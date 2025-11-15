import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineDesktop, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import Cookies from "universal-cookie";
import { useSystemTheme } from "@hooks/UseSystemTheme.js";
import { menuItems } from "@mock/menuItems.js";

export default function MenuHelperHandlers({
  onClose,
  setDarkMode,
  enableSystemTheme,
  disableSystemTheme,
  useSystemThemeMode,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const cookies = new Cookies();

  const systemTheme = useSystemTheme();

  const resetToSystemTheme = () => {
    enableSystemTheme();
    setDarkMode(systemTheme, true);
  };

  const isActive = (item) => {
    const { route, matchRoutes, checkStartsWith, checkRegex } = item;

    if (checkRegex && checkRegex.test(location.pathname)) {
      return true;
    }

    if (checkStartsWith && location.pathname.startsWith(checkStartsWith)) {
      return true;
    }

    if (matchRoutes && matchRoutes.some((r) => location.pathname === r)) {
      return true;
    }

    return location.pathname === route;
  };

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
    onClose && onClose();
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

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.showCondition) {
      return item.showCondition();
    }
    return true;
  });

  return {
    isActive,
    themeMenuItems,
    handleNavigation,
    handleLogout,
    visibleMenuItems,
  };
}
