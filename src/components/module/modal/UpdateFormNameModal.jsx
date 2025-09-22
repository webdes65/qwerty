import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Modal, Form, Button, Select } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function UpdateFormNameModal({
  name,
  updatedName,
  setUpdatedName,
  openUpdateModal,
  setOpenUpdateModal,
  onConfirm,
  handleDownloadHTML,
  optionsCategories,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const processedOptions = (optionsCategories ?? []).map((option) => ({
    ...option,
    value: option.value,
  }));

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
        logger.error(error.message);
      },
      onSettled: () => {
        setLoadingCreateCategory(false);
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
      title: categoryTitle.trim(),
      type: "Files",
      description: categoryDescription,
    };

    setLoadingCreateCategory(true);
    mutation.mutate(newCategory);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setIsCreatingCategory(false);
    setCategoryTitle("");
    setCategoryDescription("");
    setOpenUpdateModal(false);
  };

  const initialValues = {
    updatedName: updatedName || "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.updatedName) {
      errors.updatedName = "Form name is required";
    }
    return errors;
  };

  const handleSubmit = (values) => {
    setUpdatedName(values.updatedName);
    if (onConfirm) onConfirm(values.updatedName, selectedCategory);
    setOpenUpdateModal(false);
  };

  return (
    <Modal
      className="font-Quicksand"
      title={`Are you sure you want to change the name from ${name}?`}
      open={openUpdateModal}
      onCancel={handleModalClose}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit: formikSubmit, setFieldValue, values }) => (
          <Form onFinish={formikSubmit} className="w-full flex flex-col gap-4">
            {/* اسم فرم */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 font-bold">
                New Name
              </label>
              <Field
                type="text"
                name="updatedName"
                className="w-full border-2 border-gray-300 rounded-lg p-2 outline-none"
                onChange={(e) => setFieldValue("updatedName", e.target.value)}
                value={values.updatedName}
              />
              <ErrorMessage
                name="updatedName"
                component="div"
                className="text-red-500 text-[0.80rem] font-medium"
              />
            </div>

            {/* انتخاب دسته‌بندی */}
            <Select
              className="customSelect w-full font-Quicksand font-medium placeholder:font-medium"
              options={processedOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Categories"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />

            {/* ایجاد دسته‌بندی */}
            {!isCreatingCategory && (
              <Button
                onClick={() => setIsCreatingCategory(true)}
                className="w-full font-Quicksand font-bold !bg-blue-200 !p-3 !shadow !text-blue-500 !border-[2.5px] !border-blue-500"
              >
                Create Category
              </Button>
            )}

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
                    className="w-1/2 font-Quicksand font-bold !bg-red-200 !p-3 !shadow !text-red-500 !border-[2.5px] !border-red-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCategory}
                    loading={loadingCreateCategory}
                    className="w-1/2 font-Quicksand font-bold !bg-blue-200 !p-3 !shadow !text-blue-500 !border-[2.5px] !border-blue-500"
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}

            {/* دکمه‌های پایینی */}
            <div className="flex flex-row justify-end items-center gap-2 mt-2">
              <Button
                key="cancel"
                onClick={() => setOpenUpdateModal(false)}
                className="font-Quicksand font-bold !bg-red-200 !p-2 !shadow text-red-500 !rounded-md !border-[2.5px] !border-red-500"
              >
                Cancel
              </Button>

              <Button
                key="download"
                onClick={handleDownloadHTML}
                className="font-Quicksand font-bold !bg-green-200 !p-2 !shadow text-green-500 !rounded-md !border-[2.5px] !border-green-500"
              >
                Download
              </Button>

              <Button
                key="confirm"
                htmlType="submit"
                type="primary"
                className="font-Quicksand font-bold !bg-blue-200 !p-2 !shadow !text-blue-500 !rounded-md !border-[2.5px] !border-blue-500"
              >
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
