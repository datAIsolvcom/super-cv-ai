"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-6 py-4",
          isScrolled ? "py-3" : "py-5"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <nav
            className={cn(
              "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500",
              isScrolled
                ? "bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5"
                : "bg-transparent border border-transparent"
            )}
          >
          
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne-300 to-champagne-500 flex items-center justify-center text-obsidian-950 shadow-[0_0_15px_rgba(252,211,77,0.3)] group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={18} fill="currentColor" />
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                Super<span className="text-champagne-400">CV</span>
              </span>
            </Link>

           
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/about">Methodology</NavLink>
            </div>

          
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-slate-400">Welcome,</p>
                    <p className="text-sm font-bold text-white leading-none">
                      {session.user?.name?.split(" ")[0]}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-champagne-300 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(252,211,77,0.4)]"
                >
                  Sign In
                </Link>
              )}
            </div>

          
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
      </header>

     
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-obsidian-950/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            <div className="flex flex-col items-center gap-6 text-2xl font-serif">
              <MobileLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </MobileLink>
              <MobileLink
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </MobileLink>
              <MobileLink
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Methodology
              </MobileLink>
            </div>

            <div className="mt-8">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500 transition-all flex items-center gap-2"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-8 py-3 rounded-full bg-champagne-500 text-obsidian-950 font-bold shadow-lg shadow-champagne-500/20"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-champagne-400 transition-all group-hover:w-full duration-300" />
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-white/80 hover:text-champagne-400 transition-colors"
    >
      {children}
    </Link>
  );
}