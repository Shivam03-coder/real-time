"use client";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/store";
import { ViewTransitions } from "next-view-transitions";
const AppRootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ViewTransitions>
      <StoreProvider>
        <Toaster />
        <div className="flex min-h-screen w-full flex-col">{children}</div>
      </StoreProvider>
    </ViewTransitions>
  );
};

export default AppRootProvider;
