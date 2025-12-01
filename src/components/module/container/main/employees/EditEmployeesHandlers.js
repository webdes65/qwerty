import { useMutation, useQuery } from "react-query";
import { request } from "@services/apiService.js";
import { toast } from "react-toastify";
import logger from "@utils/logger.js";

export default function EditEmployeesHandlers({
  id,
  setIsEditable,
  setUpdateLoading,
}) {
  const updateForm = useMutation(
    (data) => request({ method: "PATCH", url: `/api/users/${id}`, data }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        setIsEditable(false);
      },
      onError: (error) => {
        logger.log(error);
        toast.error(error);
      },
      onSettled: () => {
        setUpdateLoading(false);
      },
    },
  );

  const { data: dataTimezones } = useQuery(["fetchTimezones"], () =>
    request({
      method: "GET",
      url: "/api/users/timezones",
    }),
  );

  const timezonesOptions =
    dataTimezones?.data?.map((index) => ({
      value: index,
      label: index,
    })) || [];

  const onSubmit = (values) => {
    setUpdateLoading(true);
    logger.log(values);
    updateForm.mutate(values);
  };

  return { onSubmit, timezonesOptions };
}
