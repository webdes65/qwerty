import { useState } from "react";
import Modal from "react-modal";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import { Formik, Form } from "formik";
import Spinner from "@template/Spinner";
import ButtonSection from "@module/modal/createItemModal/ButtonSection.jsx";
import DeviceOfInputCard from "@module/card/DeviceOfInputCard.jsx";
import DeviceOfLabelCard from "@module/card/DeviceOfLabelCard.jsx";
import EditItemHandlers from "@module/container/main/create-form/modal-handlers/EditItemHandlers.js";
import ControlImageForm from "@module/card/form/ControlImageForm.jsx";
import BasicOPropertiesField from "@module/card/form/modal-card/BasicOPropertiesField.jsx";
import StylePropertiesField from "@module/card/form/modal-card/StylePropertiesFields.jsx";

Modal.setAppElement("#root");

const EditItemModal = ({ isOpenEditModal, setIsOpenEditModal, item }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [optionsDevices, setOptionsDevices] = useState([]);
  const [optionsRegisters, setOptionsRegisters] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    item?.infoReqBtn?.device_uuid || null,
  );
  const [selectDevice, setSelectDevice] = useState(false);

  const {
    isLoadingCategories,
    categoriesError,
    isLoadingImages,
    imagesError,
    isLoadingDevices,
    devicesError,
    registersData,
    isLoadingRegisters,
    registersError,
  } = EditItemHandlers({
    setOptionsCategories,
    selectedCategory,
    setImages,
    setOptionsDevices,
    selectedDeviceId,
    setOptionsRegisters,
  });

  if (!item) return null;

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
        className="h-5/6 w-1/2 flex flex-col justify-start items-center p-10 px-20 bg-white text-dark-100 dark:bg-dark-100 dark:text-white rounded-md font-Poppins max-lg:w-10/12 max-sm:w-full max-sm:px-10"
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
                  <Form className="flex flex-col gap-4 w-full h-full">
                    <Tabs
                      defaultActiveKey="style"
                      items={[
                        {
                          key: "style",
                          label: "Style",
                          styleLabel: {
                            color: "purple",
                          },
                          children: (
                            <div className="flex flex-col gap-4">
                              <BasicOPropertiesField
                                values={values}
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                                item={item}
                              />
                              <StylePropertiesField
                                values={values}
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                              />
                              <ControlImageForm
                                imagesError={imagesError}
                                isLoadingImages={isLoadingImages}
                                selectedCategory={selectedCategory}
                                images={images}
                                items={items}
                                optionsCategories={optionsCategories}
                                setSelectedCategory={setSelectedCategory}
                                setFieldValue={setFieldValue}
                                values={values}
                              />
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
                                    <DeviceOfLabelCard
                                      selectDevice={selectDevice}
                                      setSelectDevice={setSelectDevice}
                                      isLoadingDevices={isLoadingDevices}
                                      devicesError={devicesError}
                                      optionsDevices={optionsDevices}
                                      setSelectedDeviceId={setSelectedDeviceId}
                                      selectedDeviceId={selectedDeviceId}
                                      isLoadingRegisters={isLoadingRegisters}
                                      registersError={registersError}
                                      registersData={registersData}
                                      optionsRegisters={optionsRegisters}
                                      setFieldValue={setFieldValue}
                                    />
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

                    <div className="flex justify-end gap-2 mt-6 h-full items-end">
                      <button
                        type="button"
                        onClick={() => setIsOpenEditModal(false)}
                        className="!py-2 !px-4 dragButtonSecondaryStyle"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="!py-2 !px-4 dragButtonPrimaryStyle"
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
