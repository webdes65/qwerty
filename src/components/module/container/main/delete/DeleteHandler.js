import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function DeleteHandler({ url, queryKey, setSubmitLoading }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `${url}${id}` }),
    {
      onSuccess: (res) => {
        toast.success(res.message);
        if (Array.isArray(queryKey)) {
          queryKey.forEach((key) => {
            queryClient.invalidateQueries([key]);
          });
        } else {
          queryClient.invalidateQueries([queryKey]);
        }
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setSubmitLoading(false);
      },
    },
  );

  const handleRemove = (id) => {
    setSubmitLoading(true);
    deleteMutation.mutate(id);
  };

  return { deleteMutation, handleRemove };
}
