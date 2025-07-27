import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  // useEffect(() => {
  //   const path = location.pathname;

  //   if (token && (path === "/login" || path === "/signup" || path === "/register")) {
  //     navigate("/");
  //   }

  //   if (!token && path !== "/login" && path !== "/signup" && path !== "/register") {
  //     navigate("/signup");
  //   }
  // }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;

    if (
      token &&
      (path === "/login" || path === "/signup" || path === "/register")
    ) {
      navigate("/");
    }

    if (
      !token &&
      path !== "/login" &&
      path !== "/signup" &&
      path !== "/register"
    ) {
      navigate("/signup");
    }
  }, [location.pathname, token, navigate]);
};

export default useAuthCheck;
