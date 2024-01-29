from contextlib import asynccontextmanager
import io
import os
from typing import Annotated
from fastapi import FastAPI, File, UploadFile
import tensorflow as tf
import numpy as np
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware

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


@asynccontextmanager
async def lifespan(app: FastAPI):
    classifiers["cifar_base"] = load_model()
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
