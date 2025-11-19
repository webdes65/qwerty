import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Form, Button, Select, Checkbox } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import SubmitHandler from "@module/container/main/create-form/modal-handlers/SubmitHandler.js";
import "@styles/formAndComponentStyles.css";

const SubmitModal = ({
  isOpenChooseNameModal,
  setIsOpenChooseNameModal,
  optionsCategories,
  setName,
  title,
  selectedCategory: initialCategory,
  setSelectedCategory = () => {},
  setDefault = 0,
}) => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isDefaultForm, setIsDefaultForm] = useState(false);

  const [localSelectedCategory, setLocalSelectedCategory] = useState(
    initialCategory || null,
  );

  const location = useLocation();

  const initialValues = {
    name: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Name is required";
    return errors;
  };

  const processedOptions = (optionsCategories ?? []).map((option) => ({
    ...option,
    value: option.value,
  }));

  const { handleCreateCategory } = SubmitHandler({
    setCategoryTitle,
    setCategoryDescription,
    setIsCreatingCategory,
    setLoadingCreateCategory,
    categoryTitle,
    categoryDescription,
  });

  const handleCategoryChange = (value) => {
    setLocalSelectedCategory(value);
    setSelectedCategory(value);
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!values.name.trim()) {
      toast.error("Form name is required");
      return;
    }

    if (!localSelectedCategory) {
      toast.error("Category is required");
      return;
    }

    if (location.pathname !== "/createcomponent") {
      const defaultValue = isDefaultForm ? 1 : 0;
      setDefault(defaultValue);
    }

    setName(values.name);
    setSelectedCategory(localSelectedCategory);
    resetForm();
    setIsDefaultForm(false);
    setIsOpenChooseNameModal(false);
  };

  return (
    <Modal
      className="font-Quicksand"
      title={`Choose Name ${title}`}
      open={isOpenChooseNameModal}
      onCancel={() => setIsOpenChooseNameModal(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <Form onFinish={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col justify-center items-start">
              <label htmlFor="name" className="text-sm labelStyle">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="w-full !p-2  bg-white inputStyle"
                onChange={(e) => setFieldValue("name", e.target.value)}
                value={values.name}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-[0.80rem] font-medium"
              />
            </div>

            <Select
              className="customSelect w-full font-Quicksand font-medium placeholder:font-medium"
              options={processedOptions}
              value={localSelectedCategory}
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

            {!isCreatingCategory && (
              <Button
                onClick={() => setIsCreatingCategory(true)}
                className="w-full buttonPrimaryStyle"
              >
                Create Category
              </Button>
            )}

            {isCreatingCategory && (
              <div className="w-full flex flex-col gap-2">
                <input
                  className="placeholder:font-medium bg-white inputStyle"
                  placeholder="Title"
                  value={categoryTitle}
                  onChange={(e) => setCategoryTitle(e.target.value)}
                  required
                />
                <input
                  className="placeholder:font-medium bg-white mb-2 inputStyle"
                  placeholder="Description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
                <div className="w-full flex flex-row justify-center items-center gap-2">
                  <Button
                    onClick={() => setIsCreatingCategory(false)}
                    className="w-1/2 buttonSecondaryStyle"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCategory}
                    loading={loadingCreateCategory}
                    htmlType="button"
                    className="w-1/2 buttonPrimaryStyle"
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}

            {location.pathname !== "/createcomponent" && (
              <Checkbox
                className="w-[100px]"
                checked={isDefaultForm}
                onChange={(e) => setIsDefaultForm(e.target.checked)}
              >
                Set default
              </Checkbox>
            )}

            <Button htmlType="submit" className="w-full buttonPrimaryStyle">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default SubmitModal;
