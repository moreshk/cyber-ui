import {
  Connection,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { PROGRAM_ID } from "./programId";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { SwapAccounts, SwapArgs, swap } from "./swap";
import * as anchor from "@coral-xyz/anchor";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

const curveSeed = "CurveConfiguration";
const POOL_SEED_PREFIX = "liquidity_pool";

export const connection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=44b7171f-7de7-4e68-9d08-eff1ef7529bd"
);

// const privateKey = base58.decode(process.env.PRIVATE_KEY!);

// export const adminKeypair = web3.Keypair.fromSecretKey(privateKey);
// const adminWallet = new NodeWallet(adminKeypair);

export const getTokenBalance = async (
  walletAddress: string,
  tokenMintAddress: string
) => {
  const wallet = new PublicKey(walletAddress);
  const tokenMint = new PublicKey(tokenMintAddress);

  // Fetch the token account details
  const response = await connection.getTokenAccountsByOwner(wallet, {
    mint: tokenMint,
  });

  if (response.value.length == 0) {
    console.log("No token account found for the specified mint address.");
    return;
  }

  // Get the balance
  const tokenAccountInfo = await connection.getTokenAccountBalance(
    response.value[0].pubkey
  );

  // Convert the balance from integer to decimal format
  console.log(`Token Balance: ${tokenAccountInfo.value.uiAmount}`);

  return tokenAccountInfo.value.uiAmount;
};

// Swap transaction
export const swapTx = async (
  mint1: PublicKey,
  wallet: PublicKey,
  amount: string,
  type: number
): Promise<Transaction | undefined> => {
  try {
    const [curveConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from(curveSeed)],
      PROGRAM_ID
    );
    const [poolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(POOL_SEED_PREFIX), mint1.toBuffer()],
      PROGRAM_ID
    );
    const [globalAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      PROGRAM_ID
    );
    const poolTokenOne = await getAssociatedTokenAddress(
      mint1,
      globalAccount,
      true
    );

    const { instructions, destinationAccounts } =
      await getATokenAccountsNeedCreate(connection, wallet, wallet, [mint1]);

    const args: SwapArgs = {
      amount: new anchor.BN(
        type === 2
          ? parseFloat(amount) * 1000_000_000
          : parseFloat(amount) * 1000_000_000
      ),
      style: new anchor.BN(type),
    };
    const FEE_WALLET = new PublicKey(
      "3KHQ26KaTEceAWdSr7r1Wdb4EjzfURJkV9BVykrhDJrF"
    );

    const acc: SwapAccounts = {
      dexConfigurationAccount: curveConfig,
      pool: poolPda,
      globalAccount,
      mintTokenOne: mint1,
      poolTokenAccountOne: poolTokenOne,
      userTokenAccountOne: destinationAccounts[0],
      user: wallet,
      feeWallet: FEE_WALLET,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    };
    const dataIx = swap(args, acc, PROGRAM_ID);
    const tx = new Transaction();
    if (instructions.length !== 0) tx.add(...instructions);
    tx.add(dataIx);
    return tx;
  } catch (error) {
    console.log("Error in swap transaction", error);
  }
};

const getAssociatedTokenAccount = async (
  ownerPubkey: PublicKey,
  mintPk: PublicKey
): Promise<PublicKey> => {
  const associatedTokenAccountPubkey = PublicKey.findProgramAddressSync(
    [
      ownerPubkey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintPk.toBuffer(), // mint address
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];

  return associatedTokenAccountPubkey;
};

const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

const getATokenAccountsNeedCreate = async (
  connection: anchor.web3.Connection,
  walletAddress: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  nfts: anchor.web3.PublicKey[]
) => {
  const instructions = [];
  const destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    let response = await connection.getAccountInfo(destinationPubkey);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        destinationPubkey,
        walletAddress,
        owner,
        mint
      );
      instructions.push(createATAIx);
    }
    destinationAccounts.push(destinationPubkey);
    if (walletAddress != owner) {
      const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
      response = await connection.getAccountInfo(userAccount);
      if (!response) {
        const createATAIx = createAssociatedTokenAccountInstruction(
          userAccount,
          walletAddress,
          walletAddress,
          mint
        );
        instructions.push(createATAIx);
      }
    }
  }
  return {
    instructions,
    destinationAccounts,
  };
};
