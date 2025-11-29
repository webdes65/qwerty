import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function ForgetPassHandlers({ setSubmitPending }) {
  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/forget", data }),
    {
      onSuccess: () => {
        toast.success("Sent link to your email successfully!");

        /*let expirationDate = new Date();
                        expirationDate.setDate(expirationDate.getDate() + 6);
                        cookies.set("bms_access_token", token, {
                            expires: expirationDate,
                        });*/

        /* setTimeout(() => {
                            navigate("/");
                        }, 5000);*/
      },
      onError: (error) => {
        logger.error(error);
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
