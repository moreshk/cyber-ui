import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  CandlestickSeriesPartialOptions,
} from "lightweight-charts";

interface CandleChartProps {
  data: CandlestickData[]; // Data for the candlestick series
  options?: CandlestickSeriesPartialOptions; // Optional series customization
  width?: number; // Optional width of the chart
  height?: number; // Optional height of the chart
}

const CandleChartComponent: React.FC<CandleChartProps> = ({
  data,
  options,
  width = 800,
  height = 400,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        textColor: "#ffffff",
      },
      grid: {
        vertLines: { color: "#404040" },
        horzLines: { color: "#404040" },
      },
    });

    chartRef.current = chart;

    // Add a candlestick series
    const candlestickSeries = chart.addCandlestickSeries(options);
    seriesRef.current = candlestickSeries;

    // Set the initial data
    candlestickSeries.setData(data);

    // Resize handling
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.offsetWidth || width,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, options, width, height]);

  useEffect(() => {
    // Update data dynamically
    seriesRef.current?.setData(data);
  }, [data]);

  return <div ref={chartContainerRef} style={{ height: `${height}px` }} />;
};

export default CandleChartComponent;
