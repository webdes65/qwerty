import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useNavigate } from "react-router-dom";
import useEchoRegister from "../../../../hooks/useEchoRegister";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import {
  IoMdSettings,
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../../../redux_toolkit/features/itemsSlice";
import { TiDelete } from "react-icons/ti";
import { BsArrowsMove } from "react-icons/bs";
import FormDisplay from "../../modal/FormDisplay";
import useMQTT from "../../../../hooks/useMQTT";
import { generateCypherKey } from "../../../../utils/generateCypherKey";

const ItemType = {
  BOX: "box",
};

const DraggableBoxItem = ({
  position,
  index,
  onDrop,
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

  const [isEditing, setIsEditing] = useState(false);
  const [displayItem, setDisplayItem] = useState(true);
  const [info, setInfo] = useState("--");
  const [registers, setRegisters] = useState([]);
  const [showModalFormDisplay, setShowModalFormDisplay] = useState(false);
  const [showOnlyController, setShowOnlyController] = useState(false);

  const allowedIds = idRegister ? idRegister : null;

  const realtimeService = useSelector((state) => state.realtimeService);

  useEchoRegister(setRegisters, allowedIds, realtimeService);

  const mqttTopics =
    realtimeService === "mqtt" && allowedIds ? [`registers/${allowedIds}`] : [];

  const { messages } = useMQTT(mqttTopics, realtimeService);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      const data = JSON.parse(latestMessage.payload);

      setRegisters((prevTemps) => {
        const existingTemp = prevTemps.find((temp) => temp.id === data.id);

        if (!existingTemp) {
          return [
            ...prevTemps,
            {
              id: data.id,
              label: data.label,
              value: data.value,
              type: data.type,
            },
          ];
        }

        if (existingTemp.value !== data.value) {
          const updatedTemps = prevTemps.filter((temp) => temp.id !== data.id);
          return [
            ...updatedTemps,
            {
              id: data.id,
              label: data.label,
              value: data.value,
              type: data.type,
            },
          ];
        }

        return prevTemps;
      });
    }
  }, [messages]);

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
    [itemAbility.dragDisabled, id]
  );

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
      localStorage.setItem("loadEchoRegisters", JSON.stringify(registers));
    }
  }, [registers]);

  const handleClick = async () => {
    const storedRegisters = JSON.parse(
      localStorage.getItem("loadEchoRegisters")
    );

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
            (item) => item.id === infoReqBtn.register_id
          );

          if (foundItem) {
            let currentValue = Number(foundItem.value);

            if (isNaN(currentValue)) {
              console.error("Invalid value for 'value', defaulting to 0.");
              currentValue = 0;
            }

            updatedValue = currentValue + 1;
            foundItem.value = updatedValue;
          } else {
            console.log("No matching item found.");
          }
        } else {
          console.log("temps is not a valid array.");
        }
      }

      if (infoReqBtn.singleReduction === true) {
        const foundItem = storedRegisters.find(
          (item) => item.id === infoReqBtn.register_id
        );

        if (foundItem) {
          let currentValue = Number(foundItem.value);

          if (isNaN(currentValue)) {
            console.error("Invalid value for 'value', defaulting to 0.");
            currentValue = 0;
          }

          updatedValue = currentValue - 1;
          foundItem.value = updatedValue;
        } else {
          console.log("No matching item found.");
        }
      }

      const data = {
        device_id: infoReqBtn.device_Id,
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
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
        }
      } catch (error) {
        if (error.status === 422) {
          toast.error(error.response.data.data);
        } else {
          console.log(error);
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
        infoReqBtn.device_Id === null ||
        !sendRequest
      )
        return;

      const data = {
        device_id: infoReqBtn.device_Id,
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
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);

          const registers = JSON.parse(localStorage.getItem("registers")) || [];

          const updatedRegisters = registers.map((item) =>
            item.id === id ? { ...item, title: response.data.data.value } : item
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
          : item
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
          : item
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
          : item
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
          : item
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
      onClick={indexType === "button" ? handleClick : undefined}
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
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const startRange = Number(infoReqBtn.startRange);
                  const endRange = Number(infoReqBtn.endRange);
                  if (
                    isNaN(newTitle) ||
                    newTitle < startRange ||
                    newTitle > endRange
                  ) {
                    toast.error(
                      `Value must be between ${startRange} and ${endRange}`
                    );
                    return;
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
