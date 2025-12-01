import { useEffect, useState } from "react";

export default function GraphHandlers({
  data,
  registers,
  setIsLiveUpdate,
  setAllowedIds,
  chartRef,
}) {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);

  const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" | ");

    const formattedDate = datePart.replace(/\//g, "-");

    return `${formattedDate} ${timePart}`;
  };

  useEffect(() => {
    if (data[0]?.logs) {
      const logs = data[0].logs;
      const groupedByMinute = {};

      Object.keys(logs).forEach((key) => {
        const minute = key.slice(0, 16);
        groupedByMinute[minute] = logs[key];
      });

      setChartLabels(Object.keys(groupedByMinute));
    } else {
      setChartLabels([]);
    }
  }, [data]);

  useEffect(() => {
    const newData = data.map((item) => {
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
        pointBackgroundColor: "#fff",
        pointBorderColor: item.color,
        borderColor: item.color,
        backgroundColor: item.color,
      };
    });

    setChartData(newData);
  }, [data]);

  useEffect(() => {
    if (registers.length > 0) {
      let updatedLabels = [...chartLabels];
      let updatedData = [...chartData];

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

        const dataset = updatedData.find(
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
          updatedData.push({
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
      setChartData(updatedData);
    }
  }, [registers]);

  const handleLiveUpdateChange = (checked) => {
    setIsLiveUpdate(checked);

    if (checked) {
      setAllowedIds(chartData.map((dataset) => dataset.id));
    } else {
      setAllowedIds([]);
    }
  };

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

  return { chartLabels, chartData, handleLiveUpdateChange, handleExport };
}
