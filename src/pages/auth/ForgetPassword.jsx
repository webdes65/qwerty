import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Form, Formik } from "formik";
import CustomField from "@components/module/CustomField";
import logo from "/assets/images/logo.webp";
import UseDarkModeStore from "@store/UseDarkMode.js";
import ForgetPassHandlers from "@module/container/aurh/ForgetPassHandlers.js";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { darkMode } = UseDarkModeStore();
  const [submitPending, setSubmitPending] = useState(false);

  const { onSubmit } = ForgetPassHandlers({ setSubmitPending });

  const initialValues = {
    email: "",
  };

  const validateForgetPass = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email format";
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
            Monitoring Control Panel - Forget Password
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          validate={validateForgetPass}
          onSubmit={onSubmit}
        >
          <Form className="w-10/12 flex flex-col justify-center items-start gap-2">
            <CustomField id={"email"} name={"email"} placeholder={"Email"} />

            <div className="w-full h-auto flex items-center text-[0.90rem] p-2 max-md:text-[0.80rem]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/login");
                }}
              >
                Go back
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
                Send
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ForgetPassword;
