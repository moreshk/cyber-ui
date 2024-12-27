// TradingViewChart.tsx
import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewConfig) => any;
    };
  }
}

interface TradingViewConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: "light" | "dark";
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  container_id: string;
  hide_side_toolbar: boolean;
  studies?: string[];
  disabled_features?: string[];
  enabled_features?: string[];
  charts_storage_url?: string;
  client_id?: string;
  user_id?: string;
  loading_screen?: {
    backgroundColor: string;
    foregroundColor: string;
  };
}

const TradingViewChart: React.FC = () => {
  const onLoadScriptRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    const tvScriptLoadingPromise = new Promise<void>((resolve) => {
      if (!document.getElementById("tradingview-widget-loading-script")) {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = () => resolve();
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => {
      onLoadScriptRef.current = null;
    };
  }, []);

  const createWidget = (): void => {
    if (
      document.getElementById("tradingview-widget") &&
      "TradingView" in window
    ) {
      const config: TradingViewConfig = {
        autosize: true,
        symbol: "BHPC",
        interval: "5",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview-widget",
        toolbar_bg: "#f1f3f6",
        hide_side_toolbar: false,
        studies: [
          "RSI@tv-basicstudies",
          "MASimple@tv-basicstudies",
          "MACD@tv-basicstudies",
        ],
        disabled_features: ["header_symbol_search", "header_screenshot"],
        enabled_features: ["study_templates", "use_localstorage_for_settings"],
        charts_storage_url: "https://saveload.tradingview.com",
        client_id: "your_client_id_here",
        user_id: "public_user_id",
        loading_screen: {
          backgroundColor: "#131722",
          foregroundColor: "#2962FF",
        },
      };

      new window.TradingView.widget(config);
    }
  };

  return (
    <div
      className="tradingview-chart-container flex-1"
      style={{ height: "100vh" }}
    >
      <div id="tradingview-widget" style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default TradingViewChart;
