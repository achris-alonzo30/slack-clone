import "./globals.css";

import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Modals } from "@/components/Modals";
import { Toaster } from "@/components/ui/sonner";
import { JotaiProvider } from "@/providers/JotaiProvider";
import { ConvexClientProvider } from "@/providers/ConvexClientProviders";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { generateMetadata } from "@/lib/generateMetadata";

const font = Manrope({ subsets: ["latin"] });

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
      >
        <body className={cn(font.className, "antialiased")}>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster />
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
