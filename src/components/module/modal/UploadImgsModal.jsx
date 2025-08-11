import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Button, Select, Modal } from "antd";
import Cookies from "universal-cookie";
import { request } from "@services/apiService.js";
import { generateCypherKey } from "@utils/generateCypherKey.js";

const UploadImgsModal = ({
  isOpenUploadImgsModal,
  setIsOpenUploadImgsModal,
  optionsCategories,
}) => {
  const inputRef = useRef(null);
  const cookies = new Cookies();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitLoadingImgs, setSubmitLoadingImgs] = useState(false);
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

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

      submitImgs.mutate(data);
      setSubmitLoadingImgs(true);
    }
  };

  const submitImgs = useMutation(
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
        setIsOpenUploadImgsModal(false);
      },
      onError: (error) => {
        console.error("Upload error:", error);
      },
      onSettled: () => {
        setSubmitLoadingImgs(false);
      },
    },
  );

  const handleUploadClick = () => {
    if (!selectedCategory) {
      toast.error("Please select a category before uploading images!");
      return;
    }
    inputRef.current.click();
  };

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
        console.error(error);
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

  return (
    <Modal
      open={isOpenUploadImgsModal}
      onCancel={() => setIsOpenUploadImgsModal(false)}
      footer={null}
      title="Upload Images"
      className="font-Poppins"
    >
      <div className="h-auto w-full flex flex-col justify-center items-center gap-5 p-10 px-20 bg-white rounded-md max-sm:w-full max-sm:px-10">
        <Select
          className="customSelect w-full font-Quicksand font-medium placeholder:font-medium"
          options={optionsCategories}
          onChange={(value) => setSelectedCategory(value)}
          placeholder="Categories"
        />

        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleSelectImage}
          className="w-full p-2 border rounded"
          accept="image/*"
          style={{ display: "none" }}
        />

        <Button
          onClick={handleUploadClick}
          loading={submitLoadingImgs}
          className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
        >
          Upload imgs
        </Button>

        <div className="w-full h-px bg-gray-300 my-4" />
        <Button
          onClick={() => setIsCreatingCategory(true)}
          className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
        >
          Create Category
        </Button>

        {isCreatingCategory && (
          <div className="w-full flex flex-col gap-2">
            <input
              className="border-2 border-gray-200 outline-none p-3 rounded-md placeholder:font-medium"
              placeholder="Title"
              value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)}
              required
            />
            <input
              className="border-2 border-gray-200 outline-none p-3 rounded-md placeholder:font-medium"
              placeholder="Description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
            <div className="w-full flex flex-row justify-center items-center gap-2">
              <Button
                onClick={() => setIsCreatingCategory(false)}
                className="w-1/2 font-Quicksand font-bold !bg-red-200 !p-4 !shadow !text-red-500 !text-[0.90rem] !border-[2.5px] !border-red-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCategory}
                loading={loadingCreateCategory}
                className="w-1/2 font-Quicksand font-bold !bg-blue-200 !p-4 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
              >
                Create
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UploadImgsModal;
