import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { Formik, Form } from "formik";
import EditEmployeesHandlers from "@module/container/main/employees/EditEmployeesHandlers.js";
import EditEmployeesCard from "@module/card/EditEmployeesCard.jsx";

const EditEmployees = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const [updateLoading, setUpdateLoading] = useState(false);

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

  const [isEditable, setIsEditable] = useState(false);

  const optionsLanguages = [
    { value: "en", label: "English" },
    { value: "ar", label: "Arabic" },
    { value: "tr", label: "Turkish" },
    { value: "fa", label: "Persian" },
  ];

  const optionsCalendar = [
    { value: "Hijri", label: "Hijri" },
    { value: "Jalali", label: "Jalali" },
    { value: "Gregorian", label: "Gregorian" },
  ];

  const { onSubmit, timezonesOptions } = EditEmployeesHandlers({
    id,
    setIsEditable,
    setUpdateLoading,
  });

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins">
      <div className="w-full min-h-[100vh] p-4 bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit, setFieldValue }) => (
            <Form className="w-full flex flex-row justify-start items-start flex-wrap gap-2">
              <EditEmployeesCard
                isEditable={isEditable}
                timezonesOptions={timezonesOptions}
                setFieldValue={setFieldValue}
                optionsCalendar={optionsCalendar}
                optionsLanguages={optionsLanguages}
              />

              <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                <Button
                  type="primary"
                  onClick={() => setIsEditable(!isEditable)}
                  className={`font-Quicksand font-bold !bg-blue-200 dark:bg-blue-300 !p-5 !shadow !text-blue-500 dark:text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:border-blue-600 ${
                    isEditable ? "w-full" : "w-1/2"
                  } transition-all duration-500 ease-in-out`}
                >
                  {isEditable ? "Cancel" : "Edit"}
                </Button>
                {isEditable && (
                  <Button
                    onClick={handleSubmit}
                    className="w-full font-Quicksand font-bold !bg-green-200 dark:!bg-green-300 !p-5 !shadow !text-green-500 dark:!text-green-600 !text-[0.90rem] !border-[2.5px] !border-green-500 dark:!border-green-600"
                    loading={updateLoading}
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

export default EditEmployees;
