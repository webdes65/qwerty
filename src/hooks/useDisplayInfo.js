import { useEffect, useState } from "react";

const useDisplayInfo = (registers, item) => {
  const [info, setInfo] = useState("--");
  const [displayItem, setDisplayItem] = useState(true);

  useEffect(() => {
    displayInfo();
  }, [
    registers,
    item.idRegister,
    item.numberBits,
    item.hideIfZero,
    item.hideIfOne,
    item.decimalPlaces,
  ]);

  const displayInfo = () => {
    const tempObj = registers.find((reg) => reg.id === item.idRegister);

    if (!tempObj) {
      setInfo("--");
      return;
    }

    const typeHandlers = {
      int: () => setInfo(tempObj.value),

      float: () => {
        const result = parseFloat(tempObj.value).toFixed(item.decimalPlaces);
        setInfo(result);
      },

      bool: () => setInfo(String(tempObj.value)),

      string: () => setInfo(tempObj.value),

      binary: () => {
        if (!tempObj.value) {
          setInfo("--");
          return;
        }

        const value =
          typeof tempObj.value === "string"
            ? Number(tempObj.value)
            : tempObj.value;

        const binaryValue = value.toString(2);
        const bit = binaryValue[binaryValue.length - item.numberBits];

        if (
          (item.hideIfZero && bit === "0") ||
          (item.hideIfOne && bit === "1")
        ) {
          setDisplayItem(false);
        } else {
          setDisplayItem(true);
        }

        setInfo(bit);
      },
    };

    const handler = typeHandlers[tempObj.type];
    if (handler) {
      handler();
    } else {
      setInfo("--");
    }
  };

  return { info, displayItem, setInfo, setDisplayItem };
};

export default useDisplayInfo;
