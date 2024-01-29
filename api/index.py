from contextlib import asynccontextmanager
import io
import os
from typing import Annotated
from fastapi import Body, FastAPI, File, UploadFile
import tensorflow as tf
import numpy as np
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import dill
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import joblib


classifiers = {}
script_directory = os.path.dirname(os.path.realpath(__file__))
class_names = np.array(
    [
        "airplane",
        "automobile",
        "bird",
        "cat",
        "deer",
        "dog",
        "frog",
        "horse",
        "ship",
        "truck",
    ]
)


def load_model():
    # Load cifar TFLite
    model_path = os.path.join(script_directory, "saved_models", "model_cpu.tflite")
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter


def load_mnb():
    estimator = joblib.load(
        os.path.join(script_directory, "saved_models", "estimator.joblib")
    )

    return estimator


async def predict_image(file, interpreter):
    # Read the file content
    contents = await file.read()

    # Convert the file content to a Pillow Image
    image = Image.open(io.BytesIO(contents))
    image = np.array(image)
    image = image.astype("float32")
    image = image / 255

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    image = np.expand_dims(image, axis=0)
    interpreter.set_tensor(input_details[0]["index"], image)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]["index"])
    predicted_class_index = np.argmax(output_data)
    predicted_class_name = class_names[predicted_class_index]
    prob_dict = dict(zip(class_names, list(output_data.flatten())))

    return {"predict": predicted_class_name}


def predict_text_fn(text):
    if not text:
        return None
    text = clean_text(text)
    estimator = classifiers.get("text")
    if estimator:
        prediction = estimator.predict([text])
        probabilities = estimator.predict_proba([text])
        print(probabilities[0][0])
        return {
            "probabilities": {
                "false": probabilities[0][0],
                "true": probabilities[0][1],
            },
            "predict": True if int(prediction == [1]) else False,
        }

    return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    classifiers["cifar_base"] = load_model()
    classifiers["text"] = load_mnb()
    yield
    classifiers.clear()


app = FastAPI(lifespan=lifespan)

# Allow all origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/")
def check():
    return {"message": "Ok"}


@app.get("/predict-image")
def predict():
    return {"message": "Ok"}


@app.post("/predict-image")
async def upload_images(
    files: Annotated[
        list[UploadFile], File(description="Multiple files as UploadFile")
    ],
):
    output = []
    try:
        if interpreter := classifiers.get("cifar_base"):
            for file in files:
                result = await predict_image(file, interpreter)
                output += [{"filename": file.filename, "size": file.size, **result}]
        else:
            for file in files:
                output += [{"filename": file.filename, "size": file.size}]
        return {"message": "done", "results": output}
    except:
        return {"message": "error"}


@app.post("/predict-text")
async def predict_text(text: str = Body(embed=True)):
    try:
        prediction = predict_text_fn(text)
        return {"message": "ok", "text": text, "prediction": prediction}
    except Exception as e:
        print(e)
        return {"message": "error"}


def clean_text(text):
    if not isinstance(text, str):
        return ""
    processed_text = text.lower()

    processed_text = re.sub(re.compile("[/(){}\[\]\|@,;]"), " ", processed_text)
    processed_text = re.sub(re.compile("[^0-9a-z #+_]"), " ", processed_text)

    # Tokenization
    words = word_tokenize(processed_text)

    # Lemmatize and stem each word
    stemmer = PorterStemmer()
    lemmatizer = WordNetLemmatizer()
    stemmed_words = [lemmatizer.lemmatize(stemmer.stem(word)) for word in words]

    # Stop word removal
    stop_words = set(stopwords.words("english"))
    stop_words.update(["say", "percent", "state", "year", "said", "people", "one"])
    filtered_words = [word for word in stemmed_words if word.lower() not in stop_words]
    # Combine words
    processed_text = " ".join(filtered_words)

    return processed_text
