"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BuyToken from "./BuyToken";
import SellToken from "./SellToken";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";

export default function Swap() {
  const { data } = useTokenDetailsStore();

  if (data?.migrationStatus === "in-progress") {
    return <div>Migration In progress</div>;
  }
  if (data?.migrationStatus === "completed") return <a href="">Radium pool</a>;
  return (
    <Tabs defaultValue="buy" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="buy">Buy</TabsTrigger>
        <TabsTrigger value="sell">Sell</TabsTrigger>
      </TabsList>
      <TabsContent value="buy">
        <BuyToken />
      </TabsContent>
      <TabsContent value="sell">
        <SellToken />
      </TabsContent>
    </Tabs>
  );
}
