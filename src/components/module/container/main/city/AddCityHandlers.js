import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function AddCityHandlers({ setIsModalOpen }) {
  const queryClient = useQueryClient();

  const [submitPending, setSubmitPending] = useState(false);

  const { data } = useQuery(["fetchCountries"], () =>
    request({ method: "GET", url: "/api/GetCountries" }),
  );

  const countryOptions =
    data?.data?.map((country) => ({
      value: country.uuid,
      label: country.en_name,
    })) || [];

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/cities", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        setIsModalOpen(false);
        queryClient.invalidateQueries("fetchCities");
      },
      onError: (error) => {
        logger.error(error);
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

  return { submitPending, countryOptions, onSubmit };
}
