import { Button, Modal, Progress, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "../../../components/module/CustomField";
import { useState } from "react";
import generateMindFile from "../../../utils/generateMindFile";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { request } from "../../../services/apiService";

const { Dragger } = Upload;

const AddAugmentedRealitiesModal = ({ isModalOpenAR, setIsModalOpenAR }) => {
  const queryClient = useQueryClient();
  const [submitPending, setSubmitPending] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);

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

  const mutation = useMutation(
    (data) => {
      return request({
        method: "POST",
        url: "/api/augmented-realities",
        data,
        contentType: "multipart/form-data",
      });
    },
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        queryClient.invalidateQueries("ARList");
        setIsModalOpenAR(false);
        setProgress(0);
        setFileList([]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    }
  );

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
        onSubmit={async (values, { setFieldValue }) => {
          try {
            setSubmitPending(true);

            const mindFile = await generateMindFile(
              values.files,
              (progress) => {
                setProgress(progress);
              }
            );

            if (mindFile) {
              const updatedValues = {
                ...values,
                mindFile,
              };

              mutation.mutate(updatedValues);
            } else {
              toast.error("Failed to generate mind file.");
            }
          } catch (error) {
            console.error(error);
          } finally {
            setSubmitPending(false);
          }
        }}
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
                // console.log(info.fileList)
                const files = info.fileList.map((file) => file.originFileObj);
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

export default AddAugmentedRealitiesModal;
