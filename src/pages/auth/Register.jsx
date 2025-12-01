import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "antd";
import { Formik, Form } from "formik";
import CustomField from "@components/module/CustomField";
import logo from "/assets/images/logo.webp";
import UseDarkModeStore from "@store/UseDarkMode.js";
import RegisterHandlers from "@module/container/aurh/RegisterHandlers.js";

const Register = () => {
  const navigate = useNavigate();
  const { darkMode } = UseDarkModeStore();
  const [submitPending, setSubmitPending] = useState(false);

  const { onSubmit } = RegisterHandlers({ setSubmitPending });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "User name is required";
    } else if (/[آ-ی]/.test(values.name)) {
      errors.name = "User name cannot contain Persian letters";
    } else if (
      /[\s]/.test(values.name) ||
      /[)(*&^%$#@!+=-?~<]/.test(values.name)
    ) {
      errors.name = "User name contains invalid characters";
    } else if (values.name.length < 5) {
      errors.name = "User name must be at least 5 characters long";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (/[\s]/.test(values.password)) {
      errors.password = "Password cannot contain spaces";
    } else if (/[^A-Za-z0-9+=_)(*&^%$#@!><?/"'-×]/g.test(values.password)) {
      errors.password = "Password contains invalid characters";
    }

    if (!values.password_confirmation) {
      errors.password_confirmation = "Please confirm your password";
    } else if (values.password !== values.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }

    return errors;
  };

  return (
    <div
      style={{ direction: "ltr" }}
      className="w-full h-screen flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-gray-100 font-Poppins max-sm:px-5"
    >
      <div className="w-1/2 h-auto flex flex-col items-center justify-center gap-7 rounded-xl py-14 bg-white text-dark-100 dark:text-white dark:bg-dark-100 shadow max-lg:w-8/12 max-md:w-10/12 max-sm:w-full">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="w-20 h-20">
            <img alt="logo" src={logo} className="w-full h-full" />
          </div>
          <h1
            className="text-xl font-semibold uppercase text-transparent bg-clip-text max-md:text-base text-center p-2.5"
            style={{
              backgroundImage: darkMode
                ? "linear-gradient(to right, #9897c6, #94d2e0"
                : "linear-gradient(to right, #6D6CAA, #6EC5D6)",
            }}
          >
            Monitoring Control Panel - Register
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          <Form className="w-10/12 flex flex-col justify-center items-start gap-2">
            <CustomField id={"name"} name={"name"} placeholder={"User Name"} />
            <CustomField id={"email"} name={"email"} placeholder={"Email"} />
            <CustomField
              id={"password"}
              name={"password"}
              placeholder={"Password"}
            />
            <CustomField
              id={"Password confirm"}
              name={"password_confirmation"}
              placeholder={"Password Confirm"}
            />

            <button
              type="button"
              className="flex flex-row justify-start items-center gap-1 font-normal text-[0.90rem] p-1 max-md:text-[0.80rem]"
              onClick={() => navigate("/login")}
            >
              <span>Already have an account ? Login here</span>
            </button>

            <div className="w-full h-auto flex flex-row justify-center items-center pt-5">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitPending}
                className="w-1/2 font-Quicksand font-bold uppercase !p-5 !shadow !text-white !text-[1rem] !border-hidden"
                style={{
                  background: "linear-gradient(to right, #6D6CAA, #6EC5D6)",
                  borderRadius: "0.375rem",
                }}
              >
                Register
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
