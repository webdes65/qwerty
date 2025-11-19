import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Slider } from "antd";
import { Field, Formik, Form } from "formik";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";
import EditComponentHandlers from "@module/container/main/create-component/EditComponentHandlers.js";
import ControlImageForm from "@module/card/form/ControlImageForm.jsx";
import "@styles/formAndComponentStyles.css";

const EditComponentModal = ({ isOpenEditModal, setIsOpenEditModal, item }) => {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.components);

  const [selectedCategory, setSelectedCategory] = useState(0);

  const { images, isLoadingImages, imagesError, processedOptions } =
    EditComponentHandlers({ selectedCategory });

  const handlerSubmit = (values) => {
    const updatedComponents = [...components];
    const index = updatedComponents.findIndex((index) => index.id === item.id);

    if (index !== -1) {
      updatedComponents[index] = {
        ...updatedComponents[index],
        ...values,
      };
    }

    dispatch(setComponents(updatedComponents));
    setIsOpenEditModal(false);
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Edit"
      open={isOpenEditModal}
      onCancel={() => setIsOpenEditModal(false)}
      footer={null}
    >
      <Formik
        initialValues={{
          bgImg: item?.bgImg,
          bg: item?.bg,
          width: item?.width,
          height: item?.height,
          borderRadius: item?.borderRadius,
        }}
        onSubmit={handlerSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="flex flex-col gap-4 w-full">
            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label htmlFor="width" className="text-sm labelStyle">
                  Width
                </label>
                <Field
                  type="number"
                  name="width"
                  className="w-full bg-white inputStyle"
                  onChange={handleChange}
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
                  onChange={handleChange}
                  value={values.height}
                />
              </div>
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
                onChange={(value) =>
                  handleChange({ target: { name: "borderRadius", value } })
                }
              />
            </div>

            <div className="flex flex-row justify-start items-center gap-2">
              <label htmlFor="bg" className="text-sm labelStyle">
                Background Color
              </label>

              <Field
                type="color"
                name="bg"
                className="shadow"
                onChange={(event) => setFieldValue("bg", event.target.value)}
                value={values.bg}
              />
            </div>

            {item?.type === "board" && (
              <ControlImageForm
                images={images}
                values={values}
                setFieldValue={setFieldValue}
                setSelectedCategory={setSelectedCategory}
                isLoadingImages={isLoadingImages}
                optionsCategories={processedOptions}
                selectedCategory={selectedCategory}
                imagesError={imagesError}
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpenEditModal(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditComponentModal;
