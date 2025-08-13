import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Button } from "antd";
import Cookies from "universal-cookie";
import { Form, Formik } from "formik";
import CustomField from "@components/module/CustomField";
import { request } from "@services/apiService.js";
import logo from "/assets/images/logo.webp";

const ForgetPass = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [submitPending, setSubmitPending] = useState(false);

    const mutation = useMutation(
        (data) => request({ method: "POST", url: "/api/forgetPass", data }),
        {
            onSuccess: (data) => {
                toast.success(`Welcome ${data.data.profile.first_name}`);
                localStorage.setItem("user_id", data.data.profile.user_uuid);
                localStorage.setItem("user_name", data.data.user.name);

                const token = data.access_token;

                let expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 6);
                cookies.set("bms_access_token", token, {
                    expires: expirationDate,
                });

                setTimeout(() => {
                    navigate("/");
                }, 5000);
            },
            onError: (error) => {
                console.log(error);
                toast.error(error.response.data.message);
            },
            onSettled: () => {
                setSubmitPending(false);
            },
        },
    );

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

    const onSubmit = async (values) => {
        setSubmitPending(true);
        mutation.mutate(values);
    };

    return (
        <div
            style={{ direction: "ltr" }}
            className="w-full h-screen flex flex-col items-center justify-center bg-[#F3F4F6] font-Poppins max-sm:px-5"
        >
            <div className="w-1/2 h-auto flex flex-col items-center justify-center shadow bg-white rounded-xl gap-7 py-14 max-lg:w-8/12 max-md:w-10/12 max-sm:w-full">
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="w-20 h-20">
                        <img alt="logo" src={logo} className="w-full h-full" />
                    </div>

                    <h1
                        className="text-xl font-semibold uppercase text-transparent bg-clip-text max-md:text-base"
                        style={{
                            backgroundImage: "linear-gradient(to right, #6D6CAA, #6EC5D6)",
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

export default ForgetPass;
