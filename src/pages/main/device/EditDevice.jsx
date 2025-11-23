import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdOutlineDevices } from "react-icons/md";
import { Button } from "antd";
import { Formik, Form, Field } from "formik";
import EditDeviceHandlers from "@module/container/main/device/EditDeviceHandlers.js";
import "@styles/allRepeatStyles.css";

const EditDevice = () => {
  const location = useLocation();
  const { device } = location.state || {};

  const [id, setId] = useState(device.uuid);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    setId(device.uuid);
  }, [device]);

  const initialValues = {
    name: device?.name ?? "Empty",
    brand: device?.brand ?? "Empty",
    model: device?.model ?? "Empty",
    description: device?.description ?? "Empty",
  };

  const { updateDeviceMutation, onSubmit } = EditDeviceHandlers({
    id,
    setIsEditable,
  });

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-100 p-6 cursor-default">
      <div className="mx-auto">
        <div className="mb-8 p-3 bg-gray-200 dark:bg-dark-100 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <MdOutlineDevices className="min-w-6 md:min-w-8 min-h-6 md:min-h-8 text-dark-100 dark:text-white" />
            <div>
              <h1 className="text-lg md:text-3xl font-medium md:font-bold text-dark-100 dark:text-white">
                Device Details
              </h1>
              <p className="text-sm md:text-lg text-dark-100 dark:text-white mt-1">
                View and edit device information
              </p>
            </div>
          </div>
        </div>

        <div className="my-6 text-center">
          <p className="text-sm md:text-lg text-dark-100 dark:text-white">
            Device ID:{" "}
            <span className="font-mono font-medium md:font-bold">{id}</span>
          </p>
        </div>

        <div className="bg-gray-200 dark:bg-dark-100 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          <div className="p-8">
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ handleSubmit }) => (
                <Form className="space-y-6">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="editLabelStyle transition-colors"
                    >
                      Device Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      disabled={!isEditable}
                      className={`placeholder-gray-400 editInputStyle
                        ${
                          !isEditable
                            ? "border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75"
                            : "focus:border-[#2997ff]"
                        }`}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="brand" className="editLabelStyle">
                      Brand
                    </label>
                    <Field
                      id="brand"
                      name="brand"
                      disabled={!isEditable}
                      className={`placeholder-gray-400 editInputStyle
                        ${
                          !isEditable
                            ? "border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75"
                            : "focus:border-[#2997ff]"
                        }`}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="model" className="editLabelStyle">
                      Model
                    </label>
                    <Field
                      id="model"
                      name="model"
                      disabled={!isEditable}
                      className={`placeholder-gray-400 editInputStyle
                        ${
                          !isEditable
                            ? "border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75"
                            : "focus:border-[#2997ff]"
                        }`}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="description" className="editLabelStyle">
                      Description
                    </label>
                    <Field
                      id="description"
                      name="description"
                      as="textarea"
                      rows={4}
                      disabled={!isEditable}
                      className={`placeholder-gray-400 resize-none editInputStyle
                        ${
                          !isEditable
                            ? "border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75"
                            : "focus:border-[#2997ff]"
                        }`}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type={isEditable ? "default" : "primary"}
                      onClick={() => setIsEditable(!isEditable)}
                      className={`flex-1 h-12 rounded-xl font-semibold transition-all duration-200
                        ${
                          isEditable
                            ? "buttonSecondaryStyle"
                            : "dark:bg-blue-300 dark:text-blue-600 dark:border-blue-600 buttonPrimaryStyle"
                        }`}
                    >
                      {isEditable ? "Cancel" : "Edit"}
                    </Button>

                    {isEditable && (
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={updateDeviceMutation.isLoading}
                        className="flex-1 h-12 rounded-xl transition-all duration-200 dark:!bg-green-300 dark:!text-green-600 dark:!border-green-600 buttonTertiaryStyle"
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDevice;
