import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Joyride from "react-joyride";
import { Button, Select, Slider, Spin, Switch } from "antd";
import { request } from "@services/apiService.js";
import UploadImgsModal from "@module/modal/UploadImgsModal";
import CreatePointModalInRegisEditor from "@module/modal/CreatePointModalInRegisEditor";
import ChooseNameModal from "@module/modal/ChooseNameModal";
import CreateItemModal from "@module/modal/createItemModal/CreateItemModal";
import UpdateFormNameModal from "@module/modal/UpdateFormNameModal";
import CopyModal from "@module/modal/CopyModal.jsx";
import FormHTML from "@template/FormHTML";
import { hexToRgba, rgbaToHex } from "@utils/colorConverters.js";
import logger from "@utils/logger.js";

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
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const items = useSelector((state) => state.items);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [selectedCategorie, setSelectedCategorie] = useState(0);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [imgs, setImgs] = useState([]);

  // Form Name
  const [name, setName] = useState("");

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState(formName);

  const [modals, setModals] = useState({
    createItemModal: false,
    createPointModal: false,
    uploadImgsModal: false,
    chooseNameModal: false,
    copyModal: false,
  });

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery(["getCategories"], () =>
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

  const {
    data: imgsData,
    isLoading: isLoadingImgs,
    error: imgsError,
  } = useQuery(["fetchImgsCategory", selectedCategorie], () =>
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

  // For Submit Form
  const postForm = useMutation(
    (data) => request({ method: "POST", url: "/api/forms", data }),
    {
      onSuccess: async (data) => {
        toast.success(data.status);
        queryClient.invalidateQueries("GetForms");

        const formId = data.data.uuid;

        if (formId) {
          const container = document.querySelector(".dragdrop-container");
          if (container) {
            const dropBox = document.getElementById("dropBox");
            if (dropBox) {
              dropBox.setAttribute("data-idform", formId);
            }
            const content = FormHTML(container);

            await request({
              method: "PATCH",
              url: `/api/forms/${formId}`,
              data: { content },
            })
              // .then((res) => {
              // })
              .catch((err) => {
                logger.log(err);
              });
          }
        }

        dispatch(setItems([]));
        localStorage.removeItem("registers");
        setBoxInfo({
          width: 300,
          height: 300,
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          borderRight: 0,
          borderColor: "#c2c2c2",
          borderRadius: 5,
          bgColor: "rgba(194, 194, 194, 1)",
          bgImg: "",
          opacity: "1",
        });
        localStorage.removeItem("loadEchoRegisters");
        setName("");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
      onSettled: () => {
        setSubmitLoading(false);
      },
    },
  );

  // For Submit Form
  useEffect(() => {
    if (name) {
      const registers = JSON.parse(localStorage.getItem("registers"));
      const defaultBoxInfo = {
        width: 300,
        height: 300,
        borderTop: 0,
        borderBottom: 0,
        borderLeft: 0,
        borderRight: 0,
        borderColor: "#c2c2c2",
        borderRadius: 5,
        bgColor: "rgba(194, 194, 194, 1)",
        bgImg: "",
        opacity: "1",
      };

      let boxInfo = JSON.parse(localStorage.getItem("boxInfo"));

      if (boxInfo === null) {
        boxInfo = defaultBoxInfo;
      }

      const objects = JSON.stringify({
        boxInfo,
        registers,
      });

      setSubmitLoading(true);

      postForm.mutate({ name, objects });
    }
  }, [name]);

  const updateForm = useMutation(
    (data) =>
      request({
        method: "PATCH",
        url: `/api/forms/${formId}`,
        data,
      }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        dispatch(setItems([]));
        localStorage.removeItem("registers");
        setBoxInfo({
          width: 300,
          height: 300,
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          borderRight: 0,
          borderColor: "#c2c2c2",
          borderRadius: 5,
          bgColor: "rgba(194, 194, 194, 1)",
          bgImg: "",
          opacity: "1",
        });
        localStorage.removeItem("loadEchoRegisters");
        setName("");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
      onSettled: () => {
        setSubmitLoading(false);
      },
    },
  );

  const handleUpdate = async () => {
    await setItemAbility((prev) => ({ ...prev, edit: false }));
    await setItemAbility((prev) => ({ ...prev, remove: false }));
    await setItemAbility((prev) => ({ ...prev, controller: false }));

    if (formId) {
      const container = document.querySelector(".dragdrop-container");
      if (container) {
        const dropBox = document.getElementById("dropBox");
        if (dropBox) {
          dropBox.setAttribute("data-idform", formId);
        }
        const content = FormHTML(container);
        const registers = JSON.parse(localStorage.getItem("registers"));
        const boxInfo = JSON.parse(localStorage.getItem("boxInfo"));

        const objects = JSON.stringify({
          boxInfo,
          registers,
        });

        setSubmitLoading(true);
        updateForm.mutate({ name: `${updatedName}`, content, objects });

        /*const blob = new Blob([content], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "dragdrop_content.html";
        link.click();*/
      } else {
        logger.log("dragdrop-container element not found.");
      }
    }
  };

  const openModalUpdateName = () => {
    setOpenUpdateModal(true);
  };

  const handleConfirmUpdate = () => {
    setOpenUpdateModal(false);
    handleUpdate();
  };

  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem("createForm-guide-shown");
    if (!hasShown) {
      setRun(true);
      localStorage.setItem("createForm-guide-shown", "true");
    }
  }, []);

  const steps = [
    {
      target: ".create-item",
      content: "Help text",
    },
    {
      target: ".create-point",
      content: "Help text",
    },
    {
      target: ".upload-imgs",
      content: "Help text",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-4 font-Quicksand p-5 bg-white shadow rounded-lg text-[0.90rem] overflow-auto">
      {isLoadingCategories ? (
        <div className="w-full h-full flex flex-row justify-center items-center">
          <Spin size="large" />
        </div>
      ) : categoriesError ? (
        <div>{categoriesError}</div>
      ) : (
        <>
          <div className="w-full flex flex-col justify-center items-start gap-2">
            <Joyride
              className="!font-Quicksand"
              steps={steps}
              run={run}
              continuous
              // scrollToFirstStep
              // showProgress
              showSkipButton
              styles={{
                // options: {
                //   zIndex: 1000,
                //   arrowColor: "#fff",
                //   backgroundColor: "#333",
                //   textColor: "#fff",
                //   spotlightPadding: 10,
                // },
                buttonNext: {
                  backgroundColor: "#ff0000",
                  color: "#fff",
                },
                buttonBack: {
                  color: "#ff0000",
                },
              }}
              locale={{
                next: "Next",
                back: "Back",
                skip: "Skip",
                last: "End",
              }}
            />
            <label className="text-black font-bold">Box size</label>
            <div className="w-full flex flex-col justify-center items-start gap-2 max-xl:flex-col max-xl:items-start">
              <div className="w-full flex flex-row justify-center items-center">
                <input
                  type="number"
                  placeholder={`Width ${boxInfo.width}`}
                  className="w-1/2 border-2 border-gray-200 p-2 rounded mr-2 outline-none"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 300;
                    setBoxInfo((prev) => ({
                      ...prev,
                      width: value,
                    }));
                  }}
                />
                <input
                  type="number"
                  placeholder={`Height ${boxInfo.height}`}
                  className="w-1/2 border-2 border-gray-200 p-2 rounded mr-2 outline-none"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 300;
                    setBoxInfo((prev) => ({
                      ...prev,
                      height: value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-start gap-2">
            <label className="text-black font-bold">Border</label>
            <div className="w-full flex flex-col justify-center items-start gap-2 max-xl:flex-col max-xl:items-start">
              <div className="w-full flex flex-row justify-center items-center">
                <input
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setBoxInfo((prev) => ({
                      ...prev,
                      borderTop: value,
                    }));
                  }}
                  placeholder={`Top ${boxInfo.borderTop}`}
                  className="w-1/2 border-2 border-gray-200 p-2 rounded mr-2 outline-none"
                />
                <input
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setBoxInfo((prev) => ({
                      ...prev,
                      borderBottom: value,
                    }));
                  }}
                  placeholder={`Bottom ${boxInfo.borderTop}`}
                  className="w-1/2 border-2 border-gray-200 p-2 rounded mr-2 outline-none"
                />
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <input
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setBoxInfo((prev) => ({
                      ...prev,
                      borderLeft: value,
                    }));
                  }}
                  placeholder={`Left ${boxInfo.borderLeft}`}
                  className="w-1/2 border-2 border-gray-200 p-2 rounded mr-2 outline-none"
                />
                <input
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setBoxInfo((prev) => ({
                      ...prev,
                      borderRight: value,
                    }));
                  }}
                  placeholder={`Right ${boxInfo.borderRight}`}
                  className="w-1/2 border-2 border-gray-200 p-2 rounded mr-2 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-auto">
            <label className="text-sm font-bold">
              Border radius
              <Slider
                min={0}
                max={50}
                step={1}
                value={boxInfo.borderRadius}
                onChange={(value) =>
                  setBoxInfo((prev) => ({
                    ...prev,
                    borderRadius: value,
                  }))
                }
              />
            </label>
          </div>

          <div className="w-full h-auto">
            <label className="text-sm font-bold">
              Opacity
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={boxInfo.opacity}
                onChange={(value) =>
                  setBoxInfo((prev) => ({
                    ...prev,
                    opacity: value,
                  }))
                }
              />
            </label>
          </div>

          <div className="w-full flex flex-row justify-start items-center gap-2">
            <label className="text-black font-bold">Border color</label>
            <input
              type="color"
              value={boxInfo.borderColor}
              onChange={(e) => {
                const hex = e.target.value;
                setBoxInfo((prev) => ({
                  ...prev,
                  borderColor: hex,
                }));
              }}
            />
          </div>

          <div className="w-full flex flex-row justify-start items-center gap-2">
            <label className="text-black font-bold">Background color</label>
            <input
              type="color"
              value={rgbaToHex(boxInfo.bgColor)}
              onChange={(e) => {
                const hex = e.target.value;
                const rgba = hexToRgba(hex, 1);
                setBoxInfo((prev) => ({
                  ...prev,
                  bgColor: rgba,
                }));
              }}
            />
          </div>

          <div className="w-full flex flex-row justify-start items-center">
            <Button
              type="primary"
              onClick={() => {
                setModals((prevState) => ({
                  ...prevState,
                  createItemModal: true,
                }));
              }}
              className="create-item w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
            >
              Create Item
            </Button>
          </div>

          <Button
            type="primary"
            onClick={() =>
              setModals((prevState) => ({
                ...prevState,
                createPointModal: true,
              }))
            }
            className="create-point w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
          >
            Create Point
          </Button>

          {items.length > 0 && (
            <>
              <div className="w-full flex flex-row justify-start items-center gap-2">
                <p className="font-bold">Show edit button</p>
                <Switch
                  size="large"
                  checked={itemAbility.edit}
                  onChange={(checked) =>
                    setItemAbility((prev) => ({ ...prev, edit: checked }))
                  }
                  style={{
                    backgroundColor: itemAbility.edit ? "#22c55e" : "#ef4444 ",
                  }}
                />
                <span
                  className={`${
                    itemAbility.edit ? "text-green-500" : "text-red-500"
                  } font-bold`}
                >
                  {itemAbility.edit ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="w-full flex flex-row justify-start items-center gap-2">
                <p className="font-bold">Controller</p>
                <Switch
                  size="large"
                  checked={itemAbility.controller}
                  onChange={(checked) =>
                    setItemAbility((prev) => ({ ...prev, controller: checked }))
                  }
                  style={{
                    backgroundColor: itemAbility.controller
                      ? "#22c55e"
                      : "#ef4444 ",
                  }}
                />

                <span
                  className={`${
                    itemAbility.controller ? "text-green-500" : "text-red-500"
                  } font-bold`}
                >
                  {itemAbility.controller ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="w-full flex flex-row justify-start items-center gap-2">
                <p className="font-bold">Show delete button</p>
                <Switch
                  size="large"
                  checked={itemAbility.remove}
                  onChange={(checked) =>
                    setItemAbility((prev) => ({ ...prev, remove: checked }))
                  }
                  style={{
                    backgroundColor: itemAbility.remove
                      ? "#22c55e"
                      : "#ef4444 ",
                  }}
                />

                <span
                  className={`${
                    itemAbility.remove ? "text-green-500" : "text-red-500"
                  } font-bold`}
                >
                  {itemAbility.remove ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="w-full flex flex-row justify-start items-center gap-2">
                <p className="font-bold">Enable/Disable move</p>
                <Switch
                  size="large"
                  checked={itemAbility.moveTo}
                  onChange={(checked) =>
                    setItemAbility((prev) => ({ ...prev, moveTo: checked }))
                  }
                  style={{
                    backgroundColor: itemAbility.moveTo
                      ? "#22c55e"
                      : "#ef4444 ",
                  }}
                />

                <span
                  className={`${
                    itemAbility.moveTo ? "text-green-500" : "text-red-500"
                  } font-bold`}
                >
                  {itemAbility.moveTo ? "Active" : "Inactive"}
                </span>
              </div>
            </>
          )}
          {items.length > 0 && (
            <div className="w-full h-auto flex flex-col justify-center items-center gap-3">
              <Button
                color="danger"
                variant="solid"
                onClick={() => {
                  dispatch(setItems([]));
                  setBtnDisplayStatus(true);
                  setBoxInfo({
                    width: 300,
                    height: 300,
                    borderTop: 0,
                    borderBottom: 0,
                    borderLeft: 0,
                    borderRight: 0,
                    borderColor: "#c2c2c2",
                    borderRadius: 5,
                    bgColor: "rgba(194, 194, 194, 1)",
                    bgImg: "",
                    opacity: "1",
                  });
                  localStorage.removeItem("loadEchoRegisters");
                  localStorage.removeItem("registers");
                  navigate(location.pathname, { replace: true });
                }}
                className="w-full font-Quicksand font-bold !bg-red-200 !p-5 !shadow !text-red-500 !text-[0.90rem] !border-[2.5px] !border-red-500"
              >
                Form Reset
              </Button>

              <Button
                type="primary"
                onClick={() =>
                  setItemAbility((prev) => ({
                    ...prev,
                    dragDisabled: !itemAbility.dragDisabled,
                  }))
                }
                className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
              >
                {itemAbility.dragDisabled
                  ? "Enable Dragging"
                  : "Disable Dragging"}
              </Button>
            </div>
          )}

          {items.length > 0 && formId && (
            <Button
              onClick={handleCopyHTML}
              loading={submitLoading}
              className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
            >
              Copy Form
            </Button>
          )}

          {items.length > 0 && (
            <Button
              onClick={btnDisplayStatus ? handleSendHTML : openModalUpdateName}
              loading={submitLoading}
              className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
            >
              {btnDisplayStatus ? "Send Form" : "Update"}
            </Button>
          )}

          <Button
            onClick={() =>
              setModals((prevState) => ({
                ...prevState,
                uploadImgsModal: true,
              }))
            }
            className="upload-imgs w-full h-auto font-Quicksand font-bold !bg-blue-200 !p-2 !shadow text-blue-500 !rounded-md !text-[0.90rem] !border-[2.5px] !border-blue-500"
          >
            Upload imgs
          </Button>

          <div className="w-full flex flex-col justify-center items-start gap-1">
            <label className="font-bold">Choose a photo category</label>
            <Select
              showSearch
              className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
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
          </div>

          <div className="w-full min-h-[12rem] overflow-auto flex flex-row justify-center items-start bg-blue-50 p-3 rounded-lg">
            {isLoadingImgs ? (
              <Spin />
            ) : imgsError ? (
              <div>{imgsError}</div>
            ) : imgs.length === 0 ? (
              <div className="w-full flex flex-row flex-wrap justify-center items-center gap-2">
                <div
                  onClick={() =>
                    setBoxInfo((prev) => ({
                      ...prev,
                      bgImg: "",
                    }))
                  }
                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                    boxInfo.bgImg === ""
                      ? "border-blue-500 shadow-xl"
                      : "border-transparent"
                  } flex items-center justify-center bg-gray-200 shadow p-1`}
                >
                  <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                    No Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-row flex-wrap justify-center items-center gap-2">
                {imgs.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setBoxInfo((prev) => ({
                        ...prev,
                        bgImg: img.path,
                      }));
                    }}
                    className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                      boxInfo.bgImg === img.path
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
            )}
          </div>

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
            <UploadImgsModal
              isOpenUploadImgsModal={modals.uploadImgsModal}
              setIsOpenUploadImgsModal={(value) =>
                setModals((prevState) => ({
                  ...prevState,
                  uploadImgsModal: value,
                }))
              }
              optionsCategories={optionsCategories}
            />
          )}

          {modals.createPointModal && (
            <CreatePointModalInRegisEditor
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
            <CopyModal
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
            <ChooseNameModal
              isOpenChooseNameModal={modals.chooseNameModal}
              setIsOpenChooseNameModal={(value) =>
                setModals((prevState) => ({
                  ...prevState,
                  chooseNameModal: value,
                }))
              }
              optionsCategories={optionsCategories}
              setName={setName}
              title={"Form"}
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
            />
          )}
        </>
      )}
    </div>
  );
};

export default DragDropOption;
