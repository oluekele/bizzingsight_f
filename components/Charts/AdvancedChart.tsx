"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdvancedChartProps {
  type: "bar" | "pie";
  data: any;
  options?: any;
}

export function AdvancedChart({ type, data, options }: AdvancedChartProps) {
  if (type === "bar") return <Bar data={data} options={options} />;
  if (type === "pie") return <Pie data={data} options={options} />;
  return null;
}
