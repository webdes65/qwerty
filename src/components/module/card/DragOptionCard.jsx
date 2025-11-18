import { useSelector } from "react-redux";
import { Button, Switch } from "antd";
import { setShowBtnDeleteComponent } from "@redux_toolkit/features/showBtnDeleteComponentSlice.js";
import { setEditEnabledComponent } from "@redux_toolkit/features/editEnabledComponentSlice.js";
import "@styles/formAndComponentStyles.css";

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
        <label className="dragLabelStyle">Box size</label>
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
            className="w-1/2 uploadInputStyle"
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
            className="w-1/2 uploadInputStyle"
          />
        </div>
      </div>
      <div className="w-full flex flex-row justify-center items-center gap-2">
        <Button
          type="primary"
          onClick={() => setIsOpenModalCreateBoard(true)}
          className="create-board w-1/2 buttonPrimaryStyle"
        >
          Create Board
        </Button>
        <Button
          type="primary"
          onClick={() => setIsOpenModalCreatePoint(true)}
          className="create-point w-1/2 buttonPrimaryStyle"
        >
          Create Point
        </Button>
      </div>
      {components.length > 0 && (
        <div className="w-full flex flex-row justify-center items-center gap-2">
          <Button
            onClick={submitComponent}
            className="w-1/2 h-auto !p-2 !rounded-md buttonPrimaryStyle"
          >
            Sent Component
          </Button>
          <Button
            onClick={RemoveAll}
            className="w-1/2 h-auto !p-2 !rounded-md hover:!text-red-500 buttonSecondaryStyle"
          >
            Remove all
          </Button>
        </div>
      )}
      {components.length > 0 && (
        <Button
          onClick={() => setIsFixed(!isFixed)}
          className="w-full h-auto !p-2 !rounded-md buttonPrimaryStyle"
        >
          {isFixed ? "Unfix" : "Fix"}
        </Button>
      )}
      <Button
        onClick={() => setIsOpenUploadImgsModal(true)}
        className="upload-imgs w-full h-auto !p-2 !rounded-md buttonPrimaryStyle"
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
