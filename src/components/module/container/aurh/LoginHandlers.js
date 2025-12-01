import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function LoginHandlers({ setSubmitPending }) {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/login", data }),
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
        logger.log("error", error);
        toast.error(error.response.data.message);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const onSubmit = async (values) => {
    setSubmitPending(true);
    mutation.mutate(values);
  };

  return { onSubmit };
}
