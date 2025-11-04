import { useRef, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useFormIframe } from "@hooks/useFormIframe";

const FormDetail = () => {
  const location = useLocation();
  const { form } = location.state || {};

  const iframeRef = useRef();
  const outerContainerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: form?.width || 800,
    height: form?.height || 600,
  });

  useFormIframe({
    form,
    containerDimensions,
    iframeRef,
    outerContainerRef,
    setContainerDimensions,
    options: {
      checkFormContent: false,
    },
  });

  const width = useMemo(() => {
    return containerDimensions.width > 500
      ? containerDimensions.width + 200
      : 500;
  }, [containerDimensions.width]);

  if (!form) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
        <p className="text-xl font-bold">No form data provided</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-10 p-2 bg-white text-dark-100  dark:bg-dark-100 dark:text-white">
      <div className="flex flex-col font-bold">
        <p className="text-[0.90rem] text-dark-100 dark:text-white">
          Form Name:
        </p>
        <p className="text-[1rem]">{form.name ?? ""}</p>
      </div>

      <div
        ref={outerContainerRef}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "16px",
          minHeight: "100vh",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <iframe
          ref={iframeRef}
          className="bg-white text-dark-100  dark:bg-dark-100 dark:text-white"
          title="Form Content"
          style={{
            width: `${width}px`,
            height: `${containerDimensions.height}px`,
            maxWidth: "100%",
            border: "none",
            overflow: "auto",
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default FormDetail;
