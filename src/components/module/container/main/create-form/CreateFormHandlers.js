import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function CreateFormHandlers({ id, boxInfo }) {
  const prevBoxInfo = useRef(boxInfo);

  useEffect(() => {
    if (JSON.stringify(prevBoxInfo.current) !== JSON.stringify(boxInfo)) {
      localStorage.setItem("boxInfo", JSON.stringify(boxInfo));
      prevBoxInfo.current = boxInfo;
    }
  }, [boxInfo]);

  const { data, isLoading, error } = useQuery(
    ["GetForms"],
    () =>
      request({
        method: "GET",
        url: "/api/forms",
      }),
    { enabled: !!id && !!name },
  );

  return { data, isLoading, error };
}
