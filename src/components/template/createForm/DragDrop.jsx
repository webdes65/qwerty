import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EditItemModal from "@module/modal/EditItemModal";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import EditLine from "@module/modal/EditLine";
import DraggablePoint from "@module/draggableBox/createComponent/DraggablePoint";
import DraggableBoxItem from "@module/draggableBox/createForm/DraggableBoxItem";
import DraggableBoxComponent from "@module/draggableBox/createForm/DraggableBoxComponent";
import DragHandlersOfForm from "@module/container/main/create-form/DragHandlersOfForm.js";
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

  const [lines, setLines] = useState([]);
  const [lineInfo, setLineInfo] = useState({
    color: "",
    width: "",
    index: "",
  });
  const [isOpenEditLineModal, setIsOpenEditLineModal] = useState(false);

  const {
    handleDrop,
    handleDropCom,
    handleDropPoint,
    handleLineClick,
    handleOpenEditModal,
    handleTitleChange,
  } = DragHandlersOfForm({
    lines,
    items,
    dispatch,
    setItems,
    setLines,
    setPoints,
    setLineInfo,
    setSelectedItem,
    setComponentsList,
    setIsOpenEditModal,
    setIsOpenEditLineModal,
  });

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
              item={item}
              items={items}
              itemAbility={itemAbility}
              activeItemId={activeItemId}
              setActiveItemId={setActiveItemId}
              setTopZIndex={setTopZIndex}
              topZIndex={topZIndex}
              onClick={() => handleOpenEditModal(index)}
              onChangeTitle={handleTitleChange}
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
