import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Joyride from "react-joyride";
import { useQueryClient } from "react-query";
import { TbAugmentedReality, TbChartDots, TbDoorExit } from "react-icons/tb";
import { FaListOl } from "react-icons/fa6";
import { IoCreateOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import { AiOutlineDesktop, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { BiBuildings } from "react-icons/bi";
import { MdOutlineImportantDevices } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { Button, Drawer, Dropdown, Space } from "antd";
import Cookies from "universal-cookie";
import LogoutModal from "@module/modal/LogoutModal.jsx";
import { useSystemTheme } from "@hooks/UseSystemTheme.js";
import UseDarkModeStore from "@store/UseDarkMode.js";

const MobileDrawer = ({ open, onClose, setIsDrawerOpen }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cookies = new Cookies();
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
    if (open && !localStorage.getItem("mobileDrawer-guide-shown")) {
      setTimeout(() => {
        setRun(true);
      }, 300);
      localStorage.setItem("mobileDrawer-guide-shown", "true");
    }
    if (!open) {
      setRun(false);
    }
  }, [open]);

  const resetToSystemTheme = () => {
    enableSystemTheme();
    setDarkMode(systemTheme, true);
  };

  const isActive = (route) => {
    if (route === "/SubProject/:id") {
      return location.pathname.startsWith("/SubProject/");
    }

    if (route === "/graphs/:id ") {
      return location.pathname.startsWith("/graphs/");
    }

    if (route === "/devices/:id ") {
      return location.pathname.startsWith("/devices/");
    }

    return location.pathname === route;
  };

  const steps = [
    {
      target: ".create-component-step",
      content: "Help text",
    },
    {
      target: ".create-form-step",
      content: "Help text",
    },
    {
      target: ".forms-step",
      content: "Help text",
    },
    {
      target: ".ar-step",
      content: "Help text",
    },
    {
      target: ".graph-step",
      content: "Help text",
    },
    {
      target: ".devices-step",
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

  const handleNavigation = (route) => {
    navigate(route);
    onClose();
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

  return (
    <>
      <Joyride
        className="!font-Quicksand"
        steps={steps}
        run={run}
        continuous
        // scrollToFirstStep
        showProgress
        showSkipButton
        styles={{
          options: {
            zIndex: 10000,
          },
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
      <Drawer
        className="font-Poppins text-[1rem] font-bold bg-white text-dark-100 dark:bg-dark-100 dark:text-white border-r border-r-gray200 dark:border-gray-600"
        title="BMS"
        placement="left"
        closable={true}
        onClose={onClose}
        open={open}
        key="left"
      >
        <div className="h-full flex flex-col justify-between items-start">
          <div className="w-full flex flex-col justify-start items-start gap-1">
            <p
              className={`flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/") ? "bg-tealBlue text-white" : ""
              }`}
              onClick={() => handleNavigation("/")}
            >
              <IoHome className="text-[1.55rem]" />
              Home
            </p>
            <p
              className={`create-component-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/createcomponent") ? "bg-tealBlue text-white" : ""
              }`}
              onClick={() => handleNavigation("/createcomponent")}
            >
              <IoCreateOutline className="text-[1.5rem]" />
              Create Components
            </p>
            <p
              className={`create-form-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/createform") ? "bg-tealBlue text-white" : ""
              }`}
              onClick={() => handleNavigation("/createform")}
            >
              <IoCreateOutline className="text-[1.5rem]" />
              Create Form
            </p>
            <p
              className={`forms-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/forms") || isActive("/forms/formDetail")
                  ? "bg-tealBlue text-white"
                  : ""
              }`}
              onClick={() => handleNavigation("/forms")}
            >
              <FaListOl className="text-[1.5rem]" />
              Forms
            </p>
            <p
              className={`ar-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
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
            </p>
            <p
              className={`graph-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/graphs") || isActive("/graphs/:id ")
                  ? "bg-tealBlue text-white"
                  : ""
              }`}
              onClick={() => handleNavigation("/graphs")}
            >
              <TbChartDots className="text-[1.5rem]" />
              Graphs
            </p>

            <p
              className={`devices-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/devices") ||
                isActive("/devices/deviceDetail") ||
                isActive("/devices/editdevice") ||
                isActive("/devices/*/registers") ||
                /^\/devices\/\d+\/registers$/.test(window.location.pathname)
                  ? "bg-tealBlue text-white"
                  : ""
              }`}
              onClick={() => handleNavigation("/devices")}
            >
              <MdOutlineImportantDevices className="text-[1.5rem]" />
              Devices
            </p>
            <p
              className={`flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/cities") ? "bg-tealBlue text-white" : ""
              }`}
              onClick={() => handleNavigation("/cities")}
            >
              <BiBuildings className="text-[1.5rem]" />
              Cities
            </p>
            <p
              className={`flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
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
            </p>

            <p
              className={`flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black dark:text-white font-medium cursor-pointer ${
                isActive("/settings") ? "bg-tealBlue text-white" : ""
              }`}
              onClick={() => handleNavigation("/settings")}
            >
              <IoSettingsSharp className="text-[1.5rem]" />
              Settings
            </p>
          </div>

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
            <button
              className="w-full p-2 rounded-md flex flex-row justify-center items-center gap-2 text-red-500 font-bold uppercase bg-red-200 border-[3px] border-red-500"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <TbDoorExit className="text-red-500 text-[25px]" />
              Logout
            </button>
          </div>
        </div>
      </Drawer>

      <LogoutModal
        title="Do you want to log out of your account?"
        isOpenModal={isLogoutModalOpen}
        setIsOpenModal={setIsLogoutModalOpen}
        onLogout={handleLogout}
      />
    </>
  );
};

export default MobileDrawer;
