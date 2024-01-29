"use client";
import { useMemoizedFn, useReactive, useSafeState } from "ahooks";
import { Button, Card, Col, Flex, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { memo } from "react";
import Spinner from "../spinner";
import { isEmpty, isNil } from "ramda";
import ky from "ky";

const TextClassification = () => {
  const [text, setText] = useSafeState("");
  const prob = useReactive({
    true: 0,
    fake: 0,
    predict: null,
    loading: false,

    reset() {
      this.true = 0;
      this.fake = 0;
      this.predict = null;
      this.loading = false;
    },
  });

  const handleClear = useMemoizedFn(() => {
    prob.reset();
    setText("");
  });

  const handleClassify = useMemoizedFn(async () => {
    if (isEmpty(text)) return;
    prob.loading = true;

    await ky
      .post("http://127.0.0.1:8000/predict-text", {
        body: JSON.stringify({ text }),
        headers: {
          "content-type": "application/json",
        },
      })
      .then(async (response: any) => {
        const result = await response.json();
        const prediction = result?.prediction;
        if (prediction) {
          prob.true = prediction?.probabilities?.true ?? 0;
          prob.fake = prediction?.probabilities?.false ?? 0;
          prob.predict = prediction?.predict;
          prob.loading = false;
        }
      });
  });

  return (
    <Card
      title={
        <Title className="text-center mb-8 mt-6" level={1}>
          LIAR Classification
        </Title>
      }
      extra={
        <Space>
          <Button size="large" type="default" onClick={handleClear}>
            Clear All
          </Button>
          <Button
            size="large"
            className="w-40"
            type="primary"
            onClick={handleClassify}
          >
            Classify
          </Button>
        </Space>
      }
      bordered={false}
    >
      <Row gutter={50}>
        <Col span={12}>
          <TextArea
            onChange={(e) => setText(e.target.value)}
            value={text}
            autoSize={{ minRows: 6 }}
            placeholder="Please enter something..."
          ></TextArea>
        </Col>
        <Col span={12}>
          <Flex vertical>
            <Space align="baseline">
              <Title level={3}>Fake Probability:</Title>{" "}
              <div className="text-lg text-red-600">
                {prob.loading ? <Spinner /> : prob.fake + "%"}
              </div>
            </Space>
            <Space align="baseline">
              <Title level={3}>True Probability:</Title>{" "}
              <div className="text-lg text-green-600">
                {prob.loading ? <Spinner /> : prob.true + "%"}
              </div>
            </Space>
            {!prob.loading && !isNil(prob.predict) && (
              <Space align="baseline">
                <Title level={3}>Prediction</Title>{" "}
                <div
                  className={`text-lg ${
                    prob.predict == true ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {prob.predict == true
                    ? "This is a true statement"
                    : "This is a fake statement"}
                </div>
              </Space>
            )}
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

TextClassification.display_name = "TextClassification";
export default memo(TextClassification);
