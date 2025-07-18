import AppImages from "@/constants/images";
import Image from "next/image";
import React, { type ReactNode } from "react";

const AuthRootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-muted center min-h-screen w-full">
      <main className="bg-card mx-auto w-full border-none px-4 shadow-inner lg:max-w-[40%] lg:rounded-3xl lg:border lg:px-5">
        <Image className="mx-auto mt-5" alt="app-logo" src={AppImages.logo} width={120} height={50} />
        <div>{children}</div>
      </main>
    </div>
  );
};

export default AuthRootLayout;
