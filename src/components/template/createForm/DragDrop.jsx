import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EditItemModal from "@module/modal/EditItemModal";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import EditLine from "@module/modal/EditLine";
import DraggablePoint from "@module/draggableBox/createComponent/DraggablePoint";
import DraggableBoxItem from "@module/draggableBox/createForm/DraggableBoxItem";
import DraggableBoxComponent from "@module/draggableBox/createForm/DraggableBoxComponent";
import DropBox from "@template/createForm/DropBox.jsx";

const DragDrop = ({
  boxInfo,
  componentsList,
  setComponentsList,
  points,
  setPoints,
  itemAbility,
}) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [topZIndex, setTopZIndex] = useState(10);
  const [activeItemId, setActiveItemId] = useState(null);

  const xRef = useRef("");

  const [lines, setLines] = useState([]);
  const [lineInfo, setLineInfo] = useState({
    color: "",
    width: "",
    index: "",
  });
  const [isOpenEditLineModal, setIsOpenEditLineModal] = useState(false);
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dragdrop-container relative h-full w-full flex flex-col gap-10 justify-center items-center">
        <DropBox
          boxInfo={boxInfo}
          onDrop={handleDrop}
          onDropCom={handleDropCom}
          onDropPoint={handleDropPoint}
        >
          {items.map((item, index) => (
            <DraggableBoxItem
              key={index}
              index={index}
              title={item.title}
              items={items}
              itemAbility={itemAbility}
              onClick={() => handleOpenEditModal(index)}
              onChangeTitle={handleTitleChange}
              id={item.id}
              backgroundImage={item.backgroundImage}
              backgroundColorBooleanTrue={item.backgroundColorBooleanTrue}
              backgroundColorBooleanFalse={item.backgroundColorBooleanFalse}
              width={item.width}
              height={item.height}
              onDrop={handleDrop}
              opacity={item.opacity}
              rounded={item.rounded}
              position={item.position}
              indexType={item.type}
              idRegister={item.temp}
              fontSize={item.fontSize}
              textColor={item.textColor}
              fontFamily={item.fontFamily}
              decimalPlaces={item.decimalPlaces}
              titlebtn={item.titlebtn}
              backgroundColor={item.backgroundColor}
              borderColor={item.borderColor}
              borderWidth={item.borderWidth}
              rotation={item.rotation}
              permissionDisplayData={item.permissionDisplayData}
              backgroundImageBooleanFalse={item.backgroundImageBooleanFalse}
              backgroundImageBooleanTrue={item.backgroundImageBooleanTrue}
              typeDataRegister={item.typeDataRegister}
              numberBits={item.numberBits}
              backgroundColorBinaryZero={item.backgroundColorBinaryZero}
              backgroundColorBinaryOne={item.backgroundColorBinaryOne}
              backgroundImageBinaryZero={item.backgroundImageBinaryZero}
              backgroundImageBinaryOne={item.backgroundImageBinaryOne}
              hideIfZero={item.hideIfZero}
              hideIfOne={item.hideIfOne}
              FieldComparison={item.FieldComparison}
              path={item.path}
              idForm={item.idForm}
              typeDisplay={item.typeDisplay}
              infoReqBtn={item.infoReqBtn}
              selectDevice={item.selectDevice}
              activeItemId={activeItemId}
              setActiveItemId={setActiveItemId}
              setTopZIndex={setTopZIndex}
              topZIndex={topZIndex}
            />
          ))}

          {componentsList.map((item, index) => (
            <DraggableBoxComponent
              onDrop={handleDropCom}
              key={index}
              index={index}
              item={item}
              componentsList={componentsList}
              setComponentsList={setComponentsList}
              lines={lines}
              setLines={setLines}
              points={points}
              setPoints={setPoints}
            />
          ))}
          {points.map((point, index) => (
            <DraggablePoint
              key={index}
              index={index}
              onDrop={handleDropPoint}
              point={point}
              lines={lines}
              setLines={setLines}
              points={points}
              setPoints={setPoints}
            />
          ))}
          {lines.map(([point1, point2, lineInfo]) => {
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
                  data-line-index={lineId}
                  markerStart={`url(#arrow-start-${lineId})`}
                  markerEnd={`url(#arrow-end-${lineId})`}
                  onClick={handleLineClick}
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
      {isOpenEditModal && selectedItem && (
        <EditItemModal
          item={selectedItem}
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={() => setIsOpenEditModal(false)}
          onSave={(updatedItem) => {
            const updatedItems = items.map((item, i) =>
              i === selectedItem.index ? updatedItem : item,
            );
            dispatch(setItems(updatedItems));
            setIsOpenEditModal(false);
          }}
        />
      )}
    </DndProvider>
  );
};

export default DragDrop;
