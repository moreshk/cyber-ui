import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

export async function splTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  tokenMint: PublicKey
): Promise<{
  balance: number;
  decimals: number;
  tokenAccount: string | null;
  exists: boolean;
}> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      walletAddress,
      true
    );

    try {
      const account = await getAccount(connection, tokenAccount);

      return {
        balance: Number(account.amount),
        decimals: 9,
        tokenAccount: tokenAccount.toString(),
        exists: true,
      };
    } catch (_: any) {
      console.log(_);
      return {
        balance: 0,
        decimals: 0,
        tokenAccount: tokenAccount.toString(),
        exists: false,
      };
    }
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
}
