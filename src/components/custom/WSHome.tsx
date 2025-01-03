"use client";
import { useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Coin } from "../../../type";
import useTokenStore from "@/store/useTokenStore";

const WSHome = () => {
  const { mutate } = useTokenStore();

  useEffect(() => {
    let heartbeat: any;
    const rws = new ReconnectingWebSocket(async () => {
      return `${process.env.NEXT_PUBLIC_WS_URL}/v1/g/home`;
    });

    rws.onopen = () => {
      heartbeat = setInterval(() => {
        return rws.send(JSON.stringify({ action: "subscribe", topic: "home" }));
      }, 3000);
    };
    rws.onmessage = (event) => {
      if (event.data === "pong") {
        return;
      }
      if (event.data === "subscribed") {
        return;
      }

      const data = JSON.parse(event?.data || "{}");

      if (data.event === "token-creation") {
        mutate((oldData: Coin[] | null) => {
          if (oldData) {
            return [data.value, ...oldData];
          } else {
            return null;
          }
        });
      }
    };

    return () => {
      clearInterval(heartbeat);
      rws.close();
    };
  }, []);
  return null;
};

export default WSHome;
