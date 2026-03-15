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
    <html lang="en">
      <body className="antialiased">
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
