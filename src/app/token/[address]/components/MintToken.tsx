"use client";
import bs58 from "bs58";
import * as React from "react";
import { Button } from "@/components/ui/button";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/providers/Auth";

export default function MintToken({ onDone }: { onDone: () => void }) {
  const { data } = useTokenDetailsStore();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const mint = async () => {
    if (!isAuthenticated) return toast.error("Connect Wallet");
    if (!publicKey || !signTransaction) return;
    if (!data) return;
    const privateKeyArray = bs58.decode(data.privateKey);
    const mint = Keypair.fromSecretKey(privateKeyArray);
    if (data.status === "pending") {
      try {
        setLoading(true);
        const {
          data: { serializedTransaction },
        } = await api.post<{ serializedTransaction: string }>("/v1/coin/mint", {
          token: data.mintAddress,
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
        onDone();
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        console.log(e);
        toast.error(e.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h">
      <Button loading={loading} onClick={mint}>
        Unlock Token
      </Button>
    </div>
  );
}
