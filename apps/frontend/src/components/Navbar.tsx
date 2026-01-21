"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { useProfileQuery } from "@/features/profile/api/useProfile";

export function Navbar() {
  const { data: session } = useSession();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch profile to get updated picture from database
  const userId = session?.user?.id;
  const { data: profile } = useProfileQuery(userId || null);

  // Use profile picture from database, fallback to session image
  const avatarUrl = profile?.picture || session?.user?.image;
  const userName = profile?.name || session?.user?.name;

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
          {/* Gradient border glow container */}
          <div className="relative">
            {/* Glow effect behind navbar */}
            <div className={cn(
              "absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500",
              "bg-gradient-to-r from-[#2F6BFF]/50 via-[#3CE0B1]/50 to-[#2F6BFF]/50",
              isScrolled && "opacity-60 blur-sm"
            )} />

            <nav
              className={cn(
                "relative flex items-center justify-between px-5 sm:px-6 py-3 rounded-2xl transition-all duration-500",
                "bg-white/80 backdrop-blur-2xl backdrop-saturate-200",
                "border border-white/50",
                isScrolled
                  ? "shadow-xl shadow-slate-900/10 border-white/60"
                  : "shadow-lg shadow-slate-900/5"
              )}
            >

              {/* Logo - Left */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles size={18} fill="currentColor" className="text-white" />
                </div>
                <span className="font-serif font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Super<span className="text-[#2F6BFF] dark:text-[#3CE0B1]">CV</span>
                </span>
              </Link>

              {/* Nav Links - Absolute Center */}
              <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <NavLink href="/app">My CVs</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
              </div>


              <div className="hidden md:flex items-center gap-4">


                {session ? (
                  <div className="flex items-center gap-3 pl-4 border-l border-black/10 dark:border-white/10">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 group"
                      title="View Profile"
                    >
                      <div className="text-right hidden lg:block">
                        <p className="text-xs text-slate-500">Welcome,</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                          {userName?.split(" ")[0]}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#2F6BFF] transition-all">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={userName || "Profile"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <User size={18} className="text-white" />
                          </div>
                        )}
                      </div>
                    </Link>
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


              {/* Mobile header - show profile avatar + hamburger */}
              <div className="md:hidden flex items-center gap-2">


                {/* Mobile profile avatar */}
                {session && (
                  <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-[#2F6BFF] transition-all">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={userName || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                    )}
                  </Link>
                )}

                <button
                  className="p-2 text-slate-900 dark:text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>


      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-6 transition-colors duration-300"
          >
            {/* Nav Links */}
            <div className="flex flex-col items-center gap-5">
              <Link
                href="/app"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-semibold text-slate-900 dark:text-white hover:text-[#2F6BFF] dark:hover:text-[#3CE0B1] transition-colors"
              >
                My CVs
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-semibold text-slate-900 dark:text-white hover:text-[#2F6BFF] dark:hover:text-[#3CE0B1] transition-colors"
              >
                Pricing
              </Link>
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-slate-200 dark:bg-slate-700" />

            {/* Auth Section */}
            <div className="flex flex-col items-center gap-4">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-slate-600 dark:text-slate-400 hover:text-[#2F6BFF] dark:hover:text-[#3CE0B1] transition-colors"
                  >
                    <User size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 transition-all"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-8 py-3 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative group ${className || ''}`}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2F6BFF] transition-all group-hover:w-full duration-300" />
    </Link>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="text-slate-600 dark:text-slate-400 hover:text-[#2F6BFF] dark:hover:text-[#3CE0B1] transition-colors">
      {children}
    </Link>
  );
}