"use client";
import Link from "next/link";
import Web3AuthButton from "./Web3AuthButton";
import { buttonVariants } from "../ui/button";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="sticky top-0 border-b py-4 px-5 bg-white">
      <div className="mx-auto max-w-7xl flex justify-between items-center">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <div className="flex gap-2 items-center">
          <Link
            href="/create-agent"
            className={buttonVariants({
              variant: "link",
            })}
          >
            Create Agent
          </Link>
          <Web3AuthButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
