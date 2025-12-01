import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

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
  const outerContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({
    width: boxInfo.width,
    height: boxInfo.height,
  });

  useEffect(() => {
    if (dropBoxRef.current) {
      dropBoxRef.current.style.transform = "none";
    }
  }, [boxInfo]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isCurrentlyMobile = window.innerWidth <= 1540;
      setIsMobile(isCurrentlyMobile);

      if (isCurrentlyMobile && outerContainerRef.current) {
        const parentElement = outerContainerRef.current.parentElement;
        if (parentElement) {
          const availableWidth = parentElement.clientWidth - 32;
          const availableHeight = window.innerHeight - 200;

          const finalWidth = Math.min(boxInfo.width, availableWidth);
          const finalHeight = Math.min(boxInfo.height, availableHeight);

          setContainerDimensions({
            width: finalWidth,
            height: finalHeight,
          });
        }
      } else {
        setContainerDimensions({
          width: boxInfo.width,
          height: boxInfo.height,
        });
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const resizeObserver = new ResizeObserver(checkScreenSize);
    if (outerContainerRef.current?.parentElement) {
      resizeObserver.observe(outerContainerRef.current.parentElement);
    }

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      resizeObserver.disconnect();
    };
  }, [boxInfo.width, boxInfo.height]);

  const [, drop] = useDrop(
    () => ({
      accept: [ItemType.BOX, ItemType.BOX_COM, ItemType.POINT],
      drop: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        const dropBoxBounds = dropBoxRef.current?.getBoundingClientRect();

        if (!clientOffset || !dropBoxBounds) return;

        let newLeft = Math.round(clientOffset.x - dropBoxBounds.left);
        let newTop = Math.round(clientOffset.y - dropBoxBounds.top);

        const elementWidth = item.width || 50;
        const elementHeight = item.height || 50;

        newLeft = newLeft - elementWidth / 2;
        newTop = newTop - elementHeight / 2;

        const maxLeft =
          (isMobile ? containerDimensions.width : boxInfo.width) - elementWidth;
        const maxTop =
          (isMobile ? containerDimensions.height : boxInfo.height) -
          elementHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        if (item.type === ItemType.BOX) {
          onDrop(item.index, { x: newLeft, y: newTop });
        } else if (item.type === ItemType.BOX_COM) {
          onDropCom(item.index, { x: newLeft, y: newTop });
        } else if (item.type === ItemType.POINT) {
          onDropPoint(item.index, { x: newLeft, y: newTop });
        }
      },
    }),
    [isMobile, containerDimensions, boxInfo.width, boxInfo.height],
  );

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

  const needsScroll =
    containerDimensions.width < boxInfo.width ||
    containerDimensions.height < boxInfo.height;

  return (
    <div
      ref={outerContainerRef}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "16px",
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderStyle: "solid",
          boxSizing: "border-box",
          borderWidth: `${boxInfo.borderTop}px ${boxInfo.borderRight}px ${boxInfo.borderBottom}px ${boxInfo.borderLeft}px`,
          borderRadius: `${boxInfo.borderRadius}%`,
          borderColor: boxInfo.borderColor,
          overflow: needsScroll ? "auto" : "hidden",
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`,
          maxWidth: "100%",
          position: "relative",
        }}
      >
        <div
          id="dropBox"
          ref={combinedRef}
          style={{
            backgroundColor: newBackgroundColor,
            backgroundImage: boxInfo.bgImg ? `url(${boxInfo.bgImg})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: `${boxInfo.width}px`,
            height: `${boxInfo.height}px`,
            minWidth: `${boxInfo.width}px`,
            minHeight: `${boxInfo.height}px`,
            position: "relative",
          }}
          className="bg-cover"
          data-token={token}
          data-typeservice={realtimeService}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DropBox;
