export interface Coin {
  mintAddress: string;
  creatorWalletAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  imgUrl: string;
  metaDataUrl: string;
  metaData: string;
  privateKey: string;
  supply: string;
  status: string;
  description: string;
  signature: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: null;
}
export interface Agents {
  id: number;
  name: string;
  ownerWalletAddress: string;
  coinId: string;
  description: string;
  instruction: string;
  knowledge: string;
  personality: string;
  telegramUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  points: string;
  updatedAt: null;
  createdAt: string;
  deletedAt: null;
}

export interface Comment {
  id: number;
  walletAddress: string;
  coinId: string;
  content: string;
  updatedAt: null;
  createdAt: Date;
  deletedAt: null;
}
