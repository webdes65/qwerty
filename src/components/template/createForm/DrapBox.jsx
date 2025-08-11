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

  const [, drop] = useDrop(() => ({
    accept: [ItemType.BOX, ItemType.BOX_COM, ItemType.POINT],
    drop: (item, monitor) => {
      const initialClientOffset = monitor.getInitialClientOffset();
      const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
      const clientOffset = monitor.getClientOffset();

      const dropBoxBounds = clientOffset
        ? document.getElementById("dropBox").getBoundingClientRect()
        : { left: 0, top: 0 };

      const offsetX = initialClientOffset.x - initialSourceClientOffset.x;
      const offsetY = initialClientOffset.y - initialSourceClientOffset.y;

      const newLeft = Math.round(clientOffset.x - dropBoxBounds.left - offsetX);
      const newTop = Math.round(clientOffset.y - dropBoxBounds.top - offsetY);

      if (item.type === ItemType.BOX) {
        onDrop(item.index, { x: newLeft, y: newTop });
      } else if (item.type === ItemType.BOX_COM) {
        onDropCom(item.index, { x: newLeft, y: newTop });
      } else if (item.type === ItemType.POINT) {
        onDropPoint(item.index, { x: newLeft, y: newTop });
      }
    },
  }));

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
      id="dropBox"
      ref={drop}
      style={{
        width: `${boxInfo.width}px`,
        height: `${boxInfo.height}px`,
        backgroundColor: newBackgroundColor,
        backgroundImage: boxInfo.bgImg ? `url(${boxInfo.bgImg})` : "none",
        borderStyle: "solid",
        boxSizing: "border-box",
        borderWidth: `${boxInfo.borderTop}px ${boxInfo.borderRight}px ${boxInfo.borderBottom}px ${boxInfo.borderLeft}px`,
        borderRadius: `${boxInfo.borderRadius}%`,
        borderColor: boxInfo.borderColor,
      }}
      className="relative flex items-center justify-center bg-cover"
      // Information we need in the form in HTML
      data-token={token}
      data-typeservice={realtimeService}
    >
      {children}
    </div>
  );
};

export default DropBox;
