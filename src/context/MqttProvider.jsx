import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import mqtt from "mqtt";
import logger from "@utils/logger.js";

const MQTTContext = createContext();

export const MqttProvider = ({ children }) => {
  const realtimeService = useSelector((state) => state.realtimeService);
  const [mqttClient, setMqttClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const subscribedTopics = useRef(new Set());
  const messageHandlers = useRef(new Map());

  useEffect(() => {
    if (realtimeService !== "mqtt") {
      if (mqttClient) {
        // logger.log("Disconnecting MQTT client...");
        mqttClient.end(true);
        setMqttClient(null);
        setIsConnected(false);
        subscribedTopics.current.clear();
        messageHandlers.current.clear();
      }
      return;
    }

    if (mqttClient) {
      return;
    }

    const brokerUrl = import.meta.env.VITE_BROKER_URL;

    if (!brokerUrl) {
      // logger.error("MQTT broker URL not found");
      return;
    }

    // logger.log("Connecting to MQTT broker:", brokerUrl);

    const client = mqtt.connect(brokerUrl, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      clean: true,
    });

    setMqttClient(client);

    client.on("connect", () => {
      // logger.log("Connected to MQTT Broker");
      setIsConnected(true);
    });

    // logger.log("Received message");

    client.on("message", (topic, payload) => {
      const message = {
        topic,
        payload: payload.toString(),
        timestamp: Date.now(),
      };

      // logger.log("Received message", message);

      setMessages((prev) => [...prev, message]);

      const handlers = messageHandlers.current.get(topic);
      if (handlers) {
        handlers.forEach((handler) => handler(message));
      }
    });

    client.on("error", (err) => {
      logger.error("MQTT error:", err);
      setIsConnected(false);
    });

    client.on("close", () => {
      // logger.log("MQTT connection closed");
      setIsConnected(false);
    });

    return () => {
      if (client && !client.disconnecting) {
        // logger.log("Cleaning up MQTT client...");
        client.end(true);
        subscribedTopics.current.clear();
        messageHandlers.current.clear();
      }
    };
  }, [realtimeService]);

  const subscribe = (topic, messageHandler, options = {}) => {
    if (!mqttClient || !isConnected || realtimeService !== "mqtt") {
      return () => {};
    }

    if (subscribedTopics.current.has(topic)) {
      if (messageHandler) {
        const handlers = messageHandlers.current.get(topic) || [];
        handlers.push(messageHandler);
        messageHandlers.current.set(topic, handlers);
      }

      return () => {
        if (messageHandler) {
          const handlers = messageHandlers.current.get(topic) || [];
          const newHandlers = handlers.filter((h) => h !== messageHandler);
          if (newHandlers.length === 0) {
            messageHandlers.current.delete(topic);
            if (mqttClient && !mqttClient.disconnecting) {
              mqttClient.unsubscribe(topic);
              subscribedTopics.current.delete(topic);
              // logger.log(`Unsubscribed from ${topic}`);
            }
          } else {
            messageHandlers.current.set(topic, newHandlers);
          }
        }
      };
    }

    mqttClient.subscribe(topic, (err) => {
      if (err) {
        logger.error(`Failed to subscribe to ${topic}`, err);
      } else {
        // logger.log(`Successfully subscribed to ${topic}`);
        subscribedTopics.current.add(topic);

        if (messageHandler) {
          const handlers = messageHandlers.current.get(topic) || [];
          handlers.push(messageHandler);
          messageHandlers.current.set(topic, handlers);
        }

        if (options?.publishTopic && options?.publishMessage) {
          mqttClient.publish(
            options.publishTopic,
            String(options.publishMessage),
          );
          logger.log(
            `Published initial request to ${options.publishTopic}:`,
            options.publishMessage,
          );

          const intervalId = setInterval(() => {
            mqttClient.publish(
              options.publishTopic,
              String(options.publishMessage),
            );
            logger.log(
              `Published repeated request to ${options.publishTopic}:`,
              options.publishMessage,
            );
          }, 30000);

          return () => clearInterval(intervalId);
        }
      }
    });

    return () => {
      // cleanup
      if (messageHandler) {
        const handlers = messageHandlers.current.get(topic) || [];
        const newHandlers = handlers.filter((h) => h !== messageHandler);
        if (newHandlers.length === 0) {
          messageHandlers.current.delete(topic);
          if (mqttClient && !mqttClient.disconnecting) {
            mqttClient.unsubscribe(topic);
            subscribedTopics.current.delete(topic);
            // logger.log(`Unsubscribed from ${topic}`);
          }
        } else {
          messageHandlers.current.set(topic, newHandlers);
        }
      }
    };
  };

  const value = {
    mqttClient,
    isConnected,
    messages,
    subscribe,
    realtimeService,
  };

  return <MQTTContext.Provider value={value}>{children}</MQTTContext.Provider>;
};

export const UseMqttContext = () => {
  const context = useContext(MQTTContext);
  if (!context) {
    throw new Error("useMQTTContext must be used within mqttProvider");
  }
  return context;
};
