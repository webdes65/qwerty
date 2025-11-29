import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";

export default function DragHandlersOfComponents({
  isFixed,
  setBlinkingItemId,
  lines,
  setLines,
  setIsOpenEditLineModal,
}) {
  const dispatch = useDispatch();

  const [lineInfo, setLineInfo] = useState({
    color: "",
    width: "",
    index: "",
  });
  const [movedItem, setMovedItem] = useState(null);

  const isFixedRef = useRef(isFixed);

  useEffect(() => {
    isFixedRef.current = isFixed;
  }, [isFixed]);

  const handleDoubleClick = (point) => {
    if (point.type === "point") {
      setBlinkingItemId(point.id);

      setTimeout(() => {
        setBlinkingItemId(null);
      }, 3000);

      const isPointAlreadyAdded = lines.some((line) =>
        line.some((item) => item.uuid === point.uuid),
      );

      if (isPointAlreadyAdded) {
        toast.info("Please select the second point");
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

  const handleLineClick = (e) => {
    const clickedLine = e.target;
    const style = getComputedStyle(clickedLine);
    const strokeColor = style.stroke;
    const strokeWidth = style.strokeWidth;
    const strokeWidthValue = parseInt(strokeWidth, 10);

    const lineIndex = e.target.getAttribute("data-line-index");

    setLineInfo({
      color: strokeColor,
      strokeWidth: strokeWidthValue,
      index: lineIndex,
    });

    setIsOpenEditLineModal(true);
  };

  const handleDrop = (index, newPosition) => {
    dispatch((dispatch, getState) => {
      const { components } = getState();
      const boardItem = components.find((item) => item.type === "board");
      const oldPosition = boardItem ? boardItem.position : null;

      let updatedComponents = components.map((item, i) =>
        i === index ? { ...item, position: newPosition } : item,
      );

      const updatedItem = updatedComponents[index];

      let movedItems;

      if (updatedItem.type === "board" && isFixedRef.current) {
        const newBoardPosition = { x: newPosition.x, y: newPosition.y };
        const deltaX = newBoardPosition.x - oldPosition.x;
        const deltaY = newBoardPosition.y - oldPosition.y;

        const relatedPoints = components.filter(
          (point) => point.type === "point" && point.boardId === updatedItem.id,
        );

        const updatedPoints = relatedPoints.map((point) => ({
          ...point,
          position: {
            x: point.position.x + deltaX,
            y: point.position.y + deltaY,
          },
        }));

        movedItems = [...updatedPoints];

        updatedComponents = updatedComponents.map((item) => {
          const updatedPoint = updatedPoints.find((p) => p.id === item.id);
          return updatedPoint ? updatedPoint : item;
        });
      } else {
        movedItems = [updatedItem];
      }

      dispatch(setComponents(updatedComponents));
      setMovedItem(movedItems);
    });
  };

  useEffect(() => {
    if (!movedItem || movedItem.length === 0) return;

    const movedPoints = Array.isArray(movedItem) ? movedItem : [movedItem];

    setLines((prevLines) => {
      return prevLines.map(([point1, point2, lineProperties]) => {
        const updatedPoint1 = { ...point1 };
        const updatedPoint2 = { ...point2 };

        const foundPoint1 = movedPoints.find((p) => p.id === updatedPoint1.id);
        if (foundPoint1) {
          updatedPoint1.position = { ...foundPoint1.position };
        }

        const foundPoint2 = movedPoints.find((p) => p.id === updatedPoint2.id);
        if (foundPoint2) {
          updatedPoint2.position = { ...foundPoint2.position };
        }

        return [updatedPoint1, updatedPoint2, lineProperties];
      });
    });
  }, [movedItem]);

  return { lineInfo, handleDoubleClick, handleLineClick, handleDrop };
}
