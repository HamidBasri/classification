"use client";
import { useMemoizedFn, useReactive, useSafeState } from "ahooks";
import { Button, Card, Col, Flex, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { memo } from "react";
import Spinner from "../spinner";
import { isEmpty } from "ramda";

const TextClassification = () => {
  const [text, setText] = useSafeState("");
  const prob = useReactive({
    true: 0,
    fake: 0,
    loading: false,

    reset() {
      this.true = 0;
      this.fake = 0;
      this.loading = false;
    },
  });

  const handleClear = useMemoizedFn(() => {
    prob.reset();
    setText("");
  });

  const handleClassify = useMemoizedFn(() => {
    if (isEmpty(text)) return;
    prob.loading = true;
    setTimeout(() => {
      prob.true = 20;
      prob.fake = 90;
      prob.loading = false;
    }, 2000);
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
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

TextClassification.display_name = "TextClassification";
export default memo(TextClassification);
