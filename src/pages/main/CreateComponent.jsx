import { useRef, useState } from "react";
import DragDrop from "@components/template/createComponent/DragDrop";
import DragDropOption from "@components/template/createComponent/DragDropOption";

const CreateComponent = () => {
  const dropBoxRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [isFixed, setIsFixed] = useState(false);

  const [containerSize, setContainerSize] = useState({
    width: 120,
    height: 120,
  });

  const [itemAbility, setItemAbility] = useState({
    // edit: false,
    // remove: false,
    // dragDisabled: false,
    controller: false,
  });

  return (
    <div className="h-full w-full flex flex-row justify-center items-center overflow-auto max-lg:flex-col max-lg:justify-start">
      <div className="w-8/12 h-full max-2xl:w-7/12 max-xl:w-6/12 max-lg:p-10 ">
        <DragDrop
          lines={lines}
          setLines={setLines}
          isFixed={isFixed}
          dropBoxRef={dropBoxRef}
          containerSize={containerSize}
          itemAbility={itemAbility}
        />
      </div>
      <div className="w-4/12 h-full p-10 max-2xl:w-5/12 max-xl:w-6/12 max-lg:w-full max-md:p-4">
        <DragDropOption
          dropBoxRef={dropBoxRef}
          setLines={setLines}
          isFixed={isFixed}
          setIsFixed={setIsFixed}
          containerSize={containerSize}
          setContainerSize={setContainerSize}
          itemAbility={itemAbility}
          setItemAbility={setItemAbility}
        />
      </div>
    </div>
  );
};

export default CreateComponent;
