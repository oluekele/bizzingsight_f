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
  ChartOptions,
  ChartData,
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

// Use discriminated union to type data/options based on chart type
interface BarChartProps {
  type: "bar";
  data: ChartData<"bar", number[], string>;
  options?: ChartOptions<"bar">;
}

interface PieChartProps {
  type: "pie";
  data: ChartData<"pie", number[], string>;
  options?: ChartOptions<"pie">;
}

type AdvancedChartProps = BarChartProps | PieChartProps;

export function AdvancedChart({ type, data, options }: AdvancedChartProps) {
  if (type === "bar") return <Bar data={data} options={options} />;
  if (type === "pie") return <Pie data={data} options={options} />;
  return null;
}
