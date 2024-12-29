import { first4Characters } from "@/lib/utils";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import useTxDetailsStore from "@/store/useTokenTxStore";
import { Clock, ExternalLink } from "lucide-react";
import { useEffect } from "react";

const TxList = () => {
  const { data, fetchTxs } = useTxDetailsStore();
  const { data: tokenDetails } = useTokenDetailsStore();

  useEffect(() => {
    if (tokenDetails?.mintAddress) fetchTxs(tokenDetails?.mintAddress);
  }, []);

  return (
    <div>
      {" "}
      <div className="w-full bg-gray-900 text-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-800">
              <th className="text-left py-3 px-4">account</th>
              <th className="text-left py-3 px-4">type</th>
              <th className="text-left py-3 px-4">SOL</th>
              <th className="text-left py-3 px-4">X COIN</th>
              <th className="text-left py-3 px-4">date</th>
              <th className="text-right py-3 px-4">transaction</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((tx) => (
              <tr
                key={tx.transactionHash}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                    <span className="font-mono">
                      {first4Characters(tx.user.walletAddress)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      tx.type === "buy"
                        ? "text-green-400 bg-green-400/10"
                        : "text-red-400 bg-red-400/10"
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-3 px-4">{Number(tx.solQuantity)}</td>
                <td className="py-3 px-4">{Number(tx.tokenQuantity)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{tx.timestamp}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-mono text-gray-400">
                      {first4Characters(tx.transactionHash)}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TxList;
