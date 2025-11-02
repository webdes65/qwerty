import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { Button, Modal, Progress, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "@components/module/CustomField";
import generateMindFile from "@utils/generateMindFile";
import logger from "@utils/logger.js";
import { request } from "@services/apiService.js";

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
    (formData) => {
      return request({
        method: "POST",
        url: "/api/augmented-realities",
        data: formData,
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
        // logger.error('data', data)
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  // logger.log('fileList', fileList)

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
        onSubmit={async (values) => {
          try {
            setSubmitPending(true);

            const mindFile = await generateMindFile(
              values.files,
              (progress) => {
                setProgress(progress);
              },
            );

            if (mindFile) {
              // Create FormData to handle file uploads
              const formData = new FormData();

              // Add text fields
              formData.append("name", values.name);
              formData.append("description", values.description);

              // Add the generated mind file
              formData.append("mindFile", mindFile, "mindfile.mind");

              // Add original uploaded files
              values.files.forEach((file) => {
                // Use the original file object
                const actualFile = file.originFileObj || file;
                formData.append("files[]", actualFile, actualFile.name);
                // logger.log(`Adding file ${index}:`, actualFile.name, actualFile.size, actualFile.type)
              });

              // Log FormData contents for debugging
              /* logger.log(pair[0], pair[1])
                  for (let pair of formData.entries()) {
                    logger.log(pair[0], pair[1])
                  }*/

              // logger.log("formData", formData);

              mutation.mutate(formData);
            } else {
              toast.error("Failed to generate mind file.");
            }
          } catch (error) {
            logger.log(error);
            toast.error("An error occurred while processing files.");
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

export default AddAugmentedRealitiesModal;
