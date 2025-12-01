import { Field, ErrorMessage } from "formik";
import "@styles/allRepeatStyles.css";

const CustomField = ({ id, name, placeholder }) => {
  return (
    <>
      <Field
        className="w-full text-[0.90rem] max-sm:text-[0.80rem] bg-white inputStyle"
        style={{
          direction: "ltr",
          textAlign: "left",
        }}
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-[0.80rem] font-medium"
      />
    </>
  );
};

export default CustomField;
