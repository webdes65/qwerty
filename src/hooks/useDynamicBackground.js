import { useEffect, useState } from "react";

const useDynamicBackground = (registers, item) => {
  const [bgColor, setBgColor] = useState("");
  const [bgImg, setBgImg] = useState("");

  const hexToRgba = (hex, alpha = 1) => {
    if (!hex) return "";
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getBinaryBit = (tempObj) => {
    const value =
      typeof tempObj.value === "string" ? Number(tempObj.value) : tempObj.value;
    const binaryValue = value.toString(2);
    return binaryValue[binaryValue.length - item.numberBits];
  };

  useEffect(() => {
    const tempObj = registers.find((reg) => reg.id === item.idRegister);
    const alpha = item.opacity;

    if (!tempObj) {
      if (item.backgroundColor) {
        setBgColor(hexToRgba(item.backgroundColor, alpha));
      }
      return;
    }

    const colorHandlers = {
      bool: () => {
        const color = tempObj.value
          ? item.backgroundColorBooleanTrue
          : item.backgroundColorBooleanFalse;
        return hexToRgba(color, alpha);
      },

      binary: () => {
        const bit = getBinaryBit(tempObj);
        const color =
          bit === "1"
            ? item.backgroundColorBinaryOne
            : item.backgroundColorBinaryZero;
        return hexToRgba(color, alpha);
      },

      default: () => hexToRgba(item.backgroundColor, alpha),
    };

    const handler = colorHandlers[tempObj.type] || colorHandlers.default;
    setBgColor(handler());
  }, [
    registers,
    item.idRegister,
    item.backgroundColor,
    item.backgroundColorBooleanTrue,
    item.backgroundColorBooleanFalse,
    item.backgroundColorBinaryZero,
    item.backgroundColorBinaryOne,
    item.opacity,
  ]);

  useEffect(() => {
    const tempObj = registers.find((reg) => reg.id === item.idRegister);

    if (!tempObj) {
      if (item.backgroundImage) {
        setBgImg(item.backgroundImage);
      }
      return;
    }

    const imageHandlers = {
      bool: () =>
        tempObj.value
          ? item.backgroundImageBooleanTrue
          : item.backgroundImageBooleanFalse,

      binary: () => {
        const bit = getBinaryBit(tempObj);
        return bit === "1"
          ? item.backgroundImageBinaryOne
          : item.backgroundImageBinaryZero;
      },

      default: () => item.backgroundImage,
    };

    const handler = imageHandlers[tempObj.type] || imageHandlers.default;
    const result = handler();

    if (result) {
      setBgImg(result);
    }
  }, [
    registers,
    item.idRegister,
    item.typeDataRegister,
    item.backgroundImage,
    item.backgroundImageBooleanTrue,
    item.backgroundImageBooleanFalse,
    item.backgroundImageBinaryZero,
    item.backgroundImageBinaryOne,
  ]);

  return {
    bgColor,
    bgImg,
    setBgColor,
    setBgImg,
  };
};

export default useDynamicBackground;
