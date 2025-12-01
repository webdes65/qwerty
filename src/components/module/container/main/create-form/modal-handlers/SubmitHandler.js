import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function SubmitHandler({
  setCategoryTitle,
  setCategoryDescription,
  setIsCreatingCategory,
  setLoadingCreateCategory,
  categoryTitle,
  categoryDescription,
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/categories", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        queryClient.invalidateQueries("getCategories");

        setCategoryTitle("");
        setCategoryDescription("");
        setIsCreatingCategory(false);
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setLoadingCreateCategory(false);
      },
    },
  );

  const handleCreateCategory = () => {
    if (!categoryTitle) {
      toast.error("Title is required!");
      return;
    }

    const newCategory = {
      title: categoryTitle,
      type: "None",
      description: categoryDescription,
    };

    mutation.mutate(newCategory);
    setLoadingCreateCategory(true);
  };

  return { handleCreateCategory };
}
