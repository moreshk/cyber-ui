import api from "@/lib/axios";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { Crown } from "lucide-react";
import { Line } from "rc-progress";
import { useEffect } from "react";
import dayjs from "dayjs";
import { config } from "@/config";
import useSWR from "swr";
const updateKingOfTheHill = async (token?: string) => {
  try {
    await api.get(`/v1/token/king-of-the-hill?token=${token}`);
  } catch (e) {
    console.log(e);
  }
};

const tokenMigration = async (token?: string) => {
  try {
    await api.get(`/v1/token/king-of-the-hill?token=${token}`);
  } catch (e) {
    console.log(e);
  }
};

const BondingCurveProgress = () => {
  const { data } = useTokenDetailsStore();
  const { data: reserves } = useSWR<{
    reserveOne: number;
    reserveTwo: number;
  }>(`/v1/token/reserves?token=${data?.mintAddress}`);

  const getReservers = async () => {
    try {
      if (reserves && +reserves?.reserveOne <= config.kingOfTheHill) {
        updateKingOfTheHill(data?.mintAddress);
      }
      if (reserves && +reserves.reserveOne <= config.migration) {
        tokenMigration();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getReservers();
  }, [reserves]);

  if (reserves) {
    const bondingCurveProgress = (
      100 -
      ((reserves?.reserveOne - 900_000_000) / 100_000_000) * 100 // Update this as per bonding curve limit
    ).toFixed(2);
    // 100_000_000 is the bonding curve limit, 900_000_000 is the current reserve
    
    return (
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg">
              bonding curve progress: {bondingCurveProgress}%
            </span>
            <button className="opacity-60 hover:opacity-100">
              <span className="text-xl">ⓘ</span>
            </button>
          </div>
          <Line
            percent={+bondingCurveProgress}
            strokeWidth={4}
            strokeColor="#8066BD"
            trailWidth={4}
          />
          <p className="text-gray-400 mt-2">
            graduate this coin to raydium at $100,000 market cap.
            <br />
            there is {(+reserves.reserveTwo - 30).toFixed(2)} SOL in the bonding
            curve.
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-lg">
              king of the hill progress: {+bondingCurveProgress * 2}%
            </span>
            <button className="opacity-60 hover:opacity-100">
              <span className="text-xl">ⓘ</span>
            </button>
          </div>
          <Line
            percent={+bondingCurveProgress * 2}
            strokeWidth={4}
            strokeColor="#F9BF85"
            trailWidth={4}
          />
          {data?.kingOfTheHillTimeStamp && (
            <div className="flex items-center gap-2 text-yellow-500 mt-2">
              <Crown size={20} />
              <span>
                crowned king of the hill on{" "}
                {dayjs(data?.kingOfTheHillTimeStamp).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg">bonding curve progress: {0}%</span>
          <button className="opacity-60 hover:opacity-100">
            <span className="text-xl">ⓘ</span>
          </button>
        </div>
        <Line
          percent={0}
          strokeWidth={4}
          strokeColor="#8066BD"
          trailWidth={4}
        />
        <p className="text-gray-400 mt-2">
          graduate this coin to raydium at $100,000 market cap.
          <br />
          there is {(0).toFixed(2)} SOL in the bonding curve.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-gray-400">
          <span className="text-lg">king of the hill progress: {0}%</span>
          <button className="opacity-60 hover:opacity-100">
            <span className="text-xl">ⓘ</span>
          </button>
        </div>
        <Line
          percent={0}
          strokeWidth={4}
          strokeColor="#F9BF85"
          trailWidth={4}
        />
        {data?.kingOfTheHillTimeStamp && (
          <div className="flex items-center gap-2 text-yellow-500 mt-2">
            <Crown size={20} />
            <span>
              crowned king of the hill on{" "}
              {dayjs(data?.kingOfTheHillTimeStamp).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BondingCurveProgress;
