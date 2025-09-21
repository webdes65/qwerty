import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import { Formik, Form, Field } from "formik";
import { v4 as uuidv4 } from "uuid";
import TextInputSection from "@module/modal/createItemModal/TextInputSection";
import ButtonSection from "@module/modal/createItemModal/ButtonSection";
import ComponentsSection from "@module/modal/createItemModal/ComponentsSection";
import FieldComparison from "@template/FieldComparison";
import { request } from "@services/apiService.js";
import LabelSection from "@module/modal/createItemModal/LabelSection.jsx";

const CreateItemContent = ({ setIsOpenCreateModal, setComponentsList }) => {
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
    infoReqBtn: {
      value: "",
      title: "",
      device_uuid: "",
      register_id: "",
      startRange: "",
      endRange: "",
      singleIncrease: false,
      singleReduction: false,
    },
  };

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
      infoReqBtn: {
        ...values.infoReqBtn,
        device_uuid: selectedDeviceId,
      },
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
    <div className="h-auto w-full flex flex-col justify-start items-center bg-white font-Poppins overflow-auto">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form className="w-full flex flex-col gap-2">
            <div className="w-full h-auto">
              <label className="font-bold text-gray-500">Type item</label>
              <div className="w-full flex flex-row justify-between items-center gap-1 font-bold">
                {["text input", "label", "button", "components"].map((type) => (
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
                ))}
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
              infoReqBtn={values.infoReqBtn}
              setInfoReqBtn={(newValue) =>
                setFieldValue("infoReqBtn", newValue)
              }
              setFieldValue={setFieldValue}
              optionsDevices={optionsDevices}
              deviceStatus={{
                isLoading: isLoadingDevices,
                error: devicesError,
              }}
              optionsRegisters={optionsRegisters}
            />

            <LabelSection
              imgsError={imgsError}
              setSelectedDeviceId={setSelectedDeviceId}
              selectDevice={selectDevice}
              setSelectDevice={setSelectDevice}
              optionsRegisters={optionsRegisters}
              optionsCategories={optionsCategories}
              optionsDevices={optionsDevices}
              isLoadingDevices={isLoadingDevices}
              imgs={imgs}
              registersData={registersData}
              setBetData={setBetData}
              values={values}
              devicesError={devicesError}
              isLoadingImgs={isLoadingImgs}
              selectedDeviceId={selectedDeviceId}
              setFieldValue={setFieldValue}
              setSelectedCategorie={setSelectedCategorie}
              setShowImgsOrColors={setShowImgsOrColors}
              showImgsOrColors={showImgsOrColors}
              isLoadingRegisters={isLoadingRegisters}
              registersError={registersError}
            />

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
  );
};

export default CreateItemContent;
