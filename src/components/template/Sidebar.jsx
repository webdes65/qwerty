import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Joyride from "react-joyride";
import { useLocation, useNavigate } from "react-router-dom";
import { TbDoorExit } from "react-icons/tb";
import { IoHome, IoCreateOutline, IoSettingsOutline } from "react-icons/io5";
import { FaListOl } from "react-icons/fa6";
import { TbChartDots, TbAugmentedReality } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { BiBuildings } from "react-icons/bi";
import { AiOutlineDesktop, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { MdOutlineImportantDevices } from "react-icons/md";
import { PiMapPinArea } from "react-icons/pi";
import { Button, Dropdown, Space } from "antd";
import Cookies from "universal-cookie";
import LogoutModal from "@module/modal/LogoutModal.jsx";
import { useSystemTheme } from "@hooks/UseSystemTheme.js";
import UseDarkModeStore from "@store/UseDarkMode.js";

const showMap = import.meta.env.VITE_SHOW_MAP === "true";

const Sidebar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {
    darkMode,
    useSystemTheme: useSystemThemeMode,
    setDarkMode,
    enableSystemTheme,
    disableSystemTheme,
  } = UseDarkModeStore();
  const systemTheme = useSystemTheme();

  const [run, setRun] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem("sidebar-guide-shown");
    if (!hasShown) {
      setRun(true);
      localStorage.setItem("sidebar-guide-shown", "true");
    }
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    cookies.remove("bms_access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("registers");
    localStorage.removeItem("createComponents-guide-shown");
    localStorage.removeItem("createForm-guide-shown");
    localStorage.removeItem("sidebar-guide-shown");
    localStorage.removeItem("mobileDrawer-guide-shown");
    localStorage.removeItem("realtime_service");
    localStorage.removeItem("app_version");
    localStorage.removeItem("sidebar-guide-shown");
    queryClient.clear();
    navigate("/login");
  };

  const isActive = (route) => {
    if (route === "/SubProject/:id") {
      return location.pathname.startsWith("/SubProject/");
    }

    if (route === "/graphs/:id ") {
      return location.pathname.startsWith("/graphs/");
    }

    return location.pathname === route;
  };

  const resetToSystemTheme = () => {
    enableSystemTheme();
    setDarkMode(systemTheme, true);
  };

  const steps = [
    {
      target: ".create-component",
      content: "Help text",
    },
    {
      target: ".create-form",
      content: "Help text",
    },
    {
      target: ".forms",
      content: "Help text",
    },
    {
      target: ".ar",
      content: "Help text",
    },
    {
      target: ".graph",
      content: "Help text",
    },
    {
      target: ".device",
      content: "Help text",
    },
  ];

  const themeMenuItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center justify-between">
          <AiOutlineSun />
        </div>
      ),
      onClick: () => {
        disableSystemTheme();
        setDarkMode(false);
      },
    },
    {
      key: "2",
      label: (
        <div className="flex items-center justify-between">
          <AiOutlineMoon />
        </div>
      ),
      onClick: () => {
        disableSystemTheme();
        setDarkMode(true);
      },
    },
    {
      key: "3",
      label: (
        <div className="flex items-center justify-between">
          <AiOutlineDesktop />
        </div>
      ),
      onClick: resetToSystemTheme,
    },
  ];

  useEffect(() => {
    if (useSystemThemeMode) {
      setDarkMode(systemTheme, true);
    }
  }, [systemTheme, useSystemThemeMode, setDarkMode]);

  return (
    <aside className="max-w-64 h-full flex flex-col justify-between items-start p-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white border-r border-r-gray200 dark:border-gray-600 font-Quicksand font-medium max-lg:hidden">
      <Joyride
        className="!font-Quicksand"
        steps={steps}
        run={run}
        continuous
        // scrollToFirstStep
        // showProgress
        showSkipButton
        styles={{
          // options: {
          //   zIndex: 1000,
          //   arrowColor: "#fff",
          //   backgroundColor: "#333",
          //   textColor: "#fff",
          //   spotlightPadding: 10,
          // },
          buttonNext: {
            backgroundColor: "#ff0000",
            color: "#fff",
          },
          buttonBack: {
            color: "#ff0000",
          },
          buttonSkip: {
            color: darkMode ? "#ffffff" : "#000000",
          },
        }}
        locale={{
          next: "Next",
          back: "Back",
          skip: "Skip",
          last: "End",
        }}
      />
      <ul className="w-full h-full flex flex-col justify-start items-start gap-2 font-medium text-[0.85rem]">
        <div
          className="flex flex-row justify-start items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-12 h-12 max-md:hidden">
            <img
              alt="logo"
              src="/assets/images/logo.webp"
              className="w-full h-full"
            />
          </div>
          <h1
            className="font-bold text-[1.75rem] p-2 max-md:hidden text-transparent bg-clip-text"
            style={{
              backgroundImage: darkMode
                ? "linear-gradient(to right, #9897c6, #94d2e0"
                : "linear-gradient(to right, #6D6CAA, #6EC5D6)",
            }}
          >
            MCP
          </h1>
        </div>

        <li
          className={`w-full flex flex-row justify-start items-end gap-2 cursor-pointer p-2 rounded ${
            isActive("/") ? "bg-tealBlue text-white" : ""
          }`}
          onClick={() => handleNavigation("/")}
        >
          <IoHome className="text-[1.55rem]" />
          Home
        </li>
        <li
          className={`w-full create-component flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/createcomponent") ? "bg-tealBlue text-white" : ""
          }`}
          onClick={() => handleNavigation("/createcomponent")}
        >
          <IoCreateOutline className="text-[1.5rem]" />
          Create Component
        </li>
        <li
          className={`w-full create-form flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/createform") ? "bg-tealBlue text-white" : ""
          }`}
          onClick={() => handleNavigation("/createform")}
        >
          <IoCreateOutline className="text-[1.5rem]" />
          Create Form
        </li>
        <li
          className={`w-full forms flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/forms") || isActive("/forms/formDetail")
              ? "bg-tealBlue text-white"
              : ""
          }`}
          onClick={() => handleNavigation("/forms")}
        >
          <FaListOl className="text-[1.5rem]" />
          Forms
        </li>
        <li
          className={`ar w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded  ${
            isActive("/augmentedRealities") ||
            isActive("/ProjectDetails") ||
            isActive("/ARDetails") ||
            isActive("/SubProject/:id")
              ? "bg-tealBlue text-white"
              : ""
          }`}
          onClick={() => handleNavigation("/augmentedRealities")}
        >
          <TbAugmentedReality className="text-[1.5rem]" />
          AR
        </li>
        <li
          className={`graphs w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded  ${
            isActive("/graphs") || isActive("/graphs/:id ")
              ? "bg-tealBlue text-white"
              : ""
          }`}
          onClick={() => handleNavigation("/graphs")}
        >
          <TbChartDots className="text-[1.5rem]" />
          Graphs
        </li>
        <li
          className={`device w-full flex flex-row gap-2 justify-start items-center cursor-pointer p-2 rounded ${
            isActive("/devices") ||
            isActive("/devices/deviceDetail") ||
            /^\/devices\/\d+\/registers$/.test(window.location.pathname)
              ? "bg-tealBlue text-white"
              : ""
          }`}
          onClick={() => handleNavigation("/devices")}
        >
          <MdOutlineImportantDevices className="text-[1.5rem]" />
          Devices
        </li>
        <li
          className={`citys-btn w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/cities") ? "bg-tealBlue text-white" : ""
          }`}
          onClick={() => handleNavigation("/cities")}
        >
          <BiBuildings className="text-[1.5rem]" />
          Cities
        </li>
        <li
          className={`w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded  ${
            isActive("/employees") ||
            isActive("/employees/employeesDetail") ||
            isActive("/employees/editEmployess")
              ? "bg-tealBlue text-white"
              : ""
          }`}
          onClick={() => handleNavigation("/employees")}
        >
          <LuUsers className="text-[1.5rem]" />
          Employees
        </li>
        {showMap && (
          <li
            className={`citys-btn w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
              isActive("/map") ? "bg-tealBlue text-white" : ""
            }`}
            onClick={() => handleNavigation("/map")}
          >
            <PiMapPinArea className="text-[1.5rem]" />
            Map
          </li>
        )}
        <li
          className={`w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/settings") ? "bg-tealBlue text-white" : ""
          }`}
          onClick={() => handleNavigation("/settings")}
        >
          <IoSettingsOutline className="text-[1.5rem]" />
          Settings
        </li>
      </ul>

      <div className="flex flex-col items-center justify-center gap-1 w-full">
        <div className="flex items-center gap-1 flex-row-reverse">
          <Dropdown
            menu={{ items: themeMenuItems }}
            trigger={["click"]}
            className="mb-2"
          >
            <Button type="text" className="flex items-center gap-2">
              <Space>
                {useSystemThemeMode ? (
                  <AiOutlineDesktop />
                ) : darkMode ? (
                  <AiOutlineMoon />
                ) : (
                  <AiOutlineSun />
                )}
              </Space>
            </Button>
          </Dropdown>
          <p className="text-dark-100 dark:text-white mb-2.5">
            {useSystemThemeMode
              ? "System mode"
              : darkMode
                ? "Dark mode"
                : "Light mode"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="flex flex-row justify-center items-center gap-2 text-red-500 font-bold"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <TbDoorExit className="text-red-500 text-[25px]" />
            Logout
          </button>

          <LogoutModal
            title="Do you want to log out of your account?"
            isOpenModal={isLogoutModalOpen}
            setIsOpenModal={setIsLogoutModalOpen}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
