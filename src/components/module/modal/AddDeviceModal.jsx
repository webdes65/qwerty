import { Button, Modal, Select } from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "@components/module/CustomField";
import AddDeviceHandlers from "@module/container/main/device/AddDeviceHandlers.js";

const AddDeviceModal = ({ isModalOpen, setIsModalOpen }) => {
  const {
    submitPending,
    patterns,
    connectionOptions,
    onSubmit,
    addPattern,
    updatePatternType,
    removePattern,
  } = AddDeviceHandlers({ setIsModalOpen });

  const typeOptions = [
    { value: "json", label: "JSON" },
    { value: "array", label: "Array" },
    { value: "custom", label: "Custom" },
  ];

  const initialValues = {
    name: "",
    board: "",
    brand: "",
    model: "",
    description: "",
    connection: "",
    topic: "",
    lan: "",
    wifi: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Device name is required";
    if (!values.connection) errors.connection = "Connection is required";
    if (!values.topic) errors.topic = "Topic is required";
    return errors;
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Add Device"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form
            className="w-full h-[30rem] overflow-auto flex flex-col justify-start items-start gap-2 pt-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <CustomField id={"name"} name={"name"} placeholder={"Name"} />
            <CustomField id={"board"} name={"board"} placeholder={"Board ID"} />
            <CustomField id={"brand"} name={"brand"} placeholder={"Brand"} />
            <CustomField id={"model"} name={"model"} placeholder={"Model"} />
            <CustomField
              id={"description"}
              name={"description"}
              placeholder={"Description"}
            />

            <div className="w-full">
              <Select
                className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                options={connectionOptions}
                onChange={(value) => {
                  setFieldValue("connection", value);
                }}
                placeholder="Connection"
              />
              <ErrorMessage
                name={"connection"}
                component="div"
                className="text-red-500 text-[0.75rem]"
              />
            </div>
            <CustomField id={"topic"} name={"topic"} placeholder={"Topic"} />
            <CustomField id={"lan"} name={"lan"} placeholder={"LAN"} />
            <CustomField id={"wifi"} name={"wifi"} placeholder={"WiFi"} />

            <Button
              className="w-full h-auto flex flex-row justify-center items-center p-2 font-Quicksand border-2 border-gray-200 dark:border-gray-600 bg-gray-200 text-dark-100  dark:bg-dark-100 dark:text-white font-bold"
              onClick={addPattern}
            >
              Add Pattern
              <PlusCircleOutlined style={{ fontSize: "20px" }} />
            </Button>

            <div className="w-full h-auto flex flex-col justify-center items-center gap-5">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="w-full flex flex-col justify-center items-center gap-3 bg-white dark:bg-gray-100 p-3 pb-[1rem] rounded-lg relative"
                >
                  <div className="w-full flex flex-row justify-center items-center gap-2">
                    <Select
                      className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                      options={typeOptions}
                      onChange={(value) => updatePatternType(pattern.id, value)}
                      placeholder="Type"
                    />
                    <div className="w-auto h-full flex flex-row justify-center items-center">
                      <Button
                        type="primary"
                        danger
                        onClick={() => removePattern(pattern.id)}
                        icon={<DeleteOutlined />}
                      />
                    </div>
                  </div>
                  {pattern.type === "array" && (
                    <div className="w-full pt-3">
                      <div className="flex flex-col gap-3 p-3 border-2 border-dashed border-gray-400">
                        <CustomField
                          id={"connectorArray"}
                          name={"connectorArray"}
                          placeholder={"ConnectorArray"}
                        />
                      </div>
                    </div>
                  )}
                  {pattern.type === "custom" && (
                    <div className="w-full pt-3">
                      <div className="flex flex-col gap-2 p-3 border-2 border-dashed border-gray-400">
                        <CustomField
                          id={"setter"}
                          name={"setter"}
                          placeholder={"Setter"}
                        />

                        <Select
                          className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                          options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ]}
                          placeholder="Use Board ID? (If Available)"
                        />

                        <CustomField
                          id={"separator"}
                          name={"separator"}
                          placeholder={"Separator"}
                        />
                        <CustomField
                          id={"connectorCustom"}
                          name={"connectorCustom"}
                          placeholder={"ConnectorCustom"}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center pt-5">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitPending}
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

export default AddDeviceModal;
