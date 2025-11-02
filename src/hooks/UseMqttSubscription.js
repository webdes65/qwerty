import { useEffect, useState, useRef } from "react";
import { UseMqttContext } from "../context/MqttProvider.jsx";

const UseMqttSubscription = (
  topics,
  messageHandler,
  enabled = true,
  publishOnSubscribe = null,
) => {
  const { subscribe, isConnected, realtimeService } = UseMqttContext();
  const [messages, setMessages] = useState([]);
  const messageHandlerRef = useRef(messageHandler);

  useEffect(() => {
    messageHandlerRef.current = messageHandler;
  }, [messageHandler]);

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
      const options = publishOnSubscribe ?? {};

      const cleanup = subscribe(
        topic,
        (message) => {
          // logger.log(`Received message on topic: ${topic}`, message);

          setMessages((prev) => [...prev, message]);

          if (messageHandlerRef.current) {
            messageHandlerRef.current(message);
          }
        },
        options,
      );

      cleanupFunctions.push(cleanup);
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [topics, enabled, subscribe, realtimeService, publishOnSubscribe]);

  return { messages, isConnected };
};

export default UseMqttSubscription;
