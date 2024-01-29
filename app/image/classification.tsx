"use client";
import { useCreation, useMemoizedFn, useSafeState } from "ahooks";
import {
  Button,
  Card,
  Col,
  Flex,
  GetProp,
  Image,
  Modal,
  Row,
  Space,
  UploadFile,
  UploadProps,
} from "antd";
import Title from "antd/es/typography/Title";
import Dragger from "antd/es/upload/Dragger";
import { ScanEye, UploadCloud } from "lucide-react";
import { has, isEmpty, isNil } from "ramda";
import React, { ReactElement, memo } from "react";
import Spinner from "../spinner";
import ky from "ky";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type CustomUploadFile = UploadFile & { class?: string; processing?: boolean };
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Uploader = () => {
  const [fileList, setFileList] = useSafeState<CustomUploadFile[]>([]);
  const [previewImage, setPreviewImage] = useSafeState<CustomUploadFile | null>(
    null
  );

  const handleChange: UploadProps["onChange"] = useMemoizedFn(
    ({ fileList: newFileList }) => setFileList(newFileList)
  );

  const itemRender = useMemoizedFn(
    (
      originNode: ReactElement,
      file: CustomUploadFile,
      fileList: object[],
      actions: { download: Function; preview: Function; remove: Function }
    ) => {
      originNode.props.children[1].push(
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            setPreviewImage(file);
          }}
        >
          <ScanEye size={16} />
        </div>
      );
      // a.push(<div>AA</div>);
      return (
        <Flex gap={10} flex={1} className="w-full" align="center">
          <div>{originNode}</div>

          <div>
            Class:{" "}
            <span className="font-bold">
              {file.processing ? <Spinner /> : file.class ?? "None"}
            </span>
          </div>
        </Flex>
      );
    }
  );
  const uploaderProps: UploadProps = useCreation(
    () => ({
      name: "file",
      accept: "image",
      className: "w-full",
      multiple: true,
      fileList: fileList,
      onChange: handleChange,
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: true,
      },
      listType: "picture",
      itemRender: itemRender,
    }),
    [fileList]
  );

  const handleClearAll = useMemoizedFn(() => setFileList([]));
  const handleClassify = useMemoizedFn(async () => {
    const formData = new FormData();
    fileList.forEach((file, index) => {
      if (file.originFileObj) {
        formData.append(`files`, file.originFileObj);
      }
    });
    await ky
      .post("http://127.0.0.1:8000/predict-image", {
        body: formData,
      })
      .then(async (response) => {
        const result = await response.json();
        const results = result?.results;
        if (results) {
          setFileList(
            fileList.map((file, index) => {
              file.class = results?.[index]?.predict;
              return file;
            })
          );
        }
      });
  });

  console.log(previewImage);
  return (
    <Card
      title={
        <Title className="text-center mb-8 mt-6" level={1}>
          CIFAR-10 Classification
        </Title>
      }
      extra={
        <Space>
          <Button size="large" type="default" onClick={handleClearAll}>
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
      <Row>
        <Dragger {...uploaderProps}>
          <Flex
            vertical
            justify="center"
            align="center"
            gap={5}
            className="p-5"
          >
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
        <Modal
          open={!isNil(previewImage) && !isEmpty(previewImage)}
          title={previewImage?.name}
          footer={null}
          onCancel={() => setPreviewImage(null)}
        >
          <img src={previewImage?.thumbUrl} alt="Base64 Image" />
        </Modal>
      </Row>
    </Card>
  );
};

export default memo(Uploader);
