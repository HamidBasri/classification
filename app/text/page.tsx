import { Button, Flex, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import React from "react";

const page = () => {
  return (
    <>
      <Title className="text-center" level={2}>
        Text Classification
      </Title>
      <Form layout="inline">
        <FormItem
          label="Your Text"
          name="text"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <TextArea
            placeholder="Please enter your text here"
            className="w-96"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="w-28">
            Submit
          </Button>
        </FormItem>
      </Form>
    </>
  );
};

export default page;
