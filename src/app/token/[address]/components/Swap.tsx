"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BuyToken from "./BuyToken";
import SellToken from "./SellToken";

export default function Swap() {
  return (
    <Tabs defaultValue="buy" className="w-[400px]">
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
