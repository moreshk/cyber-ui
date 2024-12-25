import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { swapTx } from "@/lib/web3";
import { useAuth } from "@/providers/Auth";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Label } from "@radix-ui/react-label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "sonner";

const SellToken = () => {
  const [amount, setAmount] = useState("0.00");
  const { data } = useTokenDetailsStore();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

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
        console.log("Transaction successful:", signature);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="space-y-2 pt-3">
          <div className="space-y-1">
            <Label htmlFor="username">Amount in ({data?.name})</Label>
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
              reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount("0.1")}
            >
              25%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount("0.5")}
            >
              50%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount("1")}
            >
              100%
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={swap} loading={loading} className="w-full" size="lg">
            Please Trade
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SellToken;
