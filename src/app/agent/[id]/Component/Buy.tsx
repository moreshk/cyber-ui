import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import useAgentDetailsStore from "@/store/useAgentDetailsStore";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import React, { useState } from "react";
import { toast } from "sonner";

interface Package {
  title: string;
  credits: string;
  description: string;
  price: string;
  color: string;
}

interface PricingCardProps extends Package {
  key?: number | string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  color,
}) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data } = useAgentDetailsStore();
  const [loading, setLoading] = useState(false);
  const handleTransaction = async () => {
    if (!publicKey || !sendTransaction) {
      console.error("Wallet not connected!");
      return;
    }

    try {
      setLoading(true);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "3KHQ26KaTEceAWdSr7r1Wdb4EjzfURJkV9BVykrhDJrF"
          ),
          lamports: parseFloat(price) * 1e9,
        })
      );
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      await api.post("/v1/agent/add-credits", {
        token: data?.coinId,
        txHash: signature,
      });
      toast.success("Credits added to the agent");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Transaction failed:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col h-full">
      <div className="flex justify-center mb-6">
        <div
          className={`w-32 h-32 ${color} rounded-lg shadow-lg flex items-center justify-center`}
        >
          <div className="w-24 h-24 bg-white/20 rounded-lg transform rotate-45 relative">
            <div className="absolute top-0 left-0 w-full h-full -rotate-45 flex items-center justify-center">
              <div className="w-16 h-4 bg-white/30 rounded-full transform -translate-y-4" />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">{title}</h2>

      <p className="text-gray-600 mb-6 flex-grow">{description}</p>

      <div className="space-y-4">
        <Button
          loading={loading}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          onClick={handleTransaction}
        >
          {price} SOL
        </Button>

        <p className="text-xs text-gray-500 text-center">
          10% will be used to buy back & burning SHAT™
        </p>
      </div>
    </div>
  );
};

const Buy: React.FC = () => {
  const packages: Package[] = [
    {
      title: "Kick-off Package",
      credits: "100",
      description:
        "Contains 100 credits to help you get familiar with the world of autonomous agents.",
      price: "0.1",
      color: "bg-gradient-to-br from-red-400 to-red-500",
    },
    {
      title: "Goatse Package",
      credits: "1000",
      description:
        "Contains 1000 credits as you've learned how to interact and experiment with autonomous agents.",
      price: "1",
      color: "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400",
    },
    {
      title: "Terminator Package",
      credits: "4000",
      description:
        "Contains 4000 credits for you, the ultimate boss, to supercharge your AI agent to infiltrate humanity.",
      price: "3",
      color: "bg-gradient-to-br from-blue-400 to-cyan-400",
    },
  ];

  return (
    <div>
      <div className="mb-4 bg-blue-500 text-white p-4 rounded-lg text-center">
        Your agent runs on credits. 1 Telegram message / 1 prompt change / 1
        Tweet each uses one credit.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <PricingCard key={index} {...pkg} />
        ))}
      </div>
    </div>
  );
};

export default Buy;
