import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setItems } from "../redux_toolkit/features/itemsSlice";

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

    return Object.keys(defaultBoxInfo).reduce((acc, key) => {
      acc[key] = boxInfoData[key] ?? defaultBoxInfo[key];
      return acc;
    }, {});
  };

  useEffect(() => {
    if (data && id) {
      const filtered = data.data.find((register) => register.uuid === id);
      if (filtered) {
        const parsedObjects = JSON.parse(filtered.objects);
        setBoxInfo(getBoxInfo(parsedObjects.boxInfo));

        localStorage.setItem(
          "registers",
          JSON.stringify(parsedObjects.registers)
        );
        dispatch(setItems(parsedObjects.registers));
        setBtnDisplayStatus(false);
      } else {
        setBtnDisplayStatus(true);
      }
    }

    return () => dispatch(setItems([]));
  }, [data, id, dispatch, setBoxInfo, setBtnDisplayStatus]);
};

export default useFormData;
