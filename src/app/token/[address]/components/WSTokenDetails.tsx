"use client";
import { useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import useTokenDetailsStore, {
  TokenDetails,
} from "@/store/useTokenDetailsStore";
import { useParams } from "next/navigation";

const WSTokenDetails = () => {
  const { mutate } = useTokenDetailsStore();
  const { address } = useParams() as { address: string };

  useEffect(() => {
    let heartbeat: any;
    const rws = new ReconnectingWebSocket(async () => {
      return `${process.env.NEXT_PUBLIC_WS_URL}/v1/g/${address}`;
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

      if (data.event === "comment") {
        mutate((oldData: TokenDetails | null) => {
          if (oldData) {
            return { ...oldData, comments: [data.value, ...oldData.comments] };
          } else {
            return null;
          }
        });
      }
      if (data.event === "token-minted") {
        mutate((oldData: TokenDetails | null) => {
          if (oldData) {
            return { ...oldData, status: "success" };
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

export default WSTokenDetails;
