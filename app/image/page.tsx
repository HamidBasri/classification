import { Flex, UploadProps, message } from "antd";
import Title from "antd/es/typography/Title";
import Dragger from "antd/es/upload/Dragger";
import { UploadCloud } from "lucide-react";
import React from "react";

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  // onChange(info) {
  //   const { status } = info.file;
  //   if (status !== "uploading") {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (status === "done") {
  //     message.success(`${info.file.name} file uploaded successfully.`);
  //   } else if (status === "error") {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // },
  // onDrop(e) {
  //   console.log("Dropped files", e.dataTransfer.files);
  // },
};
const page = () => {
  return (
    <>
      <Title className="text-center" level={2}>
        Image Classification
      </Title>
      <Dragger {...props}>
        <Flex vertical justify="center" align="center" gap={5} className="p-5">
          <UploadCloud size={46} />
          <p className="pb-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="pb-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Flex>
      </Dragger>
    </>
  );
};

export default page;
