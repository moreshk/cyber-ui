import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
        setLoading(false);
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
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );
          setLoading(false);
          toast("Event has been created", {
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
        }
      } catch (e: any) {
        toast.error(e.message);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="space-y-2 pt-3">
          <div className="space-y-1">
            <div>
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
              0.1 SOL
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount("0.5")}
            >
              0.5 SOL
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAmount("1")}
            >
              1 SOL
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

export default BuyToken;
