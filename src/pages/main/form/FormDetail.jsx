import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import logger from "@utils/logger.js";

const FormDetail = () => {
  const location = useLocation();
  const { form } = location.state || {};

  const iframeRef = useRef();
  const outerContainerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: form?.width || 800,
    height: form?.height || 600,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const isCurrentlyMobile = window.innerWidth <= 1420; // Changed from 1540 to 1420

      if (isCurrentlyMobile && outerContainerRef.current) {
        const parentElement = outerContainerRef.current.parentElement;
        if (parentElement) {
          const availableWidth = parentElement.clientWidth - 64; // Increased padding
          const availableHeight = window.innerHeight - 200;

          const finalWidth = Math.min(form?.width || 800, availableWidth);
          const finalHeight = Math.min(form?.height || 600, availableHeight);

          setContainerDimensions({
            width: finalWidth,
            height: finalHeight,
          });
        }
      } else {
        setContainerDimensions({
          width: form?.width || 800,
          height: form?.height || 600,
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
  }, [form?.width, form?.height]);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentWindow.document;

      iframeDocument.open();
      iframeDocument.write(form.content);
      iframeDocument.close();

      // Override the CSS styles inside iframe
      const style = iframeDocument.createElement("style");
      style.textContent = `
        body {
          padding: 0;
          margin: 0;
          overflow: visible !important;
          width: 100%;
          height: 100%;
        }
        
        #form-container {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          position: relative !important;
        }
        
        #dropBox {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          transform: none !important;
        }
        
        /* Hide loading and modal elements that might interfere */
        #loadingOverlay,
        #myModal {
          display: none !important;
        }
      `;
      iframeDocument.head.appendChild(style);

      const dropBox = iframeDocument.querySelector("#dropBox");
      const formContainer = iframeDocument.querySelector("#form-container");

      if (dropBox && formContainer) {
        // Set attributes
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

        // Apply DropBox-like styling to the container inside iframe
        const dropBoxParent = dropBox.parentElement;
        if (dropBoxParent) {
          // Reset any existing styles that might cause positioning issues
          dropBoxParent.style.position = "relative";
          dropBoxParent.style.left = "0";
          dropBoxParent.style.top = "0";
          dropBoxParent.style.transform = "none";

          dropBoxParent.style.backgroundColor = form?.bgColor
            ? form.bgColor.includes("rgba")
              ? `rgba(${form.bgColor.match(/\d+/g).join(", ")}, ${form?.opacity || 1})`
              : `rgba(${form.bgColor}, ${form?.opacity || 1})`
            : "white";

          if (form?.bgImg) {
            dropBoxParent.style.backgroundImage = `url(${form.bgImg})`;
            dropBoxParent.style.backgroundSize = "cover";
            dropBoxParent.style.backgroundPosition = "center";
          }

          dropBoxParent.style.borderStyle = "solid";
          dropBoxParent.style.boxSizing = "border-box";
          dropBoxParent.style.borderWidth = `${form?.borderTop || 0}px ${form?.borderRight || 0}px ${form?.borderBottom || 0}px ${form?.borderLeft || 0}px`;
          dropBoxParent.style.borderRadius = `${form?.borderRadius || 0}%`;
          dropBoxParent.style.borderColor = form?.borderColor || "transparent";
          dropBoxParent.style.width = `${containerDimensions.width}px`;
          dropBoxParent.style.height = `${containerDimensions.height}px`;
          dropBoxParent.style.maxWidth = "100%";

          // محاسبه Available space در outerContainer
          const outerContainer = outerContainerRef.current;
          let availableWidth = containerDimensions.width;
          let availableHeight = containerDimensions.height;

          if (outerContainer && outerContainer.parentElement) {
            // محاسبه فضای موجود با در نظر گیری padding ها
            const parentRect =
              outerContainer.parentElement.getBoundingClientRect();
            const containerPadding = 32; // 16px * 2 for both sides

            availableWidth = Math.min(
              containerDimensions.width,
              parentRect.width - containerPadding,
            );
            availableHeight = Math.min(
              containerDimensions.height,
              window.innerHeight - 200,
            );
          }

          // بررسی اینکه آیا محتوای فرم از فضای موجود بزرگتر است یا نه
          const originalFormWidth = form?.width || 800;
          const originalFormHeight = form?.height || 600;

          const needsHorizontalScroll = originalFormWidth > availableWidth;
          const needsVerticalScroll = originalFormHeight > availableHeight;

          // اگر هر کدام از ابعاد فرم از فضای موجود بزرگتر باشد، اسکرول را فعال کن
          const needsScroll = needsHorizontalScroll || needsVerticalScroll;

          console.log("Form dimensions check:", {
            originalFormWidth,
            originalFormHeight,
            availableWidth,
            availableHeight,
            needsHorizontalScroll,
            needsVerticalScroll,
            needsScroll,
            containerDimensions,
          });

          dropBoxParent.style.overflow = needsScroll ? "auto" : "hidden";
        }

        // Set dropBox dimensions and reset positioning
        dropBox.style.width = `${containerDimensions.width}px`;
        dropBox.style.height = `${containerDimensions.height}px`;
        dropBox.style.minWidth = `${containerDimensions.width}px`;
        dropBox.style.minHeight = `${containerDimensions.height}px`;
        dropBox.style.position = "relative";
        dropBox.style.left = "0";
        dropBox.style.top = "0";
        dropBox.style.transform = "none";

        const iframeWindow = iframeRef.current.contentWindow;
        if (iframeWindow && iframeWindow.initializeFormHandler) {
          try {
            iframeWindow.initializeFormHandler();
          } catch (error) {
            logger.error("Error reinitializing form handler:", error);
          }
        }
      } else {
        logger.warn("Element with ID 'dropBox' not found in iframe content.");
      }
    }
  }, [form, containerDimensions]);

  return (
    <div className="flex flex-col justify-center items-start gap-10 p-2">
      <div className="flex flex-col font-bold">
        <p className="text-[0.90rem] text-gray-500">Form Name</p>
        <p className="text-[1rem]">{form.name || "empty"}</p>
      </div>

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
        <iframe
          ref={iframeRef}
          title="Form Content"
          style={{
            width: `${containerDimensions.width}px`,
            height: `${containerDimensions.height}px`,
            maxWidth: "100%",
            border: "none",
            background: "transparent",
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default FormDetail;
