import { useSelector } from "react-redux";
import { Button, Switch } from "antd";
import { setShowBtnDeleteComponent } from "@redux_toolkit/features/showBtnDeleteComponentSlice.js";
import { setEditEnabledComponent } from "@redux_toolkit/features/editEnabledComponentSlice.js";

export default function DragOptionCard({
  containerSize,
  setContainerSize,
  setIsOpenModalCreateBoard,
  setIsOpenModalCreatePoint,
  components,
  setIsFixed,
  isFixed,
  setIsOpenUploadImgsModal,
  dispatch,
  itemAbility,
  setItemAbility,
  submitComponent,
  RemoveAll,
}) {
  const showBtnDeleteComponent = useSelector(
    (state) => state.showBtnDeleteComponent,
  );

  const editEnabledComponent = useSelector(
    (state) => state.editEnabledComponent,
  );

  return (
    <>
      <div className="w-full flex flex-col justify-center items-start gap-2">
        <label className="text-black dark:text-white font-bold">Box size</label>
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
            className="w-1/2 border-2 border-gray-200 dark:border-gray-600 p-2 rounded outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
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
            className="w-1/2 border-2 border-gray-200 dark:border-gray-600 p-2 rounded outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
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
        Upload images
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
    </>
  );
}
