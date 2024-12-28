import { first4Characters } from "@/lib/utils";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

interface Holder {
  address: string;
  amount: string;
}

const HolderDistribution = () => {
  const { data } = useTokenDetailsStore();
  const { connection } = useConnection();
  const [holders, setHolders] = useState<Holder[]>([]);

  async function getTokenHolders() {
    if (!data || data.status === "pending") return;
    const mintPubkey = new PublicKey(data.mintAddress);

    try {
      const accounts = await connection.getTokenLargestAccounts(mintPubkey);
      const filteredHolders = accounts.value.filter(
        (account) => +account.amount > 0
      );

      const holdersDetails = filteredHolders.map((holder) => ({
        address: holder.address.toString(),
        amount: holder.amount.toString(),
      }));

      setHolders(holdersDetails);
    } catch (error) {
      console.error("Error fetching token holders:", error);
      throw error;
    }
  }

  useEffect(() => {
    getTokenHolders();
  }, [data, connection]);

  const calculatePercentage = (amount: string): string => {
    const total = holders.reduce(
      (acc, curr) => acc + BigInt(curr.amount),
      BigInt(0)
    );
    const percentage = (BigInt(amount) * BigInt(10000)) / total;
    return (Number(percentage) / 100).toFixed(2);
  };
  if (!holders.length) return;

  return (
    <div className="pt-4 rounded-lg max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Holder distribution</h2>
      </div>
      <div className="space-y-2">
        {holders.map((holder, index) => (
          <div
            key={holder.address}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">{index + 1}.</span>
              <span>{first4Characters(holder.address)}</span>
              {holder.address === data?.creatorWalletAddress && (
                <span>🤵‍♂️ (dev)</span>
              )}
              {index === 0 && <span> 🏦 (bonding curve)</span>}
            </div>
            <span className="text-right">
              {calculatePercentage(holder.amount)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolderDistribution;
