import { useEffect, useRef, useState, useMemo } from "react";
import logger from "@utils/logger.js";
import Cookies from "universal-cookie";

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

  useEffect(() => {
    const fetchDefaultForm = async () => {
      try {
        setLoading(true);

        const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

        const response = await fetch(`${BASE_URL}/forms/default-building`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch default form");
        }

        const data = await response.json();

        setForm(data.data);

        if (data.data?.width && data.data?.height) {
          setContainerDimensions({
            width: data.data.width,
            height: data.data.height,
          });
        }

        setLoading(false);
      } catch (err) {
        logger.error("Error fetching default form:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDefaultForm();
  }, []);

  useEffect(() => {
    if (!form) return;

    const checkScreenSize = () => {
      const isCurrentlyMobile = window.innerWidth <= 1420;

      if (isCurrentlyMobile && outerContainerRef.current) {
        const parentElement = outerContainerRef.current.parentElement;
        if (parentElement) {
          const availableWidth = parentElement.clientWidth - 64;
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
    if (!form?.content || !iframeRef.current) return;

    const iframeDocument = iframeRef.current.contentWindow.document;

    iframeDocument.open();
    iframeDocument.write(form?.content);
    iframeDocument.close();

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
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
      }
      
      #form-container > div > div > div {
        overflow: ${shouldAddOverflow ? "auto !important" : "hidden !important"}
      }
      
      #dropBox {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        transform: none !important;
      }
      
      #loadingOverlay,
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
        dropBox.setAttribute("data-idform", form?.uuid || "default");
      }

      if (!dropBox.hasAttribute("data-typeservice")) {
        dropBox.setAttribute("data-typeservice", form?.typeservice || "echo");
      }

      const dropBoxParent = dropBox.parentElement;
      if (dropBoxParent) {
        dropBoxParent.style.position = "relative";
        dropBoxParent.style.left = "0";
        dropBoxParent.style.top = "0";
        dropBoxParent.style.transform = "none";

        dropBoxParent.style.backgroundColor = form?.bgColor
          ? form?.bgColor.includes("rgba")
            ? `rgba(${form?.bgColor.match(/\d+/g).join(", ")}, ${form?.opacity || 1})`
            : `rgba(${form?.bgColor}, ${form?.opacity || 1})`
          : "white";

        if (form?.bgImg) {
          dropBoxParent.style.backgroundImage = `url(${form?.bgImg})`;
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

        const outerContainer = outerContainerRef.current;
        let availableWidth = containerDimensions.width;
        let availableHeight = containerDimensions.height;

        if (outerContainer && outerContainer.parentElement) {
          const parentRect =
            outerContainer.parentElement.getBoundingClientRect();
          const containerPadding = 32;

          availableWidth = Math.min(
            containerDimensions.width,
            parentRect.width - containerPadding,
          );
          availableHeight = Math.min(
            containerDimensions.height,
            window.innerHeight - 200,
          );
        }

        const originalFormWidth = form?.width || 800;
        const originalFormHeight = form?.height || 600;

        const needsHorizontalScroll = originalFormWidth > availableWidth;
        const needsVerticalScroll = originalFormHeight > availableHeight;
        const needsScroll = needsHorizontalScroll || needsVerticalScroll;

        dropBoxParent.style.overflow = needsScroll ? "auto" : "hidden";
      }

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
  }, [form, containerDimensions]);

  const width = useMemo(() => {
    return containerDimensions.width > 500
      ? containerDimensions.width + 200
      : 500;
  }, [containerDimensions.width]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
        <div className="spinner border-6 h-12 w-12 animate-spin rounded-full border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500">Error Loading Form</p>
          <p className="mt-2 text-gray-600">{error}</p>
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
