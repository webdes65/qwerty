import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
  IoMdSettings,
} from "react-icons/io";
import { TiDelete } from "react-icons/ti";

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
      {item.indexType === "label" && (
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

      {item.indexType === "text input" && (
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

      {item.indexType === "button" && (
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
          className="absolute -bottom-2 -left-2 cursor-pointer text-black bg-gray-200 rounded-full shadow p-1"
          size={24}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      )}
      {itemAbility.remove && (
        <TiDelete
          className="absolute -bottom-3 -right-3 cursor-pointer text-red-500 bg-gray-200 rounded-full shadow p-1"
          size={28}
          onClick={handleDelete}
        />
      )}
      {showOnlyController && (
        <div className="controls">
          <button
            onClick={moveUp}
            className="absolute -top-[2.5rem] left-[1.25rem] bg-[#7e7e7e] shadow uppercase text-black p-2 rounded-md z-[1001]"
          >
            <IoIosArrowUp />
          </button>
          <button
            onClick={moveDown}
            className="absolute -bottom-[2.5rem] left-[1.25rem] bg-[#7e7e7e] shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowDown />
          </button>
          <button
            onClick={moveLeft}
            className="absolute top-[1rem] -left-[2.5rem] bg-[#7e7e7e] shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={moveRight}
            className="absolute top-[1rem] -right-[2.5rem] bg-[#7e7e7e] shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </>
  );
}
