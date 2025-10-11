import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { setRealtimeService } from "@redux_toolkit/features/realtimeServiceSlice.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdError } from "react-icons/md";
import { ConfigProvider, theme } from "antd";
import MobileDrawer from "@template/MobileDrawer";
import Sidebar from "@template/Sidebar";
import MobileMenu from "@template/MobileMenu";
import Header from "@template/Header";
import Spinner from "@template/Spinner";
import InstallModal from "@module/modal/InstallModal";
import UseEchoNotif from "@hooks/UseEchoNotif.js";
import UseAuthCheck from "@hooks/UseAuthCheck.js";
import UseMqttSubscription from "@hooks/UseMqttSubscription.js";
import { setupInstallPrompt } from "@services/setupInstallPrompt.js";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";
import useDarkMode from "../../store/UseDarkMode.js";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = localStorage.getItem("user_id");
  const realtimeService = useSelector((state) => state.realtimeService);
  const { darkMode, initializeDarkMode } = useDarkMode();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  UseAuthCheck();

  useEffect(() => {
    setupInstallPrompt();
  }, []);

  const { data, isLoading, isError } = useQuery(
    ["user-service", userId],
    () => request({ method: "GET", url: `/api/users/${userId}/service` }),
    { enabled: !!userId },
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(setRealtimeService(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    initializeDarkMode();
  }, [initializeDarkMode]);

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgetPassword";

  // Echo notification channel listening
  UseEchoNotif(userId, realtimeService);

  const notificationTopics = [`notifications/${userId}`];

  const { messages: notificationMessages } = UseMqttSubscription(
    notificationTopics,
    (message) => {
      try {
        const parsedPayload = JSON.parse(message.payload);
        const { title, body, type } = parsedPayload;

        const customToastContent = (
          <div>
            <h1 style={{ fontSize: "14px", color: "#333" }}>{title}</h1>
            <p style={{ fontSize: "12px", color: "#666" }}>{body}</p>
          </div>
        );

        switch (type) {
          case "success":
            toast.success(customToastContent);
            break;
          case "error":
            toast.error(customToastContent);
            break;
          case "warning":
            toast.warning(customToastContent);
            break;
          default:
            toast.info(customToastContent);
            break;
        }
      } catch (error) {
        logger.error("Error parsing MQTT notification payload:", error);
        toast.info(message.payload);
      }
    },
    realtimeService === "mqtt",
  );

  if (isLoading)
    return (
      <div className="w-full h-screen flex flex-row justify-center items-center bg-white dark:bg-dark">
        <Spinner />
      </div>
    );

  if (isError)
    return (
      <div className="w-full h-screen flex flex-row justify-center items-center gap-2 bg-white dark:bg-dark">
        <MdError className="text-red-500 text-[1.5rem]" />
        <p className="text-red-500 font-medium">
          Error receiving information. Please try again.
        </p>
      </div>
    );

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#007BFF",
          borderRadius: 4,
          fontSize: 14,
        },
        components: {
          Carousel: {
            arrowSize: 18,
            arrowOffset: 12,
          },
          Layout: {
            headerBg: darkMode ? "#1E1E1E" : "#FFFFFF",
            siderBg: darkMode ? "#1E1E1E" : "#FFFFFF",
          },
          Menu: {
            itemBg: darkMode ? "#1E1E1E" : "#FFFFFF",
            itemHoverBg: "#00A3FF",
            itemSelectedBg: "#007BFF",
          },
          Slider: {
            trackBg: darkMode ? "#2AC3DE" : "#1A56DC",
            trackHoverBg: darkMode ? "#2AC3DE" : "#1A56DC",
            handleColor: darkMode ? "#2AC3DE" : "#1A56DC",
            handleActiveColor: darkMode ? "#2AC3DE" : "#1A56DC",
          },
        },
      }}
    >
      {hideLayout ? (
        <>
          <main className="flex-1 bg-red-500">{children}</main>
          <ToastContainer
            position="top-right"
            className="!p-1 text-[0.90rem] font-bold"
          />
          <InstallModal />
        </>
      ) : (
        <div className="bg-white dark:bg-dark">
          <div className="h-[100vh] flex">
            <Sidebar />
            <div className="h-full w-full flex flex-col gap-2 flex-1 p-3 bg-white dark:bg-dark-100">
              <Header
                onOpenDrawer={() => setIsDrawerOpen(true)}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
              />
              <main
                style={{
                  overflow:
                    location.pathname === "/forms"
                      ? "!overflow-hidden"
                      : "!overflow-auto",
                }}
                className={`h-6/12 flex-1 bg-white dark:bg-dark ${location.pathname === "/forms" ? "!overflow-hidden" : "!overflow-auto"}`}
              >
                {children}
              </main>
              <div className="h-6/12">
                <MobileMenu />
              </div>
              <MobileDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                setIsDrawerOpen={setIsDrawerOpen}
              />
            </div>
            <ToastContainer
              position="top-right"
              className="!p-1 text-[0.90rem] font-bold"
            />
            <InstallModal />
          </div>
        </div>
      )}
    </ConfigProvider>
  );
};

export default Layout;
