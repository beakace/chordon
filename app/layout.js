import "./globals.css";
import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "CHORDON - Chord Progression Generator",
  description: "Generate and play chord progressions with few clicks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={syne.className}>{children}</body>
    </html>
  );
}
