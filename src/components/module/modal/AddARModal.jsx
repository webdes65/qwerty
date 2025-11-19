import { useState } from "react";
import { Button, Modal, Progress, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "@components/module/CustomField";
import AddARHandler from "@module/container/main/argument-realities/AddARHandler.js";

const { Dragger } = Upload;

const AddARModal = ({ isModalOpenAR, setIsModalOpenAR }) => {
  const [fileList, setFileList] = useState([]);

  const initialValues = {
    name: "",
    description: "",
    files: [],
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    if (values.files.length === 0) {
      errors.files = "You must upload at least one file";
    }
    return errors;
  };

  const { progress, submitPending, handlerSubmit } = AddARHandler({
    setIsModalOpenAR,
    setFileList,
  });

  return (
    <Modal
      className="font-Quicksand"
      title="Add AR"
      open={isModalOpenAR}
      onCancel={() => setIsModalOpenAR(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handlerSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
            <CustomField id="name" name="name" placeholder="Name" />
            <CustomField
              id="description"
              name="description"
              placeholder="Description"
            />

            <Dragger
              name="file"
              multiple
              beforeUpload={() => false}
              onChange={(info) => {
                const files = info.fileList.map(
                  (file) => file.originFileObj || file,
                );
                setFieldValue("files", files);
                setFileList(info.fileList);
              }}
              fileList={fileList}
              className="w-full mt-4"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Dragger>
            <ErrorMessage
              name="files"
              component="div"
              className="text-red-500 text-sm mt-2"
            />

            {progress > 0 && (
              <div className="w-full mt-4">
                <p className="text-sm text-gray-400 font-bold">
                  Minding the files, please wait ...
                </p>
                <Progress percent={progress} />
              </div>
            )}
            <div className="w-full h-auto flex flex-row justify-center items-center pt-5">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitPending}
                disabled={submitPending}
                className="w-1/2 h-auto flex flex-row justify-center items-center p-2 font-Quicksand"
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddARModal;
