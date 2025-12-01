import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { request } from "@services/apiService.js";
import { setRealtimeService } from "@redux_toolkit/features/realtimeServiceSlice.js";
import logger from "@utils/logger.js";

export default function SettingHandler() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("user_id");

  const mutation = useMutation(
    (data) =>
      request({
        method: "POST",
        url: `/api/users/${userId}/service`,
        data: { service: data },
      }),
    {
      onSuccess: (data) => {
        dispatch(setRealtimeService(data.data));
      },
      onError: (error) => {
        logger.error(error);
      },
    },
  );

  const handleChange = (event) => {
    const value = event.target.value;
    mutation.mutate(value);
  };

  return { handleChange };
}
