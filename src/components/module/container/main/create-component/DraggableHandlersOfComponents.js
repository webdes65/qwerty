export default function DraggableHandlersOfComponents({
  dispatch,
  components,
  index,
  setComponents,
}) {
  const moveUp = (e) => {
    e.stopPropagation();
    dispatch((dispatch) => {
      const updatedPositions = components.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, y: item.position.y - 1 } }
          : item,
      );

      dispatch(setComponents(updatedPositions));
    });
  };

  const moveDown = (e) => {
    e.stopPropagation();
    dispatch((dispatch) => {
      const updatedPositions = components.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, y: item.position.y + 1 } }
          : item,
      );

      dispatch(setComponents(updatedPositions));
    });
  };

  const moveLeft = (e) => {
    e.stopPropagation();
    dispatch((dispatch) => {
      const updatedPositions = components.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, x: item.position.x - 1 } }
          : item,
      );

      dispatch(setComponents(updatedPositions));
    });
  };

  const moveRight = (e) => {
    e.stopPropagation();
    dispatch((dispatch) => {
      const updatedPositions = components.map((item, i) =>
        i === index
          ? { ...item, position: { ...item.position, x: item.position.x + 1 } }
          : item,
      );

      dispatch(setComponents(updatedPositions));
    });
  };

  return { moveUp, moveDown, moveLeft, moveRight };
}
