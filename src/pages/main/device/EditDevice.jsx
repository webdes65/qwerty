import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { Formik, Form, Field } from "formik";
import EditDeviceHandlers from "@module/container/main/device/EditDeviceHandlers.js";

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
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2">
      <div className="w-full h-full  text-dark-100 dark:bg-gray-100 dark:text-white">
        <div className="w-full grid grid-cols-2 gap-4 p-4 rounded shadow">
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <Form className="w-full flex flex-col justify-center items-start gap-2">
                <div className="flex flex-col w-full">
                  <Field
                    id="name"
                    name="name"
                    disabled={!isEditable}
                    className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded bg-white text-dark-100  dark:bg-dark-100 dark:text-white"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Field
                    id="brand"
                    name="brand"
                    disabled={!isEditable}
                    className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded bg-white text-dark-100  dark:bg-dark-100 dark:text-white"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Field
                    id="model"
                    name="model"
                    disabled={!isEditable}
                    className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded bg-white text-dark-100  dark:bg-dark-100 dark:text-white"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Field
                    id="description"
                    name="description"
                    disabled={!isEditable}
                    className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded bg-white text-dark-100  dark:bg-dark-100 dark:text-white"
                  />
                </div>
                <div className="w-full flex gap-4">
                  <Button
                    type="primary"
                    onClick={() => setIsEditable(!isEditable)}
                    className="w-1/2 font-Poppins font-bold !p-4"
                    disabled={updateDeviceMutation.isLoading}
                  >
                    {isEditable ? "Cancel" : "Edit"}
                  </Button>
                  {isEditable && (
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      className="w-1/2 font-Poppins border-2 border-green-200 dark:border-green-300 font-bold !p-4 text-dark-100  bg-green-200 dark:bg-green-300"
                      loading={updateDeviceMutation.isLoading}
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
  );
};

export default EditDevice;
