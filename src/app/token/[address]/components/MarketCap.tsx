import useSolPriceStore from "@/store/useSolPrice";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import useSWR from "swr";

const MarketCap = () => {
  const { data } = useTokenDetailsStore();
  const { data: reserves } = useSWR<{
    reserveOne: number;
    reserveTwo: number;
  }>(`/v1/token/reserves?token=${data?.mintAddress}`);
  const { solPrice } = useSolPriceStore();

  return (
    <div className="text-right">
      <p>Market Cap</p>
      {solPrice && (
        <>
          {reserves ? (
            <p className="text-[#71BB44] font-bold text-xl">
              $
              {(
                (reserves.reserveTwo / reserves.reserveOne) *
                1000000000 *
                solPrice
              ).toFixed(2)}
            </p>
          ) : (
            <p className="text-[#71BB44] font-bold text-xl">$ 0.00</p>
          )}
        </>
      )}
    </div>
  );
};

export default MarketCap;
