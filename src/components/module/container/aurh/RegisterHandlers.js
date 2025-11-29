import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { request } from "@services/apiService.js";

export default function RegisterHandlers({ setSubmitPending }) {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/register", data }),
    {
      onSuccess: (data) => {
        toast.success(data.message);

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
        const errors = error.response?.data?.errors;

        if (errors) {
          for (const key in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, key)) {
              errors[key].forEach((message) => {
                toast.error(message);
              });
            }
          }
        }
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
