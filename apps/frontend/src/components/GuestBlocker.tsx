"use client";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button"; 

interface GuestBlockerProps {
  isGuest: boolean;
  children: React.ReactNode;
}

export const GuestBlocker = ({ isGuest, children }: GuestBlockerProps) => {
  if (!isGuest) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-xl">
      
      <div className="blur-md select-none pointer-events-none opacity-50 transition-all duration-500">
        {children}
      </div>

     
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-slate-950/90">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 p-6 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-serif text-white mb-2">Unlock Full Analysis</h3>
          <p className="text-sm text-slate-400 mb-6">
            Join 10,000+ professionals optimizing their careers.
          </p>
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium">
            Sign Up Free
          </Button>
        </div>
      </div>
    </div>
  );
};