import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import { Providers } from "~/components/providers";
import { Toaster as ReactHotToaster } from "react-hot-toast";
export const metadata = {
  title: "DOCPHOTO",
  description: "Фотогалерея",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const font = Inter({
  subsets: ["cyrillic-ext", "cyrillic", "latin-ext", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${font.className} h-screen p-0`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=.5, maximum-scale=12.0, minimum-scale=.25, user-scalable=yes"
        />
      </head>
      <body className="light min-h-full p-0">
        <TRPCReactProvider>
          <Providers>{children}</Providers>
          <Toaster />
          <ReactHotToaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
