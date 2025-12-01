import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Slider } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";
import CreateBoardHandlers from "@module/container/main/create-component/CreateBoardHandlers.js";
import ControlImageForm from "@module/card/form/ControlImageForm.jsx";
import "@styles/allRepeatStyles.css";

const CreateBoardModal = ({
  isOpenModalCreateBoard,
  setIsOpenModalCreateBoard,
}) => {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.components);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [images, setImages] = useState([]);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const processedOptions = optionsCategories.map((option) => ({
    ...option,
    value: option.value,
  }));

  const { isLoadingImages, imagesError } = CreateBoardHandlers({
    setOptionsCategories,
    selectedCategory,
    setImages,
  });

  const initialValues = {
    type: "board",
    name: "",
    width: 80,
    height: 80,
    bg: "#000",
    bgImg: "",
    position: { x: 0, y: 0 },
    borderRadius: 5,
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    return errors;
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Create Board"
      open={isOpenModalCreateBoard}
      onCancel={() => setIsOpenModalCreateBoard(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, { resetForm }) => {
          const newBoard = {
            ...values,
            id: uuidv4(),
          };
          const updatedList = [...components, newBoard];
          dispatch(setComponents(updatedList));
          resetForm();
          setIsOpenModalCreateBoard(false);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="w-full flex flex-col gap-4">
            <div className="flex flex-col justify-center items-start pb-2">
              <label htmlFor="title" className="text-sm labelStyle">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="w-full bg-white inputStyle"
                onChange={(e) => setFieldValue("name", e.target.value)}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-[0.80rem] font-medium mt-1"
              />
            </div>
            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label htmlFor="width" className="text-sm labelStyle">
                  Width
                </label>
                <Field
                  type="number"
                  name="width"
                  className="w-full bg-white inputStyle"
                  onChange={(e) => setFieldValue("width", e.target.value)}
                  value={values.width}
                />
              </div>
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label htmlFor="height" className="text-sm labelStyle">
                  Height
                </label>
                <Field
                  type="number"
                  name="height"
                  className="w-full bg-white inputStyle"
                  onChange={(e) => setFieldValue("height", e.target.value)}
                  value={values.height}
                />
              </div>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <label htmlFor="bg" className="text-sm labelStyle">
                Background Color
              </label>
              <Field
                type="color"
                name="bg"
                className="shadow"
                onChange={(e) => setFieldValue("bg", e.target.value)}
                value={values.bg}
              />
            </div>

            <div className="w-full h-auto flex flex-col justify-center items-start gap-2">
              <label htmlFor="bg" className="text-sm labelStyle">
                Border Radius
              </label>
              <Slider
                className="w-full"
                min={0}
                max={50}
                step={1}
                value={values.borderRadius}
                onChange={(value) => setFieldValue("borderRadius", value)}
              />
            </div>

            <ControlImageForm
              selectedCategory={selectedCategory}
              optionsCategories={processedOptions}
              setSelectedCategory={setSelectedCategory}
              isLoadingImages={isLoadingImages}
              imagesError={imagesError}
              images={images}
              setFieldValue={setFieldValue}
              values={values}
            />
            <Button htmlType="submit" className="w-full buttonPrimaryStyle">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateBoardModal;
