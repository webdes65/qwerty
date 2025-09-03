import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { Button, message } from "antd";
import { Formik, Form, Field } from "formik";
import { request } from "@services/apiService.js";

const EditDevice = () => {
  const location = useLocation();
  const { device } = location.state || {};
  const [id, setId] = useState(device.uuid);

  const queryClient = useQueryClient();

  useEffect(() => {
    setId(device.uuid);
  }, [device]);

  const initialValues = {
    name: device?.name ?? "Empty",
    brand: device?.brand ?? "Empty",
    model: device?.model ?? "Empty",
    description: device?.description ?? "Empty",
  };

  const [isEditable, setIsEditable] = useState(false);

  const updateDeviceMutation = useMutation(
    (values) =>
      request({
        method: "PATCH",
        url: `/api/devices/${id}`,
        data: values,
      }),
    {
      onSuccess: () => {
        message.success("Device updated successfully!");
        setIsEditable(false);
        queryClient.invalidateQueries(["device", id]);
      },
      onError: (error) => {
        message.error("Failed to update device!");
        console.error("Update error:", error);
      },
    },
  );

  const onSubmit = (values) => {
    console.log("Submitting values:", values);
    updateDeviceMutation.mutate(values);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2">
      <div className="w-full grid grid-cols-2 gap-4 p-4 bg-white rounded shadow">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <Form className="w-full flex flex-col justify-center items-start gap-2">
              <div className="flex flex-col w-full">
                <Field
                  id="name"
                  name="name"
                  disabled={!isEditable}
                  className={`w-full p-2 border-2 ${
                    isEditable ? "border-gray-200" : "border-gray-200"
                  } rounded`}
                />
              </div>
              <div className="flex flex-col w-full">
                <Field
                  id="brand"
                  name="brand"
                  disabled={!isEditable}
                  className={`w-full p-2 border-2 ${
                    isEditable ? "border-gray-200" : "border-gray-200"
                  } rounded`}
                />
              </div>
              <div className="flex flex-col w-full">
                <Field
                  id="model"
                  name="model"
                  disabled={!isEditable}
                  className={`w-full p-2 border-2 ${
                    isEditable ? "border-gray-200" : "border-gray-200"
                  } rounded`}
                />
              </div>
              <div className="flex flex-col w-full">
                <Field
                  id="description"
                  name="description"
                  disabled={!isEditable}
                  className={`w-full p-2 border-2 ${
                    isEditable ? "border-gray-200" : "border-gray-200"
                  } rounded`}
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
                    onClick={handleSubmit}
                    className="w-1/2 font-Poppins border-2 border-gray-200 font-bold !p-4"
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
  );
};

export default EditDevice;
