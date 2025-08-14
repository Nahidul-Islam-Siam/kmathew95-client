"use client";

import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* If you have a header, place it here */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
