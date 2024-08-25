import "./globals.css";

import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Modals } from "@/components/modals";
import { ConvexClientProvider } from "@/providers/ConvexClientProviders";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const font = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        suppressHydrationWarning
        suppressContentEditableWarning
      >
        <body className={cn(font.className, "antialiased")}>
          <ConvexClientProvider>
            <Modals />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
