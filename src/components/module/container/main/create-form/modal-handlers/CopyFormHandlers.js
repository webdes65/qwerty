import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function CopyFormHandlers({
  setIsOpenChooseNameModal,
  onSuccess,
  formId,
  selectedCategory,
  setCategoryTitle,
  setCategoryDescription,
  setIsCreatingCategory,
  categoryTitle,
  categoryDescription,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);

  const copyFormMutation = useMutation(
    (data) => {
      return request({
        method: "POST",
        url: "/api/forms/clone",
        data,
      });
    },
    {
      onSuccess: (data) => {
        toast.success("Form copied successfully!");
        setIsOpenChooseNameModal(false);
        if (onSuccess) {
          onSuccess(data);
        }
        navigate("/forms");
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "Error copying form";
        toast.error(errorMessage);
      },
    },
  );

  const handleSubmit = (values, { resetForm }) => {
    if (!formId) {
      toast.error("Cannot copy form: Form ID is missing");
      return;
    }

    const payloadData = {
      name: values.name,
      form: formId,
      category: selectedCategory,
    };

    copyFormMutation.mutate(payloadData);
    resetForm();
  };

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
    const newCategory = {
      title: categoryTitle,
      description: categoryDescription,
      type: "None",
    };

    mutation.mutate(newCategory);
    setLoadingCreateCategory(true);
  };

  return {
    loadingCreateCategory,
    copyFormMutation,
    handleSubmit,
    handleCreateCategory,
  };
}
