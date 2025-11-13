import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Select, Modal } from "antd";
import UploadImagesHandlers from "@module/container/main/create-form/modal-handlers/UploadImagesHandlers.js";
import "@styles/dragOptionStyles.css";

const UploadImagesModal = ({
  isOpenUploadImagesModal,
  setIsOpenUploadImagesModal,
  optionsCategories,
}) => {
  const inputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitLoadingImages, setSubmitLoadingImages] = useState(false);
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const processedOptions = optionsCategories.map((option) => ({
    ...option,
    value: option.value,
  }));

  const { handleSelectImage, handleCreateCategory } = UploadImagesHandlers({
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
  });

  const handleUploadClick = () => {
    if (!selectedCategory) {
      toast.error("Please select a category before uploading images!");
      return;
    }
    inputRef.current.click();
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleModalClose = () => {
    setIsOpenUploadImagesModal(false);
    setSelectedCategory(null);
    setIsCreatingCategory(false);
    setCategoryTitle("");
    setCategoryDescription("");
  };

  return (
    <Modal
      open={isOpenUploadImagesModal}
      onCancel={handleModalClose}
      footer={null}
      title="Upload Images"
      className="font-Poppins"
    >
      <div className="h-auto w-full flex flex-col justify-center items-center gap-5 p-10 px-20 bg-white text-dark-100  dark:bg-dark-100 dark:text-white rounded-md max-sm:w-full max-sm:px-10">
        <Select
          className="customSelect w-full font-Quicksand font-medium placeholder:font-medium"
          options={processedOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Categories"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
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
          loading={submitLoadingImages}
          className="w-full dragButtonPrimaryStyle"
        >
          Upload imgs
        </Button>

        <div className="w-full h-px bg-gray-300 my-4" />
        <Button
          onClick={() => setIsCreatingCategory(true)}
          className="w-full dragButtonPrimaryStyle"
        >
          Create Category
        </Button>

        {isCreatingCategory && (
          <div className="w-full flex flex-col gap-2">
            <input
              className="uploadInputStyle placeholder:font-mediumbg-white"
              placeholder="Title"
              value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)}
              required
            />
            <input
              className="uploadInputStyle placeholder:font-mediumbg-white mb-2"
              placeholder="Description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
            <div className="w-full flex flex-row justify-center items-center gap-2">
              <Button
                onClick={() => setIsCreatingCategory(false)}
                className="w-1/2 dragButtonSecondaryStyle"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCategory}
                loading={loadingCreateCategory}
                className="w-1/2 dragButtonPrimaryStyle"
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

export default UploadImagesModal;
