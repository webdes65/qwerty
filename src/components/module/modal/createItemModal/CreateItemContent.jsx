import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { v4 as uuidv4 } from "uuid";
import TextInputSection from "@module/modal/createItemModal/TextInputSection";
import ButtonSection from "@module/modal/createItemModal/ButtonSection";
import ComponentsSection from "@module/modal/createItemModal/ComponentsSection";
import FieldComparison from "@template/FieldComparison";
import LabelSection from "@module/modal/createItemModal/LabelSection.jsx";
import CreateItemHelperHandlers from "@module/container/main/create-form/modal-handlers/CreateItemHelperHandlers.js";
import CreateItemHandlers from "@module/container/main/create-form/modal-handlers/CreateItemHandlers.js";
import "@styles/allRepeatStyles.css";

const CreateItemContent = ({ setIsOpenCreateModal, setComponentsList }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);

  const [optionsDevices, setOptionsDevices] = useState([]);
  const [optionsRegisters, setOptionsRegisters] = useState([]);
  const [selectDevice, setSelectDevice] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const [showImagesOrColors, setShowImagesOrColors] = useState("colors");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [betData, setBetData] = useState({
    bet: "",
    betList: [],
  });

  const {
    isLoadingDevices,
    devicesError,
    registersData,
    isLoadingRegisters,
    registersError,
    isLoadingImages,
    imagesError,
  } = CreateItemHandlers({
    setOptionsDevices,
    selectedDeviceId,
    setOptionsRegisters,
    setOptionsCategories,
    selectedCategory,
    setImages,
  });

  const { initialValues, handleSubmit } = CreateItemHelperHandlers({
    selectedDeviceId,
    uuidv4,
    selectDevice,
    betData,
    items,
    dispatch,
    setSelectedDeviceId,
    setSelectDevice,
    setIsOpenCreateModal,
    setBetData,
  });

  const labelProps = {
    imagesError,
    setSelectedDeviceId,
    selectDevice,
    setSelectDevice,
    optionsRegisters,
    optionsCategories,
    optionsDevices,
    isLoadingDevices,
    images,
    registersData,
    setBetData,
    devicesError,
    isLoadingImages,
    selectedDeviceId,
    setSelectedCategory,
    setShowImagesOrColors,
    showImagesOrColors,
    isLoadingRegisters,
    registersError,
  };

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white  font-Poppins overflow-auto">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form className="w-full flex flex-col gap-2">
            <div className="w-full h-auto">
              <label className="font-bold text-black dark:text-white">
                Type item
              </label>
              <div className="w-full flex flex-row justify-between items-center gap-1 font-bold">
                {["text input", "label", "button", "components"].map((type) => (
                  <label
                    key={type}
                    className={`w-3/12 flex flex-row justify-center items-center gap-1 bg-blue-100  rounded-md p-2 cursor-pointer
                ${
                  values.type === type
                    ? "border-2 border-blue-500 text-dark-100"
                    : "border border-transparent text-gray-100"
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
              values={values}
              setFieldValue={setFieldValue}
              props={labelProps}
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
                  className="w-1/2 !p-2 buttonSecondaryStyle"
                >
                  Cancel
                </button>
                <button type="submit" className="w-1/2 !p-2 buttonPrimaryStyle">
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
