import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import logger from "@utils/logger.js";

const FormDetail = () => {
  const location = useLocation();
  const { form } = location.state || {};

  const iframeRef = useRef();

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentWindow.document;

      iframeDocument.open();
      iframeDocument.write(form.content);
      iframeDocument.close();

      const dropBox = iframeDocument.querySelector("#dropBox");

      if (dropBox) {
        if (!dropBox.hasAttribute("data-token")) {
          const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
          if (token) {
            dropBox.setAttribute("data-token", token);
          }
        }

        if (!dropBox.hasAttribute("data-idform")) {
          dropBox.setAttribute("data-idform", form.uuid);
        }

        if (!dropBox.hasAttribute("data-typeservice")) {
          dropBox.setAttribute("data-typeservice", "echo");
        }

        const updateScale = () => {
          if (window.matchMedia("(max-width: 640px)").matches) {
            dropBox.style.transform = "scale(0.4)";
          } else if (window.matchMedia("(max-width: 1024px)").matches) {
            dropBox.style.transform = "scale(0.67)";
          } else {
            dropBox.style.transform = "scale(1)";
          }
          dropBox.style.transformOrigin = "center";
        };

        updateScale();

        const iframeWindow = iframeRef.current.contentWindow;
        if (iframeWindow && iframeWindow.initializeFormHandler) {
          try {
            iframeWindow.initializeFormHandler();
          } catch (error) {
            logger.error("Error reinitializing form handler:", error);
          }
        }

        window.addEventListener("resize", updateScale);

        return () => {
          window.removeEventListener("resize", updateScale);
        };
      } else {
        logger.warn("Element with ID 'dropBox' not found in iframe content.");
      }
    }
  }, [form]);

  return (
    <div className="flex flex-col justify-center items-start gap-10 p-2">
      <div className="flex flex-col font-bold">
        <p className="text-[0.90rem] text-gray-500">Form Name</p>
        <p className="text-[1rem]">{form.name || "empty"}</p>
      </div>

      <iframe
        ref={iframeRef}
        title="Form Content"
        style={{
          width: "100%",
          height: "110vh",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default FormDetail;
