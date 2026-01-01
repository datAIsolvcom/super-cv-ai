"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Loader2, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-20 px-6 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-7xl flex items-center justify-between pointer-events-auto">
        
       
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
            <span className="font-serif font-bold text-slate-950 text-xl">S</span>
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">
            Super<span className="text-amber-400">CV</span>
          </span>
        </Link>

      
        <div className="flex items-center gap-6">
          
         
          {status === "loading" ? (
            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
          ) : session ? (
            
           
            <div className="flex items-center gap-4" ref={menuRef}>
              <div className="hidden md:block text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Welcome Back</p>
                <p className="text-sm font-medium text-slate-200">{session.user?.name || "User"}</p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 p-0.5 transition-all overflow-hidden",
                    isMenuOpen ? "border-amber-400 shadow-lg shadow-amber-500/20" : "border-white/10 hover:border-white/30"
                  )}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                        <UserIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                </button>

               
                {isMenuOpen && (
                  <div className="absolute right-0 top-14 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{session.user?.email}</p>
                    </div>
                    
                    <div className="p-2">
                        <button 
                            onClick={() => signOut({ callbackUrl: "/login" })} 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors text-left font-medium"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          ) : (
            
           
            <Link 
              href="/login"
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold text-white transition-all backdrop-blur-md shadow-lg hover:shadow-white/5"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}