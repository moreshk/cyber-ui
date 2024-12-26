/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
  "47LT6fpnsf9w8crd5VagS8Tc4QDUWEzptDqDFpNG9Mem"
);

async function get(
  pool: PublicKey,
  program: Program<any>
): Promise<{ reserveOne: string; reserveTwo: string }> {
  try {
    // @ts-ignore
    const poolData = await program.account.liquidityPool.fetch(pool);
    return {
      reserveOne: poolData.reserveOne.toString(),
      reserveTwo: poolData.reserveTwo.toString(),
    };
  } catch (error) {
    console.error("Error fetching pool reserves:", error);
    throw error;
  }
}

export async function getPoolReserves(token: string) {
  try {
    const idl = await import("./pump.json");
    const program = new Program(idl, PROGRAM_ID) as Program<any>;
    const tokenMint = new PublicKey(token);
    const [pool] = PublicKey.findProgramAddressSync(
      [Buffer.from("liquidity_pool"), tokenMint.toBuffer()],
      program.programId
    );

    const { reserveOne, reserveTwo } = await get(pool, program);
    return {
      reserveOne,
      reserveTwo,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
