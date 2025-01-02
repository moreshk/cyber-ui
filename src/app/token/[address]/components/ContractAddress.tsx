import { truncateAddress } from "@/lib/utils";
import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const ContractAddress = () => {
  const { data } = useTokenDetailsStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (data?.mintAddress) {
      navigator.clipboard.writeText(data.mintAddress).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  return (
    <div className="gap-2 text-right">
      <p>Contract</p>
      <div className="flex items-center justify-end gap-2">
        <p className="text-xl font-bold">
          {truncateAddress(data?.mintAddress)}
        </p>
        <button
          onClick={handleCopy}
          className="text-sm text-blue-500 underline hover:text-blue-700"
        >
          {copied ? (
            <Check className="text-white w-4 h-4" />
          ) : (
            <Copy className="text-white w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ContractAddress;
