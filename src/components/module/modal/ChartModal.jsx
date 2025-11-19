import { useRef } from "react";
import { Line } from "react-chartjs-2";
import { LuDownload } from "react-icons/lu";
import { Button, Modal } from "antd";
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
import { format } from "date-fns";
import * as XLSX from "xlsx";
import "@styles/formAndComponentStyles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const ChartModal = ({
  isChartModalOpen,
  setIsChartModalOpen,
  dataChart,
  deviceName,
}) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: dataChart.map((item) =>
      format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss"),
    ),
    datasets: [
      {
        label: "Chart Data",
        data: dataChart.map((item) => item.value),
        borderColor: "#22c55e",
        backgroundColor: "#fff",
        fill: true,
        borderWidth: 1,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#22c55e",
        pointBorderWidth: 1,
        pointRadius: 1,
        tension: 0.4,
      },
    ],
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

  const handleExportExcel = () => {
    const data = dataChart.map((item) => ({
      Value: item.value,
      Date: format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss"),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chart Data");

    XLSX.writeFile(wb, "chart_data.xlsx");
  };

  return (
    <Modal
      className="font-Quicksand"
      title={deviceName}
      open={isChartModalOpen}
      onCancel={() => setIsChartModalOpen(false)}
      footer={null}
      width={1200}
      style={{
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
        },
      }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: false,
                text: "Temperature Chart",
              },
              legend: {
                display: false,
              },
            },

            scales: {
              x: {
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,

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
      </div>
      <div className="w-full h-auto flex flex-row justify-end items-center p-2 gap-2">
        <Button
          type="primary"
          className="w-auto buttonPrimaryStyle"
          onClick={handleExport}
        >
          Export as JPG
          <LuDownload className="text-[1rem]" />
        </Button>
        <Button
          type="primary"
          className="w-auto buttonTertiaryStyle"
          onClick={handleExportExcel}
        >
          Export as Excel
          <LuDownload className="text-[1rem]" />
        </Button>
      </div>
    </Modal>
  );
};

export default ChartModal;
