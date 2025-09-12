import { useEffect, useState } from "react";
import { UseMqttContext } from "../context/MqttProvider.jsx";

const UseMqttSubscription = (topics, messageHandler, enabled = true) => {
  const { subscribe, isConnected, realtimeService } = UseMqttContext();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (
      !enabled ||
      realtimeService !== "mqtt" ||
      !topics ||
      topics.length === 0
    ) {
      return;
    }

    const cleanupFunctions = [];

    topics.forEach((topic) => {
      const cleanup = subscribe(topic, (message) => {
        setMessages((prev) => [...prev, message]);

        if (messageHandler) {
          messageHandler(message);
        }
      });

      cleanupFunctions.push(cleanup);
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [topics, enabled, subscribe, realtimeService, messageHandler]);

  // console.log("Received message", topics);

  return { messages, isConnected };
};

export default UseMqttSubscription;
