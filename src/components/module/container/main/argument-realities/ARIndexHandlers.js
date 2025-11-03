import { useQuery } from "react-query";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

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

  if (errAR) {
    logger.error(errAR);
    return <div>{errAR.message}</div>;
  }

  if (errProject) {
    logger.error(errProject);
    return <div>{errProject.message}</div>;
  }

  const dataAugmentedRealities = dataAR?.data || [];
  const dataListProject = dataProject?.data || [];

  return { loadingAR, loadingProject, dataAugmentedRealities, dataListProject };
}
