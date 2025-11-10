import { useLocation, useNavigate } from "react-router-dom";
import { Button, Switch } from "antd";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";

export default function ControlMainOfForm({
  setModals,
  items,
  itemAbility,
  setItemAbility,
  dispatch,
  setBtnDisplayStatus,
  setBoxInfo,
  formId,
  handleCopyHTML,
  btnDisplayStatus,
  handleSendHTML,
  openModalUpdateName,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-2">
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
      </div>

      {items.length > 0 && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2">
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <p className="font-bold">Show edit button</p>
            <Switch
              size="small"
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
              size="small"
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
              size="small"
              checked={itemAbility.remove}
              onChange={(checked) =>
                setItemAbility((prev) => ({ ...prev, remove: checked }))
              }
              style={{
                backgroundColor: itemAbility.remove ? "#22c55e" : "#ef4444 ",
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
            <p className="font-bold">Enable/Disable</p>
            <Switch
              size="small"
              checked={itemAbility.moveTo}
              onChange={(checked) =>
                setItemAbility((prev) => ({ ...prev, moveTo: checked }))
              }
              style={{
                backgroundColor: itemAbility.moveTo ? "#22c55e" : "#ef4444 ",
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
        </div>
      )}
      {items.length > 0 && (
        <div className="w-full h-auto flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2">
          <Button
            color="danger"
            variant="solid"
            size="middle"
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
            size="middle"
            onClick={() =>
              setItemAbility((prev) => ({
                ...prev,
                dragDisabled: !itemAbility.dragDisabled,
              }))
            }
            className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
          >
            {itemAbility.dragDisabled ? "Enable Dragging" : "Disable Dragging"}
          </Button>
        </div>
      )}

      {items.length > 0 && formId && (
        <Button
          onClick={handleCopyHTML}
          className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
        >
          Copy Form
        </Button>
      )}

      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-2">
        {items.length > 0 && (
          <Button
            size="middle"
            onClick={btnDisplayStatus ? handleSendHTML : openModalUpdateName}
            className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
          >
            {btnDisplayStatus ? "Send Form" : "Update"}
          </Button>
        )}

        <Button
          size="middle"
          onClick={() =>
            setModals((prevState) => ({
              ...prevState,
              uploadImgsModal: true,
            }))
          }
          className="upload-imgs w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
        >
          Upload image
        </Button>
      </div>
    </>
  );
}
