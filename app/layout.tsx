import "@/styles/globals.css";
import type { ReactNode } from "react";
import { CeramicWrapper } from "@/context";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <CeramicWrapper>{children}</CeramicWrapper>{" "}
      </body>
    </html>
  );
}
