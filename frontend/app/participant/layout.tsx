import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <main className="flex-1 bg-[#141414]/70 p-6">{children}</main>;
};

export default Layout;
