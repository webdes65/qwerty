import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function ComponentsSectionHandlers({ setDeletingId }) {
  const queryClient = useQueryClient();

  const {
    data: dataComponents,
    isLoading: isLoadingComponents,
    error: isErrorComponents,
  } = useQuery(["fetchComponents"], () =>
    request({
      method: "GET",
      url: "/api/components",
    }),
  );

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/components/${id}` }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["fetchComponents"]);
      },
      onError: (error) => {
        logger.error(error);
      },
    },
  );

  const removeComponent = (id) => {
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  return {
    dataComponents,
    isLoadingComponents,
    isErrorComponents,
    removeComponent,
  };
}
