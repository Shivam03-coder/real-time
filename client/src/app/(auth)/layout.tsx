import Image from "next/image";
import React, { type ReactNode } from "react";

const AuthRootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-muted center min-h-screen w-full">
      <main className="bg-card mx-auto w-full border-none px-4 shadow-inner lg:max-w-[40%] lg:rounded-3xl lg:border lg:px-5">
        {children}
      </main>
    </div>
  );
};

export default AuthRootLayout;
