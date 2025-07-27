import { useEffect, useRef, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import DraggableBoxComponent from "../../module/draggableBox/createComponent/DraggableBoxComponent";
import { setComponents } from "../../../redux_toolkit/features/componentsSlice";
import { toast } from "react-toastify";
import EditLine from "../../module/modal/EditLine";
import { v4 as uuidv4 } from "uuid";

const ItemType = {
  BOX: "box",
};

const DropBox = ({ onDrop, children, containerSize }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType.BOX,
    drop: (item, monitor) => {
      const initialClientOffset = monitor.getInitialClientOffset();
      const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
      const clientOffset = monitor.getClientOffset();

      if (!initialClientOffset || !initialSourceClientOffset || !clientOffset)
        return;

      const dropBoxBounds = document
        .getElementById("dropBox")
        ?.getBoundingClientRect() || { left: 0, top: 0 };

      const offsetX = initialClientOffset.x - initialSourceClientOffset.x;
      const offsetY = initialClientOffset.y - initialSourceClientOffset.y;

      const newLeft = Math.round(clientOffset.x - dropBoxBounds.left - offsetX);
      const newTop = Math.round(clientOffset.y - dropBoxBounds.top - offsetY);

      onDrop(item.index, { x: newLeft, y: newTop });
    },
  }));

  return (
    <div
      id="dropBox"
      ref={drop}
      style={{
        width: `${containerSize.width}px`,
        height: `${containerSize.height}px`,
        backgroundColor: "#b3b3b3",
        position: "relative",
        borderRadius: "20px",
      }}
      className="relative flex items-center justify-center bg-cover"
    >
      {children}
    </div>
  );
};

const DragDrop = ({
  dropBoxRef,
  lines,
  setLines,
  isFixed,
  containerSize,
  itemAbility,
}) => {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.components);

  const [movedItem, setMovedItem] = useState(null);
  const [blinkingItemId, setBlinkingItemId] = useState(null);
  const [isOpenEditLineModal, setIsOpenEditLineModal] = useState(false);
  const [lineInfo, setLineInfo] = useState({
    color: "",
    width: "",
    index: "",
  });

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
        line.some((item) => item.id === point.id)
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
        i === index ? { ...item, position: newPosition } : item
      );

      const updatedItem = updatedComponents[index];

      let movedItems = [];

      if (updatedItem.type === "board" && isFixedRef.current) {
        const newBoardPosition = { x: newPosition.x, y: newPosition.y };
        const deltaX = newBoardPosition.x - oldPosition.x;
        const deltaY = newBoardPosition.y - oldPosition.y;

        const relatedPoints = components.filter(
          (point) => point.type === "point" && point.boardId === updatedItem.id
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={dropBoxRef}
        className="dragdrop-container relative h-full w-full flex flex-col gap-10 justify-center items-center"
      >
        <DropBox onDrop={handleDrop} containerSize={containerSize}>
          {components.map((item, index) => (
            <DraggableBoxComponent
              key={index}
              index={index}
              item={item}
              onDrop={handleDrop}
              onDoubleClick={() => handleDoubleClick(item)}
              isBlinking={blinkingItemId === item.id}
              isFixed={isFixed}
              itemAbility={itemAbility}
            />
          ))}

          {lines.map(([point1, point2, lineInfo], index) => {
            if (!point1 || !point2 || !point1.position || !point2.position)
              return null;

            const lineColor = lineInfo?.color;
            const lineWidth = lineInfo?.width;
            const lineId = lineInfo?.id;

            const isVertical =
              Math.abs(point1.position.x - point2.position.x) <= 10;

            return (
              <svg
                key={lineId}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 20,
                  pointerEvents: "none",
                  height: "100%",
                  width: "100%",
                }}
              >
                <defs>
                  <marker
                    id={`arrow-start-${lineId}`}
                    viewBox="0 0 10 10"
                    refX="-10"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <polygon points="0,0 10,5 0,10" fill={lineColor} />
                  </marker>

                  <marker
                    id={`arrow-end-${lineId}`}
                    viewBox="0 0 10 10"
                    refX="20"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <polygon points="0,0 10,5 0,10" fill={lineColor} />
                  </marker>
                </defs>
                <polyline
                  points={
                    isVertical
                      ? `
                      ${point1.position.x},${point1.position.y}
                      ${point1.position.x - 50},${point1.position.y}
                      ${point1.position.x - 50},${point2.position.y}
                      ${point2.position.x},${point2.position.y}
                    `
                      : `
                    ${point1.position.x},${point1.position.y}
                    ${point1.position.x},${point1.position.y + 40}
                    ${point2.position.x},${point2.position.y + 40}
                    ${point2.position.x},${point2.position.y}
                    `
                  }
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  style={{ pointerEvents: "auto" }}
                  onClick={handleLineClick}
                  data-line-index={lineId}
                  markerStart={`url(#arrow-start-${lineId})`}
                  markerEnd={`url(#arrow-end-${lineId})`}
                />
              </svg>
            );
          })}
        </DropBox>
      </div>
      {isOpenEditLineModal && (
        <EditLine
          isOpenEditLineModal={isOpenEditLineModal}
          setIsOpenEditLineModal={setIsOpenEditLineModal}
          lineInfo={lineInfo}
          lines={lines}
          setLines={setLines}
        />
      )}
    </DndProvider>
  );
};

export default DragDrop;
