/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  SeriesFormat,
  widget,
} from "@/libraries/charting_library";
import {
  chartOverrides,
  disabledFeatures,
  enabledFeatures,
} from "@/utils/constants";
import ReactLoading from "react-loading";
import { twMerge } from "tailwind-merge";
import {
  LibrarySymbolInfo,
  Bar,
  HistoryCallback,
  ErrorCallback,
  PeriodParams,
} from "@/libraries/charting_library";

export type TVChartContainerProps = {
  name: string;
  pairIndex: number;
  token: string;
  classNames?: {
    container: string;
  };
};

const mockDataFeed: ChartingLibraryWidgetOptions["datafeed"] = {
  onReady: (callback) => {
    setTimeout(() => {
      callback({
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        supported_resolutions: ["1D", "1W", "1M"] as ResolutionString[]
      });
    }, 0);
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    setTimeout(() => {
      const symbolInfo: LibrarySymbolInfo = {
        ticker: symbolName,
        name: symbolName,
        session: "24x7",
        timezone: "Etc/UTC",
        minmov: 1,
        pricescale: 100,
        has_intraday: false,
        description: symbolName,
        exchange: "",
        listed_exchange: "",
        format: "price" as SeriesFormat,
        type: "crypto",
        supported_resolutions: ["1D", "1W", "1M"] as ResolutionString[],
      };
      onSymbolResolvedCallback(symbolInfo);
    }, 0);
  },
  getBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback
  ) => {
    try {
      const { from, to } = periodParams;
      const bars: Bar[] = [];
      let interval = 86400; // 86400 seconds = 1 day

      if (resolution === "1D") {
        interval = interval; // 1 day
      } else if (resolution === "1M") {
        interval = 30 * interval; // 30 days in seconds
      } else if (resolution === "1W") {
        interval = 7 * interval; // 7 days in seconds
      }

      // show data after Tue Mar 05 2024 00:00:00 GMT+0000
      if (from >= 1709596800) {       
        // Generate one bar per day between from and to
        for (let time = from; time < to; time += interval) {
          const randomChange = Math.random() * 2 - 1; // Random value between -1 and 1
          const basePrice = 100; // Base price for demonstration
          
          const bar: Bar = {
            time: time * 1000, // Convert to milliseconds
            open: basePrice + randomChange,
            high: basePrice + randomChange + Math.random() * 2,
            low: basePrice + randomChange - Math.random() * 2,
            close: basePrice + randomChange + (Math.random() - 0.5),
            volume: Math.floor(Math.random() * 10000) + 1000,
          };
          bars.push(bar);
        }
      }

      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.error("Error in getBars:", error);
      onErrorCallback("Error fetching bars");
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    const interval = setInterval(() => {
      const bar: Bar = {
        time: Date.now(),
        open: 100,
        high: 120,
        low: 90,
        close: 110,
        volume: 1200,
      };
      onRealtimeCallback(bar);
    }, 5000);

    return () => clearInterval(interval);
  },
  unsubscribeBars: (subscriberUID) => {
    // Handle unsubscribing logic if necessary
  },
  getServerTime: (callback) => {
    callback(Math.floor(Date.now() / 1000)); // Return current timestamp in seconds
  },
};

export const TVChartContainer = ({
  name,
  pairIndex,
  token,
}: TVChartContainerProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLInputElement>;
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) {
      return () => {};
    }
    if (tvWidgetRef.current) {
      tvWidgetRef.current.remove();
    }
    const elem = chartContainerRef.current;

    if (name) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: name,
        debug: false,
        datafeed: mockDataFeed,
        theme: "dark",
        locale: "en",
        container: elem,
        library_path: `${location.protocol}//${location.host}/libraries/charting_library/`,
        loading_screen: {
          backgroundColor: "#111114",
          foregroundColor: "#111114",
        },
        enabled_features: enabledFeatures,
        disabled_features: disabledFeatures,
        client_id: "tradingview.com",
        user_id: "public_user_id",
        fullscreen: false,
        autosize: true,
        // custom_css_url: "/tradingview-chart.css",
        overrides: chartOverrides,
        interval: "1D" as ResolutionString,
        // timeframe: "6M",
        // studies_overrides: {},
        // saved_data: null,
      };

      tvWidgetRef.current = new widget(widgetOptions);
      tvWidgetRef.current.onChartReady(function () {
        setIsLoading(false);
      });

      return () => {
        if (tvWidgetRef.current) {
          tvWidgetRef.current.remove();
        }
      };
    }
  }, [name, pairIndex]);

  return (
    <div className="relative mb-[1px] h-[600px] w-full ">
      {isLoading ? (
        <div className="z-9999 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-tizz-background">
          <ReactLoading
            height={20}
            width={50}
            type={"bars"}
            color={"#36d7b7"}
          />
        </div>
      ) : null}
      <div ref={chartContainerRef} className={twMerge("h-full w-full")} />
    </div>
  );
};
