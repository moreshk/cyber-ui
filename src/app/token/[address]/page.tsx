"use client";

import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { address } = useParams() as { address: string };
  const { fetchTokens, data, isLoading } = useTokenDetailsStore();

  useEffect(() => {
    fetchTokens(address);
  }, []);

  if (isLoading || !data) {
    <div>Loading</div>;
  }
  if (data) {
    return (
      <div>
        <div>
          <div key={data.mintAddress}>
            <img src={data.imgUrl} alt="token image" />
            <p>Create by {data.creatorWalletAddress}</p>
            <p>{data.description}</p>
          </div>
        </div>
      </div>
    );
  }
  return <div>No token found</div>;
};

export default Page;
