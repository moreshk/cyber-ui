/* eslint-disable @typescript-eslint/ban-ts-comment */
import { first4Characters } from "@/lib/utils";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Connection } from "@solana/web3.js";
import useSWR from "swr";

interface Holder {
  address: string;
  ataAddress: string;
  amount: string;
}

// Fetcher function to get token holders
const fetchTokenHolders = async (
  connection: Connection,
  mintAddress?: string
): Promise<Holder[]> => {
  if (!mintAddress) return [];

  const mintPubkey = new PublicKey(mintAddress);
  const accounts = await connection.getTokenLargestAccounts(mintPubkey);

  const filteredHolders = accounts.value.filter(
    (account) => +account.amount > 0
  );

  const holdersDetails: Holder[] = await Promise.all(
    filteredHolders.map(async (holder) => {
      const ataPubkey = new PublicKey(holder.address);

      // Fetch account info to get the owner's address
      const accountInfo = await connection.getParsedAccountInfo(ataPubkey);
      const ownerAddress: string | undefined =
        // @ts-ignore
        accountInfo.value?.data?.parsed?.info?.owner;

      return {
        address: ownerAddress || "Unknown",
        ataAddress: holder.address.toString(),
        amount: holder.amount.toString(),
      };
    })
  );

  return holdersDetails;
};

// Custom hook for fetching holders using SWR
const useTokenHolders = (
  mintAddress: string | null,
  connection: Connection
) => {
  const { data, error, mutate } = useSWR<Holder[]>(
    mintAddress ? ["token-holders", mintAddress] : null,
    ([, mint]) => fetchTokenHolders(connection, mint as string),
    { revalidateOnFocus: false }
  );

  return {
    holders: data || [],
    isLoading: !error && !data,
    error,
    mutate,
  };
};

// Component for holder distribution
const HolderDistribution = () => {
  const { data } = useTokenDetailsStore();
  const { connection } = useConnection();
  const { holders, isLoading, error } = useTokenHolders(
    data?.mintAddress || null,
    connection
  );

  const calculatePercentage = (amount: string): string => {
    const total = holders.reduce(
      (acc, curr) => acc + BigInt(curr.amount),
      BigInt(0)
    );
    const percentage = (BigInt(amount) * BigInt(10000)) / total;
    return (Number(percentage) / 100).toFixed(2);
  };

  return (
    <div className="pt-4 rounded-lg max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Holder distribution</h2>
      </div>
      {!holders.length && !isLoading && <div>No token holders found.</div>}
      {!!holders.length && (
        <div className="space-y-2">
          {holders.map((holder, index) => (
            <div
              key={holder.address}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{index + 1}.</span>
                <span>{first4Characters(holder.address)}</span>
                {holder.address === data?.creatorWalletAddress && (
                  <span>🤵‍♂️ (dev)</span>
                )}
                {index === 0 && <span> 🏦 (bonding curve)</span>}
              </div>
              <span className="text-right">
                {calculatePercentage(holder.amount)}%
              </span>
            </div>
          ))}
        </div>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p>Loading...</p>}
    </div>
  );
};

export default HolderDistribution;
