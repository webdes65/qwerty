import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { useEffect, useRef, useState } from "react";

const ItemType = {
  BOX: "box",
  BOX_COM: "box_com",
  POINT: "point",
};

const DropBox = ({ boxInfo, onDrop, onDropCom, children, onDropPoint }) => {
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");
  const realtimeService = useSelector((state) => state.realtimeService);
  const dropBoxRef = useRef(null);
  const [scaleRatio, setScaleRatio] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (dropBoxRef.current) {
        const containerWidth =
          dropBoxRef.current.parentElement?.clientWidth || boxInfo.width;
        const ratio = Math.min(1, containerWidth / boxInfo.width);
        setScaleRatio(ratio);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [boxInfo.width]);

  const [, drop] = useDrop(() => ({
    accept: [ItemType.BOX, ItemType.BOX_COM, ItemType.POINT],
    drop: (item, monitor) => {
      const initialClientOffset = monitor.getInitialClientOffset();
      const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
      const clientOffset = monitor.getClientOffset();

      const dropBoxBounds = dropBoxRef.current
        ? dropBoxRef.current.getBoundingClientRect()
        : { left: 0, top: 0 };

      const offsetX = initialClientOffset.x - initialSourceClientOffset.x;
      const offsetY = initialClientOffset.y - initialSourceClientOffset.y;

      let newLeft = Math.round(
        (clientOffset.x - dropBoxBounds.left - offsetX) / scaleRatio,
      );
      let newTop = Math.round(
        (clientOffset.y - dropBoxBounds.top - offsetY) / scaleRatio,
      );

      const elementWidth = 50;
      const elementHeight = 50;

      const maxLeft = boxInfo.width - elementWidth;
      const maxTop = boxInfo.height - elementHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      if (
        newLeft < 0 ||
        newLeft > boxInfo.width ||
        newTop < 0 ||
        newTop > boxInfo.height
      ) {
        return;
      }

      if (item.type === ItemType.BOX) {
        onDrop(item.index, { x: newLeft, y: newTop });
      } else if (item.type === ItemType.BOX_COM) {
        onDropCom(item.index, { x: newLeft, y: newTop });
      } else if (item.type === ItemType.POINT) {
        onDropPoint(item.index, { x: newLeft, y: newTop });
      }
    },
  }));

  const combinedRef = (el) => {
    drop(el);
    dropBoxRef.current = el;
  };

  const rgbaMatch = boxInfo.bgColor.match(
    /^rgba?\((\d+), (\d+), (\d+), (\d?\.?\d+)\)$/,
  );

  let newBackgroundColor = boxInfo.bgColor;

  if (rgbaMatch) {
    newBackgroundColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${boxInfo.opacity})`;
  } else {
    newBackgroundColor = `rgba(${boxInfo.bgColor}, ${boxInfo.opacity})`;
  }

  return (
    <div
      style={{
        backgroundColor: newBackgroundColor,
        backgroundImage: boxInfo.bgImg ? `url(${boxInfo.bgImg})` : "none",
        borderStyle: "solid",
        boxSizing: "border-box",
        borderWidth: `${boxInfo.borderTop}px ${boxInfo.borderRight}px ${boxInfo.borderBottom}px ${boxInfo.borderLeft}px`,
        borderRadius: `${boxInfo.borderRadius}%`,
        borderColor: boxInfo.borderColor,
        overflow: "hidden",
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id="dropBox"
        ref={combinedRef}
        style={{
          width: `${boxInfo.width}px`,
          height: `${boxInfo.height}px`,
          transform: `scale(${scaleRatio})`,
          transformOrigin: "center center",
          minWidth: `${boxInfo.width}px`,
          minHeight: `${boxInfo.height}px`,
        }}
        className="relative flex items-center justify-center bg-cover"
        data-token={token}
        data-typeservice={realtimeService}
      >
        {children}
      </div>
    </div>
  );
};

export default DropBox;
