import { toast } from "react-toastify";

export default function DraggableHelperHandlersOfForm({
  dispatch,
  index,
  setItems,
  item,
  items,
  setIsEditing,
  onChangeTitle,
  newTitle,
  setSendRequest,
}) {
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

  const handleInputSubmit = (e) => {
    if (e.key !== "Enter") return;

    const startRange = Number(item.infoReqBtn?.startRange);
    const endRange = Number(item.infoReqBtn?.endRange);

    const hasRange =
      item.infoReqBtn?.startRange !== undefined &&
      item.infoReqBtn?.startRange !== null &&
      item.infoReqBtn?.startRange !== "" &&
      item.infoReqBtn?.endRange !== undefined &&
      item.infoReqBtn?.endRange !== null &&
      item.infoReqBtn?.endRange !== "";

    if (hasRange) {
      const numValue = Number(newTitle);
      if (isNaN(numValue) || numValue < startRange || numValue > endRange) {
        toast.error(`Value must be between ${startRange} and ${endRange}`);
        return;
      }
    }

    setIsEditing(false);
    onChangeTitle(index, newTitle);
    setSendRequest(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const updatedItems = items.filter((i) => i.id !== item.id);
    dispatch(setItems(updatedItems));
    localStorage.setItem("registers", JSON.stringify(updatedItems));
  };

  return {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    handleInputSubmit,
    handleDelete,
  };
}
