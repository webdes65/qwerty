import MaskedInput from "react-maskedinput";
import { Select } from "antd";
import { Field } from "formik";
import "@styles/employeeStyles.css";

export default function EditEmployeesCard({
  isEditable,
  setFieldValue,
  timezonesOptions,
  optionsCalendar,
  optionsLanguages,
}) {
  const shareClass = `w-full p-2 border-2 border-gray-200 dark:border-gray-600 outline-none ${
    isEditable
      ? "bg-white text-black dark:bg-dark-100 dark:text-white"
      : "text-dark-100 dark:text-white dark:bg-gray-100"
  } rounded`;

  return (
    <>
      <div className="employeeMainTagStyle">
        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">First Name : </span>
          <Field
            id="first_name"
            name="first_name"
            disabled={!isEditable}
            className={shareClass}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">Last Name : </span>
          <Field
            id="last_name"
            name="last_name"
            disabled={!isEditable}
            className={shareClass}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">User Name : </span>
          <Field
            id="name"
            name="name"
            disabled={!isEditable}
            className={shareClass}
          />
        </div>
      </div>

      <div className="employeeMainTagStyle">
        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">Phone Number : </span>
          <Field
            id="phone_number"
            name="phone_number"
            disabled={!isEditable}
            className={shareClass}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">Email : </span>
          <Field
            id="email"
            name="email"
            disabled={!isEditable}
            className={shareClass}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">Birthday : </span>
          {isEditable ? (
            <MaskedInput
              className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded outline-none bg-white text-black dark:bg-dark-100 dark:text-white"
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
              className={`w-full p-2 border-2 border-gray-200 dark:border-gray-600 ${
                isEditable
                  ? "bg-white text-black dark:bg-dark-100"
                  : "text-dark-100 dark:text-white dark:bg-gray-100"
              } rounded`}
            />
          )}
        </div>
      </div>

      <div className="employeeMainTagStyle">
        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">Time Zone : </span>
          {isEditable ? (
            <Select
              className="customSelect ant-select-selector w-full h-[2.75rem] font-Quicksand font-medium"
              options={timezonesOptions}
              placeholder="Select Time Zone"
              onChange={(value) => setFieldValue("timezone", value)}
            />
          ) : (
            <Field
              id="timezone"
              name="timezone"
              disabled={!isEditable}
              className={shareClass}
            />
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">Calendar : </span>
          {isEditable ? (
            <Select
              className="customSelect ant-select-selector w-full h-[2.75rem] font-Quicksand font-medium"
              options={optionsCalendar}
              placeholder="Select Calendar"
              onChange={(value) => setFieldValue("calendar", value)}
            />
          ) : (
            <Field
              id="calendar"
              name="calendar"
              disabled={!isEditable}
              className={shareClass}
            />
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          <span className="employeeLabelStyle">Language : </span>
          {isEditable ? (
            <Select
              className="customSelect ant-select-selector w-full h-[2.75rem] font-Quicksand font-medium"
              options={optionsLanguages}
              placeholder="Select Language"
              onChange={(value) => setFieldValue("language", value)}
            />
          ) : (
            <Field
              id="language"
              name="language"
              disabled={!isEditable}
              className={shareClass}
            />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-1">
        <span className="employeeLabelStyle">Address : </span>
        <Field
          id="address"
          name="address"
          disabled={!isEditable}
          className={shareClass}
        />
      </div>
    </>
  );
}
