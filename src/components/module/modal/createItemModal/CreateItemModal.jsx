import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import { Modal, Select, Spin } from "antd";
import { Formik, Form, Field } from "formik";
import { v4 as uuidv4 } from "uuid";
import TextInputSection from "@module/modal/createItemModal/TextInputSection";
import ButtonSection from "@module/modal/createItemModal/ButtonSection";
import ComponentsSection from "@module/modal/createItemModal/ComponentsSection";
import FieldComparison from "@template/FieldComparison";
import { request } from "@services/apiService.js";

const { Option } = Select;

const CreateItemModal = ({
  isOpenCreateModal,
  setIsOpenCreateModal,
  setComponentsList,
}) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);

  const [optionsDevices, setOptionsDevices] = useState([]);
  const [optionsRegisters, setOptionsRegisters] = useState([]);
  const [selectDevice, setSelectDevice] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const {
    data: devicesData,
    isLoading: isLoadingDevices,
    error: devicesError,
  } = useQuery(["getDevices"], () =>
    request({
      method: "GET",
      url: "/api/devices",
    }),
  );

  useEffect(() => {
    if (devicesData) {
      const newOptions = devicesData.data.map((item) => ({
        label: item.name,
        value: item.uuid,
      }));

      setOptionsDevices(newOptions);
    }
  }, [devicesData]);

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
    {
      enabled: !!selectedDeviceId,
    },
  );

  useEffect(() => {
    if (registersData) {
      const newOptions = registersData.data.map((item) => ({
        label: `${item.title} (${item.uuid})`,
        value: item.uuid,
      }));
      setOptionsRegisters(newOptions);
    }
  }, [registersData]);

  const [showImgsOrColors, setShowImgsOrColors] = useState("colors");
  const [selectedCategorie, setSelectedCategorie] = useState(0);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [imgs, setImgs] = useState([]);

  const [betData, setBetData] = useState({
    bet: "",
    betList: [],
  });

  const [infoReqBtn, setInfoReqBtn] = useState({
    value: "",
    title: "",
    device_uuid: selectedDeviceId,
    register_id: "",
    startRange: "",
    endRange: "",
    singleIncrease: false,
    singleReduction: false,
  });

  useEffect(() => {
    setInfoReqBtn((prev) => ({
      ...prev,
      device_uuid: selectedDeviceId,
    }));
  }, [selectedDeviceId]);

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

  const {
    data: imgsData,
    isLoading: isLoadingImgs,
    error: imgsError,
  } = useQuery(
    ["fetchImgsCategory", selectedCategorie],
    () =>
      request({
        method: "GET",
        url: `/api/files?category=${selectedCategorie}`,
      }),
    {
      enabled: !!selectedCategorie,
    },
  );

  useEffect(() => {
    imgsData && setImgs(imgsData.data);
  }, [imgsData]);

  // temp is id Registry

  const initialValues = {
    title: "",
    titlebtn: "",
    width: 80,
    height: 80,
    type: "text input",
    path: "",
    temp: "",
    typeTitleTextInput: "string",
    typeDataRegister: "",
    numberBits: "",
    permissionDisplayData: true,
    backgroundColor: "#ffffff",
    backgroundColorBooleanTrue: "",
    backgroundColorBooleanFalse: "",
    backgroundColorBinaryZero: "",
    backgroundColorBinaryOne: "",
    backgroundImage: "",
    backgroundImageBooleanTrue: "",
    backgroundImageBooleanFalse: "",
    backgroundImageBinaryZero: "",
    backgroundImageBinaryOne: "",
    hideIfOne: false,
    hideIfZero: false,
    idForm: "",
    typeDisplay: "",
    borderColor: "#000",
    borderWidth: 0,
    borderTopContainer: 0,
    borderButtomContainer: 0,
    borderLeftContainer: 0,
    borderRightContainer: 0,
    point: {
      name: "",
      width: 15,
      height: 15,
      bg: "#000",
      borderColor: "#000",
    },
  };

  // const validateForm = (values) => {
  //   const errors = {};
  //   return errors;
  // };

  const handleSubmit = (values) => {
    const newItem = {
      id: uuidv4(),
      title: values.title,
      titlebtn: values.titlebtn,
      borderColor: values.borderColor,
      borderWidth: values.borderWidth,
      width: values.width,
      height: values.height,
      type: values.type,
      path: values.path,
      position: { x: 0, y: 0 },
      opacity: 1,
      rounded: 0,
      temp: values.temp,
      fontSize: "1",
      textColor: "#000000",
      fontFamily: "DS-Digital",
      typeTitleTextInput: values.typeTitleTextInput,
      decimalPlaces: 6,
      rotation: 0,
      numberBits: values.numberBits,
      permissionDisplayData: values.permissionDisplayData,
      backgroundColor: values.backgroundColor,
      backgroundColorBooleanTrue: values.backgroundColorBooleanTrue,
      backgroundColorBooleanFalse: values.backgroundColorBooleanFalse,
      backgroundColorBinaryZero: values.backgroundColorBinaryZero,
      backgroundColorBinaryOne: values.backgroundColorBinaryOne,
      backgroundImage: values.backgroundImage,
      backgroundImageBooleanTrue: values.backgroundImageBooleanTrue,
      backgroundImageBooleanFalse: values.backgroundImageBooleanFalse,
      backgroundImageBinaryZero: values.backgroundImageBinaryZero,
      backgroundImageBinaryOne: values.backgroundImageBinaryOne,
      typeDataRegister: values.typeDataRegister,
      hideIfZero: values.hideIfZero,
      hideIfOne: values.hideIfOne,
      idForm: values.idForm,
      typeDisplay: values.typeDisplay,
      infoReqBtn: { ...infoReqBtn },
      point: {
        name: values.point?.name,
        width: values.point.width,
        height: values.point.height,
        bg: values.point.bg,
        borderColor: values.point.borderColor,
      },
      selectDevice,
    };

    const FieldComparison = { ...betData.betList };

    const finalItem = { ...newItem, FieldComparison };

    const updatedItems = [...items, finalItem];
    dispatch(setItems(updatedItems));

    localStorage.setItem("registers", JSON.stringify(updatedItems));
    setSelectedDeviceId(null);
    setSelectDevice(false);
    setIsOpenCreateModal(false);

    setBetData((prevState) => ({
      ...prevState,
      bet: "",
      betList: [],
    }));
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Create Item"
      open={isOpenCreateModal}
      onCancel={() => setIsOpenCreateModal(false)}
      footer={null}
    >
      <div className="h-auto w-full flex flex-col justify-start items-center bg-white font-Poppins overflow-auto">
        <Formik
          initialValues={initialValues}
          // validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="w-full flex flex-col gap-2">
              <div className="w-full h-auto">
                <label className="font-bold text-gray-500">Type item</label>
                <div className="w-full flex flex-row justify-between items-center gap-1 font-bold">
                  {["text input", "label", "button", "components"].map(
                    (type) => (
                      <label
                        key={type}
                        className={`w-3/12 flex flex-row justify-center items-center gap-1 bg-blue-100 rounded-md p-2 cursor-pointer
                ${
                  values.type === type
                    ? "border-2 border-blue-500 text-blue-500"
                    : "border border-transparent"
                }`}
                      >
                        <Field
                          type="radio"
                          name="type"
                          value={type}
                          className="hidden"
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ),
                  )}
                </div>
              </div>

              <TextInputSection
                values={values}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                registersStatus={{
                  isLoadingRegisters: isLoadingRegisters,
                  registersError: registersError,
                }}
                infoReqBtn={infoReqBtn}
                setInfoReqBtn={setInfoReqBtn}
                setFieldValue={setFieldValue}
                optionsDevices={optionsDevices}
                deviceStatus={{
                  isLoading: isLoadingDevices,
                  error: devicesError,
                }}
                optionsRegisters={optionsRegisters}
              />

              {values.type === "label" && (
                <>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="border-2 border-gray-200 py-[0.20rem] px-3 rounded-md w-full outline-none"
                  />

                  <div className="flex items-center gap-2">
                    <Field
                      type="checkbox"
                      id="selectDevice"
                      name="selectDevice"
                      checked={selectDevice}
                      onChange={() => setSelectDevice(!selectDevice)}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="selectDevice"
                      className="text-sm cursor-pointer font-bold"
                    >
                      Choose Device
                    </label>
                  </div>

                  {selectDevice ? (
                    isLoadingDevices ? (
                      <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 p-2 rounded-lg">
                        <Spin />
                      </div>
                    ) : devicesError ? (
                      <p className="text-center text-red-500">
                        Error: {devicesError.message}
                      </p>
                    ) : (
                      <Select
                        className="customSelect ant-select-selector w-full"
                        placeholder="Select device"
                        options={optionsDevices}
                        onChange={(value) => {
                          setSelectedDeviceId(value);
                        }}
                      />
                    )
                  ) : null}

                  {selectDevice && selectedDeviceId && (
                    <>
                      {isLoadingRegisters ? (
                        <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                          <Spin />
                        </div>
                      ) : registersError ? (
                        <p className="text-center text-red-500">
                          Error: {registersError.message}
                        </p>
                      ) : (
                        registersData && (
                          <Select
                            className="customSelect ant-select-selector w-full"
                            placeholder="Select register"
                            options={optionsRegisters}
                            onChange={(value) => setFieldValue("temp", value)}
                          />
                        )
                      )}
                    </>
                  )}

                  {values.temp && (
                    <Select
                      className="customSelect ant-select-selector w-full"
                      placeholder="Type data"
                      onChange={(value) =>
                        setFieldValue("typeDataRegister", value)
                      }
                    >
                      <Option value="string">String</Option>
                      <Option value="binary">Binary</Option>
                      <Option value="integer">Integer</Option>
                      <Option value="float">Float</Option>
                      <Option value="boolean">Boolean</Option>
                    </Select>
                  )}

                  {values.typeDataRegister === "binary" && (
                    <Select
                      className="customSelect w-full"
                      placeholder="Number bits"
                      onChange={(value) => setFieldValue("numberBits", value)}
                    >
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">6</Option>
                      <Option value="6">6</Option>
                      <Option value="7">7</Option>
                      <Option value="8">8</Option>
                      <Option value="9">9</Option>
                      <Option value="10">10</Option>
                      <Option value="11">11</Option>
                      <Option value="12">12</Option>
                      <Option value="13">13</Option>
                      <Option value="14">14</Option>
                      <Option value="15">15</Option>
                      <Option value="16">16</Option>
                    </Select>
                  )}

                  {(values.typeDataRegister === "boolean" ||
                    values.typeDataRegister === "binary") && (
                    <div className="flex flex-row justify-row items-center">
                      <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                        <Field
                          type="radio"
                          id="chooseColorsForBg"
                          name="bgOption"
                          value="colors"
                          checked={showImgsOrColors === "colors"}
                          onChange={() => setShowImgsOrColors("colors")}
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="chooseColorsForBg"
                          className="text-sm font-bold cursor-pointer"
                        >
                          Choose Color
                        </label>
                      </div>

                      <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                        <Field
                          type="radio"
                          id="chooseImgsForBg"
                          name="bgOption"
                          value="images"
                          checked={showImgsOrColors === "images"}
                          onChange={() => setShowImgsOrColors("images")}
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="chooseImgsForBg"
                          className="text-sm font-bold cursor-pointer"
                        >
                          Choose Imgs
                        </label>
                      </div>
                    </div>
                  )}

                  {values.typeDataRegister === "boolean" &&
                    showImgsOrColors === "colors" && (
                      <div className="w-full flex flex-row justify-center items-center gap-1">
                        <label className="w-1/2 flex flex-row justify-start items-center gap-1 text-sm font-bold bg-blue-50 runded-md p-2">
                          Color in true :
                          <input
                            type="color"
                            name="backgroundColorBooleanTrue"
                            value={values.backgroundColorBooleanTrue}
                            onChange={(e) =>
                              setFieldValue(
                                "backgroundColorBooleanTrue",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                        <label className="w-1/2 flex flex-row justify-start items-center gap-1 text-sm font-bold bg-blue-50 runded-md p-2">
                          Color in fasle :
                          <input
                            type="color"
                            name="backgroundColorBooleanFalse"
                            value={values.backgroundColorBooleanFalse}
                            onChange={(e) =>
                              setFieldValue(
                                "backgroundColorBooleanFalse",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                      </div>
                    )}

                  {values.typeDataRegister === "binary" &&
                    showImgsOrColors === "colors" && (
                      <div className="w-full h-auto flex flex-row justify-center items-center gap-1">
                        <label className="w-1/2 text-sm font-bold flex flex-row justify-start items-center gap-1 bg-blue-50 rounded-md p-2">
                          Color in 0 :
                          <input
                            type="color"
                            name="backgroundColorBinaryZero"
                            value={values.backgroundColorBinaryZero}
                            onChange={(e) =>
                              setFieldValue(
                                "backgroundColorBinaryZero",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                        <label className="w-1/2 text-sm font-bold flex flex-row justify-start items-center gap-1 bg-blue-50 rounded-md p-2">
                          Color in 1 :
                          <input
                            type="color"
                            name="backgroundColorBinaryOne"
                            value={values.backgroundColorBinaryOne}
                            onChange={(e) =>
                              setFieldValue(
                                "backgroundColorBinaryOne",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                      </div>
                    )}

                  {showImgsOrColors === "images" &&
                    (values.typeDataRegister === "boolean" ||
                      values.typeDataRegister === "binary") && (
                      <Select
                        showSearch
                        className="customSelect ant-select-selector w-full"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        placeholder="Choose category"
                        options={optionsCategories}
                        onChange={(value) => setSelectedCategorie(value)}
                      />
                    )}

                  {values.typeDataRegister === "boolean" &&
                    showImgsOrColors === "images" && (
                      <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                        {isLoadingImgs ? (
                          <Spin />
                        ) : imgsError ? (
                          <div>{imgsError}</div>
                        ) : (
                          <div className="w-full flex flex-col justify-center items-start gap-2">
                            <p className="font-bold text-sm">Img in true</p>
                            <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                              <div
                                onClick={() =>
                                  setFieldValue(
                                    "backgroundImageBooleanTrue",
                                    "",
                                  )
                                }
                                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                  values.backgroundImageBooleanTrue === ""
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
                                      "backgroundImageBooleanTrue",
                                      img.path,
                                    )
                                  }
                                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                    values.backgroundImageBooleanTrue ===
                                    img.path
                                      ? "border-blue-500 shadow-xl"
                                      : "border-transparent"
                                  }`}
                                >
                                  <img
                                    src={img.path}
                                    alt={`Image ${index}`}
                                    className="w-full h-full object-cover rounded-lg p-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {values.typeDataRegister === "boolean" &&
                    showImgsOrColors === "images" && (
                      <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                        {isLoadingImgs ? (
                          <Spin />
                        ) : imgsError ? (
                          <div>{imgsError}</div>
                        ) : (
                          <div className="w-full flex flex-col justify-center items-start gap-2">
                            <p className="font-bold text-sm">Img in false</p>
                            <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                              <div
                                onClick={() =>
                                  setFieldValue(
                                    "backgroundImageBooleanFalse",
                                    "",
                                  )
                                }
                                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                  values.backgroundImageBooleanFalse === ""
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
                                      "backgroundImageBooleanFalse",
                                      img.path,
                                    )
                                  }
                                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                    values.backgroundImageBooleanFalse ===
                                    img.path
                                      ? "border-blue-500 shadow-xl"
                                      : "border-transparent"
                                  }`}
                                >
                                  <img
                                    src={img.path}
                                    alt={`Image ${index}`}
                                    className="w-full h-full object-cover rounded-lg p-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {values.typeDataRegister === "binary" &&
                    showImgsOrColors === "images" && (
                      <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                        {isLoadingImgs ? (
                          <Spin />
                        ) : imgsError ? (
                          <div>{imgsError}</div>
                        ) : (
                          <div className="w-full flex flex-col justify-center items-start gap-2">
                            <p className="font-bold text-sm">Img in 0</p>
                            <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                              <div
                                onClick={() =>
                                  setFieldValue("backgroundImageBinaryZero", "")
                                }
                                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                  values.backgroundImageBinaryZero === ""
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
                                      "backgroundImageBinaryZero",
                                      img.path,
                                    )
                                  }
                                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                    values.backgroundImageBinaryZero ===
                                    img.path
                                      ? "border-blue-500 shadow-xl"
                                      : "border-transparent"
                                  }`}
                                >
                                  <img
                                    src={img.path}
                                    alt={`Image ${index}`}
                                    className="w-full h-full object-cover rounded-lg p-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {values.typeDataRegister === "binary" &&
                    showImgsOrColors === "images" && (
                      <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                        {isLoadingImgs ? (
                          <Spin />
                        ) : imgsError ? (
                          <div>{imgsError}</div>
                        ) : (
                          <div className="w-full flex flex-col justify-center items-start gap-2">
                            <p className="font-bold text-sm">Img in 1</p>
                            <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                              <div
                                onClick={() =>
                                  setFieldValue("backgroundImageBinaryOne", "")
                                }
                                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                  values.backgroundImageBinaryOne === ""
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
                                      "backgroundImageBinaryOne",
                                      img.path,
                                    )
                                  }
                                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                                    values.backgroundImageBinaryOne === img.path
                                      ? "border-blue-500 shadow-xl"
                                      : "border-transparent"
                                  }`}
                                >
                                  <img
                                    src={img.path}
                                    alt={`Image ${index}`}
                                    className="w-full h-full object-cover rounded-lg p-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {values.typeDataRegister === "binary" && (
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="w-1/2 flex flex-row justify-start items-center gap-2 p-2 bg-blue-50 rounded-md">
                        <Field
                          type="checkbox"
                          id="hideIfZero"
                          name="hideIfZero"
                          checked={values.hideIfZero}
                          onChange={() =>
                            setFieldValue("hideIfZero", !values.hideIfZero)
                          }
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="hideIfZero"
                          className="text-sm cursor-pointer font-bold"
                        >
                          If 0, it's hidden.
                        </label>
                      </div>
                      <div className="w-1/2 flex flex-row justify-start items-center gap-2 p-2 bg-blue-50 rounded-md">
                        <Field
                          type="checkbox"
                          id="hideIfOne"
                          name="hideIfOne"
                          checked={values.hideIfOne}
                          onChange={() =>
                            setFieldValue("hideIfOne", !values.hideIfOne)
                          }
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor="hideIfOne"
                          className="text-sm font-bold cursor-pointer"
                        >
                          If 1, it's hidden.
                        </label>
                      </div>
                    </div>
                  )}

                  {values.temp &&
                    (values.typeDataRegister === "integer" ||
                      values.typeDataRegister === "binary") && (
                      <div className="h-auto flex flex-row justify-center items-end gap-1">
                        <Select
                          className="customSelect w-full"
                          placeholder="Condition definition"
                          onChange={(value) => {
                            setBetData((prevState) => ({
                              ...prevState,
                              bet: value,
                            }));
                          }}
                        >
                          <Option value="bigger">greater than &gt;</Option>
                          <Option value="smaller">less than &lt;</Option>
                          <Option value="equal">equal = </Option>
                          <Option value="GreaterThanOrEqual">
                            greater than or equal &gt;=
                          </Option>
                          <Option value="LessThanOrEqual">
                            less than or equal &lt;=
                          </Option>
                        </Select>
                      </div>
                    )}
                </>
              )}

              {values.temp && betData.bet && (
                <FieldComparison betData={betData} setBetData={setBetData} />
              )}

              {values.temp && (
                <div className="w-full h-auto py-2 flex flex-row justify-start items-center gap-2">
                  <Field
                    type="checkbox"
                    id="displayData"
                    name="selectDevice"
                    checked={values.permissionDisplayData}
                    onChange={() =>
                      setFieldValue(
                        "permissionDisplayData",
                        !values.permissionDisplayData,
                      )
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="displayData"
                    className="text-sm font-bold cursor-pointer"
                  >
                    Display Data
                  </label>
                </div>
              )}

              <ButtonSection
                values={values}
                infoReqBtn={infoReqBtn}
                setInfoReqBtn={setInfoReqBtn}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                optionsDevices={optionsDevices}
                deviceStatus={{
                  isLoading: isLoadingDevices,
                  error: devicesError,
                }}
                optionsRegisters={optionsRegisters}
                isLoadingRegisters={isLoadingRegisters}
                registersStatus={{
                  isLoadingRegisters: isLoadingRegisters,
                  registersError: registersError,
                }}
                setFieldValue={setFieldValue}
              />

              <ComponentsSection
                values={values}
                setComponentsList={setComponentsList}
                setIsOpenCreateModal={setIsOpenCreateModal}
              />
              {values.type !== "components" && (
                <div className="w-full flex flex-row justify-center items-center gap-1 font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeviceId(null);
                      setIsOpenCreateModal(false);
                      setSelectDevice(false);
                      setBetData((prevState) => ({
                        ...prevState,
                        bet: "",
                        betList: [],
                      }));
                    }}
                    className="w-1/2 bg-red-200 text-red-500 p-2 uppercase rounded-md hover:bg-red-500 hover:text-red-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-blue-200 text-blue-500 p-2 uppercase rounded-md hover:bg-blue-500 hover:text-blue-200"
                  >
                    Save
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default CreateItemModal;
