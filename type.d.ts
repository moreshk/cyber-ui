export type Coin = {
  mintAddress: string;
  creatorWalletAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  imgUrl: string;
  metaDataUrl: string;
  metaData: string;
  privateKey: string;
  description: string;
  supply: number;
  status: "pending" | "minted" | "failed";
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
};
