import { auth } from "@/lib/auth"; 
import { UploadCard } from "@/components/UploadCard"; 
import { Sparkles, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
 
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10 max-w-2xl mx-auto">
        {user ? (

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-6">
              <Sparkles size={12} />
              <span>Pro Plan Active</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight text-white">
              Welcome back, <br />
              <span className="text-gold">{user.name?.split(' ')[0] || 'Executive'}</span>
            </h1>

            <div className="flex items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-medium">System Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <span className="text-slate-200 text-sm font-bold">3 Credits Available</span>
              </div>
            </div>
          </div>
        ) : (

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight text-white">
              Craft Your <span className="text-gold">Legacy</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
              AI-powered resume architecture for the modern executive. <br/>
              Optimize for ATS, Strategy, and Impact.
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl z-10">
        <UploadCard />
      </div>

    </main>
  );
}