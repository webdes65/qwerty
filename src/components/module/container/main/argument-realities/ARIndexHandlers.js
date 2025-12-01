import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function ARIndexHandlers() {
  const {
    data: dataAR,
    isLoading: loadingAR,
    error: errAR,
  } = useQuery(["ARList"], () =>
    request({
      method: "GET",
      url: "/api/augmented-realities",
    }),
  );

  const {
    data: dataProject,
    isLoading: loadingProject,
    error: errProject,
  } = useQuery(["getProject"], () =>
    request({
      method: "GET",
      url: "/api/projects",
    }),
  );

  const dataAugmentedRealities = dataAR?.data || [];
  const dataListProject = dataProject?.data || [];

  return {
    loadingAR,
    loadingProject,
    dataAugmentedRealities,
    dataListProject,
    errAR,
    errProject,
  };
}
