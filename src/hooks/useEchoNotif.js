import { useEffect } from "react";
import { toast } from "react-toastify";
import echo from "@config/echo";

const useEchoNotif = (userId, realtimeService) => {
  useEffect(() => {
    let channel;

    if (userId && realtimeService === "echo") {
      channel = echo.private(`notification.${userId}`);

      channel.listen("NotificationEvent", (data) => {
        if (data && data.title && data.body) {
          if (document.hidden) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(data.title, {
                body: data.body,
                icon: "/icons/icon192.png",
              });
            });
          } else {
            toast.info(data.title);
          }
        }
      });

      channel
        // .subscribed(() => {
        //   console.log("Successfully subscribed to notification channel");
        // })
        .error((error) => {
          console.error("Error subscribing to channel:", error);
        });
    }

    return () => {
      if (channel) {
        channel.stopListening("NotificationEvent");
        echo.leave(`notification.${userId}`);
        // console.log("Left the echo channel");
      }
    };
  }, [userId, realtimeService]);
};

export default useEchoNotif;
