import api from "@/lib/axios";
import useSolPriceStore from "@/store/useSolPrice";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { useEffect, useState } from "react";

const MarketCap = () => {
  const { data } = useTokenDetailsStore();
  const { solPrice } = useSolPriceStore();
  const [reserves, setReserves] = useState<
    | {
        reserveOne: number;
        reserveTwo: number;
      }
    | undefined
  >();

  const getReservers = async () => {
    try {
      const { data: response } = await api.get<{
        reserveOne: number;
        reserveTwo: number;
      }>(`/v1/token/reserves?token=${data?.mintAddress}`);
      setReserves(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getReservers();
  }, [data]);
  return (
    <div className="text-right">
      <p>Market Cap</p>
      {reserves && solPrice && (
        <p className="text-[#71BB44] font-bold text-xl">
          $
          {(
            (reserves.reserveTwo / reserves.reserveOne) *
            1000000000 *
            solPrice
          ).toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default MarketCap;
