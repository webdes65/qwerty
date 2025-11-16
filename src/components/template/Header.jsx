import { useLocation, useNavigate } from "react-router-dom";
import { Spin as Hamburger } from "hamburger-react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import logo from "/assets/images/logo.webp";
import useDarkMode from "../../store/UseDarkMode.js";

const Header = ({
  onOpenDrawer,
  isDrawerOpen,
  setIsDrawerOpen,
  // isListening,
  // setIsListening,
  // selectedLanguage,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const { darkMode } = useDarkMode();

  const lastSegment =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "home";

  const formattedLastSegment = (() => {
    const isEditForm =
      lastSegment.toLowerCase() === "createform" && location.state?.id;

    const specialCases = {
      createform: "Create Form",
      augmentedrealities: "Augmented Realities",
      devicedetail: "Device Detail",
      employeesDetail: "Employees Detail 222",
    };

    const isNumber = !isNaN(lastSegment);

    const previousSegment =
      pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : null;

    if (isNumber) {
      if (previousSegment?.toLowerCase() === "subproject") {
        return "SubProjects";
      } else if (previousSegment?.toLowerCase() === "graphs") {
        return "Graph Detail";
      }
    }

    if (isEditForm) {
      return `Edit Form of ${location.state.name}`;
    }

    const formDetail = lastSegment === "formDetail";

    if (formDetail) {
      return `Detail of ${location.state.form.name} form`;
    }

    return (
      specialCases[lastSegment.toLowerCase()] ||
      lastSegment
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z]+)/g, "$1 $2")
    );
  })();

  const userName = localStorage.getItem("user_name");

  // const toggleListening = () => {
  //   if (isListening) {
  //     annyang.abort();
  //   } else {
  //     annyang.setLanguage(selectedLanguage);
  //     annyang.start();
  //   }
  //   setIsListening(!isListening);
  // };

  return (
    <header className="h-3/12 flex flex-row justify-between items-center px-4 bg-white text-dark-100 dark:bg-gray-100 dark:text-white shadow rounded-xl font-Quicksand p-2">
      <h1
        className="font-bold text-[1.5rem] max-lg:hidden text-transparent bg-clip-text cursor-default"
        style={{
          backgroundImage: darkMode
            ? "linear-gradient(to right, #9897c6, #94d2e0"
            : "linear-gradient(to right, #6D6CAA, #6EC5D6)",
        }}
      >
        {formattedLastSegment}
      </h1>
      <div className="w-auto flex flex-row justify-center items-center gap-2 max-lg:hidden">
        {/* <button
            onClick={toggleListening}
            className={`w-[2.5rem] h-[2.5rem] shadow-xl flex flex-row justify-center items-center rounded-full
            ${
              isListening
                ? "bg-green-200 border-2 border-green-500"
                : "bg-red-200 border-2 border-red-500"
            }`}
          >
            <FaMicrophone
              className={`text-[1.25rem] ${
                isListening ? "text-green-500" : "text-red-500"
              }`}
            />
          </button> */}
        <div className="flex flex-row justify-center items-center gap-2">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#c3c4c7",
              color: "#000",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            }}
          />
          <p className="text-[1rem] dragLabelStyle cursor-default">
            {userName}
          </p>
        </div>
      </div>

      <div
        className="hidden max-lg:flex"
        onClick={() => {
          onOpenDrawer();
        }}
      >
        <Hamburger
          size={30}
          duration={0.8}
          toggled={isDrawerOpen}
          toggle={setIsDrawerOpen}
          className="hamburger-custom"
        />
      </div>
      <div className="w-12 h-12 flex lg:hidden" onClick={() => navigate("/")}>
        <img alt="logo" src={logo} className="w-full h-full" />
      </div>
    </header>
  );
};

export default Header;
