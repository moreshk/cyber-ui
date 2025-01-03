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
import axios from "axios";
import api from "@/lib/axios";
import { GraphDetails } from "@/store/useTokenGraphDetailsStore";
import ReconnectingWebSocket from "reconnecting-websocket";

export type TVChartContainerProps = {
  name: string;
  pairIndex: number;
  token: string;
  mintAddress: string;
  classNames?: {
    container: string;
  };
};

// Add this outside the component to cache the data
const dataCache = new Map<string, Bar[]>();

// Modify mockDataFeed to accept token parameter
const createDataFeed = (
  mintAddress: string
): ChartingLibraryWidgetOptions["datafeed"] => ({
  onReady: (callback) => {
    setTimeout(() => {
      callback({
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        supported_resolutions: [
          "1",
          // "3",
          "5",
          // "15",
          // "30",
          "60",
          // "120",
          // "240",
          // "1D",
        ] as ResolutionString[],
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
        pricescale: 10000000000,
        has_intraday: true,
        has_daily: true,
        description: symbolName,
        exchange: "",
        listed_exchange: "",
        format: "price" as SeriesFormat,
        type: "crypto",
        supported_resolutions: [
          "1",
          // "3",
          "5",
          // "15",
          // "30",
          "60",
          // "120",
          // "240",
          // "1D",
        ] as ResolutionString[],
      };
      onSymbolResolvedCallback(symbolInfo);
    }, 0);
  },
  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback
  ) => {
    try {
      const { from, to, countBack } = periodParams;
      const cacheKey = `${symbolInfo.name}-${resolution}-${from}-${to}`;

      // Check cache
      if (dataCache.has(cacheKey)) {
        const cachedData = dataCache.get(cacheKey)!;
        onHistoryCallback(cachedData, {
          noData: cachedData.length === 0,
          nextTime: cachedData.length > 0 ? cachedData[0].time : undefined,
        });
        return;
      }

      // Calculate extended range
      const extendedFrom = from - countBack * 2;

      // Convert resolution to API format if needed
      const apiResolution = resolution === "1D" ? "1440" : resolution;

      // ==========================
      // const response = await axios.get(`/api/candlesticks`, {
      //   params: {
      //     // token: 'twzY8ahJ8FEtc7db81ZrPrVwxzHu7WXGcmEKXXtpump',
      //     // token: '2wWWiDvxPuLrkMMRF5fvjskxf91GXN6nppukAgF2cVnv',
      //     token: '7yY7aQjmTzUe9mZCUHiCPs8ZTcyx41ucoxFjHdGrpump',
      //     from: extendedFrom,
      //     to,
      //     resolution: apiResolution
      //   }
      // });

      // const chartData = response.data;
      // ==========================

      // ==========================
      // const chartData = [{
      //   "mint": "7yY7aQjmTzUe9mZCUHiCPs8ZTcyx41ucoxFjHdGrpump",
      //   "timestamp": 1735798380,
      //   "open": 3.83360252162478e-7,
      //   "high": 3.83496936874864e-7,
      //   "low": 3.83360252162478e-7,
      //   "close": 3.83496936874864e-7,
      //   "volume": 39603922,
      //   "slot": 311347339,
      //   "is_5_min": false,
      //   "is_1_min": true
      // },
      // {
      //   "mint": "7yY7aQjmTzUe9mZCUHiCPs8ZTcyx41ucoxFjHdGrpump",
      //   "timestamp": 1735798440,
      //   "open": 3.83496936874864e-7,
      //   "high": 3.84187567533852e-7,
      //   "low": 3.83496936874864e-7,
      //   "close": 3.84187567533852e-7,
      //   "volume": 200000002,
      //   "slot": 311347520,
      //   "is_5_min": false,
      //   "is_1_min": true
      // },
      // {
      //   "mint": "7yY7aQjmTzUe9mZCUHiCPs8ZTcyx41ucoxFjHdGrpump",
      //   "timestamp": 1735798560,
      //   "open": 3.84187567533852e-7,
      //   "high": 3.8453311585323e-7,
      //   "low": 3.84187567533852e-7,
      //   "close": 3.8453311585323e-7,
      //   "volume": 100000000,
      //   "slot": 311347749,
      //   "is_5_min": false,
      //   "is_1_min": true
      // }].filter((item: any) => {
      //   return item.timestamp >= from && item.timestamp <= to;
      // }).map((bar) => ({
      //   close: parseFloat(bar.close),
      //   open: parseFloat(bar.open),
      //   high: parseFloat(bar.high),
      //   low: parseFloat(bar.low),
      //   time: Math.floor(bar.timestamp) * 1000,
      //   volume: parseFloat(bar.volume),
      // })) as Bar[];
      // ==========================

      // ==========================
      console.log("mintAddress", mintAddress);
      const response = await api.get<GraphDetails[]>(
        `/v1/token/ohlc?token=${mintAddress}`
      );

      const chartData = response.data
        .filter((item: any) => {
          return item.unixTimestamp >= from && item.unixTimestamp <= to;
        })
        .map((bar) => ({
          close: parseFloat(bar.close),
          open: parseFloat(bar.open),
          high: parseFloat(bar.high),
          low: parseFloat(bar.low),
          time: Math.floor(bar.unixTimestamp) * 1000,
          volume: parseFloat(bar.volume),
        })) as Bar[];
      // ==========================

      if (!chartData || chartData.length === 0) {
        onHistoryCallback([], {
          noData: true,
          nextTime: undefined,
        });
        return;
      }

      const bars: Bar[] = chartData.sort((a: Bar, b: Bar) => a.time - b.time);

      // Cache the data
      dataCache.set(cacheKey, bars);

      onHistoryCallback(bars, {
        noData: false,
        nextTime: bars.length > 0 ? bars[0].time : undefined,
      });
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
    let heartbeat: any;
    const rws = new ReconnectingWebSocket(async () => {
      return `${process.env.NEXT_PUBLIC_WS_URL}/v1/g/${mintAddress}`;
    });
    rws.onopen = () => {
      heartbeat = setInterval(() => {
        return rws.send(
          JSON.stringify({ action: "subscribe", topic: mintAddress })
        );
      }, 3000);
    };
    rws.onmessage = (event) => {
      if (event.data === "pong") {
        return;
      }
      if (event.data === "subscribed") {
        return;
      }
      const data = JSON.parse(event.data);
      if (data.event === "new-tx") {
        const details = data.value;
        onRealtimeCallback({
          close: parseFloat(details.close),
          open: parseFloat(details.open),
          high: parseFloat(details.high),
          low: parseFloat(details.low),
          time: Math.floor(details.unixTimestamp) * 1000,
          volume: parseFloat(details.volume),
        });
      }
    };

    return () => clearInterval(heartbeat);
  },
  unsubscribeBars: (subscriberUID) => {
    // Handle unsubscribing logic if necessary
  },
  getServerTime: (callback) => {
    callback(Math.floor(Date.now() / 1000)); // Return current timestamp in seconds
  },
});

// Add this function to clean up old cache entries
const cleanupCache = () => {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000; // 30 minutes

  dataCache.forEach((value, key) => {
    const [, , timestamp] = key.split("-");
    if (now - Number(timestamp) > maxAge) {
      dataCache.delete(key);
    }
  });
};

// Call this periodically or when appropriate
setInterval(cleanupCache, 15 * 60 * 1000); // Clean up every 15 minutes

export const TVChartContainer = ({
  name,
  pairIndex,
  token,
  mintAddress,
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
        datafeed: createDataFeed(mintAddress),
        theme: "dark",
        locale: "en",
        container: elem,
        library_path: `${location.protocol}//${location.host}/libraries/charting_library/`,
        loading_screen: {
          backgroundColor: "#111114",
          foregroundColor: "#111114",
        },
        enabled_features: enabledFeatures,
        disabled_features: [
          ...disabledFeatures.filter(
            (feature) =>
              feature !== "hide_right_scale" &&
              feature !== "header_symbol_search" &&
              feature !== "header_settings"
          ),
          "future_data",
          "go_to_date",
        ],
        client_id: "tradingview.com",
        user_id: "public_user_id",
        fullscreen: false,
        autosize: true,
        // custom_css_url: "/tradingview-chart.css",
        overrides: {
          ...chartOverrides,
          // "mainSeriesProperties.priceFormat.precision": 10,
          // "mainSeriesProperties.priceFormat.minMove": 0.0000000001,
          // "mainSeriesProperties.priceFormat.type": "price",
          // "mainSeriesProperties.priceFormat.pattern": "##.########",
          // "scalesProperties.showRightScale": true,
          // "paneProperties.rightMargin": 12,
          "scalesProperties.fontSize": 10,

          // "scalesProperties.position": "right",
          // "paneProperties.legendProperties.showLegend": true,
          // "paneProperties.legendProperties.showSeriesTitle": false,
          // "paneProperties.legendProperties.showSeriesOHLC": true,
          // "paneProperties.legendProperties.position": "right",
          // "scalesProperties.placeLabelsToTheRight": true,
          // "paneProperties.legendProperties.showSeriesVolume": true,
          // "chartProperties.leftMargin": 12,
          // "chartProperties.rightMargin": 12,
          // "timeScale.rightOffset": 12,
          // "timeScale.barSpacing": 6,
          // "timeScale.fixLeftEdge": true,
          "priceScale.position": "right",
          // "timeScale.lockVisibleTimeRangeOnResize": true,
        },
        interval: "1" as ResolutionString,
        timeframe: {
          from: Math.floor(Date.now() / 1000) - 60 * 60 * 3 * 1,
          to: Math.floor(Date.now() / 1000),
        },
        // timeframe: "2D",
        // studies_overrides: {},
        // saved_data: null,
        timeScale: {
          rightOffset: 12,
          barSpacing: 12,
          fixLeftEdge: true,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
          borderVisible: false,
          visible: true,
          timeVisible: true,
          secondsVisible: false,
        },
      };

      tvWidgetRef.current = new widget(widgetOptions);
      tvWidgetRef.current.onChartReady(function () {
        // tvWidgetRef.current?.activeChart().executeActionById('timeScaleReset');
        // Get the active chart instance
        const chart = tvWidgetRef.current?.activeChart();

        // Apply series properties
        chart?.applyOverrides({
          "mainSeriesProperties.priceLineColor": "#26a69a", // Changed to green
          "mainSeriesProperties.priceAxisProperties.autoScale": true,
          "mainSeriesProperties.priceLineWidth": 1,
          // "mainSeriesProperties.priceLineStyle": 0,
          "scalesProperties.fontSize": 10,
          priceScaleSelectionStrategyName: "right",
          "scalesProperties.showSymbolLabels": false,
        });

        // Set the chart type to candlesticks
        chart?.setChartType(1); // 1 is for candlesticks

        chart?.executeActionById("timeScaleReset");
        setIsLoading(false);
      });

      return () => {
        if (tvWidgetRef.current) {
          tvWidgetRef.current.remove();
        }
      };
    }
  }, [name, pairIndex, token]);

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
