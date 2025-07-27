import { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { TiDelete } from "react-icons/ti";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const ItemType = {
  BOX_COM: "box_com",
};

const DraggableBoxComponent = ({
  item,
  index,
  componentsList,
  setComponentsList,
  lines,
  setLines,
  points,
  setPoints,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.BOX_COM,
    item: { index, type: ItemType.BOX_COM },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const contentRef = useRef(null);
  const showBtnDeleteItem = useSelector((state) => state.showBtnDeleteItem);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (item) {
      setContent(item.content);
    }
  }, [item]);

  useEffect(() => {
    if (contentRef.current) {
      const dropBoxElement = contentRef.current.querySelector("#dropBox");

      if (dropBoxElement) {
        dropBoxElement.style.backgroundColor = "transparent";
        dropBoxElement.style.display = "inline-block";
        dropBoxElement.style.position = "relative";
      }

      const pointElements = contentRef.current.querySelectorAll("#point");

      const handleDoubleClick = (event) => {
        const pointElement = event.target;

        const pointRect = pointElement.getBoundingClientRect();
        const dropBoxRect = dropBoxElement.getBoundingClientRect();

        const updatedPositionX = pointRect.left - dropBoxRect.left + 12;
        const updatedPositionY = pointRect.top - dropBoxRect.top + 10;

        const { id, name, width, height, bg, borderRadius } =
          pointElement.dataset;

        const pointData = {
          type: "point",
          id,
          name,
          width: Number(width),
          height: Number(height),
          bg,
          borderRadius: Number(borderRadius),
          position: {
            x: Number(updatedPositionX),
            y: Number(updatedPositionY),
          },
        };

        // setPoints((prevPoints) => {
        //   const isPointExists = prevPoints.some((point) => point.id === pointData.id);

        //   if (isPointExists) {
        //     return prevPoints;
        //   }

        //   return [...prevPoints, pointData];
        // });

        setLines((prevLines) => {
          const isPointAlreadyInLine = prevLines.some((line) =>
            line.some((item) => item.id === pointData.id)
          );

          if (isPointAlreadyInLine) {
            toast.info("Please select a different point");
            return prevLines;
          }

          if (
            prevLines.length === 0 ||
            prevLines[prevLines.length - 1].length === 3
          ) {
            return [...prevLines, [pointData]];
          } else {
            const updatedLines = [...prevLines];
            updatedLines[updatedLines.length - 1].push(pointData);

            if (updatedLines[updatedLines.length - 1].length === 2) {
              updatedLines[updatedLines.length - 1].push({
                id: uuidv4(),
                color: "#000",
                width: 2,
              });
            }

            return updatedLines;
          }
        });
      };

      pointElements.forEach((point) => {
        point.addEventListener("dblclick", handleDoubleClick);
      });

      return () => {
        pointElements.forEach((point) => {
          point.removeEventListener("dblclick", handleDoubleClick);
        });
      };
    }
  }, [content, points]);

  const handleDelete = (id) => {
    const updatedList = componentsList.filter(
      (component) => component.id !== id
    );
    setComponentsList(updatedList);
  };

  return (
    <div
      ref={drag}
      className="flex flex-col justify-center items-center cursor-move break-all p-2 z-0 relative"
      style={{
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        position: "absolute",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
      {showBtnDeleteItem && (
        <TiDelete
          className="absolute -bottom-3 -right-3 cursor-pointer text-red-500 bg-gray-200 rounded-full shadow p-1 z-50"
          size={28}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
        />
      )}
    </div>
  );
};

export default DraggableBoxComponent;
