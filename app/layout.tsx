import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MathMotion Gesture AI",
  description: "Platform media pembelajaran matematika kinetik tanpa sentuhan fisik (touchless gesture) berbasis web camera untuk melatih fokus, motorik, dan pemahaman konsep siswa SD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full antialiased ${fredoka.variable} ${jakarta.variable}`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#FFE600] selection:text-black">
        {children}
      </body>
    </html>
  );
}

