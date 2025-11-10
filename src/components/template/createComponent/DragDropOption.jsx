import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateBoardModal from "@module/modal/CreateBoardModal";
import UploadImgsModal from "@module/modal/UploadImgsModal";
import CreatePointModal from "@module/modal/CreatePointModal";
import ChooseNameModal from "@module/modal/ChooseNameModal";
import DragOptionHandlersOfComponents from "@module/container/main/create-component/DragOptionHandlersOfComponents.js";
import DragOptionCard from "@module/card/DragOptionCard.jsx";

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

  const [isOpenModalCreatePoint, setIsOpenModalCreatePoint] = useState(false);
  const [isOpenModalCreateBoard, setIsOpenModalCreateBoard] = useState(false);
  const [isOpenChooseNameModal, setIsOpenChooseNameModal] = useState(false);
  const [isOpenUploadImgsModal, setIsOpenUploadImgsModal] = useState(false);
  const [optionsCategories, setOptionsCategories] = useState([]);
  // const [run, setRun] = useState(false);

  /* useEffect(() => {
    const hasShown = localStorage.getItem("createComponents-guide-shown");
    if (!hasShown) {
      setRun(true);
      localStorage.setItem("createComponents-guide-shown", "true");
    }
  }, []);*/

  const { setName, submitComponent, RemoveAll } =
    DragOptionHandlersOfComponents({
      setOptionsCategories,
      dropBoxRef,
      setIsOpenChooseNameModal,
      dispatch,
      setLines,
      components,
    });

  /*const steps = [
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
  ];*/

  return (
    <div className="w-full h-auto flex flex-col items-start justify-start gap-4 font-Quicksand p-5 border-2 border-gray-200 dark:border-gray-100 bg-white text-dark-100 dark:bg-dark-100 dark:text-white shadow rounded-lg text-[0.90rem] overflow-auto">
      {/*<Joyride
        className="!font-Quicksand"
        steps={steps}
        run={run}
        continuous
        showSkipButton
        styles={{
          buttonNext: {
            backgroundColor: "#ff0000",
            color: "#fff",
          },
          buttonBack: {
            color: "#ff0000",
          },
          buttonSkip: {
            color: darkMode ? "#ffffff" : "#000000",
          },
        }}
        locale={{
          next: "Next",
          back: "Back",
          skip: "Skip",
          last: "End",
        }}
      />*/}

      <DragOptionCard
        isFixed={isFixed}
        setIsFixed={setIsFixed}
        dispatch={dispatch}
        setIsOpenModalCreateBoard={setIsOpenModalCreateBoard}
        setIsOpenModalCreatePoint={setIsOpenModalCreatePoint}
        containerSize={containerSize}
        itemAbility={itemAbility}
        setItemAbility={setItemAbility}
        setIsOpenUploadImgsModal={setIsOpenUploadImgsModal}
        setContainerSize={setContainerSize}
        components={components}
        RemoveAll={RemoveAll}
        submitComponent={submitComponent}
      />

      <CreatePointModal
        isOpenModalCreatePoint={isOpenModalCreatePoint}
        setIsOpenModalCreatePoint={setIsOpenModalCreatePoint}
      />
      <CreateBoardModal
        isOpenModalCreateBoard={isOpenModalCreateBoard}
        setIsOpenModalCreateBoard={setIsOpenModalCreateBoard}
      />
      <ChooseNameModal
        isOpenChooseNameModal={isOpenChooseNameModal}
        setIsOpenChooseNameModal={setIsOpenChooseNameModal}
        optionsCategories={optionsCategories}
        setName={setName}
        title={"Component"}
      />
      <UploadImgsModal
        isOpenUploadImgsModal={isOpenUploadImgsModal}
        setIsOpenUploadImgsModal={setIsOpenUploadImgsModal}
        optionsCategories={optionsCategories}
      />
    </div>
  );
};

export default DragDropOption;
