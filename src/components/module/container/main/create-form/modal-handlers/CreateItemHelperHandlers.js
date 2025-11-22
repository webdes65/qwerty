import { setItems } from "@redux_toolkit/features/itemsSlice.js";

export default function CreateItemHelperHandlers({
  selectedDeviceId,
  uuidv4,
  selectDevice,
  labelBetData,
  buttonBetData,
  items,
  dispatch,
  setSelectedDeviceId,
  setSelectDevice,
  setIsOpenCreateModal,
  setLabelBetData,
  setButtonBetData,
}) {
  const initialValues = {
    title: "",
    titlebtn: "",
    width: 80,
    height: 80,
    type: "text input",
    path: "",
    temp: "",
    typeTitleTextInput: "string",
    typeDataRegister: "",
    numberBits: "",
    permissionDisplayData: true,
    backgroundColor: "#ffffff",
    backgroundColorBooleanTrue: "",
    backgroundColorBooleanFalse: "",
    backgroundColorBinaryZero: "",
    backgroundColorBinaryOne: "",
    backgroundImage: "",
    backgroundImageBooleanTrue: "",
    backgroundImageBooleanFalse: "",
    backgroundImageBinaryZero: "",
    backgroundImageBinaryOne: "",
    hideIfOne: false,
    hideIfZero: false,
    idForm: "",
    typeDisplay: "",
    borderColor: "#000",
    borderWidth: 0,
    borderTopContainer: 0,
    borderButtomContainer: 0,
    borderLeftContainer: 0,
    borderRightContainer: 0,
    point: {
      name: "",
      width: 15,
      height: 15,
      bg: "#000",
      borderColor: "#000",
    },
    infoReqBtn: {
      value: "",
      title: "",
      device_uuid: "",
      register_id: "",
      startRange: "",
      endRange: "",
      singleIncrease: false,
      singleReduction: false,
    },
  };

  const handleSubmit = (values) => {
    const newItem = {
      id: uuidv4(),
      title: values.title,
      titlebtn: values.titlebtn,
      borderColor: values.borderColor,
      borderWidth: values.borderWidth,
      width: values.width,
      height: values.height,
      type: values.type,
      path: values.path,
      position: { x: 0, y: 0 },
      opacity: 1,
      rounded: 0,
      temp: values.temp,
      fontSize: "1",
      textColor: "#000000",
      fontFamily: "DS-Digital",
      typeTitleTextInput: values.typeTitleTextInput,
      decimalPlaces: 6,
      rotation: 0,
      numberBits: values.numberBits,
      permissionDisplayData: values.permissionDisplayData,
      backgroundColor: values.backgroundColor,
      backgroundColorBooleanTrue: values.backgroundColorBooleanTrue,
      backgroundColorBooleanFalse: values.backgroundColorBooleanFalse,
      backgroundColorBinaryZero: values.backgroundColorBinaryZero,
      backgroundColorBinaryOne: values.backgroundColorBinaryOne,
      backgroundImage: values.backgroundImage,
      backgroundImageBooleanTrue: values.backgroundImageBooleanTrue,
      backgroundImageBooleanFalse: values.backgroundImageBooleanFalse,
      backgroundImageBinaryZero: values.backgroundImageBinaryZero,
      backgroundImageBinaryOne: values.backgroundImageBinaryOne,
      typeDataRegister: values.typeDataRegister,
      hideIfZero: values.hideIfZero,
      hideIfOne: values.hideIfOne,
      idForm: values.idForm,
      typeDisplay: values.typeDisplay,
      infoReqBtn: {
        ...values.infoReqBtn,
        device_uuid: selectedDeviceId,
      },
      point: {
        name: values.point?.name,
        width: values.point.width,
        height: values.point.height,
        bg: values.point.bg,
        borderColor: values.point.borderColor,
      },
      selectDevice,
    };

    let FieldComparison = {};

    if (values.type === "label") {
      FieldComparison =
        labelBetData.betList.length > 0 ? { ...labelBetData.betList } : {};
    } else if (values.type === "button") {
      FieldComparison =
        buttonBetData.betList.length > 0 ? { ...buttonBetData.betList } : {};
    }

    const finalItem = { ...newItem, FieldComparison };

    const updatedItems = [...items, finalItem];
    dispatch(setItems(updatedItems));

    localStorage.setItem("registers", JSON.stringify(updatedItems));
    setSelectedDeviceId(null);
    setSelectDevice(false);
    setIsOpenCreateModal(false);

    if (values.type === "label") {
      setLabelBetData({
        bet: "",
        betList: [],
      });
    } else if (values.type === "button") {
      setButtonBetData({
        bet: "",
        betList: [],
      });
    }
  };

  return { initialValues, handleSubmit };
}
