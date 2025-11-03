import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function ARSubProjectHandler({ id }) {
  const {
    data: dataSub,
    isLoading: loadingSub,
    // error: errSub,
  } = useQuery(["subsList", id], () =>
    request({
      method: "GET",
      url: `/api/projects/${id}/subs`,
    }),
  );

  return { dataSub, loadingSub };
}
