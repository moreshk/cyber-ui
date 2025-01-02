"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BuyToken from "./BuyToken";
import SellToken from "./SellToken";

export default function Swap() {
  // const migration = async () => {
  //   try {
  //     setMigration(true);
  //     await api.get(`/v1/token/migration?token=${data?.mintAddress}`);
  //     setMigration(true);
  //   } catch (e) {
  //     setMigration(false);
  //     console.log(e);
  //   }
  // };

  // useEffect(() => {
  //   migration();
  // }, []);

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
