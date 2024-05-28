import "@/styles/globals.css";
import type { ReactNode } from "react";
import { CeramicWrapper, useCeramicContext } from "@/context";
import React from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
