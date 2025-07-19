"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Products", path: "/products" },
  ];

  return (
    <nav className="w-full p-4 bg-secondary flex gap-4 border-b border-border">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "default" : "outline"}
          onClick={() => router.push(item.path)}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
