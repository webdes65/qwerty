import MaskedInput from "react-maskedinput";
import { Select } from "antd";
import { Field } from "formik";
import "@styles/allRepeatStyles.css";
import "@styles/antdStyles.css";

export default function EditEmployeesCard({
  isEditable,
  setFieldValue,
  timezonesOptions,
  optionsCalendar,
  optionsLanguages,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="group">
        <label
          htmlFor="first_name"
          className="editLabelStyle transition-colors"
        >
          First Name
        </label>
        <Field
          id="first_name"
          name="first_name"
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
        <label htmlFor="last_name" className="editLabelStyle transition-colors">
          Last Name
        </label>
        <Field
          id="last_name"
          name="last_name"
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
        <label htmlFor="name" className="editLabelStyle transition-colors">
          User Name
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
        <label
          htmlFor="phone_number"
          className="editLabelStyle transition-colors"
        >
          Phone Number
        </label>
        <Field
          id="phone_number"
          name="phone_number"
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
        <label htmlFor="email" className="editLabelStyle transition-colors">
          Email
        </label>
        <Field
          id="email"
          name="email"
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
        <label htmlFor="birthday" className="editLabelStyle transition-colors">
          Birthday
        </label>
        {isEditable ? (
          <MaskedInput
            className="focus:border-[#2997ff] editInputStyle"
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
            className="placeholder-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75 editInputStyle"
          />
        )}
      </div>
      <div className="group">
        <label htmlFor="timezone" className="editLabelStyle transition-colors">
          Time Zone
        </label>
        {isEditable ? (
          <Select
            id="timezone"
            className="w-full editEmployee"
            options={timezonesOptions}
            placeholder="Select Time Zone"
            onChange={(value) => setFieldValue("timezone", value)}
          />
        ) : (
          <Field
            id="timezone"
            name="timezone"
            disabled={!isEditable}
            className="placeholder-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75 editInputStyle"
          />
        )}
      </div>
      <div className="group">
        <label htmlFor="calendar" className="editLabelStyle transition-colors">
          Calendar
        </label>
        {isEditable ? (
          <Select
            id="calendar"
            className="w-full editEmployee"
            options={optionsCalendar}
            placeholder="Select Calendar"
            onChange={(value) => setFieldValue("calendar", value)}
          />
        ) : (
          <Field
            id="calendar"
            name="calendar"
            disabled={!isEditable}
            className="placeholder-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75 editInputStyle"
          />
        )}
      </div>
      <div className="group">
        <label htmlFor="language" className="editLabelStyle transition-colors">
          Language
        </label>
        {isEditable ? (
          <Select
            id="language"
            className="w-full editEmployee"
            options={optionsLanguages}
            placeholder="Select Language"
            onChange={(value) => setFieldValue("language", value)}
          />
        ) : (
          <Field
            id="language"
            name="language"
            disabled={!isEditable}
            className="placeholder-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75 editInputStyle"
          />
        )}
      </div>
      <div className="group">
        <label htmlFor="address" className="editLabelStyle transition-colors">
          Address
        </label>
        <Field
          id="address"
          name="address"
          disabled={!isEditable}
          className={`placeholder-gray-400 editInputStyle
                      ${
                        !isEditable
                          ? "border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-75"
                          : "focus:border-[#2997ff]"
                      }`}
        />
      </div>
    </div>
  );
}
