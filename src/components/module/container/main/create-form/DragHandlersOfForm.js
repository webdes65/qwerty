import { useEffect, useRef, useState } from "react";

export default function DragHandlersOfForm({
  lines,
  dispatch,
  setItems,
  setSelectedItem,
  items,
  setIsOpenEditModal,
  setComponentsList,
  setPoints,
  setLines,
  setLineInfo,
  setIsOpenEditLineModal,
}) {
  const xRef = useRef("");

  const [movedItem, setMovedItem] = useState(null);

  useEffect(() => {
    xRef.current = lines;
  }, [lines]);

  useEffect(() => {
    const savedPositions = JSON.parse(localStorage.getItem("registers"));
    if (savedPositions) {
      dispatch(setItems(savedPositions));
    }
  }, []);

  const handleOpenEditModal = (index) => {
    setSelectedItem(items[index]);
    setIsOpenEditModal(true);
  };

  const handleTitleChange = (index, newTitle) => {
    dispatch((dispatch, getState) => {
      const { items } = getState();
      const updatedItems = items.map((item, i) =>
        i === index ? { ...item, title: newTitle } : item,
      );
      dispatch(setItems(updatedItems));
    });
  };

  const handleDrop = (index, newPosition) => {
    dispatch((dispatch, getState) => {
      const { items } = getState();

      const updatedPositions = items.map((item, i) =>
        i === index ? { ...item, position: newPosition } : item,
      );

      dispatch(setItems(updatedPositions));
      localStorage.setItem("registers", JSON.stringify(updatedPositions));
    });
  };

  const handleDropCom = (index, newPosition) => {
    setComponentsList((prevList) => {
      const updatedComList = [...prevList];
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        updatedComList[index].content,
        "text/html",
      );

      const prevPosition = updatedComList[index].position;

      const points = doc.querySelectorAll("#point");

      const extractedPoints = Array.from(points).map((pointElement) => {
        const pointId = pointElement.getAttribute("data-id");

        const line = xRef.current.find((line) =>
          line.some((item) => item.type === "point" && item.id === pointId),
        );

        const pointData = line
          ? line.find((item) => item.type === "point" && item.id === pointId)
          : null;

        return {
          id: pointId,
          name: pointElement.getAttribute("data-name"),
          width: Number(pointElement.getAttribute("data-width")),
          height: Number(pointElement.getAttribute("data-height")),
          bg: pointElement.getAttribute("data-bg"),
          borderRadius: Number(pointElement.getAttribute("data-border-radius")),
          position: {
            x: pointData?.position?.x,
            y: pointData?.position?.y,
          },
        };
      });

      const deltaX = newPosition.x - prevPosition.x;
      const deltaY = newPosition.y - prevPosition.y;

      const updatedPoints = extractedPoints.map((point) => ({
        ...point,
        position: {
          x: point.position.x + deltaX,
          y: point.position.y + deltaY,
        },
      }));

      setMovedItem(updatedPoints);

      updatedComList[index] = {
        ...updatedComList[index],
        position: newPosition,
      };

      return updatedComList;
    });
  };

  const handleDropPoint = (index, newPosition) => {
    setPoints((prevPoints) => {
      const updatedPoints = [...prevPoints];
      updatedPoints[index] = {
        ...updatedPoints[index],
        position: newPosition,
      };

      setMovedItem(updatedPoints);
      return updatedPoints;
    });
  };

  useEffect(() => {
    if (movedItem && movedItem.length > 0) {
      const updatedLines = lines.map((line) => {
        return line.map((item) => {
          const updatedItem = movedItem.find((m) => m.id === item.id);
          if (updatedItem) {
            return {
              ...item,
              position: updatedItem.position,
            };
          }
          return item;
        });
      });

      setLines(updatedLines);

      setMovedItem([]);
    }
  }, [movedItem]);

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

  return {
    handleOpenEditModal,
    handleTitleChange,
    handleDrop,
    handleDropCom,
    handleDropPoint,
    handleLineClick,
  };
}
