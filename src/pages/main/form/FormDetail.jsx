import { useRef, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useFormIframe } from "@hooks/UseFormIframe.js";
import logger from "@utils/logger.js";
import "@styles/allRepeatStyles.css";

const FormDetail = () => {
  const location = useLocation();
  const { form } = location.state || {};

  const newForm = useMemo(() => {
    if (!form?.objects) return null;

    try {
      if (typeof form.objects === "object") {
        return form.objects;
      }
      return JSON.parse(form.objects);
    } catch (error) {
      logger.error("Error parsing form.objects:", error);
      return null;
    }
  }, [form?.objects]);

  const iframeRef = useRef();
  const outerContainerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: newForm?.boxInfo?.width,
    height: newForm?.boxInfo?.height,
  });

  useFormIframe({
    form,
    newForm,
    containerDimensions,
    iframeRef,
    outerContainerRef,
    setContainerDimensions,
    options: {
      checkFormContent: false,
    },
  });

  if (!form) {
    return (
      <div className="formNotResponseStyle">
        <p className="text-xl font-bold">No form data provided</p>
      </div>
    );
  }

  return (
    <div className="formResponseStyle">
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
          minHeight: "100vh",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <iframe
          key={form.uuid ?? newForm.registers?.[0]?.id}
          ref={iframeRef}
          title="Form Content"
          style={{
            width: `100%`,
            height: `${containerDimensions.height + 20}px`,
            maxWidth: "100%",
            border: "none",
            overflow: "auto",
            minHeight: `${containerDimensions.height}px`,
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default FormDetail;
