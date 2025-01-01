"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Script from "next/script";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";

const TVChartContainer = dynamic(
  () => import("./TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false }
);

export const TradingChart = () => {
  const { data } = useTokenDetailsStore();
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
        <TVChartContainer
          name={data?.name || ""}
          pairIndex={10}
          token={data?.name || ""}
        />
      )}
    </>
  );
};
