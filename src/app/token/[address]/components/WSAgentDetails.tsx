"use client";
import { useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { useParams } from "next/navigation";
import useAgentDetailsStore, {
  AgentDetails,
} from "@/store/useAgentDetailsStore";

const WSAgentDetails = () => {
  const { mutate } = useAgentDetailsStore();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    let heartbeat: any;
    const rws = new ReconnectingWebSocket(async () => {
      return `${process.env.NEXT_PUBLIC_WS_URL}/v1/g/${params.id}`;
    });

    rws.onopen = () => {
      heartbeat = setInterval(() => {
        return rws.send(
          JSON.stringify({ action: "subscribe", topic: params.id })
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
      if (data.event === "agent-credits") {
        mutate((oldData: AgentDetails | null) => {
          if (oldData) {
            return {
              ...oldData,
              points: data.value.points,
              usedPoints: data.value.usedPoints,
            };
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

export default WSAgentDetails;
