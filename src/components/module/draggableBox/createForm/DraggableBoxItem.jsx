import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsArrowsMove } from "react-icons/bs";
import { setItems } from "@redux_toolkit/features/itemsSlice";
import useDisplayInfo from "@hooks/useDisplayInfo.js";
import useDynamicBackground from "@hooks/useDynamicBackground";
import useFieldComparison from "@hooks/useFieldComparison";
import UseMqttSubscription from "@hooks/UseMqttSubscription.js";
import UseEchoRegister from "@hooks/UseEchoRegister.js";
import FormDisplay from "@module/modal/FormDisplay";
import DraggableHelperHandlersOfForm from "@module/container/main/create-form/DraggableHelperHandlersOfForm.js";
import DraggableHandlersOfForm from "@module/container/main/create-form/DraggableHandlersOfForm.js";
import logger from "@utils/logger.js";
import DraggableBoxItemCard from "@module/card/DraggableBoxItemCard.jsx";

const ItemType = {
  BOX: "box",
};

const DraggableBoxItem = ({
  item,
  index,
  items,
  itemAbility,
  activeItemId,
  setActiveItemId,
  setTopZIndex,
  topZIndex,
  onClick,
  onChangeTitle,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const realtimeService = useSelector((state) => state.realtimeService);

  const formId = location.state?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showModalFormDisplay, setShowModalFormDisplay] = useState(false);
  const [showOnlyController, setShowOnlyController] = useState(false);
  const [registers, setRegisters] = useState([]);
  const [info, setInfo] = useState("--");

  const allowedIds = item.idRegister ?? null;

  UseEchoRegister(setRegisters, allowedIds, realtimeService);

  const mqttTopics =
    realtimeService === "mqtt" && allowedIds ? [`registers/${allowedIds}`] : [];

  const payload = JSON.stringify({ uuid: formId });

  UseMqttSubscription(
    mqttTopics,
    (message) => {
      try {
        const payload = JSON.parse(message.payload);
        setInfo(payload.value);
      } catch (e) {
        logger.error("MQTT parse error:", e);
      }
    },
    realtimeService === "mqtt",
    formId
      ? {
          publishTopic: "watchers/form",
          publishMessage: payload,
        }
      : null,
  );

  useEffect(() => {
    if (registers.length > 0) {
      localStorage.setItem("registers", JSON.stringify(registers));
    }
  }, [registers]);

  const { displayItem, setDisplayItem } = useDisplayInfo(
    registers,
    item,
    setInfo,
  );

  const { bgColor, bgImg, setBgColor, setBgImg } = useDynamicBackground(
    registers,
    item,
  );

  useFieldComparison(
    info,
    item.FieldComparison,
    setBgColor,
    setBgImg,
    setDisplayItem,
  );

  const { handleClick, setSendRequest } = DraggableHandlersOfForm({
    item,
    setShowModalFormDisplay,
    showModalFormDisplay,
  });

  const {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    handleInputSubmit,
    handleDelete,
  } = DraggableHelperHandlersOfForm({
    index,
    dispatch,
    setItems,
    items,
    newTitle,
    item,
    onChangeTitle,
    setIsEditing,
    setSendRequest,
  });

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemType.BOX,
      item: () => {
        setActiveItemId(item.id);
        setTopZIndex((prev) => prev + 1);
        return { index, type: ItemType.BOX, itemId: item.id };
      },
      canDrag: !itemAbility.dragDisabled,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [itemAbility.dragDisabled, item.id],
  );

  const isNew = item.position?.x === 0 && item.position?.y === 0;
  const offset = isNew ? index * 20 : 0;

  return (
    <div
      ref={drag}
      onClick={
        item.indexType === "button" && itemAbility.moveTo
          ? handleClick
          : undefined
      }
      className={`flex flex-col justify-center items-center cursor-move break-all p-0 ${
        !displayItem ? "hidden" : ""
      }`}
      style={{
        width: `${item.width}px`,
        height: `${item.height}px`,
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        position: "absolute",
        borderRadius: `${item.rounded}px`,
        borderColor: item.borderColor,
        borderWidth: `${item.borderWidth}px`,
        borderStyle: "solid",
        transform: `rotate(${item.rotation}deg) ${
          isNew ? `translate(${offset}px, ${offset}px)` : ""
        }`,
        transition: "transform 0.3s ease",
        backgroundColor: bgColor,
        backgroundImage: bgImg ? `url(${bgImg})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: activeItemId === item.id ? topZIndex : 1,
      }}
      id={item.id}
      {...(item.idRegister ? { "data-idregister": item.idRegister } : {})}
    >
      <div
        style={{
          opacity: item.opacity,
          zIndex: -1,
          borderRadius: `${item.rounded}px`,
        }}
      />

      <DraggableBoxItemCard
        item={item}
        itemAbility={itemAbility}
        onClick={onClick}
        handleDelete={handleDelete}
        handleInputSubmit={handleInputSubmit}
        showOnlyController={showOnlyController}
        info={info}
        moveUp={moveUp}
        moveDown={moveDown}
        moveLeft={moveLeft}
        moveRight={moveRight}
        isEditing={isEditing}
        newTitle={newTitle}
        setIsEditing={setIsEditing}
        setNewTitle={setNewTitle}
      />

      {itemAbility.controller && (
        <BsArrowsMove
          className="absolute -top-3 -right-3 cursor-pointer text-dark-100 bg-white dark:bg-gray-100 dark:text-white rounded-full shadow p-1 z-[1001]"
          size={28}
          onClick={(e) => {
            e.stopPropagation();
            setShowOnlyController(!showOnlyController);
          }}
        />
      )}
      {showModalFormDisplay && (
        <FormDisplay
          showModalFormDisplay={showModalFormDisplay}
          setShowModalFormDisplay={setShowModalFormDisplay}
          idForm={item.idForm}
        />
      )}
    </div>
  );
};

export default DraggableBoxItem;
