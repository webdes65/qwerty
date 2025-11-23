import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { FaUserTie } from "react-icons/fa";
import { Formik, Form } from "formik";
import EditEmployeesHandlers from "@module/container/main/employees/EditEmployeesHandlers.js";
import EditEmployeesCard from "@module/card/EditEmployeesCard.jsx";

const EditEmployees = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [id, setId] = useState(data.data.uuid);

  useEffect(() => {
    setId(data.data.uuid);
  }, [data]);

  const initialValues = {
    first_name: data?.data?.profile?.first_name || "",
    last_name: data?.data?.profile?.last_name || "",
    name: data?.data?.name || "",
    phone_number: data?.data?.phone_number || "",
    email: data?.data?.email || "",
    address: data?.data?.profile?.address || "",
    birthday: data?.data?.profile?.birthday || "",
    gender: data?.data?.profile?.gender || "",
    timezone: data?.data?.profile?.timezone || "",
    calendar: data?.data?.profile?.calendar || "",
    language: data?.data?.profile?.language || "",
  };

  const { onSubmit, timezonesOptions } = EditEmployeesHandlers({
    id,
    setIsEditable,
    setUpdateLoading,
  });

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins cursor-default">
      <div className="w-full min-h-[100vh] p-4 bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow">
        <div className="mb-8 p-3 bg-gray-200 dark:bg-dark-100 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <FaUserTie className="min-w-6 md:min-w-8 min-h-6 md:min-h-8 text-dark-100 dark:text-white" />
            <div>
              <h1 className="text-lg md:text-3xl font-medium md:font-bold text-dark-100 dark:text-white">
                Employee Details
              </h1>
              <p className="text-sm md:text-lg text-dark-100 dark:text-white mt-1">
                View and edit employee information
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
              {({ handleSubmit, setFieldValue }) => (
                <Form className="space-y-6">
                  <EditEmployeesCard
                    isEditable={isEditable}
                    timezonesOptions={timezonesOptions}
                    setFieldValue={setFieldValue}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type={isEditable ? "default" : "primary"}
                      onClick={() => setIsEditable(!isEditable)}
                      className={`flex-1 rounded-xl font-semibold transition-all duration-200
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
                        loading={updateLoading}
                        className="flex-1 rounded-xl transition-all duration-200 dark:!bg-green-300 dark:!text-green-600 dark:!border-green-600 buttonTertiaryStyle"
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

export default EditEmployees;
