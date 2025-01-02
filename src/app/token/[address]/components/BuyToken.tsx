import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { swapTx } from "@/lib/web3";
import { useAuth } from "@/providers/Auth";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Label } from "@radix-ui/react-label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BuyToken = () => {
  const [amount, setAmount] = useState("0.00");
  const [balance, setBalance] = useState(0);
  const { data } = useTokenDetailsStore();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1e9); // Convert lamports to SOL
      }
    };
    fetchBalance();
  }, [publicKey, connection]);

  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickAmount = (value: string) => {
    setAmount(value);
  };

  const swap = async () => {
    if (!isAuthenticated) return toast.error("Please connect wallet");
    if (!publicKey || !signTransaction) return;
    if (!data) return;
    if (data.status === "pending") {
      try {
        setLoading(true);
        const privateKeyArray = bs58.decode(data.privateKey);
        const mint = Keypair.fromSecretKey(privateKeyArray);
        const {
          data: { serializedTransaction },
        } = await api.post<{ serializedTransaction: string }>("/v1/coin/mint", {
          token: data.mintAddress,
          amount: amount,
        });
        const tx = Transaction.from(bs58.decode(serializedTransaction));
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = publicKey;
        tx.sign(mint);
        const signedTransaction = await signTransaction(tx);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
        await api.post<{ serializedTransaction: string }>("/v1/coin/minted", {
          token: data.mintAddress,
          tx: signature,
        });
        await api.post("/v1/coin/tx", {
          type: "buy",
          token: data.mintAddress,
          txHash: signature,
        });
        setLoading(false);
        toast.error("Congratulations you are the first person to buy");
      } catch (e: any) {
        setLoading(false);
        toast.error(e.message);
        console.log(e);
      }
    } else {
      try {
        setLoading(true);
        const privateKeyArray = bs58.decode(data.privateKey);
        const mint = Keypair.fromSecretKey(privateKeyArray);
        const swap = await swapTx(mint.publicKey, publicKey, amount, 2);
        if (swap) {
          const { blockhash } = await connection.getLatestBlockhash();
          swap.recentBlockhash = blockhash;
          swap.feePayer = publicKey;
          const signedTransaction = await signTransaction(swap);

          const rawTransaction = signedTransaction.serialize();

          const signature = await connection.sendRawTransaction(
            rawTransaction,
            {
              skipPreflight: false, // Optional: Skip preflight checks if you trust the transaction
            }
          );
          await connection.confirmTransaction(signature, "finalized");
          const res = await api.post("/v1/coin/tx", {
            type: "buy",
            token: data.mintAddress,
            txHash: signature,
          });
          setLoading(false);
          toast("Transaction Success", {
            action: {
              actionButtonStyle: {
                background: "black",
                color: "white",
                borderRadius: "10px",
                padding: "4px",
              },
              label: "View on SolScan",
              onClick: () => {
                window.open(
                  `https://solscan.io/tx/${signature}?cluster=devnet`,
                  "_blank"
                );
              },
            },
          });
          console.log("swap response: ", res);
        }
      } catch (e: any) {
        toast.error(e.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="pt-4">
        <Label htmlFor="username">Amount in (SOL)</Label>
        <p className="text-sm text-gray-500">
          Available Balance: {balance.toFixed(2) || "-"} (Sol)
        </p>
      </div>
      <Input
        value={amount}
        onChange={(e) => {
          handleAmountChange(e.target.value);
        }}
        placeholder="0.1"
      />
      <div className="flex gap-2">
        <Button
          className="bg-baseSecondary"
          size="sm"
          variant="outline"
          onClick={() => handleAmountChange("")}
        >
          reset
        </Button>
        <Button
          className="bg-baseSecondary"
          size="sm"
          variant="outline"
          onClick={() => handleQuickAmount("0.1")}
        >
          0.1 SOL
        </Button>
        <Button
          className="bg-baseSecondary"
          size="sm"
          variant="outline"
          onClick={() => handleQuickAmount("0.5")}
        >
          0.5 SOL
        </Button>
        <Button
          className="bg-baseSecondary"
          size="sm"
          variant="outline"
          onClick={() => handleQuickAmount("1")}
        >
          1 SOL
        </Button>
      </div>

      <Button onClick={swap} loading={loading} className="w-full" size="lg">
        Please Trade
      </Button>
    </div>
  );
};

export default BuyToken;
