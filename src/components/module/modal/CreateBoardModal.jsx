import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";
import { Button, Modal, Select, Slider, Spin } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { request } from "@services/apiService.js";

const CreateBoardModal = ({
  isOpenModalCreateBoard,
  setIsOpenModalCreateBoard,
}) => {
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
        value: item.uuid,
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

  const processedOptions = optionsCategories.map((option) => ({
    ...option,
    value: option.value,
  }));

  useEffect(() => {
    if (imgsData) {
      setImgs(imgsData.data);
    }
  }, [imgsData]);

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
              <label
                htmlFor="title"
                className="text-sm text-gray-500 font-bold"
              >
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="border-2 border-gray-200 p-2 rounded w-full outline-none"
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
                  onChange={(e) => setFieldValue("width", e.target.value)}
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
                  onChange={(e) => setFieldValue("height", e.target.value)}
                  value={values.height}
                />
              </div>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <label htmlFor="bg" className="text-sm text-gray-500 font-bold">
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
              <label htmlFor="bg" className="text-sm text-gray-500 font-bold">
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
              options={processedOptions}
              onChange={(value) => setSelectedCategorie(value)}
            />
            <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
              {isLoadingImgs ? (
                <Spin />
              ) : imgs.length === 0 ? (
                <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                  <div
                    onClick={() => setFieldValue("bgImg", "")}
                    className={`w-20 h-20 rounded-lg cursor-default border-2 ${
                      values.bgImg === ""
                        ? "border-blue-500 shadow-xl"
                        : "border-transparent"
                    } flex items-center justify-center bg-gray-200 shadow`}
                  >
                    <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                      No Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                  {imgs.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setFieldValue("bgImg", img.path)}
                      className={`w-20 h-20 rounded-lg text-center content-center cursor-default border-2 ${
                        values.bgImg === img.path
                          ? "border-blue-500 shadow-xl"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.path}
                        alt={index}
                        className="w-full h-full text-center content-center object-cover rounded-lg p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              htmlType="submit"
              className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateBoardModal;
