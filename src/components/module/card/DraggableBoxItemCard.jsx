import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
  IoMdSettings,
} from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import "@styles/formAndComponentStyles.css";

export default function DraggableBoxItemCard({
  item,
  info,
  newTitle,
  setNewTitle,
  handleInputSubmit,
  isEditing,
  setIsEditing,
  itemAbility,
  onClick,
  handleDelete,
  showOnlyController,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
}) {

  return (
    <>
      {item.type === "label" && (
        <>
          <p
            style={{
              display: item.permissionDisplayData ? "inline" : "none",
              fontSize: `${item.fontSize}rem`,
              color: item.textColor,
              fontFamily: item.fontFamily,
            }}
          >
            {item.title}
          </p>

          {item.selectDevice && (
            <span
              style={{
                display: item.permissionDisplayData ? "inline" : "none",
                fontSize: `${item.fontSize}rem`,
                color: item.textColor,
                fontFamily: item.fontFamily,
              }}
            >
              {info}
            </span>
          )}
        </>
      )}

      {item.type === "text input" && (
        <>
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleInputSubmit}
              className="text-black outline-none rounded-md border-2 border-blue-500 p-1"
              autoFocus
            />
          ) : (
            <p
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              style={{
                fontSize: `${item.fontSize}rem`,
                color: item.textColor,
                fontFamily: item.fontFamily,
              }}
              className="!opacity-100 z-10 text-center w-full h-auto overflow-hidden text-ellipsis"
            >
              {item.title}
            </p>
          )}
        </>
      )}

      {item.type === "button" && (
        <p
          style={{
            fontSize: `${item.fontSize}rem`,
            color: item.textColor,
            fontFamily: item.fontFamily,
          }}
        >
          {item.titlebtn}
        </p>
      )}
      {itemAbility.edit && (
        <IoMdSettings
          className="settingButtonsStyle"
          size={24}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      )}
      {itemAbility.remove && (
        <TiDelete
          className="detectButtonsStyle"
          size={28}
          onClick={handleDelete}
        />
      )}
      {showOnlyController && (
        <div className="controls">
          <button
            onClick={moveUp}
            className="-top-[2.5rem] left-[1.25rem] z-[1001] controlButtonsStyle"
          >
            <IoIosArrowUp />
          </button>
          <button
            onClick={moveDown}
            className="-bottom-[2.5rem] left-[1.25rem] controlButtonsStyle"
          >
            <IoIosArrowDown />
          </button>
          <button
            onClick={moveLeft}
            className="top-[1rem] -left-[2.5rem] controlButtonsStyle"
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={moveRight}
            className="top-[1rem] -right-[2.5rem] controlButtonsStyle"
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </>
  );
}
