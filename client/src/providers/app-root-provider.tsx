"use client";

import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/store";
import { ViewTransitions } from "next-view-transitions";
import SocketProvider from "./socket-provider";
import { useSessionEventTracker } from "@/hooks/use-event-tracker";

const AppRootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ViewTransitions>
      <StoreProvider>
        <InnerAppContent>{children}</InnerAppContent>
      </StoreProvider>
    </ViewTransitions>
  );
};

export default AppRootProvider;

const InnerAppContent = ({ children }: { children: React.ReactNode }) => {
  useSessionEventTracker();
  return (
    <SocketProvider>
      <Toaster />
      <div className="flex min-h-screen w-full flex-col">{children}</div>
    </SocketProvider>
  );
};
