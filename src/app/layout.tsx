import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content SaaS | Smart Creator Intelligence",
  description: "Transform creator research into high-performing content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#FDFDFD]">
      <body className="antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
