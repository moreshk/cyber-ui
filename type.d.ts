export interface Coin {
  mintAddress: string;
  kingOfTheHillTimeStamp: string;
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
  marketCap?: string;
  agent: Agents;
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
  telegramName?: string;
  telegramToken?: string;
  agentId?: string;
  usedPoints: string;
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

export interface Owner {
  walletAddress: string;
  username: string;
  role: string;
  lastLogin: string;
  updatedAt: null;
  createdAt: string;
  deletedAt: null;
}

interface Tx {
  id: number;
  coinId: string;
  walletAddress: string;
  type: string;
  pricePerCoin: string;
  solQuantity: string;
  tokenQuantity: string;
  transactionHash: string;
  metadata: string;
  timestamp: null;
  updatedAt: null;
  createdAt: string;
  deletedAt: null;
  user: Owner;
}
