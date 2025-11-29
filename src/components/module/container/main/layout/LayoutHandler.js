import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setupInstallPrompt } from "@services/setupInstallPrompt.js";
import { request } from "@services/apiService.js";
import useDarkMode from "@store/UseDarkMode.js";
import { setRealtimeService } from "@redux_toolkit/features/realtimeServiceSlice.js";

export default function LayoutHandler({ userId }) {
  const dispatch = useDispatch();
  const { initializeDarkMode } = useDarkMode();

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

  return { isLoading, isError };
}
