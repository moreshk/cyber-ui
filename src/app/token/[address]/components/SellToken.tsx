/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { swapTx } from "@/lib/web3";
import { useAuth } from "@/providers/Auth";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Label } from "@radix-ui/react-label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const SellToken = () => {
  const [amount, setAmount] = useState("0.00");
  const [balance, setBalance] = useState(0);
  const { data } = useTokenDetailsStore();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch balance from the blockchain
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && data?.mintAddress) {
        try {
          const tokenAccountInfo = await connection.getTokenAccountsByOwner(
            publicKey,
            {
              mint: new PublicKey(data.mintAddress),
            }
          );
          const tokenBalance =
            // @ts-ignore
            tokenAccountInfo.value[0]?.account?.data?.parsed?.info?.tokenAmount
              ?.uiAmount || 0;
          setBalance(tokenBalance);
        } catch (error) {
          console.error("Error fetching token balance:", error);
          setBalance(0);
        }
      }
    };
    fetchBalance();
  }, [publicKey, data?.mintAddress, connection]);

  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    if (balance > 0) {
      const calculatedAmount = ((balance * percentage) / 100).toFixed(2);
      setAmount(calculatedAmount);
    }
  };

  const swap = async () => {
    if (!isAuthenticated) return toast.error("Please connect wallet");
    if (!publicKey || !signTransaction) return;
    if (!data) return;
    try {
      setLoading(true);
      const privateKeyArray = bs58.decode(data.privateKey);
      const mint = Keypair.fromSecretKey(privateKeyArray);
      const swap = await swapTx(mint.publicKey, publicKey, amount, 1);
      if (swap) {
        const { blockhash } = await connection.getLatestBlockhash();
        swap.recentBlockhash = blockhash;
        swap.feePayer = publicKey;
        const signedTransaction = await signTransaction(swap);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
        setLoading(false);
        toast("Transaction successful", {
          action: {
            label: "View on SolScan",
            onClick: () => {
              window.open(
                `https://solscan.io/tx/${signature}?cluster=devnet`,
                "_blank"
              );
            },
          },
        });
      }
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message);
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="space-y-2 pt-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Amount in ({data?.name})</Label>
              <p className="text-sm text-gray-500">
                Available Balance: {balance.toFixed(2) || "-"} {data?.name}
              </p>
            </div>
            <Input
              value={amount}
              onChange={(e) => {
                handleAmountChange(e.target.value);
              }}
              placeholder="0.1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAmountChange("")}
            >
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount(25)}
            >
              25%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount(50)}
            >
              50%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount(100)}
            >
              100%
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={swap} loading={loading} className="w-full" size="lg">
            Swap Tokens
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SellToken;
