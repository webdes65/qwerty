import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";
import { Modal, Select, Slider, Spin } from "antd";
import { Field, Formik, Form } from "formik";
import { request } from "@services/apiService.js";

const EditComponentModal = ({ isOpenEditModal, setIsOpenEditModal, item }) => {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.components);

  const [selectedCategorie, setSelectedCategorie] = useState(0);
  const [imgs, setImgs] = useState([]);
  const [optionsCategories, setOptionsCategories] = useState([]);

  const { data: categoriesData } = useQuery(["getCategories"], () =>
    request({
      method: "GET",
      url: "/api/categories",
    }),
  );

  useEffect(() => {
    if (categoriesData) {
      const newOptions = categoriesData.data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      const allOption = { label: "All", value: 0 };
      setOptionsCategories([allOption, ...newOptions]);
    }
  }, [categoriesData]);

  const { data: imgsData, isLoading: isLoadingImgs } = useQuery(
    ["fetchImgsCategory", selectedCategorie],
    () =>
      request({
        method: "GET",
        url: `/api/files?category=${selectedCategorie}`,
      }),
  );

  useEffect(() => {
    if (imgsData) {
      setImgs(imgsData.data);
    }
  }, [imgsData]);

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
        onSubmit={(values) => {
          const updatedComponents = [...components];
          const index = updatedComponents.findIndex(
            (index) => index.id === item.id,
          );

          if (index !== -1) {
            updatedComponents[index] = {
              ...updatedComponents[index],
              ...values,
            };
          }

          dispatch(setComponents(updatedComponents));
          setIsOpenEditModal(false);
        }}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="flex flex-col gap-4 w-full">
            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label
                  htmlFor="width"
                  className="text-sm text-gray-500 font-bold"
                >
                  Width
                </label>
                <Field
                  type="number"
                  name="width"
                  className="border-2 border-gray-200 p-2 rounded w-full outline-none"
                  onChange={handleChange}
                  value={values.width}
                />
              </div>
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label
                  htmlFor="height"
                  className="text-sm text-gray-500 font-bold"
                >
                  Height
                </label>
                <Field
                  type="number"
                  name="height"
                  className="border-2 border-gray-200 p-2 rounded w-full outline-none"
                  onChange={handleChange}
                  value={values.height}
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-col justify-center items-start gap-2">
              <label htmlFor="bg" className="text-sm text-gray-500 font-bold">
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
              <label htmlFor="bg" className="text-sm text-gray-500 font-bold">
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
              <>
                <Select
                  showSearch
                  className="customSelect w-full font-Quicksand font-medium placeholder:font-medium"
                  placeholder="Choose Category"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  value={selectedCategorie}
                  options={optionsCategories}
                  onChange={(value) => setSelectedCategorie(value)}
                />
                <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                  {isLoadingImgs ? (
                    <Spin />
                  ) : (
                    <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                      <div
                        onClick={() => setFieldValue("bgImg", "")}
                        className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                          values.bgImg === ""
                            ? "border-blue-500 shadow-xl"
                            : "border-transparent"
                        } flex items-center justify-center bg-gray-200 shadow p-1`}
                      >
                        <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                          No Image
                        </span>
                      </div>
                      {imgs.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => setFieldValue("bgImg", img.path)}
                          className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                            values.bgImg === img.path
                              ? "border-blue-500 shadow-xl"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={img.path}
                            alt={index}
                            className="w-full h-full object-cover rounded-lg p-1"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
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
