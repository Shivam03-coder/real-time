import { type Metadata } from "next";
import "@/styles/globals.css";
import { appfonts } from "@/fonts";
import AppRootProvider from "@/providers/app-root-provider";

export const metadata: Metadata = {
  title: "E-COMMERCE",
};

export default function AppRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en" className={appfonts}>
      <body className="">
        <AppRootProvider>
          <main className="flex min-h-screen flex-col">{children}</main>
        </AppRootProvider>
      </body>
    </html>
  );
}
