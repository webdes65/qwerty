import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { LuDownload } from "react-icons/lu";
import { Button, Switch } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import UseEchoChart from "@hooks/UseEchoChart.js";
import UseMqttSubscription from "@hooks/UseMqttSubscription.js";
import logger from "@utils/logger.js";
import "@styles/allRepeatStyles.css";
import GraphHandlers from "@module/container/main/graphs/GraphHandlers.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const TemperatureChart = ({ data }) => {
  const chartRef = useRef(null);
  const realtimeService = useSelector((state) => state.realtimeService);
  const location = useLocation();
  const graphId = location.pathname.slice(8);

  const [isLiveUpdate, setIsLiveUpdate] = useState(false);
  const [allowedIds, setAllowedIds] = useState([]);
  const [registers, setRegisters] = useState([]);

  const { chartLabels, chartData, handleLiveUpdateChange, handleExport } =
    GraphHandlers({
      data,
      registers,
      setIsLiveUpdate,
      setAllowedIds,
      chartRef,
    });

  UseEchoChart(setRegisters, allowedIds, isLiveUpdate, realtimeService);

  const mqttTopics =
    realtimeService === "mqtt" &&
    Array.isArray(allowedIds) &&
    allowedIds.length > 0
      ? allowedIds.map((id) => `registers/${id}`)
      : [];

  const payload = JSON.stringify({ uuid: graphId });

  UseMqttSubscription(
    mqttTopics,
    (message) => {
      try {
        const parsedPayload = JSON.parse(message.payload);

        setRegisters((prevRegisters) => {
          const existingIndex = prevRegisters.findIndex(
            (register) => register.uuid === parsedPayload.uuid,
          );

          if (existingIndex !== -1) {
            const updatedRegisters = [...prevRegisters];
            updatedRegisters[existingIndex] = parsedPayload;
            return updatedRegisters;
          } else {
            return [...prevRegisters, parsedPayload];
          }
        });
      } catch (error) {
        logger.error("Error parsing register MQTT payload:", error);
      }
    },
    isLiveUpdate && realtimeService === "mqtt",

    graphId
      ? {
          publishTopic: "watchers/graph",
          publishMessage: payload,
        }
      : null,
  );

  return (
    <div className="w-1/2 h-auto p-1 max-xl:w-full bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="w-full h-full flex flex-col justify-start items-center gap-5 p-8 bg-white text-dark-100 dark:bg-dark-100 dark:text-white rounded-md border-4 border-gray-200 dark:border-gray-600 max-md:p-4">
        <Line
          ref={chartRef}
          data={{
            labels: chartLabels,
            datasets: chartData,
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: false,
                text: "Temperature Chart",
              },
              legend: {
                labels: {
                  font: {
                    family: "Quicksand, sans",
                    size: 16,
                    weight: "bold",
                  },
                },
              },
              zoom: {
                pan: {
                  enabled: true,
                  mode: "xy",
                  threshold: 10,
                },
                zoom: {
                  enabled: true,
                  mode: "xy",
                  speed: 0.1,
                  sensitivity: 3,
                  threshold: 2,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,
                  callback: function (value) {
                    const label = this.getLabelForValue(value);
                    const time = label.split(" ")[1];
                    return time;
                  },
                  font: {
                    family: "Quicksand, sans",
                    weight: "bold",
                  },
                },
              },
              y: {
                ticks: {
                  font: {
                    family: "Quicksand, sans",
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />

        <div className="w-full h-auto flex flex-row justify-between items-center">
          <div className="w-auto h-auto flex flex-row justify-start items-center gap-2">
            <span
              className={`font-bold text-[1rem] cursor-default max-md:text-[0.80rem] ${
                isLiveUpdate ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Live Update
            </span>
            <Switch
              size="small"
              checked={isLiveUpdate}
              onChange={handleLiveUpdateChange}
            />
          </div>
          <Button
            type="primary"
            className="w-auto buttonPrimaryStyle"
            onClick={handleExport}
          >
            Export Chart
            <LuDownload className="text-[1rem]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;
