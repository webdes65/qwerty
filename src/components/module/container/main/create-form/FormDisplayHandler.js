import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function FormDisplayHandler({ idForm, setFormInfo }) {
  const { data, isLoading, error } = useQuery(
    ["GetForms"],
    () =>
      request({
        method: "GET",
        url: "/api/forms",
      }),
    { enabled: !!idForm },
  );

  useEffect(() => {
    if (data?.data && idForm) {
      const info = data.data.find((form) => form.id === idForm);
      if (info) {
        setFormInfo(info.content);
      } else {
        logger.log("A form was not found with this ID.");
      }
    }
  }, [data, idForm]);

  return { isLoading, error };
}
