import { useMutation, useQueryClient } from "react-query";
import { generateCypherKey } from "@utils/generateCypherKey.js";
import axios from "axios";
import { toast } from "react-toastify";
import logger from "@utils/logger.js";
import { request } from "@services/apiService.js";
import Cookies from "universal-cookie";

export default function UploadImagesHandlers({
  setIsOpenUploadImagesModal,
  setSelectedCategory,
  setSubmitLoadingImages,
  selectedCategory,
  setCategoryTitle,
  setCategoryDescription,
  setIsCreatingCategory,
  setLoadingCreateCategory,
  categoryTitle,
  categoryDescription,
}) {
  const queryClient = useQueryClient();
  const cookies = new Cookies();

  const submitImages = useMutation(
    async (data) => {
      const cypherKey = await generateCypherKey();
      const token = cookies.get("bms_access_token");

      return axios.post(`${import.meta.env.VITE_BASE_URL}/api/files`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          cypherKey,
        },
      });
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message);
        setIsOpenUploadImagesModal(false);
        setSelectedCategory(null);
      },
      onError: (error) => {
        logger.error("Upload error:", error);
      },
      onSettled: () => {
        setSubmitLoadingImages(false);
      },
    },
  );

  const handleSelectImage = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();

      const data = {
        category: selectedCategory,
        files: [],
      };

      for (let i = 0; i < files.length; i++) {
        formData.append(`files[]`, files[i]);
        data.files.push(files[i]);
      }

      submitImages.mutate(data);
      setSubmitLoadingImages(true);
    }
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
    if (!categoryTitle) {
      toast.error("Title is required!");
      return;
    }

    const newCategory = {
      title: categoryTitle,
      type: "Files",
      description: categoryDescription,
    };

    mutation.mutate(newCategory);
    setLoadingCreateCategory(true);
  };

  return { handleSelectImage, handleCreateCategory };
}
