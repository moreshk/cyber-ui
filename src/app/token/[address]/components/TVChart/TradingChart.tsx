"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Script from "next/script";

const TVChartContainer = dynamic(
  () => import("./TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false }
);

export const TradingChart = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);

  return (
    <>
      <Script
        src="/libraries/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && (
        <TVChartContainer name="dsffdsf" pairIndex={10} token={"sfsd"} />
      )}
    </>
  );
};
