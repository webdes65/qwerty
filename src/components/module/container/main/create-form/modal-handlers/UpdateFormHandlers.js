import { useMutation, useQueryClient } from "react-query";
import { request } from "@services/apiService.js";
import { toast } from "react-toastify";
import logger from "@utils/logger.js";
import { useLocation } from "react-router-dom";

export default function UpdateFormHandlers({
  setCategoryTitle,
  setCategoryDescription,
  setIsCreatingCategory,
  setLoadingCreateCategory,
  categoryTitle,
  optionsCategories,
  categoryDescription,
  selectedCategory,
  isDefaultForm,
  onConfirm,
  setUpdatedName,
  setIsDefaultForm,
  setOpenUpdateModal,
}) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const formId = location.state.id;

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

  const setDefaultMutation = useMutation(
    (data) =>
      request({
        method: "POST",
        url: `api/forms/default-building/${formId}`,
        data,
      }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        queryClient.invalidateQueries("setDefaultForm");
      },
      onError: (error) => {
        logger.error(error);
        toast.error("Failed to set default form");
      },
    },
  );

  const handleCreateCategory = () => {
    if (!categoryTitle.trim()) {
      toast.error("Title is required for category");
      return;
    }

    const isDuplicate = (optionsCategories ?? []).some(
      (cat) => cat.label?.toLowerCase() === categoryTitle.trim().toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("Category title already exists");
      return;
    }

    const newCategory = {
      title: categoryTitle,
      type: "None",
      description: categoryDescription,
    };

    setLoadingCreateCategory(true);
    mutation.mutate(newCategory);
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!values.updatedName.trim()) {
      toast.error("Form name is required");
      return;
    }

    if (!selectedCategory) {
      toast.error("Category is required");
      return;
    }

    if (isDefaultForm) {
      const setDefaultData = {
        default_building: 1,
      };
      setDefaultMutation.mutate(setDefaultData);
    }

    if (onConfirm) onConfirm(values.updatedName, selectedCategory);
    setUpdatedName(values.updatedName);
    resetForm();
    setIsDefaultForm(false);
    setOpenUpdateModal(false);
  };

  return { handleCreateCategory, handleSubmit };
}
