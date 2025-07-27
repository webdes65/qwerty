import { useEffect, useState } from "react";
import mqtt from "mqtt";

const useMQTT = (topics, realtimeService, isLiveUpdate) => {
  const [messages, setMessages] = useState([]);
  const [mqttClient, setMqttClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (realtimeService !== "mqtt" || isLiveUpdate === false) {
      if (mqttClient) {
        mqttClient.end();
        setMqttClient(null);
        setIsConnected(false);
      }
      return;
    }

    const brokerUrl = import.meta.env.VITE_BROKER_URL;

    const client = mqtt.connect(brokerUrl, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
    });

    setMqttClient(client);

    client.on("connect", () => {
      console.log("Connected to MQTT Broker");
      setIsConnected(true);
    });

    client.on("message", (topic, payload) => {
      const message = {
        payload: payload.toString(),
      };
      setMessages((prev) => [...prev, message]);
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    return () => {
      client.end();
    };
  }, [realtimeService, isLiveUpdate]);

  useEffect(() => {
    if (realtimeService !== "mqtt" || isLiveUpdate === false) {
      if (mqttClient) {
        mqttClient.end();
        setMqttClient(null);
        setIsConnected(false);
      }
      return;
    }

    if (mqttClient && isConnected && topics.length > 0) {
      topics.forEach((topic) => {
        mqttClient.subscribe(topic, (err) => {
          if (err) {
            console.error(`Failed to subscribe to ${topic}`, err);
          } else {
            // console.log(`Subscribed to ${topic}`);
          }
        });
      });
    }
  }, [mqttClient, isConnected, topics, realtimeService, isLiveUpdate]);

  return { messages };
};

export default useMQTT;
