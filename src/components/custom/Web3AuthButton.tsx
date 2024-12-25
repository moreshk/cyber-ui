"use client";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { truncateAddress } from "@/lib/utils";
import { useAuth } from "@/providers/Auth";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Web3AuthButton = () => {
  const { signMessage, publicKey, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const { isLoading, isAuthenticated, mutate } = useAuth();

  const handleSignMessage = async () => {
    try {
      await connect();
    } catch (e) {
      console.log(e);
    }

    if (!signMessage || !publicKey) return;
    try {
      setLoading(true);
      const message = Date.now().toString();
      const signature = await signMessage(new TextEncoder().encode(message));
      const signatureBase58 = bs58.encode(signature);
      const {
        data: { token },
      } = await api.post<{ token: string }>("/v1/auth/verify-signature", {
        signature: signatureBase58,
        walletAddress: publicKey.toString(),
        message,
      });
      localStorage.setItem("auth-x-token", token);
      await mutate();
      toast.success("wallet Connected");
    } catch (error) {
      console.error("Error signing message:", error);
      toast.error("Unable to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && publicKey && !isLoading) {
      handleSignMessage();
    }
  }, [publicKey]);

  return (
    <div>
      {publicKey ? (
        <Button
          loading={loading}
          loadingText="connecting..."
          onClick={handleSignMessage}
        >
          <Wallet />
          {isAuthenticated && publicKey
            ? truncateAddress(publicKey.toString())
            : "Connect"}
        </Button>
      ) : (
        <WalletMultiButton style={{}} />
      )}
    </div>
  );
};

export default Web3AuthButton;
