import { useEffect } from "react";
import logger from "@utils/logger.js";

export const useFormIframe = ({
  iframeRef,
  outerContainerRef,
  form,
  newForm,
  setContainerDimensions,
  containerDimensions,
  options = {},
}) => {
  const { checkFormContent = false } = options;

  useEffect(() => {
    if (newForm?.boxInfo) {
      setContainerDimensions({
        width: newForm.boxInfo.width,
        height: newForm.boxInfo.height,
      });
    }
  }, [form?.uuid, newForm?.boxInfo?.width, newForm?.boxInfo?.height]);

  useEffect(() => {
    if (!newForm) return;

    const checkScreenSize = () => {
      const isCurrentlyMobile = window.innerWidth <= 1420;

      if (isCurrentlyMobile && outerContainerRef.current) {
        const parentElement = outerContainerRef.current.parentElement;
        if (parentElement) {
          const availableWidth = parentElement.clientWidth;
          const availableHeight = window.innerHeight - 200;

          const finalWidth = Math.min(newForm?.boxInfo?.width, availableWidth);
          const finalHeight = Math.min(
            newForm?.boxInfo?.height,
            availableHeight,
          );

          setContainerDimensions({
            width: finalWidth,
            height: finalHeight,
          });
        }
      } else {
        setContainerDimensions({
          width: newForm?.boxInfo?.width,
          height: newForm?.boxInfo?.height,
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
  }, [form?.uuid, newForm?.boxInfo?.width, newForm?.boxInfo?.height]);

  useEffect(() => {
    if (!iframeRef.current || !form?.content) return;

    const iframeDocument = iframeRef.current.contentWindow.document;

    iframeDocument.open();
    iframeDocument.write(form.content);
    iframeDocument.close();

    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    const shouldAddOverflow =
      containerDimensions.width > 550 || containerDimensions.height > 550;

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
        min-width: 100% !important;
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
      }
      
      #form-container > div {
        width: 100% !important;
        height: 100% !important;
      }
      
      #form-container > div > div {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
      }
      
      #form-container > div > div > div:not(#dropBox) {
        overflow: ${shouldAddOverflow && width <= 1100 && height <= 900 ? "auto !important" : "hidden !important"}
      }
      
      #form-container > div > div > div:not(#dropBox) {
        width: 100% !important;
        min-width: 100% !important;
        max-width: 0 !important;
        height: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
      }
      
      #dropBox {
        display: inline-flex !important;
        justify-content: center !important;
        align-items: center !important;
        border-radius: ${newForm?.boxInfo?.borderRadius || 0}%;
      }
      
      #myModal {
        display: none !important;
      }
    `;
    iframeDocument.head.appendChild(style);

    const dropBox = iframeDocument.querySelector("#dropBox");

    if (dropBox) {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (token && !dropBox.hasAttribute("data-token")) {
        dropBox.setAttribute("data-token", token);
      }

      if (!dropBox.hasAttribute("data-idform")) {
        dropBox.setAttribute("data-idform", form.uuid || "default");
      }

      if (!dropBox.hasAttribute("data-typeservice")) {
        dropBox.setAttribute("data-typeservice", form?.typeservice || "echo");
      }

      setTimeout(() => {
        const dropBoxParent = dropBox.parentElement;
        if (dropBoxParent) {
          dropBoxParent.replaceWith(dropBox);

          let availableWidth = containerDimensions.width;
          let availableHeight = containerDimensions.height;

          const originalFormWidth = newForm?.boxInfo?.width;
          const originalFormHeight = newForm?.boxInfo?.height;

          const needsHorizontalScroll = originalFormWidth > availableWidth;
          const needsVerticalScroll = originalFormHeight > availableHeight;
          const needsScroll = needsHorizontalScroll || needsVerticalScroll;

          dropBox.style.overflow = needsScroll ? "auto" : "hidden";
        }
      }, 1000);

      dropBox.style.backgroundColor = newForm?.boxInfo?.bgColor
        ? newForm?.boxInfo?.bgColor.includes("rgba")
          ? `rgba(${newForm?.boxInfo?.bgColor.match(/\d+/g).join(", ")}, ${newForm?.boxInfo?.opacity || 1})`
          : `rgba(${newForm?.boxInfo?.bgColor}, ${newForm?.boxInfo?.opacity || 1})`
        : "white";

      if (newForm?.boxInfo?.bgImg) {
        dropBox.style.backgroundImage = `url(${newForm?.boxInfo?.bgImg})`;
        dropBox.style.backgroundSize = "cover";
        dropBox.style.backgroundPosition = "center";
        dropBox.style.backgroundRepeat = "no-repeat";
      }

      dropBox.style.borderStyle = "solid";
      dropBox.style.boxSizing = "border-box";
      dropBox.style.borderWidth = `${newForm?.boxInfo?.borderTop || 0}px ${newForm?.boxInfo?.borderRight || 0}px ${newForm?.boxInfo?.borderBottom || 0}px ${newForm?.boxInfo?.borderLeft || 0}px`;
      dropBox.style.borderRadius = `${newForm?.boxInfo?.borderRadius || 0}%`;
      dropBox.style.borderColor =
        newForm?.boxInfo?.borderColor || "transparent";

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
  }, [
    newForm,
    containerDimensions,
    iframeRef,
    outerContainerRef,
    checkFormContent,
  ]);
};
