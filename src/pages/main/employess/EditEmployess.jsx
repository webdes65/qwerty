import { useEffect, useState } from "react";
import MaskedInput from "react-maskedinput";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { Button, Select } from "antd";
import { Formik, Form, Field } from "formik";
import { request } from "@services/apiService.js";

const EditEmployess = () => {
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

  const onSubmit = (values) => {
    setUpdateLoading(true);
    console.log(values);
    updateForm.mutate(values);
  };

  const updateForm = useMutation(
    (data) => request({ method: "PATCH", url: `/api/users/${id}`, data }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        setIsEditable(false);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error);
      },
      onSettled: () => {
        setUpdateLoading(false);
      },
    },
  );

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

  const { data: dataTimezones } = useQuery(["fetchTimezones"], () =>
    request({
      method: "GET",
      url: "/api/users/timezones",
    }),
  );

  const timezonesOptions =
    dataTimezones?.data?.map((index) => ({
      value: index,
      label: index,
    })) || [];

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2">
      <div className="w-full p-4 bg-white rounded shadow">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit, setFieldValue }) => (
            <Form className="w-full flex flex-row justify-start items-start flex-wrap gap-2">
              <div className="w-full flex flex-row justify-center items-center gap-2 max-sm:flex-col">
                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    First Name :{" "}
                  </span>
                  <Field
                    id="first_name"
                    name="first_name"
                    disabled={!isEditable}
                    className={`w-full p-2 border-2 outline-none ${
                      isEditable ? "text-black" : "text-gray-500"
                    } rounded`}
                  />
                </div>

                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    Last Name :{" "}
                  </span>
                  <Field
                    id="last_name"
                    name="last_name"
                    disabled={!isEditable}
                    className={`w-full p-2 border-2 outline-none ${
                      isEditable ? "text-black" : "text-gray-500"
                    } rounded`}
                  />
                </div>

                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    User Name :{" "}
                  </span>
                  <Field
                    id="name"
                    name="name"
                    disabled={!isEditable}
                    className={`w-full p-2 border-2 outline-none ${
                      isEditable ? "text-black" : "text-gray-500"
                    } rounded`}
                  />
                </div>
              </div>

              <div className="w-full flex flex-row justify-center items-center gap-2 max-sm:flex-col">
                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    Phone Number :{" "}
                  </span>
                  <Field
                    id="phone_number"
                    name="phone_number"
                    disabled={!isEditable}
                    className={`w-full p-2 border-2 outline-none ${
                      isEditable ? "text-black" : "text-gray-500"
                    } rounded`}
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    Email :{" "}
                  </span>
                  <Field
                    id="email"
                    name="email"
                    disabled={!isEditable}
                    className={`w-full p-2 border-2 outline-none ${
                      isEditable ? "text-black" : "text-gray-500"
                    } rounded`}
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    Birthday :{" "}
                  </span>
                  {isEditable ? (
                    <MaskedInput
                      className="w-full p-2 border-2 border-gray-200 rounded outline-none"
                      id="birthday"
                      mask="1111-11-11"
                      placeholder="yyyy-mm-dd"
                      name="birthday"
                      value="birthday"
                      onChange={(e) => {
                        const result = e.target.value.replace(/\D/g, "-");
                        setFieldValue("birthday", result);
                      }}
                    />
                  ) : (
                    <Field
                      id="birthday"
                      name="birthday"
                      disabled={!isEditable}
                      className={`w-full p-2 border-2 ${
                        isEditable ? "text-black" : "text-gray-500"
                      } rounded`}
                    />
                  )}
                </div>
              </div>

              <div className="w-full flex flex-row justify-center items-center gap-2 max-sm:flex-col">
                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    Time Zone :{" "}
                  </span>
                  {isEditable ? (
                    <Select
                      className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                      options={timezonesOptions}
                      placeholder="Select Time Zone"
                      onChange={(value) => setFieldValue("timezone", value)}
                    />
                  ) : (
                    <Field
                      id="timezone"
                      name="timezone"
                      disabled={!isEditable}
                      className={`w-auto p-2 border-2 outline-none ${
                        isEditable ? "text-black" : "text-gray-500"
                      } rounded`}
                    />
                  )}
                </div>

                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    Calendar :{" "}
                  </span>
                  {isEditable ? (
                    <Select
                      className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                      options={optionsCalendar}
                      placeholder="Select Calendar"
                      onChange={(value) => setFieldValue("calendar", value)}
                    />
                  ) : (
                    <Field
                      id="calendar"
                      name="calendar"
                      disabled={!isEditable}
                      className={`w-auto p-2 border-2 outline-none ${
                        isEditable ? "text-black" : "text-gray-500"
                      } rounded`}
                    />
                  )}
                </div>

                <div className="w-full flex flex-col gap-1">
                  <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                    Language :{" "}
                  </span>
                  {isEditable ? (
                    <Select
                      className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                      options={optionsLanguages}
                      placeholder="Select Language"
                      onChange={(value) => setFieldValue("language", value)}
                    />
                  ) : (
                    <Field
                      id="language"
                      name="language"
                      disabled={!isEditable}
                      className={`w-auto p-2 border-2 outline-none ${
                        isEditable ? "text-black" : "text-gray-500"
                      } rounded`}
                    />
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col gap-1">
                <span className="text-gray-500 text-[0.80rem] font-bold uppercase">
                  Address :{" "}
                </span>
                <Field
                  id="address"
                  name="address"
                  disabled={!isEditable}
                  className={`w-full p-2 border-2 outline-none ${
                    isEditable ? "text-black" : "text-gray-500"
                  } rounded`}
                />
              </div>

              <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                <Button
                  type="primary"
                  onClick={() => setIsEditable(!isEditable)}
                  className={`font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500 ${
                    isEditable ? "w-full" : "w-1/2"
                  } transition-all duration-500 ease-in-out`}
                >
                  {isEditable ? "Cancel" : "Edit"}
                </Button>
                {isEditable && (
                  <Button
                    onClick={handleSubmit}
                    className="w-full font-Quicksand font-bold !bg-green-200 !p-5 !shadow !text-green-500 !text-[0.90rem] !border-[2.5px] !border-green-500"
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

export default EditEmployess;
