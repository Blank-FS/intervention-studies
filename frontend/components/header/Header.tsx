import Image from "next/image";
import React from "react";
import { Separator } from "../ui/separator";
import HeaderAuth from "./HeaderAuth";

const Header = () => {
  return (
    <div className="bg-umich-blue/70 flex h-20 w-full items-center gap-4 p-4">
      <Image src="/images/logo.png" alt="Logo" width={60} height={30} />
      <Separator orientation="vertical" className="bg-white" />
      <h1 className="mr-auto text-3xl font-bold">Study Portal</h1>
      <HeaderAuth />
    </div>
  );
};

export default Header;
