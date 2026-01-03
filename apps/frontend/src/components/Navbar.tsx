"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, LogOut, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
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
                ? "glass-panel shadow-lg"
                : "bg-transparent border border-transparent"
            )}
          >

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 dark:from-amber-400 dark:to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={18} fill="currentColor" className="text-slate-900" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Super<span className="text-amber-600 dark:text-amber-400">CV</span>
              </span>
            </Link>


            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/about">Methodology</NavLink>
            </div>


            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full glass-button transition-all duration-500"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} className="text-slate-700" />
                )}
              </button>

              {session ? (
                <div className="flex items-center gap-3 pl-4 border-l border-black/10 dark:border-white/10">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-slate-500">Welcome,</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                      {session.user?.name?.split(" ")[0]}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-primary">
                  Sign In
                </Link>
              )}
            </div>


            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full glass-button transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} className="text-slate-700" />
                )}
              </button>

              <button
                className="p-2 text-slate-900 dark:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </nav>
        </div>
      </header>


      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-8 transition-colors duration-300"
          >
            <div className="flex flex-col items-center gap-6 text-2xl font-serif">
              <MobileLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileLink>
              <MobileLink href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileLink>
              <MobileLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>Methodology</MobileLink>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="px-8 py-3 rounded-full btn-ghost flex items-center gap-2"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary"
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
      className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full duration-300" />
    </Link>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
      {children}
    </Link>
  );
}