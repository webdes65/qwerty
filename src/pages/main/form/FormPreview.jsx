import { useRef, useState, useMemo } from "react";
import Cookies from "universal-cookie";
import { useFormIframe } from "@hooks/UseFormIframe.js";
import FormPreviewHandler from "@module/container/main/form/FormPreviewHandler.js";
import logger from "@utils/logger.js";
import "@styles/allRepeatStyles.css";

const FormPreview = () => {
  const iframeRef = useRef();
  const outerContainerRef = useRef(null);
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newForm = useMemo(() => {
    if (!form?.objects) {
      logger.log("form.objects is null or undefined");
      return null;
    }

    if (typeof form.objects === "object") {
      logger.log("form.objects is already an object");
      return form.objects;
    }

    try {
      logger.log("Parsing form.objects string");
      return JSON.parse(form.objects);
    } catch (error) {
      logger.error("Error parsing form.objects:", error);
      return null;
    }
  }, [form?.objects]);

  const [containerDimensions, setContainerDimensions] = useState({
    width: newForm?.boxInfo?.width,
    height: newForm?.boxInfo?.height,
  });

  FormPreviewHandler({
    setContainerDimensions,
    setForm,
    setLoading,
    setError,
    token,
  });

  useFormIframe({
    form,
    newForm,
    containerDimensions,
    iframeRef,
    outerContainerRef,
    setContainerDimensions,
    options: {
      checkFormContent: true,
    },
  });

  if (loading) {
    return (
      <div className="formNotResponseStyle">
        <div className="spinner border-6 h-12 w-12 animate-spin rounded-full border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="formNotResponseStyle">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500">Error Loading Form</p>
          <p className="mt-2 text-dark-100 dark:text-white">{error}</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="formNotResponseStyle">
        <p className="text-xl font-bold">No form found</p>
      </div>
    );
  }

  return (
    <div className="formResponseStyle">
      <div className="flex flex-col font-bold">
        <p className="text-[0.90rem] text-dark-100 dark:text-white">
          Default Form Preview:
        </p>
        <p className="text-[1rem]">{form?.name ?? ""}</p>
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
          className="bg-white text-dark-100 dark:bg-dark-100 dark:text-white"
          title="Form Preview"
          style={{
            width: `100%`,
            height: `${containerDimensions.height + 20}px`,
            maxWidth: "100%",
            border: "none",
            overflow: "auto",
            minHeight: `${containerDimensions.height}px`,
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          csp="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        />
      </div>
    </div>
  );
};

export default FormPreview;
