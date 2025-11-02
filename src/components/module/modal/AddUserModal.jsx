import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, DatePicker, Modal, Select } from "antd";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "@components/module/CustomField";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const AddUserModal = ({ isModalOpen, setIsModalOpen }) => {
  const [submitPending, setSubmitPending] = useState(false);

  const initialValues = {
    name: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    gender: "",
    birthday: "",
    email: "",
    phone_number: "",
    language: "",
    calendar: "",
    timezone: "",
    address: "",
    roles: "",
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/users", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        logger.log("data", data);

        queryClient.invalidateQueries("fetchUsers");

        // queryClient.setQueryData("fetchUsers", (oldData) => {
        //   if (!oldData) return oldData;
        //   return {
        //     ...oldData,
        //     data: [...oldData.data, data.data.user]
        //   };
        // });

        setIsModalOpen(false);
      },
      onError: (error) => {
        const errors = error.response?.data?.errors;
        if (errors) {
          Object.values(errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });
        } else {
          toast.error("An error occurred.");
        }
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const optionsCalendar = [
    { value: "Hijri", label: "Hijri" },
    { value: "Jalali", label: "Jalali" },
    { value: "Gregorian", label: "Gregorian" },
  ];

  const { data: dataLngs } = useQuery(["fetchLanguages"], () =>
    request({
      method: "GET",
      url: "/api/users/languages",
    }),
  );

  const optionsLanguages = dataLngs?.data
    ? Object.entries(dataLngs.data).map(([key, value]) => ({
        value: key,
        label: value,
      }))
    : [];

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

  const { data: dataRole } = useQuery(["fetchRoles"], () =>
    request({
      method: "GET",
      url: "/api/roles",
    }),
  );

  const roleOptions =
    dataRole?.data?.map((index) => ({
      value: index.uuid,
      label: index.name,
    })) || [];

  const validateWithToast = (values) => {
    const errors = [];

    if (!values.name) {
      errors.push("Username is required");
    } else if (!/^(?![_.])([a-zA-Z0-9._]{1,30})(?<![_.])$/.test(values.name)) {
      errors.push(
        "Invalid username. Only letters, numbers, dots, and underscores are allowed.",
      );
    }

    if (!values.password) {
      errors.push("Password is required");
    } else if (values.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!values.password_confirmation) {
      errors.push("Password confirmation is required");
    } else if (values.password !== values.password_confirmation) {
      errors.push("Passwords do not match");
    }

    if (!values.email) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.push("Email is invalid");
    }

    if (!values.timezone) errors.push("Timezone is required");
    if (!values.calendar) errors.push("Calendar is required");

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    return true;
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Add User"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          if (!validateWithToast(values)) return;

          setSubmitPending(true);
          try {
            await mutation.mutateAsync(values);
            resetForm();
          } catch (error) {
            logger.error(error);
          }
        }}
      >
        {({ setFieldValue }) => (
          <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"first_name"}
                  name={"first_name"}
                  placeholder={"First Name"}
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"last_name"}
                  name={"last_name"}
                  placeholder={"Last Name"}
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"name"}
                  name={"name"}
                  placeholder={"UserName"}
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"email"}
                  name={"email"}
                  placeholder={"Email"}
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"password"}
                  name={"password"}
                  placeholder={"Password"}
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"password_confirmation"}
                  name={"password_confirmation"}
                  placeholder={"Confirm Password"}
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"address"}
                  name={"address"}
                  placeholder={"Address"}
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <CustomField
                  id={"phone_number"}
                  name={"phone_number"}
                  placeholder={"Phone Number"}
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <Select
                  className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand"
                  options={genderOptions}
                  onChange={(value) => setFieldValue("gender", value)}
                  placeholder={
                    <span style={{ fontWeight: "400", color: "#9ca3af" }}>
                      Gender
                    </span>
                  }
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <DatePicker
                  className="w-full h-[3rem] border-2 border-gray-200 dark:border-gray-600 outline-none"
                  placeholder="Birthday"
                  onChange={(date) => setFieldValue("birthday", date)}
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <Select
                  className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                  options={optionsCalendar}
                  onChange={(value) => setFieldValue("calendar", value)}
                  placeholder="Calendar"
                />
                <ErrorMessage
                  name="calendar"
                  component="div"
                  className="text-red-500 text-[0.80rem] font-medium"
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <Select
                  showSearch
                  className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                  options={timezonesOptions}
                  onChange={(value) => setFieldValue("timezone", value)}
                  placeholder="Time zones"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />

                <ErrorMessage
                  name="timezone"
                  component="div"
                  className="text-red-500 text-[0.80rem] font-medium"
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <Select
                  className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                  options={optionsLanguages}
                  onChange={(value) => setFieldValue("language", value)}
                  placeholder="Language"
                />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <Select
                  className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                  options={roleOptions}
                  onChange={(value) => setFieldValue("roles", value)}
                  placeholder="Roles"
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitPending}
                className="w-full font-Quicksand font-medium !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
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

export default AddUserModal;
