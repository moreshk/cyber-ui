"use client";
import bs58 from "bs58";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { swapTx } from "@/lib/web3";

export default function Swap() {
  const [tradeType, setTradeType] = React.useState("buy");
  const [amount, setAmount] = React.useState("0.00");
  const { data } = useTokenDetailsStore();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickAmount = (value: string) => {
    setAmount(value);
  };

  const swap = async () => {
    if (!publicKey || !signTransaction) return;
    if (!data) return;
    const privateKeyArray = bs58.decode(data.privateKey);
    const mint = Keypair.fromSecretKey(privateKeyArray);
    if (data.status === "pending") {
      try {
        const {
          data: { serializedTransaction },
        } = await api.post<{ serializedTransaction: string }>("/v1/coin/mint", {
          token: data.mintAddress,
        });
        const tx = Transaction.from(bs58.decode(serializedTransaction));
        // const swap = await swapTx(
        //   mint.publicKey,
        //   publicKey,
        //   amount,
        //   tradeType === "buy" ? 2 : 1
        // );
        // if (swap) tx.add(swap);
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
      } catch (e: any) {
        console.log(e);
        toast.error(e.message);
      }
    } else {
      const swap = await swapTx(
        mint.publicKey,
        publicKey,
        amount,
        tradeType === "buy" ? 2 : 1
      );
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
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-xl bg-gray-900 text-gray-100">
      <div className="space-y-6">
        <ToggleGroup
          type="single"
          value={tradeType}
          onValueChange={(value) => value && setTradeType(value)}
        >
          <ToggleGroupItem
            value="buy"
            className={`w-1/2 h-12 text-lg font-medium ${
              tradeType === "buy"
                ? "bg-green-500 hover:bg-green-600 text-gray-900"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            buy
          </ToggleGroupItem>
          <ToggleGroupItem
            value="sell"
            className={`w-1/2 h-12 text-lg font-medium ${
              tradeType === "sell"
                ? "bg-green-500 hover:bg-green-600 text-gray-900"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            sell
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="space-y-2">
          <label className="text-lg">amount (SOL)</label>
          <div className="relative">
            <Input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full h-14 bg-gray-800 border-gray-700 text-2xl pr-20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-xl">SOL</span>
              <svg
                className="w-5 h-5"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 397.7 311.7"
                xmlSpace="preserve"
              >
                <style
                  type="text/css"
                  dangerouslySetInnerHTML={{
                    __html:
                      "\n\t.st0{fill:url(#SVGID_1_);}\n\t.st1{fill:url(#SVGID_2_);}\n\t.st2{fill:url(#SVGID_3_);}\n",
                  }}
                />
                <linearGradient
                  id="SVGID_1_"
                  gradientUnits="userSpaceOnUse"
                  x1="360.8791"
                  y1="351.4553"
                  x2="141.213"
                  y2="-69.2936"
                  gradientTransform="matrix(1 0 0 -1 0 314)"
                >
                  <stop offset={0} style={{ stopColor: "#00FFA3" }} />
                  <stop offset={1} style={{ stopColor: "#DC1FFF" }} />
                </linearGradient>
                <path
                  className="st0"
                  d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
	c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"
                />
                <linearGradient
                  id="SVGID_2_"
                  gradientUnits="userSpaceOnUse"
                  x1="264.8291"
                  y1="401.6014"
                  x2="45.163"
                  y2="-19.1475"
                  gradientTransform="matrix(1 0 0 -1 0 314)"
                >
                  <stop offset={0} style={{ stopColor: "#00FFA3" }} />
                  <stop offset={1} style={{ stopColor: "#DC1FFF" }} />
                </linearGradient>
                <path
                  className="st1"
                  d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
	c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"
                />
                <linearGradient
                  id="SVGID_3_"
                  gradientUnits="userSpaceOnUse"
                  x1="312.5484"
                  y1="376.688"
                  x2="92.8822"
                  y2="-44.061"
                  gradientTransform="matrix(1 0 0 -1 0 314)"
                >
                  <stop offset={0} style={{ stopColor: "#00FFA3" }} />
                  <stop offset={1} style={{ stopColor: "#DC1FFF" }} />
                </linearGradient>
                <path
                  className="st2"
                  d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
	c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 hover:bg-gray-700 border-gray-700"
            onClick={() => handleAmountChange("")}
          >
            reset
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 hover:bg-gray-700 border-gray-700"
            onClick={() => handleQuickAmount("0.1")}
          >
            0.1 SOL
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 hover:bg-gray-700 border-gray-700"
            onClick={() => handleQuickAmount("0.5")}
          >
            0.5 SOL
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 hover:bg-gray-700 border-gray-700"
            onClick={() => handleQuickAmount("1")}
          >
            1 SOL
          </Button>
        </div>

        <Button
          onClick={swap}
          className="w-full h-14 text-lg font-medium bg-green-500 hover:bg-green-600 text-gray-900"
        >
          place trade
        </Button>
      </div>
    </div>
  );
}
