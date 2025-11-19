import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Button } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import CustomField from "@components/module/CustomField";
import logo from "/assets/images/logo.webp";
import UseDarkModeStore from "@store/UseDarkMode.js";
import LoginHandlers from "@module/container/aurh/LoginHandlers.js";

const Login = () => {
  const navigate = useNavigate();
  const { darkMode } = UseDarkModeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitPending, setSubmitPending] = useState(false);

  const { onSubmit } = LoginHandlers({ setSubmitPending });

  const initialValues = {
    email: "",
    password: "",
  };

  const validateLogin = (values) => {
    const errors = {};

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

    return errors;
  };

  return (
    <div
      style={{ direction: "ltr" }}
      className="w-full h-screen flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-gray-100 font-Poppins max-sm:px-5"
    >
      <div className="w-1/2 h-auto flex flex-col items-center justify-center shadow bg-white text-dark-100 dark:text-white dark:bg-dark-100 rounded-xl gap-7 py-14 max-lg:w-8/12 max-md:w-10/12 max-sm:w-full">
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
            Monitoring Control Panel - Login
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          validate={validateLogin}
          onSubmit={onSubmit}
        >
          <Form className="w-10/12 flex flex-col justify-center items-start gap-2">
            <CustomField id={"email"} name={"email"} placeholder={"Email"} />
            <div className="w-full flex items-center rounded-lg border-2 border-gray-200 dark:border-gray-600">
              <Field
                className="w-full p-3 rounded-lg outline-none text-[0.90rem] max-sm:text-[0.80rem] bg-white dark:bg-dark-100"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder={"Password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-3 bg-white dark:bg-dark-100 rounded-r-lg focus:outline-none"
              >
                {showPassword ? (
                  <VscEyeClosed size={20} />
                ) : (
                  <VscEye size={20} />
                )}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-[0.80rem] font-medium"
            />

            <div className="w-full h-auto flex flex-row justify-between items-center text-[0.90rem] p-2 max-md:text-[0.80rem]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/register");
                }}
              >
                {"Register"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/forgetPassword");
                }}
              >
                {"Forgot password"}
              </button>
            </div>

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
                login
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
