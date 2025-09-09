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
import Cookies from "universal-cookie";
import LogoutModal from "@module/modal/LogoutModal.jsx";

const Sidebar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const location = useLocation();
  const queryClient = useQueryClient();

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

  return (
    <aside className="w-64 h-full flex flex-col justify-between items-start p-2 bg-gray-800 text-white font-Quicksand font-medium max-md:hidden">
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
              backgroundImage: "linear-gradient(to right, #6D6CAA, #6EC5D6)",
            }}
          >
            MCP
          </h1>
        </div>

        <li
          className={`w-full flex flex-row justify-start items-end gap-2 cursor-pointer p-2 rounded ${
            isActive("/") ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/")}
        >
          <IoHome className="text-[1.55rem]" />
          Home
        </li>
        <li
          className={`w-full create-component flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/createcomponent") ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/createcomponent")}
        >
          <IoCreateOutline className="text-[1.70rem]" />
          Create Component
        </li>
        <li
          className={`w-full create-form flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/createform") ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/createform")}
        >
          <IoCreateOutline className="text-[1.70rem]" />
          Create Form
        </li>
        <li
          className={`w-full forms flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/forms") || isActive("/forms/formDetail")
              ? "bg-gray-700"
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
              ? "bg-gray-700"
              : ""
          }`}
          onClick={() => handleNavigation("/augmentedRealities")}
        >
          <TbAugmentedReality className="text-[1.70rem]" />
          AR
        </li>
        <li
          className={`graphs w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded  ${
            isActive("/graphs") || isActive("/graphs/:id ") ? "bg-gray-700" : ""
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
              ? "bg-gray-700"
              : ""
          }`}
          onClick={() => handleNavigation("/devices")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-pc-display"
            viewBox="0 0 16 16"
          >
            <path
              fill="d1d5db"
              d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0M9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5M1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2z"
            />
          </svg>
          Devices
        </li>
        <li
          className={`citys-btn w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/cities") ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/cities")}
        >
          <BiBuildings className="text-[1.70rem]" />
          Cities
        </li>
        <li
          className={`w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded  ${
            isActive("/employees") ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/employees")}
        >
          <LuUsers className="text-[1.5rem]" />
          Employees
        </li>
        <li
          className={`w-full flex flex-row justify-start items-center gap-2 cursor-pointer p-2 rounded ${
            isActive("/settings") ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/settings")}
        >
          <IoSettingsOutline className="text-[1.5rem]" />
          Settings
        </li>
      </ul>
      <button
        className="flex flex-row justify-center items-center gap-2 text-red-500 font-bold p-2"
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
    </aside>
  );
};

export default Sidebar;
