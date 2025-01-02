import api from "@/lib/axios";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { Crown } from "lucide-react";
import { Line } from "rc-progress";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { config } from "@/config";
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
      if (reserves && +reserves?.reserveOne < config.kingOfTheHill) {
        updateKingOfTheHill(data?.mintAddress);
      }
      if (reserves && +reserves.reserveOne < config.migration) {
        tokenMigration();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getReservers();
  }, [data]);

  if (reserves) {
    const bondingCurveProgress = (
      100 -
      ((reserves?.reserveOne - 200_000_000) / 800_000_000) * 100
    ).toFixed(2);

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
            graduate this coin to raydium at $77,628 market cap.
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
  return null;
};

export default BondingCurveProgress;
