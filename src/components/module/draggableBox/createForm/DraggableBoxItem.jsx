import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  IoMdSettings,
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { BsArrowsMove } from "react-icons/bs";
import { setItems } from "@redux_toolkit/features/itemsSlice";
import axios from "axios";
import Cookies from "universal-cookie";
import { generateCypherKey } from "@utils/generateCypherKey.js";
import logger from "@utils/logger.js";
import useEchoRegister from "@hooks/useEchoRegister";
import UseMqttSubscription from "@hooks/UseMqttSubscription.js";
import FormDisplay from "@module/modal/FormDisplay";

const ItemType = {
  BOX: "box",
};

const DraggableBoxItem = ({
  position,
  index,
  title,
  width,
  height,
  onClick,
  opacity,
  rounded,
  onChangeTitle,
  indexType,
  idRegister,
  textColor,
  fontSize,
  fontFamily,
  decimalPlaces,
  titlebtn,
  borderColor,
  borderWidth,
  rotation,
  permissionDisplayData,
  backgroundColor,
  backgroundColorBooleanFalse,
  backgroundColorBooleanTrue,
  backgroundImage,
  backgroundImageBooleanTrue,
  backgroundImageBooleanFalse,
  typeDataRegister,
  id,
  numberBits,
  backgroundColorBinaryOne,
  backgroundColorBinaryZero,
  backgroundImageBinaryZero,
  backgroundImageBinaryOne,
  hideIfZero,
  hideIfOne,
  FieldComparison,
  path,
  idForm,
  typeDisplay,
  infoReqBtn,
  items,
  itemAbility,
  selectDevice,
  activeItemId,
  setActiveItemId,
  setTopZIndex,
  topZIndex,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");
  const location = useLocation();
  const formId = location.state?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [displayItem, setDisplayItem] = useState(true);
  const [info, setInfo] = useState("--");
  const [registers, setRegisters] = useState([]);
  const [showModalFormDisplay, setShowModalFormDisplay] = useState(false);
  const [showOnlyController, setShowOnlyController] = useState(false);

  // logger.log("info", info);

  const allowedIds = idRegister ?? null;

  const realtimeService = useSelector((state) => state.realtimeService);

  useEchoRegister(setRegisters, allowedIds, realtimeService);

  const mqttTopics =
    realtimeService === "mqtt" && allowedIds ? [`registers/${allowedIds}`] : [];

  const { messages: register } = UseMqttSubscription(
    mqttTopics,
    (message) => {
      try {
        const payload = JSON.parse(message.payload);
        setInfo(payload.value);
        /*logger.log("payload", payload);
        logger.log("message", message);*/
      } catch (e) {
        logger.error("MQTT parse error:", e);
      }
    },
    realtimeService === "mqtt",

    formId
      ? {
          publishTopic: "forms/watchers",
          publishMessage: formId,
        }
      : null,
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemType.BOX,
      item: () => {
        setActiveItemId(id);
        setTopZIndex((prev) => prev + 1);
        return { index, type: ItemType.BOX, id };
      },
      canDrag: !itemAbility.dragDisabled,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [itemAbility.dragDisabled, id],
  );

  /*const { data: imgsData } = useQuery(["fetchImgsCategory"], () =>
    request({
      method: "GET",
      url: `/api/files`,
    }),
  );*/

  // logger.log("images", imgsData?.data);

  useEffect(() => {
    displayInfo();
  }, [registers, idRegister, numberBits, hideIfZero, hideIfOne, decimalPlaces]);

  const displayInfo = () => {
    const tempObj = registers.find((item) => item.id === idRegister);

    if (tempObj && tempObj.type === "int") {
      setInfo(tempObj ? tempObj.value : "--");
      return;
    }

    if (tempObj && tempObj.type === "float") {
      const result = tempObj
        ? parseFloat(tempObj.value).toFixed(decimalPlaces)
        : "--";
      setInfo(result);
      return;
    }

    if (tempObj && tempObj.type === "bool") {
      setInfo(tempObj ? String(tempObj.value) : "--");
      return;
    }

    if (tempObj && tempObj.type === "string") {
      setInfo(tempObj ? tempObj.value : "--");
      return;
    }

    if (tempObj && tempObj.type === "binary") {
      if (!tempObj.value) {
        setInfo("--");
        return;
      }

      const value =
        typeof tempObj.value === "string"
          ? Number(tempObj.value)
          : tempObj.value;

      const binaryValue = value.toString(2);
      const bit = binaryValue[binaryValue.length - numberBits];

      if ((hideIfZero && bit === "0") || (hideIfOne && bit === "1")) {
        setDisplayItem(false);
      } else {
        setDisplayItem(true);
      }

      setInfo(bit);
      return;
    }
    return;
  };

  const [bgColor, setBgColor] = useState("");

  const hex = backgroundColor;
  const alpha = opacity;

  const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgbaValue = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    return rgbaValue;
  };

  const getDynamicBackgroundColor = () => {
    const tempObj = registers.find((item) => item.id === idRegister);

    if (tempObj && tempObj.type === "bool") {
      const color = tempObj.value
        ? backgroundColorBooleanTrue
        : backgroundColorBooleanFalse;
      return hexToRgba(color, alpha);
    }

    if (
      tempObj &&
      (tempObj.type === "float" ||
        tempObj.type === "string" ||
        tempObj.type === "int")
    ) {
      const color = backgroundColor;
      return hexToRgba(color, alpha);
    }

    if (tempObj && tempObj.type === "binary") {
      const value =
        typeof tempObj.value === "string"
          ? Number(tempObj.value)
          : tempObj.value;

      const binaryValue = value.toString(2);

      const bit = binaryValue[binaryValue.length - numberBits];

      const color =
        bit === "1" ? backgroundColorBinaryOne : backgroundColorBinaryZero;
      return hexToRgba(color, alpha);
    }

    if (!tempObj && backgroundColor) {
      return hexToRgba(backgroundColor, alpha);
    }

    return;
  };

  useEffect(() => {
    const dynamicBgColor = getDynamicBackgroundColor();
    setBgColor(dynamicBgColor);
  }, [
    registers,
    idRegister,
    backgroundColorBooleanTrue,
    backgroundColorBooleanFalse,
    backgroundColorBinaryZero,
    backgroundColorBinaryOne,
    hex,
    alpha,
  ]);

  const [bgImg, setBgImg] = useState("");

  useEffect(() => {
    const result = getDynamicBackgroundImg();
    if (result) {
      setBgImg(result);
    }
  }, [
    typeDataRegister,
    registers,
    idRegister,
    backgroundImage,
    backgroundImageBooleanTrue,
    backgroundImageBooleanFalse,
    backgroundImageBinaryZero,
    backgroundImageBinaryOne,
  ]);

  const getDynamicBackgroundImg = () => {
    const tempObj = registers.find((item) => item.id === idRegister);

    if (
      tempObj &&
      (tempObj.type === "float" ||
        tempObj.type === "string" ||
        tempObj.type === "int") &&
      backgroundImage
    ) {
      return backgroundImage;
    }

    if (tempObj && tempObj.type === "bool") {
      return tempObj.value
        ? backgroundImageBooleanTrue
        : backgroundImageBooleanFalse;
    }

    if (tempObj && tempObj.type === "binary") {
      const value =
        typeof tempObj.value === "string"
          ? Number(tempObj.value)
          : tempObj.value;

      const binaryValue = value.toString(2);
      const bit = binaryValue[binaryValue.length - numberBits];

      return bit === "1" ? backgroundImageBinaryOne : backgroundImageBinaryZero;
    }

    if (!tempObj && backgroundColor) {
      return backgroundImage;
    }

    return;
  };

  useEffect(() => {
    checkConditions();
  }, [bgImg, bgColor, info]);

  const checkConditions = () => {
    const value = info;
    const fieldComparisonArray = Object.values(FieldComparison);
    let shouldHideItem = false;

    for (let condition of fieldComparisonArray) {
      if (
        condition.key === "bigger" &&
        parseFloat(value) > parseFloat(condition.value)
      ) {
        setBgColor(condition.color);
        setBgImg(condition.bgImg);
        if (condition.visibility === true) {
          shouldHideItem = true;
        }
        break;
      } else if (
        condition.key === "smaller" &&
        parseFloat(value) < parseFloat(condition.value)
      ) {
        setBgColor(condition.color);
        setBgImg(condition.bgImg);
        if (condition.visibility === true) {
          shouldHideItem = true;
        }
        break;
      } else if (
        condition.key === "equal" &&
        parseFloat(value) === parseFloat(condition.value)
      ) {
        setBgColor(condition.color);
        setBgImg(condition.bgImg);
        if (condition.visibility === true) {
          shouldHideItem = true;
        }
        break;
      } else if (
        condition.key === "GreaterThanOrEqual" &&
        parseFloat(condition.value) >= parseFloat(value)
      ) {
        setBgColor(condition.color);
        setBgImg(condition.bgImg);
        if (condition.visibility === true) {
          shouldHideItem = true;
        }
        break;
      } else if (
        condition.key === "LessThanOrEqual" &&
        parseFloat(condition.value) <= parseFloat(value)
      ) {
        setBgColor(condition.color);
        setBgImg(condition.bgImg);
        if (condition.visibility === true) {
          shouldHideItem = true;
        }
        break;
      }
    }

    if (!shouldHideItem) {
      setDisplayItem(true);
    } else {
      setDisplayItem(false);
    }
  };

  useEffect(() => {
    if (registers.length > 0) {
      localStorage.setItem("registers", JSON.stringify(registers));
    }
  }, [registers]);

  // const [randomColor, setRandomColor] = useState("");

  /*const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };*/

  const handleClick = async () => {
    const storedRegisters = JSON.parse(localStorage.getItem("registers"));

    /*const newColor = getRandomColor();

    if (Math.random() > 0.5) {
      setRandomColor(newColor);
      setBgImg("");
    } else {
      if (imgsData?.data?.length > 0) {
        const randomImage =
          imgsData.data[Math.floor(Math.random() * imgsData.data.length)];
        setBgImg(randomImage.path);
      }
      setRandomColor("");
    }*/

    if (path !== "") {
      window.open(path, "_blank");
    } else if (idForm !== "") {
      if (typeDisplay === "form") {
        navigate("/createform", { state: { id: idForm } });
      } else {
        if (!showModalFormDisplay) {
          setShowModalFormDisplay(true);
        }
      }
    } else if (infoReqBtn !== null) {
      let updatedValue = infoReqBtn.value;

      if (infoReqBtn.singleIncrease === true) {
        if (Array.isArray(storedRegisters)) {
          const foundItem = storedRegisters.find(
            (item) => item.id === infoReqBtn.register_id,
          );

          if (foundItem) {
            let currentValue = Number(foundItem.value);

            if (isNaN(currentValue)) {
              logger.error("Invalid value for 'value', defaulting to 0.");
              currentValue = 0;
            }

            updatedValue = currentValue + 1;
            foundItem.value = updatedValue;
          } else {
            logger.log("No matching item found.");
          }
        } else {
          logger.log("temps is not a valid array.");
        }
      }

      if (infoReqBtn.singleReduction === true) {
        const foundItem = storedRegisters.find(
          (item) => item.id === infoReqBtn.register_id,
        );

        if (foundItem) {
          let currentValue = Number(foundItem.value);

          if (isNaN(currentValue)) {
            logger.error("Invalid value for 'value', defaulting to 0.");
            currentValue = 0;
          }

          updatedValue = currentValue - 1;
          foundItem.value = updatedValue;
        } else {
          logger.log("No matching item found.");
        }
      }

      const data = {
        device_uuid: infoReqBtn.device_uuid,
        title: infoReqBtn.title,
        value: isNaN(Number(updatedValue)) ? 0 : Number(updatedValue),
      };

      try {
        const cypherKey = await generateCypherKey();

        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/registers/${infoReqBtn.register_id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              cypherKey,
            },
          },
        );

        if (response.status === 200) {
          toast.success(response.data.message);
        }
      } catch (error) {
        if (error.status === 422) {
          toast.error(error.response.data.data);
        } else {
          logger.error(error);
        }
      }
    }
  };

  const [newTitle, setNewTitle] = useState("");
  const [sendRequest, setSendRequest] = useState(false);

  useEffect(() => {
    const updateRegister = async () => {
      if (
        indexType !== "text input" ||
        infoReqBtn.device_uuid === null ||
        !sendRequest
      )
        return;

      const data = {
        device_uuid: infoReqBtn.device_uuid,
        title: infoReqBtn.title,
        value: title,
      };

      try {
        const cypherKey = await generateCypherKey();

        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/registers/${infoReqBtn.register_id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              cypherKey,
            },
          },
        );

        if (response.status === 200) {
          toast.success(response.data.message);

          const registers = JSON.parse(localStorage.getItem("registers")) || [];

          const updatedRegisters = registers.map((item) =>
            item.id === id
              ? { ...item, title: response.data.data.value }
              : item,
          );

          localStorage.setItem("registers", JSON.stringify(updatedRegisters));
        }
      } catch (error) {
        if (error.status === 422) {
          toast.error(error.response.data.data);
        }
      } finally {
        setSendRequest(false);
      }
    };

    updateRegister();
  }, [indexType, title, infoReqBtn, sendRequest]);

  const moveUp = (e) => {
    e.stopPropagation();
    dispatch((dispatch, getState) => {
      const { items } = getState();

      const updatedPositions = items.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, y: item.position.y - 1 } }
          : item,
      );

      dispatch(setItems(updatedPositions));
      localStorage.setItem("registers", JSON.stringify(updatedPositions));
    });
  };

  const moveDown = (e) => {
    e.stopPropagation();
    dispatch((dispatch, getState) => {
      const { items } = getState();

      const updatedPositions = items.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, y: item.position.y + 1 } }
          : item,
      );

      dispatch(setItems(updatedPositions));
      localStorage.setItem("registers", JSON.stringify(updatedPositions));
    });
  };

  const moveLeft = (e) => {
    e.stopPropagation();
    dispatch((dispatch, getState) => {
      const { items } = getState();

      const updatedPositions = items.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, x: item.position.x - 1 } }
          : item,
      );

      dispatch(setItems(updatedPositions));
      localStorage.setItem("registers", JSON.stringify(updatedPositions));
    });
  };

  const moveRight = (e) => {
    e.stopPropagation();
    dispatch((dispatch, getState) => {
      const { items } = getState();

      const updatedPositions = items.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, x: item.position.x + 1 } }
          : item,
      );

      dispatch(setItems(updatedPositions));
      localStorage.setItem("registers", JSON.stringify(updatedPositions));
    });
  };

  const isNew = position?.x === 0 && position?.y === 0;
  const offset = isNew ? index * 20 : 0;

  return (
    <div
      ref={drag}
      onClick={
        (indexType === "button") & itemAbility.moveTo ? handleClick : undefined
      }
      className={`flex flex-col justify-center items-center cursor-move break-all p-0 ${
        !displayItem ? "hidden" : ""
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
        borderRadius: `${rounded}px`,
        borderColor: `${borderColor}`,
        borderWidth: `${borderWidth}px`,
        borderStyle: "solid",
        transform: `rotate(${rotation}deg) ${
          isNew ? `translate(${offset}px, ${offset}px)` : ""
        }`,
        transition: "transform 0.3s ease",
        backgroundColor: bgColor,
        backgroundImage: bgImg ? `url(${bgImg})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",

        zIndex: activeItemId === id ? topZIndex : 1,
      }}
      // Information we need in the form in HTML
      id={id}
      {...(idRegister ? { "data-idregister": idRegister } : {})}
    >
      <div
        style={{
          opacity: opacity,
          zIndex: -1,
          borderRadius: `${rounded}px`,
        }}
      />

      {indexType === "label" && (
        <p
          style={{
            display: permissionDisplayData ? "inline" : "none",
            fontSize: `${fontSize}rem`,
            color: textColor,
            fontFamily: fontFamily,
          }}
        >
          {title}
        </p>
      )}

      {selectDevice && indexType === "label" && (
        <span
          style={{
            display: permissionDisplayData ? "inline" : "none",
            fontSize: `${fontSize}rem`,
            color: textColor,
            fontFamily: fontFamily,
          }}
        >
          {info}
        </span>
      )}

      {indexType === "text input" && (
        <>
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => {
                const inputValue = e.target.value;
                setNewTitle(inputValue);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const startRange = Number(infoReqBtn.startRange);
                  const endRange = Number(infoReqBtn.endRange);

                  const hasRange =
                    infoReqBtn.startRange !== undefined &&
                    infoReqBtn.startRange !== null &&
                    infoReqBtn.startRange !== "" &&
                    infoReqBtn.endRange !== undefined &&
                    infoReqBtn.endRange !== null &&
                    infoReqBtn.endRange !== "";

                  if (hasRange) {
                    const numValue = Number(newTitle);
                    if (
                      isNaN(numValue) ||
                      numValue < startRange ||
                      numValue > endRange
                    ) {
                      toast.error(
                        `Value must be between ${startRange} and ${endRange}`,
                      );
                      return;
                    }
                  }

                  setIsEditing(false);
                  onChangeTitle(index, newTitle);
                  setSendRequest(true);
                }
              }}
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
                fontSize: `${fontSize}rem`,
                color: textColor,
                fontFamily: fontFamily,
              }}
              className="!opacity-100 z-10 text-center w-full h-auto overflow-hidden text-ellipsis"
            >
              {title}
            </p>
          )}
        </>
      )}

      {indexType === "button" && (
        <p
          style={{
            fontSize: `${fontSize}rem`,
            color: textColor,
            fontFamily: fontFamily,
          }}
        >
          {titlebtn}
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
          onClick={(e) => {
            e.stopPropagation();
            const updatedItems = items.filter((item) => item.id !== id);
            dispatch(setItems(updatedItems));
            localStorage.setItem("registers", JSON.stringify(updatedItems));
          }}
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
            className="absolute top-[1rem] -left-[2.5rem] bg-[#7e7e7e]  shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={moveRight}
            className="absolute  top-[1rem] -right-[2.5rem] bg-[#7e7e7e] shadow uppercase text-black p-2 rounded-md"
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
      {itemAbility.controller && (
        <BsArrowsMove
          className="absolute -top-3 -right-3 cursor-pointer text-black-500 bg-gray-200 rounded-full shadow p-1 z-[1001]"
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
          idForm={idForm}
        />
      )}
    </div>
  );
};

export default DraggableBoxItem;
