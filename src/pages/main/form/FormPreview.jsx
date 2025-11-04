import { useRef, useState, useMemo } from "react";
import Cookies from "universal-cookie";
import { useFormIframe } from "@hooks/useFormIframe";
import FormPreviewHandler from "@module/container/main/form/FormPreviewHandler.js";

const FormPreview = () => {
  const iframeRef = useRef();
  const outerContainerRef = useRef(null);
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 800,
    height: 600,
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
    containerDimensions,
    iframeRef,
    outerContainerRef,
    setContainerDimensions,
    options: {
      checkFormContent: true,
    },
  });

  const width = useMemo(() => {
    return containerDimensions.width > 500
      ? containerDimensions.width + 200
      : 500;
  }, [containerDimensions.width]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
        <div className="spinner border-6 h-12 w-12 animate-spin rounded-full border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500">Error Loading Form</p>
          <p className="mt-2 text-dark-100 dark:text-white">{error}</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
        <p className="text-xl font-bold">No form found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-10 p-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
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
          padding: "16px",
          minHeight: "100vh",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <iframe
          ref={iframeRef}
          className="bg-white text-dark-100 dark:bg-dark-100 dark:text-white"
          title="Form Preview"
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

export default FormPreview;
