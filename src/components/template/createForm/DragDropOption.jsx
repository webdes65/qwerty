import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import UploadImagesModal from "@module/modal/UploadImagesModal.jsx";
import CreatePointModalOfForm from "@module/modal/CreatePointModalOfForm.jsx";
import SubmitModal from "@module/modal/SubmitModal.jsx";
import CreateItemModal from "@module/modal/createItemModal/CreateItemModal";
import UpdateFormNameModal from "@module/modal/UpdateFormNameModal";
import CopyFormModal from "@module/modal/CopyFormModal.jsx";
import DragOptionHandlersOfForm from "@module/container/main/create-form/DragOprionHandlersOfForm.js";
import FormHTML from "@template/FormHTML";
import ControlStyleOfForm from "@module/card/form/ControlStyleOfForm.jsx";
import ControlMainOfForm from "@module/card/form/ControlMainOfForm.jsx";
import ControlImageForm from "@module/card/form/ControlImageForm.jsx";

const DragDropOption = ({
  boxInfo,
  setBoxInfo,
  setComponentsList,
  points,
  setPoints,
  itemAbility,
  setItemAbility,
  btnDisplayStatus,
  setBtnDisplayStatus,
  formId,
  formName,
  category,
}) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState(formName);
  const [modals, setModals] = useState({
    createItemModal: false,
    createPointModal: false,
    uploadImgsModal: false,
    chooseNameModal: false,
    copyModal: false,
  });
  const [isDefault, setIsDefault] = useState(0);

  const {
    setName,
    isLoadingCategories,
    categoriesError,
    isLoadingImages,
    imagesError,
    handleUpdate,
  } = DragOptionHandlersOfForm({
    setOptionsCategories,
    selectedCategory,
    setImages,
    dispatch,
    setBoxInfo,
    isDefault,
    formId,
    setItemAbility,
    updatedName,
  });

  const handleCopyHTML = async () => {
    await setItemAbility((prev) => ({ ...prev, edit: false }));
    await setItemAbility((prev) => ({ ...prev, remove: false }));
    await setItemAbility((prev) => ({ ...prev, controller: false }));
    setModals((prevState) => ({
      ...prevState,
      copyModal: true,
    }));
  };

  const handleSendHTML = async () => {
    await setItemAbility((prev) => ({ ...prev, edit: false }));
    await setItemAbility((prev) => ({ ...prev, remove: false }));
    await setItemAbility((prev) => ({ ...prev, controller: false }));
    setModals((prevState) => ({
      ...prevState,
      chooseNameModal: true,
    }));
  };

  const handleDownloadHTML = () => {
    const container = document.querySelector(".dragdrop-container");
    if (container) {
      const content = FormHTML(container);
      const blob = new Blob([content], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "dragdrop_content.html";
      link.click();
    }
  };

  const openModalUpdateName = () => {
    setOpenUpdateModal(true);
  };

  const handleConfirmUpdate = (newName, category) => {
    setUpdatedName(newName);
    handleUpdate(newName, category);
    setOpenUpdateModal(false);
  };

  return (
    <div className="w-full min-h-[100vh] flex flex-col items-start justify-start gap-4 font-Quicksand p-5 border-2 border-gray-200 dark:border-gray-100 bg-white text-dark-100 dark:bg-dark-100 dark:text-white shadow rounded-lg text-[0.90rem] overflow-auto">
      {isLoadingCategories ? (
        <div className="w-full h-full flex flex-row justify-center items-center">
          <Spin size="large" />
        </div>
      ) : categoriesError ? (
        <div>{categoriesError}</div>
      ) : (
        <>
          <ControlStyleOfForm boxInfo={boxInfo} setBoxInfo={setBoxInfo} />

          <ControlMainOfForm
            setModals={setModals}
            items={items}
            itemAbility={itemAbility}
            setItemAbility={setItemAbility}
            dispatch={dispatch}
            setBtnDisplayStatus={setBtnDisplayStatus}
            setBoxInfo={setBoxInfo}
            formId={formId}
            handleCopyHTML={handleCopyHTML}
            btnDisplayStatus={btnDisplayStatus}
            handleSendHTML={handleSendHTML}
            openModalUpdateName={openModalUpdateName}
          />

          <ControlImageForm
            selectedCategory={selectedCategory}
            optionsCategories={optionsCategories}
            setSelectedCategory={setSelectedCategory}
            items={items}
            isLoadingImages={isLoadingImages}
            imagesError={imagesError}
            images={images}
            setBoxInfo={setBoxInfo}
            boxInfo={boxInfo}
          />

          {modals.createItemModal && (
            <CreateItemModal
              isOpenCreateModal={modals.createItemModal}
              setIsOpenCreateModal={(value) =>
                setModals((prevState) => ({
                  ...prevState,
                  createItemModal: value,
                }))
              }
              setComponentsList={setComponentsList}
            />
          )}

          {modals.uploadImgsModal && (
            <UploadImagesModal
              isOpenUploadImagesModal={modals.uploadImgsModal}
              setIsOpenUploadImagesModal={(value) =>
                setModals((prevState) => ({
                  ...prevState,
                  uploadImgsModal: value,
                }))
              }
              optionsCategories={optionsCategories}
            />
          )}

          {modals.createPointModal && (
            <CreatePointModalOfForm
              isOpenModalCreatePoint={modals.createPointModal}
              setIsOpenModalCreatePoint={(value) =>
                setModals((prevState) => ({
                  ...prevState,
                  createPointModal: value,
                }))
              }
              points={points}
              setPoints={setPoints}
            />
          )}

          {modals.copyModal && formId && (
            <CopyFormModal
              isOpenChooseNameModal={modals.copyModal}
              setIsOpenChooseNameModal={(value) =>
                setModals((prevState) => ({
                  ...prevState,
                  copyModal: value,
                }))
              }
              optionsCategories={optionsCategories}
              setName={setName}
              formId={formId}
              title={"Copy Form"}
            />
          )}

          {modals.chooseNameModal && (
            <SubmitModal
              isOpenChooseNameModal={modals.chooseNameModal}
              setIsOpenChooseNameModal={(value) =>
                setModals((prevState) => ({
                  ...prevState,
                  chooseNameModal: value,
                }))
              }
              optionsCategories={optionsCategories}
              setName={setName}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              title={"Form"}
              setDefault={setIsDefault}
            />
          )}

          {openUpdateModal && (
            <UpdateFormNameModal
              name={formName}
              updatedName={updatedName}
              setUpdatedName={setUpdatedName}
              openUpdateModal={openUpdateModal}
              setOpenUpdateModal={setOpenUpdateModal}
              onConfirm={handleConfirmUpdate}
              handleDownloadHTML={handleDownloadHTML}
              optionsCategories={optionsCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              category={category}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DragDropOption;
