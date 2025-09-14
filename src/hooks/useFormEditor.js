import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setItems } from "@redux_toolkit/features/itemsSlice";

const useFormData = (data, id, setBoxInfo, setBtnDisplayStatus) => {
  const dispatch = useDispatch();

  const getBoxInfo = (boxInfoData) => {
    const defaultBoxInfo = {
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
    };

    if (!boxInfoData || typeof boxInfoData !== "object") {
      return defaultBoxInfo;
    }

    return {
      ...defaultBoxInfo,
      ...boxInfoData,
    };
  };

  useEffect(() => {
    if (!data?.data || !id) {
      dispatch(setItems([]));
      setBtnDisplayStatus(true);
      return;
    }

    try {
      const filtered = data.data.find((register) => register.uuid === id);

      if (!filtered) {
        setBtnDisplayStatus(true);
        dispatch(setItems([]));
        return;
      }

      if (!filtered.objects || typeof filtered.objects !== "string") {
        console.warn("Invalid objects data in filtered register");
        setBtnDisplayStatus(true);
        return;
      }

      const parsedObjects = JSON.parse(filtered.objects);

      if (!parsedObjects || typeof parsedObjects !== "object") {
        console.warn("Parsed objects is not a valid object");
        setBtnDisplayStatus(true);
        return;
      }

      const boxInfoResult = getBoxInfo(parsedObjects.boxInfo);
      setBoxInfo(boxInfoResult);

      const registers = Array.isArray(parsedObjects.registers)
        ? parsedObjects.registers
        : [];

      localStorage.setItem("registers", JSON.stringify(registers));
      dispatch(setItems(registers));
      setBtnDisplayStatus(false);
    } catch (error) {
      console.error("Error parsing form data:", error);
      setBtnDisplayStatus(true);
      dispatch(setItems([]));
    }

    return () => {
      dispatch(setItems([]));
    };
  }, [data, id, dispatch, setBoxInfo, setBtnDisplayStatus]);
};

export default useFormData;
