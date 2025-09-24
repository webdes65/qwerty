import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useQuery } from "react-query";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Select, Slider, Spin, Tabs } from "antd";
import { Formik, Form, Field } from "formik";
import { request } from "@services/apiService.js";
import Spinner from "@template/Spinner";
import ButtonSection from "@module/modal/createItemModal/ButtonSection.jsx";
import DeviceOfInputCard from "@module/card/DeviceOfInputCard.jsx";
import DeviceOfLabelCard from "@module/card/DeviceOfLabelCard.jsx";

Modal.setAppElement("#root");

const EditItemModal = ({ isOpenEditModal, setIsOpenEditModal, item }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);

  const [selectedCategorie, setSelectedCategorie] = useState(0);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [optionsDevices, setOptionsDevices] = useState([]);
  const [optionsRegisters, setOptionsRegisters] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    item?.infoReqBtn?.device_uuid || null,
  );
  const [selectDevice, setSelectDevice] = useState(false);

  // Categories
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery(["getCategories"], () =>
    request({ method: "GET", url: "/api/categories" }),
  );

  useEffect(() => {
    if (categoriesData) {
      const newOptions = categoriesData.data.map((cat) => ({
        label: cat.title,
        value: cat.uuid,
      }));
      setOptionsCategories([{ label: "All", value: 0 }, ...newOptions]);
    }
  }, [categoriesData]);

  // Images
  const {
    data: imgsData,
    isLoading: isLoadingImgs,
    error: imgsError,
  } = useQuery(["fetchImgsCategory", selectedCategorie], () =>
    request({ method: "GET", url: `/api/files?category=${selectedCategorie}` }),
  );

  useEffect(() => {
    if (imgsData) setImgs(imgsData.data);
  }, [imgsData]);

  // Devices
  const {
    data: devicesData,
    isLoading: isLoadingDevices,
    error: devicesError,
  } = useQuery(["getDevices"], () =>
    request({ method: "GET", url: "/api/devices" }),
  );

  useEffect(() => {
    if (devicesData) {
      const newOptions = devicesData.data.map((dev) => ({
        label: dev.name,
        value: dev.uuid,
      }));
      setOptionsDevices(newOptions);
    }
  }, [devicesData]);

  // Registers
  const {
    data: registersData,
    isLoading: isLoadingRegisters,
    error: registersError,
  } = useQuery(
    ["getRegisters", selectedDeviceId],
    () =>
      request({
        method: "GET",
        url: `/api/registers?device_id=${selectedDeviceId}`,
      }),
    { enabled: !!selectedDeviceId },
  );

  useEffect(() => {
    if (registersData) {
      const newOptions = registersData.data.map((reg) => ({
        label: `${reg.title} (${reg.uuid})`,
        value: reg.uuid,
      }));
      setOptionsRegisters(newOptions);
    }
  }, [registersData]);

  if (!item) return null;

  const fontOptions = [
    { label: "Azeret Mono", value: "Azeret Mono" },
    { label: "Noto Serif Toto", value: "Noto Serif Toto" },
    { label: "Edu SA Beginner", value: "Edu SA Beginner" },
    { label: "Digital", value: "DS-Digital" },
  ];

  const optionsDecimalPlaces = [
    { label: "0", value: "0" },
    { label: "0.0", value: "1" },
    { label: "0.00", value: "2" },
    { label: "0.000", value: "3" },
    { label: "0.0000", value: "4" },
    { label: "0.00000", value: "5" },
    { label: "0.000000", value: "6" },
  ];

  return (
    <Modal
      isOpen={isOpenEditModal}
      onRequestClose={() => setIsOpenEditModal(false)}
      contentLabel="Edit Item"
      className="modal fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      style={{ overlay: { zIndex: 1000 } }}
    >
      <div
        style={{ direction: "ltr" }}
        className="h-5/6 w-1/2 flex flex-col justify-start items-center p-10 px-20 bg-white rounded-md font-Poppins max-lg:w-10/12 max-sm:w-full max-sm:px-10"
      >
        {isLoadingCategories ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : categoriesError ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {categoriesError.message}
          </div>
        ) : (
          <>
            <h2 className="text-lg mb-4 mt-6 text-center font-semibold">
              Edit Item
            </h2>

            <div className="flex-1 w-full overflow-auto px-6 pb-6">
              <Formik
                initialValues={{
                  ...item,
                  infoReqBtn: item.infoReqBtn || {
                    value: "",
                    title: "",
                    device_uuid: "",
                    register_id: "",
                    singleIncrease: false,
                    singleReduction: false,
                  },
                  temp: item.temp || "",
                }}
                onSubmit={(values) => {
                  const updatedItems = items.map((i) =>
                    i.position.x === item.position.x &&
                    i.position.y === item.position.y
                      ? { ...i, ...values }
                      : i,
                  );
                  dispatch(setItems(updatedItems));
                  localStorage.setItem(
                    "registers",
                    JSON.stringify(updatedItems),
                  );
                  setIsOpenEditModal(false);
                }}
              >
                {({ values, setFieldValue, handleChange }) => (
                  <Form className="flex flex-col gap-4 w-full">
                    <Tabs
                      defaultActiveKey="style"
                      items={[
                        {
                          key: "style",
                          label: "Style",
                          children: (
                            <div className="flex flex-col gap-4">
                              {values.type === "button" && (
                                <div className="w-full flex flex-col gap-2">
                                  <label className="text-sm" htmlFor="titlebtn">
                                    Button Title
                                  </label>
                                  <Field
                                    name="titlebtn"
                                    type="text"
                                    placeholder="Enter button title"
                                    className="border-2 border-gray-300 p-2 rounded w-full mt-1 outline-none"
                                    value={values.titlebtn}
                                    onChange={handleChange}
                                  />
                                </div>
                              )}

                              {values.type !== "button" && (
                                <div className="w-full flex flex-col gap-2">
                                  <label className="text-sm" htmlFor="title">
                                    Title
                                  </label>
                                  <Field
                                    name="title"
                                    type="text"
                                    placeholder="Title"
                                    className="border-2 border-gray-300 p-2 rounded w-full mt-1 outline-none"
                                    value={values.title}
                                    onChange={handleChange}
                                  />
                                </div>
                              )}

                              <div className="w-full flex flex-row justify-center items-center gap-2">
                                <label className="text-sm w-1/2">
                                  Height
                                  <Field
                                    name="height"
                                    type="number"
                                    placeholder="Enter height"
                                    className="border-2 border-gray-300 p-2 rounded w-full mt-1 outline-none"
                                    value={values.height}
                                    onChange={handleChange}
                                  />
                                </label>
                                <label className="text-sm w-1/2">
                                  Width
                                  <Field
                                    name="width"
                                    type="number"
                                    placeholder="Enter width"
                                    className="border-2 border-gray-300 p-2 rounded w-full mt-1 outline-none"
                                    value={values.width}
                                    onChange={handleChange}
                                  />
                                </label>
                              </div>

                              <div className="w-full flex flex-row justify-center items-center gap-2">
                                <label className="text-sm w-1/2">
                                  Opacity
                                  <Slider
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={values.opacity}
                                    onChange={(value) =>
                                      setFieldValue("opacity", value)
                                    }
                                  />
                                </label>
                                <label className="text-sm w-1/2">
                                  Border Radius (%)
                                  <Slider
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={values.rounded || 0}
                                    onChange={(value) => {
                                      setFieldValue("rounded", value);
                                    }}
                                  />
                                </label>
                              </div>

                              <div className="w-full flex flex-row justify-center items-center gap-2">
                                <label className="text-sm w-1/2">
                                  Rotation
                                  <Slider
                                    min={0}
                                    max={180}
                                    step={1}
                                    value={values.rotation}
                                    onChange={(value) =>
                                      setFieldValue("rotation", value)
                                    }
                                  />
                                </label>

                                <label className="text-sm w-1/2">
                                  Border Width
                                  <Slider
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={values.borderWidth}
                                    onChange={(value) =>
                                      setFieldValue("borderWidth", value)
                                    }
                                  />
                                </label>
                              </div>

                              {item.type === "label" && (
                                <div className="text-sm w-full flex flex-col justify-center items-start gap-1">
                                  <label htmlFor="title">
                                    Display Decimal Places
                                  </label>
                                  <Select
                                    className="customSelect w-full font-Quicksand h-[2.60rem] font-medium"
                                    options={optionsDecimalPlaces}
                                    defaultValue={optionsDecimalPlaces.find(
                                      (option) =>
                                        option.value ===
                                        String(values.decimalPlaces),
                                    )}
                                    onChange={(value) =>
                                      setFieldValue("decimalPlaces", value)
                                    }
                                  />
                                </div>
                              )}

                              <div className="w-full flex flex-row justify-between items-center gap-4">
                                <label className="text-sm w-4/12">
                                  backgroundColor
                                  <input
                                    type="color"
                                    name="backgroundColor"
                                    value={values.backgroundColor}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "backgroundColor",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full mt-1"
                                  />
                                  <input
                                    type="text"
                                    placeholder="#ffffff"
                                    value={values.backgroundColor}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "backgroundColor",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full mt-1 border-2 border-gray-300 rounded p-1 text-center cursor-text outline-none"
                                  />
                                </label>

                                <label className="text-sm w-4/12">
                                  Border Color
                                  <input
                                    type="color"
                                    name="borderColor"
                                    value={values.borderColor}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "borderColor",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full mt-1"
                                  />
                                  <input
                                    type="text"
                                    placeholder="#ffffff"
                                    value={values.borderColor}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "borderColor",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full mt-1 border-2 border-gray-300 rounded p-1 text-center cursor-text outline-none"
                                  />
                                </label>

                                <label className="text-sm w-4/12">
                                  Text Color
                                  <input
                                    type="color"
                                    name="textColor"
                                    value={values.textColor}
                                    onChange={(e) =>
                                      setFieldValue("textColor", e.target.value)
                                    }
                                    className="w-full mt-1"
                                  />
                                  <input
                                    type="text"
                                    placeholder="#ffffff"
                                    value={values.textColor}
                                    onChange={(e) =>
                                      setFieldValue("textColor", e.target.value)
                                    }
                                    className="w-full mt-1 border-2 border-gray-300 rounded p-1 text-center cursor-text outline-none"
                                  />
                                </label>
                              </div>

                              <div className="w-full flex flex-row justify-center items-center gap-2">
                                <label className="text-sm w-1/2">
                                  Font Size
                                  <Field
                                    name="fontSize"
                                    type="number"
                                    placeholder="Enter font size"
                                    className="border-2 border-gray-200 p-2 rounded w-full mt-1 outline-none"
                                    value={values.fontSize}
                                    onChange={handleChange}
                                  />
                                </label>

                                <label className="text-sm h-full flex flex-col justify-between items-start w-1/2">
                                  Font Family
                                  <Select
                                    className="customSelect ant-select-selector h-[2.60rem] w-full"
                                    value={values.fontFamily}
                                    onChange={(value) =>
                                      setFieldValue("fontFamily", value)
                                    }
                                    options={fontOptions.map((option) => ({
                                      value: option.value,
                                      label: (
                                        <span
                                          style={{ fontFamily: option.value }}
                                        >
                                          {option.label}
                                        </span>
                                      ),
                                    }))}
                                    placeholder="Select Font"
                                  />
                                </label>
                              </div>

                              <Select
                                showSearch
                                className="customSelect ant-select-selector h-[2.60rem] w-full"
                                placeholder="Choose Category"
                                optionFilterProp="label"
                                filterSort={(optionA, optionB) =>
                                  (optionA?.label ?? "")
                                    .toLowerCase()
                                    .localeCompare(
                                      (optionB?.label ?? "").toLowerCase(),
                                    )
                                }
                                value={selectedCategorie}
                                options={optionsCategories}
                                onChange={(value) =>
                                  setSelectedCategorie(value)
                                }
                              />

                              <div className="w-full h-[12rem] overflow-auto flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                                {isLoadingImgs ? (
                                  <Spin />
                                ) : imgsError ? (
                                  <div>{imgsError}</div>
                                ) : (
                                  <div className="w-full h-full flex flex-row flex-wrap justify-start items-start gap-2">
                                    <div
                                      onClick={() =>
                                        setFieldValue("backgroundImage", "")
                                      }
                                      className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                        values.backgroundImage === ""
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
                                        onClick={() =>
                                          setFieldValue(
                                            "backgroundImage",
                                            img.path,
                                          )
                                        }
                                        className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                          values.backgroundImage === img.path
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
                            </div>
                          ),
                        },
                        {
                          key: "logic",
                          label: "Logic",
                          children: (
                            <Tabs
                              defaultActiveKey="input"
                              size="small"
                              items={[
                                {
                                  key: "input",
                                  label: "Input Logic",
                                  children: (
                                    <div className="flex flex-col gap-4 py-4">
                                      <DeviceOfInputCard
                                        isLoading={isLoadingDevices}
                                        error={devicesError}
                                        optionsDevices={optionsDevices}
                                        setSelectedDeviceId={
                                          setSelectedDeviceId
                                        }
                                        selectedDeviceId={selectedDeviceId}
                                        isLoadingRegisters={isLoadingRegisters}
                                        registersError={registersError}
                                        optionsRegisters={optionsRegisters}
                                        setInfoReqBtn={(newValue) =>
                                          setFieldValue("infoReqBtn", newValue)
                                        }
                                      />
                                    </div>
                                  ),
                                },
                                {
                                  key: "label",
                                  label: "Label Logic",
                                  children: (
                                    <div className="flex flex-col gap-4 py-4">
                                      <div className="flex items-center gap-2 mb-4">
                                        <input
                                          type="checkbox"
                                          id="selectDevice"
                                          checked={selectDevice}
                                          onChange={(e) =>
                                            setSelectDevice(e.target.checked)
                                          }
                                          className="w-4 h-4"
                                        />
                                        <label
                                          htmlFor="selectDevice"
                                          className="text-sm"
                                        >
                                          Enable Device Selection
                                        </label>
                                      </div>

                                      <DeviceOfLabelCard
                                        selectDevice={selectDevice}
                                        isLoadingDevices={isLoadingDevices}
                                        devicesError={devicesError}
                                        optionsDevices={optionsDevices}
                                        setSelectedDeviceId={
                                          setSelectedDeviceId
                                        }
                                        selectedDeviceId={selectedDeviceId}
                                        isLoadingRegisters={isLoadingRegisters}
                                        registersError={registersError}
                                        registersData={registersData}
                                        optionsRegisters={optionsRegisters}
                                        setFieldValue={setFieldValue}
                                      />
                                    </div>
                                  ),
                                },
                                {
                                  key: "button",
                                  label: "Button Logic",
                                  children: (
                                    <ButtonSection
                                      values={values}
                                      infoReqBtn={values.infoReqBtn}
                                      setInfoReqBtn={(newValue) =>
                                        setFieldValue("infoReqBtn", newValue)
                                      }
                                      selectedDeviceId={selectedDeviceId}
                                      setSelectedDeviceId={setSelectedDeviceId}
                                      optionsDevices={optionsDevices}
                                      deviceStatus={{
                                        isLoading: isLoadingDevices,
                                        error: devicesError,
                                      }}
                                      optionsRegisters={optionsRegisters}
                                      registersStatus={{
                                        isLoadingRegisters: isLoadingRegisters,
                                        registersError: registersError,
                                      }}
                                      setFieldValue={setFieldValue}
                                      forceShow={true}
                                    />
                                  ),
                                },
                              ]}
                            />
                          ),
                        },
                      ]}
                    />

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
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EditItemModal;
