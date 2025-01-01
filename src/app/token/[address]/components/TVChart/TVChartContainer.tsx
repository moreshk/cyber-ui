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

export type TVChartContainerProps = {
  name: string;
  pairIndex: number;
  token: string;
  classNames?: {
    container: string;
  };
};

// Add this outside the component to cache the data
const dataCache = new Map<string, Bar[]>();

const mockDataFeed: ChartingLibraryWidgetOptions["datafeed"] = {
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
          // "60",
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
          // "60",
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
          nextTime: cachedData.length > 0 ? cachedData[0].time : undefined 
        });
        return;
      }

      // Calculate extended range
      const extendedFrom = from - (countBack * 2);
      
      // Convert resolution to API format if needed
      const apiResolution = resolution === "1D" ? "1440" : resolution;
      
      const response = await axios.get(`/api/candlesticks`, {
        params: {
          // token: 'twzY8ahJ8FEtc7db81ZrPrVwxzHu7WXGcmEKXXtpump',
          token: '2wWWiDvxPuLrkMMRF5fvjskxf91GXN6nppukAgF2cVnv',
          from: extendedFrom,
          to,
          resolution: apiResolution
        }
      });

      const chartData = response.data;
      
      if (!chartData || chartData.length === 0) {
        onHistoryCallback([], { 
          noData: true,
          nextTime: undefined
        });
        return;
      }

      const bars: Bar[] = chartData
        .sort((a: Bar, b: Bar) => a.time - b.time);

      // Cache the data
      dataCache.set(cacheKey, bars);

      onHistoryCallback(bars, { 
        noData: false,
        nextTime: bars.length > 0 ? bars[0].time : undefined
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
    const interval = setInterval(() => {
      // const bar: Bar = {
      //   time: Date.now(), // 1623456789*1000
      //   open: 100,
      //   high: 120,
      //   low: 90,
      //   close: 110,
      //   volume: 1200,
      // };
      // onRealtimeCallback(bar);
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

// Add this function to clean up old cache entries
const cleanupCache = () => {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000; // 30 minutes
  
  dataCache.forEach((value, key) => {
    const [, , timestamp] = key.split('-');
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
        disabled_features: [
          ...disabledFeatures.filter(feature => 
            feature !== 'hide_right_scale' && 
            feature !== 'header_symbol_search' &&
            feature !== 'header_settings'
          ),
          'future_data',
          'go_to_date',
          'time_scale_right_margin',
        ],
        client_id: "tradingview.com",
        user_id: "public_user_id",
        fullscreen: false,
        autosize: true,
        // custom_css_url: "/tradingview-chart.css",
        overrides: {
          ...chartOverrides,
          "mainSeriesProperties.priceFormat.precision": 10,
          "mainSeriesProperties.priceFormat.minMove": 0.0000000001,
          "mainSeriesProperties.priceFormat.type": "price",
          // "mainSeriesProperties.priceFormat.pattern": "##.########",
          "mainSeriesProperties.priceFormat.useFixedPrecision": true,
          "scalesProperties.showRightScale": true,
          "paneProperties.rightMargin": 12,
          "scalesProperties.fontSize": 10,
          "scalesProperties.position": "right",
          "paneProperties.legendProperties.showLegend": true,
          "paneProperties.legendProperties.showSeriesTitle": false,
          "paneProperties.legendProperties.showSeriesOHLC": true,
          "paneProperties.legendProperties.position": "right",
          "scalesProperties.placeLabelsToTheRight": true,
          "paneProperties.legendProperties.showSeriesVolume": true,
          "chartProperties.leftMargin": 12,
          "chartProperties.rightMargin": 12,
          "timeScale.rightOffset": 12,
          "timeScale.barSpacing": 6,
          "timeScale.fixLeftEdge": true,
          "timeScale.lockVisibleTimeRangeOnResize": true,
        },
        interval: "1" as ResolutionString,
        timeframe: {
          from: Math.floor(Date.now() / 1000) - (60 * 60 * 12 * 1),
          to: Math.floor(Date.now() / 1000),
        },
        // studies_overrides: {},
        // saved_data: null,
      };

      tvWidgetRef.current = new widget(widgetOptions);
      tvWidgetRef.current.onChartReady(function () {
        // tvWidgetRef.current?.activeChart().executeActionById('timeScaleReset');
        // Get the active chart instance
        const chart = tvWidgetRef.current?.activeChart();
        
        // Apply series properties
        chart?.applyOverrides({
          "mainSeriesProperties.priceLineColor": "#26a69a",  // Changed to green
          "mainSeriesProperties.priceLineWidth": 1,
          "mainSeriesProperties.priceLineStyle": 0,
        });

        // Set the chart type to candlesticks
        chart?.setChartType(1); // 1 is for candlesticks

        chart?.executeActionById('timeScaleReset');
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
