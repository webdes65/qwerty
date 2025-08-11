import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Joyride from "react-joyride";
import { useQueryClient } from "react-query";
import { FaHome } from "react-icons/fa";
import { TbDoorExit } from "react-icons/tb";
import { FaChartColumn } from "react-icons/fa6";
import { RiDragMove2Line } from "react-icons/ri";
import { PiUsersThreeFill } from "react-icons/pi";
import { IoSettingsSharp } from "react-icons/io5";
import { Drawer } from "antd";
import Cookies from "universal-cookie";

const MobileDrawer = ({ open, onClose, setIsDrawerOpen }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cookies = new Cookies();

  const [run, setRun] = useState(false);

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

  const handleNavigation = (route) => {
    navigate(route);
    onClose();
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
        }}
        locale={{
          next: "Next",
          back: "Back",
          skip: "Skip",
          last: "End",
        }}
      />
      <Drawer
        className="font-Poppins text-[1rem] uppercase font-bold"
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
              className="flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <FaHome className="text-[25px]" />
              Home
            </p>
            <p
              className="create-component-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/createcomponent")}
            >
              <RiDragMove2Line className="text-[25px]" />
              Create Components
            </p>
            <p
              className="create-form-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/createform")}
            >
              <RiDragMove2Line className="text-[25px]" />
              Create Form
            </p>
            <p
              className="forms-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/forms")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="bi bi-code-square"
                viewBox="0 0 16 16"
                width="23"
                height="23"
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0m2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0" />
              </svg>
              Forms
            </p>
            <p
              className="ar-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/augmentedRealities")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-badge-ar-fill"
                viewBox="0 0 16 16"
              >
                <path d="m6.031 8.574-.734-2.426h-.052L4.51 8.574h1.52zm3.642-2.641v1.938h1.033c.66 0 1.068-.316 1.068-.95 0-.64-.422-.988-1.05-.988z" />
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.265 5.458h2.004L6.739 11H8L5.996 5.001H4.607L2.595 11h1.2zM8.5 5v6h1.173V8.763h1.064L11.787 11h1.327L11.91 8.583C12.455 8.373 13 7.779 13 6.9c0-1.147-.773-1.9-2.105-1.9z" />
              </svg>
              AR
            </p>
            <p
              className="graph-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/graphs")}
            >
              <FaChartColumn className="text-[1.5rem]" />
              Graphs
            </p>

            <p
              className="devices-step flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/devices")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-pc-display"
                viewBox="0 0 16 16"
                width="24"
                height="24"
              >
                <path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0M9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5M1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2z" />
              </svg>
              Devices
            </p>
            <p
              className="flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/citys")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="bi bi-building"
                viewBox="0 0 16 16"
                width="24"
                height="24"
              >
                <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
              </svg>
              Citys
            </p>
            <p
              className="flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/employees")}
            >
              <PiUsersThreeFill className="text-[1.5rem]" />
              Employees
            </p>

            <p
              className="flex flex-row justify-start items-center gap-2 text-[0.90rem] w-full p-2 rounded-md text-black font-medium cursor-pointer"
              onClick={() => handleNavigation("/settings")}
            >
              <IoSettingsSharp className="text-[1.5rem]" />
              Settings
            </p>
          </div>
          <button
            className="w-full p-2 rounded-md flex flex-row justify-center items-center gap-2 text-red-500 font-bold uppercase bg-red-200 border-[3px] border-red-500"
            onClick={() => {
              cookies.remove("bms_access_token");
              navigate("/login");
              localStorage.removeItem("user_id");
              localStorage.removeItem("user_name");
              localStorage.removeItem("registers");
              localStorage.removeItem("createComponents-guide-shown");
              localStorage.removeItem("createForm-guide-shown");
              localStorage.removeItem("sidebar-guide-shown");
              localStorage.removeItem("mobileDrawer-guide-shown");
              localStorage.removeItem("realtime_service");
              localStorage.removeItem("app_version");
              setIsDrawerOpen(false);
              queryClient.clear();
            }}
          >
            <TbDoorExit className="text-red-500 text-[25px]" />
            Logout
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
