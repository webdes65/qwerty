import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import Joyride from "react-joyride";
import { useDispatch, useSelector } from "react-redux";
import { setShowBtnDeleteComponent } from "@redux_toolkit/features/showBtnDeleteComponentSlice.js";
import { setEditEnabledComponent } from "@redux_toolkit/features/editEnabledComponentSlice.js";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";
import { Button, Switch } from "antd";
import CreateBoardMoal from "@module/modal/CreateBoardMoal";
import UploadImgsModal from "@module/modal/UploadImgsModal";
import CreatePointModal from "@module/modal/CreatePointModal";
import ChooseNameModal from "@module/modal/ChooseNameModal";
import { request } from "@services/apiService.js";

const DragDropOption = ({
  dropBoxRef,
  setLines,
  isFixed,
  setIsFixed,
  containerSize,
  setContainerSize,
  itemAbility,
  setItemAbility,
}) => {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.components);

  const showBtnDeleteComponent = useSelector(
    (state) => state.showBtnDeleteComponent,
  );

  const editEnabledComponent = useSelector(
    (state) => state.editEnabledComponent,
  );

  const [isOpenModalCreatePoint, setIsOpenModalCreatePoint] = useState(false);
  const [isOpenModalCreateBoard, setIsOpenModalCreateBoard] = useState(false);
  const [isOpenChooseNameModal, setIsOpenChooseNameModal] = useState(false);
  const [isOpenUploadImgsModal, setIsOpenUploadImgsModal] = useState(false);
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [name, setName] = useState("");
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem("createComponents-guide-shown");
    if (!hasShown) {
      setRun(true);
      localStorage.setItem("createComponents-guide-shown", "true");
    }
  }, []);

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
      setOptionsCategories(newOptions);
    }
  }, [categoriesData]);

  const submitComponent = () => {
    if (dropBoxRef.current) {
      setIsOpenChooseNameModal(true);
    }
  };

  const sendComponent = useMutation(
    (data) => request({ method: "POST", url: "/api/components", data }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        setName("");
        dispatch(setComponents([]));
        setLines([]);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  useEffect(() => {
    if (name && dropBoxRef.current) {
      const data = {
        name,
        content: dropBoxRef.current.innerHTML,
      };
      sendComponent.mutate(data);
    }
  }, [name]);

  const RemoveAll = () => {
    if (components.length > 0) {
      dispatch(setComponents([]));
      setLines([]);
      toast.success("All components have been removed successfully!");
    } else {
      toast.info("No components to remove.");
    }
  };

  const steps = [
    {
      target: ".create-board",
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
    <div className="w-full h-auto flex flex-col items-start justify-start gap-4 font-Quicksand p-5 bg-white shadow rounded-lg text-[0.90rem] overflow-auto">
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
      <div className="w-full flex flex-col justify-center items-start gap-2">
        <label className="text-black font-bold">Box size</label>
        <div className="w-full flex flex-row justify-center items-start gap-2">
          <input
            type="number"
            placeholder={`Width ${containerSize.width}`}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 120;
              setContainerSize((prev) => ({
                ...prev,
                width: value,
              }));
            }}
            className="w-1/2 border-2 border-gray-200 p-2 rounded outline-none"
          />
          <input
            type="number"
            placeholder={`height ${containerSize.height}`}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 120;
              setContainerSize((prev) => ({
                ...prev,
                height: value,
              }));
            }}
            className="w-1/2 border-2 border-gray-200 p-2 rounded outline-none"
          />
        </div>
      </div>

      <div className="w-full flex flex-row justify-center items-center gap-2">
        <Button
          type="primary"
          onClick={() => setIsOpenModalCreateBoard(true)}
          className="create-board w-1/2 font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
        >
          Create Board
        </Button>
        <Button
          type="primary"
          onClick={() => setIsOpenModalCreatePoint(true)}
          className="create-point w-1/2 font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
        >
          Create Point
        </Button>
      </div>

      {components.length > 0 && (
        <div className="w-full flex flex-row justify-center items-center gap-2">
          <Button
            onClick={submitComponent}
            className="w-1/2 h-auto font-Quicksand font-bold !bg-blue-200 !p-2 !shadow text-blue-500 !rounded-md !text-[0.90rem] !border-[2.5px] !border-blue-500"
          >
            Sent Component
          </Button>
          <Button
            onClick={RemoveAll}
            className="w-1/2 h-auto font-Quicksand font-bold !bg-red-200 !p-2 !shadow text-red-500 !rounded-md !text-[0.90rem] !border-[2.5px] !border-red-500 hover:!text-red-500"
          >
            Remove all
          </Button>
        </div>
      )}

      {components.length > 0 && (
        <Button
          onClick={() => setIsFixed(!isFixed)}
          className="w-full h-auto font-Quicksand font-bold !bg-blue-200 !p-2 !shadow text-blue-500 !rounded-md !text-[0.90rem] !border-[2.5px] !border-blue-500"
        >
          {isFixed ? "Unfix" : "Fix"}
        </Button>
      )}

      <Button
        onClick={() => setIsOpenUploadImgsModal(true)}
        className="upload-imgs w-full h-auto font-Quicksand font-bold !bg-blue-200 !p-2 !shadow text-blue-500 !rounded-md !text-[0.90rem] !border-[2.5px] !border-blue-500"
      >
        Upload imgs
      </Button>

      {components.length > 0 && (
        <>
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <p className="font-bold">Show delete button : </p>
            <Switch
              size="large"
              checked={showBtnDeleteComponent}
              onChange={(checked) =>
                dispatch(setShowBtnDeleteComponent(checked))
              }
              style={{
                backgroundColor: showBtnDeleteComponent
                  ? "#22c55e"
                  : "#ef4444 ",
              }}
            />
            <span className="font-bold">
              {showBtnDeleteComponent ? (
                <span className="text-green-500">Active</span>
              ) : (
                <span className="text-red-500">Inactive</span>
              )}
            </span>
          </div>
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <p className="font-bold">Enable Edit : </p>
            <Switch
              size="large"
              checked={editEnabledComponent}
              onChange={(checked) => dispatch(setEditEnabledComponent(checked))}
              style={{
                backgroundColor: editEnabledComponent ? "#22c55e" : "#ef4444 ",
              }}
            />
            <span className="font-bold">
              {editEnabledComponent ? (
                <span className="text-green-500">Active</span>
              ) : (
                <span className="text-red-500">Inactive</span>
              )}
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
        </>
      )}
      <CreatePointModal
        isOpenModalCreatePoint={isOpenModalCreatePoint}
        setIsOpenModalCreatePoint={setIsOpenModalCreatePoint}
      />
      <CreateBoardMoal
        isOpenModalCreateBoard={isOpenModalCreateBoard}
        setIsOpenModalCreateBoard={setIsOpenModalCreateBoard}
      />
      <UploadImgsModal
        isOpenUploadImgsModal={isOpenUploadImgsModal}
        setIsOpenUploadImgsModal={setIsOpenUploadImgsModal}
        optionsCategories={optionsCategories}
      />
      <ChooseNameModal
        isOpenChooseNameModal={isOpenChooseNameModal}
        setIsOpenChooseNameModal={setIsOpenChooseNameModal}
        setName={setName}
        title={"Component"}
      />
    </div>
  );
};

export default DragDropOption;
