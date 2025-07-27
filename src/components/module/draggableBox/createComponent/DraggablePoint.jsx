import { useDrag } from "react-dnd";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { TiDelete } from "react-icons/ti";
import { useSelector } from "react-redux";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import EditPointModalInRegisEditor from "../../modal/EditPointModalInRegisEditor";

const ItemType = {
  POINT: "point",
};

const DraggablePoint = ({
  index,
  point,
  onDrop,
  lines,
  setLines,
  points,
  setPoints,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.POINT,
    item: { index, type: ItemType.POINT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const editEnabled = useSelector((state) => state.editEnabled);
  const showBtnDeleteItem = useSelector((state) => state.showBtnDeleteItem);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const handleDoubleClick = (point) => {
    if (point.type === "point") {
      const isPointAlreadyAdded = lines.some((line) =>
        line.some((item) => item.id === point.id)
      );

      if (isPointAlreadyAdded) {
        toast.info("Please select a different point");
        return;
      }

      if (lines.length === 0 || lines[lines.length - 1].length === 3) {
        setLines([...lines, [point]]);
      } else {
        const updatedLines = [...lines];
        updatedLines[updatedLines.length - 1].push(point);

        if (updatedLines[updatedLines.length - 1].length === 2) {
          updatedLines[updatedLines.length - 1].push({
            id: uuidv4(),
            color: "#000",
            width: 2,
          });
        }
        setLines(updatedLines);
      }
    }
  };

  const handleDelete = (pointId) => {
    const updatedPoints = points.filter((p) => p.id !== pointId);
    setPoints(updatedPoints);

    const updatedLines = lines
      .map((line) => line.filter((item) => item.id !== pointId))
      .filter((line) => line.length > 0);

    setLines(updatedLines);

    toast.success("Point removed successfully!");
  };

  return (
    <div
      ref={drag}
      className="rounded-full cursor-move"
      onDoubleClick={() => handleDoubleClick(point)}
      style={{
        width: point.width,
        height: point.height,
        position: "absolute",
        left: `${point.position.x - 4}px`,
        top: `${point.position.y - 4}px`,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: point.bg,
      }}
    >
      {showBtnDeleteItem && (
        <TiDelete
          className="absolute -bottom-3 -right-3 cursor-pointer text-red-500 bg-gray-200 rounded-full shadow p-1 z-50"
          size={28}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(point.id);
          }}
        />
      )}
      {editEnabled && (
        <IoMdSettings
          className="absolute -bottom-2 -left-2 cursor-pointer text-black bg-gray-200 rounded-full shadow p-1 z-50"
          size={24}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpenEditModal(true);
          }}
        />
      )}
      <EditPointModalInRegisEditor
        isOpenEditModal={isOpenEditModal}
        setIsOpenEditModal={setIsOpenEditModal}
        item={point}
        items={points}
        setPoints={setPoints}
      />
    </div>
  );
};

export default DraggablePoint;
