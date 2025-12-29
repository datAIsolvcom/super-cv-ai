import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth"; 
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-7xl px-6 flex items-center justify-between pointer-events-auto">

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="font-serif font-bold text-slate-950 text-xl">S</span>
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-white">
            Super<span className="text-amber-400">CV</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Welcome Back</p>
                <p className="text-sm font-medium text-white">{session.user?.name}</p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="ghost" className="text-slate-400 hover:text-white">Sign Out</Button>
              </form>
              <div className="w-10 h-10 rounded-full border border-amber-500/50 overflow-hidden">
                {session.user?.image && (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full px-6">
                Sign In
              </Button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}