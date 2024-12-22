import React from "react";
import { CandlestickData } from "lightweight-charts";
import ChartComponent from "@/components/custom/graph";

const Chart: React.FC = () => {
  const candlestickData: CandlestickData[] = [
    { time: "2023-12-01", open: 100, high: 110, low: 95, close: 105 },
    { time: "2023-12-02", open: 105, high: 115, low: 100, close: 110 },
    { time: "2023-12-03", open: 110, high: 120, low: 105, close: 115 },
    { time: "2023-12-04", open: 115, high: 125, low: 110, close: 120 },
    { time: "2023-12-05", open: 120, high: 130, low: 115, close: 125 },
  ];

  return <ChartComponent data={candlestickData} />;
};

export default Chart;
