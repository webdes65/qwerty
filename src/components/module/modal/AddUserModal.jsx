import { useState } from "react";
import { Button, DatePicker, Modal, Select } from "antd";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "@components/module/CustomField";
import AddUserHandlers from "@module/container/main/employees/AddUserHandlers.js";
import "@styles/allRepeatStyles.css";
import "@styles/employeeStyles.css";

const AddUserModal = ({ isModalOpen, setIsModalOpen }) => {
  const [submitPending, setSubmitPending] = useState(false);

  const { handlerSubmit, optionsLanguages, timezonesOptions, roleOptions } =
    AddUserHandlers({ setIsModalOpen, setSubmitPending });

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

  return (
    <Modal
      className="font-Quicksand"
      title="Add User"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <Formik initialValues={initialValues} onSubmit={handlerSubmit}>
        {({ setFieldValue }) => (
          <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
            <div className="parentTagStyle">
              <div className="childTagStyle">
                <CustomField
                  id={"first_name"}
                  name={"first_name"}
                  placeholder={"First Name"}
                />
              </div>
              <div className="childTagStyle">
                <CustomField
                  id={"last_name"}
                  name={"last_name"}
                  placeholder={"Last Name"}
                />
              </div>
            </div>

            <div className="parentTagStyle">
              <div className="childTagStyle">
                <CustomField
                  id={"name"}
                  name={"name"}
                  placeholder={"UserName"}
                />
              </div>
              <div className="childTagStyle">
                <CustomField
                  id={"email"}
                  name={"email"}
                  placeholder={"Email"}
                />
              </div>
            </div>

            <div className="parentTagStyle">
              <div className="childTagStyle">
                <CustomField
                  id={"password"}
                  name={"password"}
                  placeholder={"Password"}
                />
              </div>
              <div className="childTagStyle">
                <CustomField
                  id={"password_confirmation"}
                  name={"password_confirmation"}
                  placeholder={"Confirm Password"}
                />
              </div>
            </div>

            <div className="parentTagStyle">
              <div className="childTagStyle">
                <CustomField
                  id={"address"}
                  name={"address"}
                  placeholder={"Address"}
                />
              </div>
              <div className="childTagStyle">
                <CustomField
                  id={"phone_number"}
                  name={"phone_number"}
                  placeholder={"Phone Number"}
                />
              </div>
            </div>

            <div className="parentTagStyle">
              <div className="childTagStyle">
                <Select
                  className="ant-select-selector customSelect mainTagStyle"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  onChange={(value) => setFieldValue("gender", value)}
                  placeholder={
                    <span style={{ fontWeight: "400", color: "#9ca3af" }}>
                      Gender
                    </span>
                  }
                />
              </div>
              <div className="childTagStyle">
                <DatePicker
                  className="w-full h-[3rem] border-2 border-gray-200 dark:border-gray-600 dark:bg-dark-100 outline-none"
                  placeholder="Birthday"
                  onChange={(date) => setFieldValue("birthday", date)}
                />
              </div>
            </div>

            <div className="parentTagStyle">
              <div className="childTagStyle">
                <Select
                  className="ant-select-selector customSelect mainTagStyle"
                  options={[
                    { value: "Hijri", label: "Hijri" },
                    { value: "Jalali", label: "Jalali" },
                    { value: "Gregorian", label: "Gregorian" },
                  ]}
                  onChange={(value) => setFieldValue("calendar", value)}
                  placeholder="Calendar"
                />
                <ErrorMessage
                  name="calendar"
                  component="div"
                  className="text-red-500 text-[0.80rem] font-medium"
                />
              </div>
              <div className="childTagStyle">
                <Select
                  showSearch
                  className="ant-select-selector customSelect mainTagStyle"
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

            <div className="parentTagStyle">
              <div className="childTagStyle">
                <Select
                  className="ant-select-selector customSelect mainTagStyle"
                  options={optionsLanguages}
                  onChange={(value) => setFieldValue("language", value)}
                  placeholder="Language"
                />
              </div>
              <div className="childTagStyle">
                <Select
                  className="ant-select-selector customSelect mainTagStyle"
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
                className="w-full buttonPrimaryStyle"
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
