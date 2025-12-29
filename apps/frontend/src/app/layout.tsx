import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/AuthProvider"; 
import { Navbar } from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Super CV | Premium Career Architect",
  description: "Craft your legacy with AI-powered resume analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen font-sans selection:bg-amber-500/30 selection:text-amber-200",
        inter.variable,
        playfair.variable
      )}>
        <AuthProvider>
          <Navbar />

          <main className="pt-24 min-h-screen">
            {children}
          </main>
          
        </AuthProvider>
      </body>
    </html>
  );
}