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
      return `ws://0.0.0.0:4000/v1/g/home`;
    });

    rws.onopen = () => {
      heartbeat = setInterval(() => {
        rws.send("ping");
      }, 3000);
    };
    rws.onmessage = (event) => {
      if (event.data === "pong") {
        return;
      }
      const data = JSON.parse(event.data);

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
