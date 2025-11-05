import { useState } from "react";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import {
  IoMdSettings,
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";
import EditComponentModal from "@module/modal/EditComponentModal";
import DraggableHandlersOfComponents from "@module/container/main/create-component/DraggableHandlersOfComponents.js";

const ItemType = {
  BOX: "box",
};

const DraggableBoxComponent = ({
  index,
  item,
  onDoubleClick,
  isBlinking,
  itemAbility,
}) => {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.components);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const showBtnDeleteComponent = useSelector(
    (state) => state.showBtnDeleteComponent,
  );
  const editEnabledComponent = useSelector(
    (state) => state.editEnabledComponent,
  );

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.BOX,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const backgroundStyle = isBlinking
    ? { backgroundColor: "#3b82f6" }
    : item.bgImg
      ? { backgroundImage: `url(${item.bgImg})`, backgroundSize: "cover" }
      : { backgroundColor: item.bg };

  const { moveUp, moveDown, moveLeft, moveRight } =
    DraggableHandlersOfComponents({
      dispatch,
      components,
      index,
      setComponents,
    });

  const isNew = item.position?.x === 0 && item.position?.y === 0;
  const offset = isNew ? index * 20 : 0;

  return (
    <div
      ref={drag}
      className={`flex flex-col justify-center items-center cursor-move z-0 ${
        isBlinking ? "animate-pulse" : ""
      }`}
      id={item.type}
      style={{
        width: `${item.width}px`,
        height: `${item.height}px`,
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        position: "absolute",
        opacity: isDragging ? 0.5 : 1,
        zIndex: item.type === "point" ? 2 : 1,
        borderRadius: `${item.borderRadius}px`,
        transform: `${isNew ? `translate(${offset}px, ${offset}px)` : ""}`,
        ...backgroundStyle,
      }}
      onDoubleClick={onDoubleClick}
      {...(item.type === "point" && {
        "data-id": item.id,
        "data-name": item.name,
        "data-width": item.width,
        "data-height": item.height,
        "data-bg": item.bg,
        "data-border-radius": item.borderRadius,
        "data-position-x": item.position.x,
        "data-position-y": item.position.y,
      })}
    >
      {showBtnDeleteComponent && (
        <TiDelete
          className="absolute -bottom-3 -right-3 cursor-pointer text-red-500 bg-gray-200 rounded-full shadow p-1"
          size={28}
          onClick={(e) => {
            e.stopPropagation();
            const updatedComponents = components.filter(
              (index) => index.id !== item.id,
            );
            dispatch(setComponents(updatedComponents));
          }}
        />
      )}
      {editEnabledComponent && (
        <IoMdSettings
          className="absolute -bottom-2 -left-2 cursor-pointer text-black bg-gray-200 rounded-full shadow p-1"
          size={24}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpenEditModal(true);
          }}
        />
      )}
      {itemAbility.controller && (
        <div className="controls">
          <button
            onClick={moveUp}
            className="absolute -top-[2.5rem] left-[1.25rem] bg-white shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowUp />
          </button>
          <button
            onClick={moveDown}
            className="absolute -bottom-[2.5rem] left-[1.25rem] bg-white shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowDown />
          </button>
          <button
            onClick={moveLeft}
            className="absolute top-[1rem] -left-[2.5rem] bg-white  shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={moveRight}
            className="absolute  top-[1rem] -right-[2.5rem] bg-white shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
      <EditComponentModal
        isOpenEditModal={isOpenEditModal}
        setIsOpenEditModal={setIsOpenEditModal}
        item={item}
      />
    </div>
  );
};

export default DraggableBoxComponent;
