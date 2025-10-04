import { useEffect, useRef, useState } from "react";
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
import useEchoChart from "@hooks/useEchoChart";
import UseMqttSubscription from "@hooks/UseMqttSubscription.js";
import logger from "@utils/logger.js";
// import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  // zoomPlugin
);

const TemperatureChart = ({ data }) => {
  const chartRef = useRef(null);
  const realtimeService = useSelector((state) => state.realtimeService);
  const location = useLocation();
  const graphId = location.pathname.slice(8);

  const [isLiveUpdate, setIsLiveUpdate] = useState(false);
  const [allowedIds, setAllowedIds] = useState([]);
  const [registers, setRegisters] = useState([]);

  const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" | ");

    const formattedDate = datePart.replace(/\//g, "-");

    return `${formattedDate} ${timePart}`;
  };

  const [chartLabels, setChartLabels] = useState(() => {
    if (data[0]?.logs) {
      const logs = data[0].logs;
      const groupedByMinute = {};

      Object.keys(logs).forEach((key) => {
        const minute = key.slice(0, 16);

        groupedByMinute[minute] = logs[key];
      });

      return Object.keys(groupedByMinute);
    }

    return [];
  });

  const [chartDatasets, setChartDatasets] = useState(() => {
    return data.map((item) => {
      if (item.logs && Object.keys(item.logs).length > 0) {
        const logs = item.logs;
        const groupedByMinute = {};

        Object.keys(logs).forEach((key) => {
          const minute = key.slice(0, 16);
          groupedByMinute[minute] = logs[key];
        });

        const filteredData = Object.values(groupedByMinute).map(Number);

        return {
          id: item.id,
          label: item.title,
          data: filteredData,
          borderWidth: 3,
          fill: true,
          pointBorderWidth: 3,
          pointRadius: 5,
          tension: 0.4,
          // pointBackgroundColor: item.color,
          pointBackgroundColor: "#fff",
          pointBorderColor: item.color,
          borderColor: item.color,
          backgroundColor: item.color,
        };
      }

      return {
        id: item.id,
        label: item.title,
        data: [],

        borderWidth: 3,
        fill: true,
        pointBorderWidth: 3,
        pointRadius: 5,
        tension: 0.4,
        // pointBackgroundColor: item.color,
        pointBackgroundColor: "#fff",
        pointBorderColor: item.color,
        borderColor: item.color,
        backgroundColor: item.color,
      };
    });
  });

  useEffect(() => {
    if (registers.length > 0) {
      let updatedLabels = [...chartLabels];
      let updatedDatasets = [...chartDatasets];

      const minuteDataMap = {};

      registers.forEach((register) => {
        const formattedMinute = formatDate(register.datetime).slice(0, 16);

        minuteDataMap[formattedMinute] = {
          label: register.label,
          value: register.value,
          datetime: register.datetime,
        };
      });

      Object.keys(minuteDataMap).forEach((minute) => {
        const register = minuteDataMap[minute];

        const dataset = updatedDatasets.find(
          (dataset) => dataset.label === register.label,
        );

        if (dataset) {
          const existingIndex = updatedLabels.indexOf(minute);

          if (existingIndex !== -1) {
            dataset.data[existingIndex] = register.value;
          } else {
            dataset.data.push(register.value);
            updatedLabels.push(minute);
          }

          if (dataset.data.length > 14) {
            dataset.data.shift();
          }
        } else {
          updatedDatasets.push({
            label: register.label,
            data: [register.value],
          });
          updatedLabels.push(minute);
        }

        if (updatedLabels.length > 14) {
          updatedLabels.shift();
        }
      });

      setChartLabels(updatedLabels);
      setChartDatasets(updatedDatasets);
    }
  }, [registers]);

  const handleLiveUpdateChange = (checked) => {
    setIsLiveUpdate(checked);

    if (checked) {
      setAllowedIds(chartDatasets.map((dataset) => dataset.id));
    } else {
      setAllowedIds([]);
    }
  };

  useEchoChart(setRegisters, allowedIds, isLiveUpdate, realtimeService);

  const mqttTopics =
    realtimeService === "mqtt" &&
    Array.isArray(allowedIds) &&
    allowedIds.length > 0
      ? allowedIds.map((id) => `registers/${id}`)
      : [];

  const { messages: register } = UseMqttSubscription(
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
          publishTopic: "graphs/watchers",
          publishMessage: graphId,
        }
      : null,
  );

  const handleExport = () => {
    const chart = chartRef.current;
    const ctx = chart.canvas.getContext("2d");
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.globalCompositeOperation = "destination-over";

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chart.canvas.width, chart.canvas.height);

    const imageUrl = chart.canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "chart.png";
    link.click();
  };

  return (
    <div className="w-1/2 h-auto p-1 max-xl:w-full">
      <div className="w-full h-full flex flex-col justify-start items-center gap-5 p-8 bg-white rounded-md border-4 border-gray-200 max-md:p-4">
        {/* <Line
          ref={chartRef}
          data={{
            labels: chartLabels,
            datasets: chartDatasets,
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
              // zoom: {
              //   pan: {
              //     enabled: true,
              //     mode: "xy",
              //     threshold: 10,
              //   },
              //   zoom: {
              //     enabled: true,
              //     mode: "xy",
              //     speed: 0.1,
              //     sensitivity: 3,
              //     threshold: 2,
              //   },
              // },
            },
            plugins: {
              zoom: {
                pan: { enabled: true, mode: "xy", threshold: 10 },
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
                  callback: function (value, index, ticks) {
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
        /> */}

        <Line
          ref={chartRef}
          data={{
            labels: chartLabels,
            datasets: chartDatasets,
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
            className="w-auto font-Quicksand font-medium !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
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
