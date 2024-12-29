import api from "@/lib/axios";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { Crown } from "lucide-react";
import { Line } from "rc-progress";
import { useEffect } from "react";

const BondingCurveProgress = () => {
  const { data } = useTokenDetailsStore();

  const getReservers = async () => {
    try {
      const { data: response } = await api.get(
        `/v1/token/reserves?token=${data?.mintAddress}`
      );
      console.log("🚀 ~ getReservers ~ data:", response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getReservers();
  }, []);

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg">bonding curve progress: 96%</span>
          <button className="opacity-60 hover:opacity-100">
            <span className="text-xl">ⓘ</span>
          </button>
        </div>
        <Line
          percent={8}
          strokeWidth={4}
          strokeColor="#8066BD"
          trailWidth={4}
        />
        <p className="text-gray-400 mt-2">
          graduate this coin to raydium at $77,628 market cap.
          <br />
          there is 70.998 SOL in the bonding curve.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-gray-400">
          <span className="text-lg">king of the hill progress: 100%</span>
          <button className="opacity-60 hover:opacity-100">
            <span className="text-xl">ⓘ</span>
          </button>
        </div>
        <Line
          percent={8}
          strokeWidth={4}
          strokeColor="#F9BF85"
          trailWidth={4}
        />
        <div className="flex items-center gap-2 text-yellow-500 mt-2">
          <Crown size={20} />
          <span>crowned king of the hill on 12/26/2024, 10:28:19 AM</span>
        </div>
      </div>
    </div>
  );
};

export default BondingCurveProgress;
