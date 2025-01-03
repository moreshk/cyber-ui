"use client";
import { useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import useTokenDetailsStore, {
  TokenDetails,
} from "@/store/useTokenDetailsStore";
import { useParams } from "next/navigation";
import { mutate as swrMutate } from "swr";

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
        return rws.send(
          JSON.stringify({ action: "subscribe", topic: address })
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
      console.log(event?.data);
      const data = JSON.parse(event.data);
      if (data.event === "comment") {
        mutate((oldData: TokenDetails | null) => {
          if (oldData) {
            return { ...oldData, comments: [...oldData.comments, data.value] };
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
      if (data.event === "agent-credits") {
        mutate((oldData: TokenDetails | null) => {
          if (oldData) {
            return {
              ...oldData,
              agent: {
                ...oldData.agent,
                points: data.value.points,
                usedPoints: data.value.usedPoints,
              },
            };
          } else {
            return null;
          }
        });
      }
      if (data.event === "new-tx") {
        swrMutate(`/v1/token/reserves?token=${address}`);
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
