"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LazyTiltCard } from "@/lib/dynamic-loading";
import { RippleButton } from "@/components/ui/RippleButton";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "Registration failed";
        throw new Error(errorMessage);
      }

      toast.success("Account created successfully! Logging you in...");

      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (loginRes?.error) {
        toast.warning("Please login with your new account.");
        router.push("/login");
      } else {
        if (callbackUrl && callbackUrl !== "/") {
          window.location.href = callbackUrl;
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    toast.loading("Redirecting to Google...");
    const separator = callbackUrl.includes('?') ? '&' : '?';
    const finalCallbackUrl = `${callbackUrl}${separator}login=success`;
    signIn("google", { callbackUrl: finalCallbackUrl });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[hsla(var(--accent-primary)/0.06)] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LazyTiltCard tiltStrength={15} glareEnabled={true}>
          <div className="glass-panel p-8 rounded-3xl">
            <Link
              href="/"
              className="inline-flex items-center text-[hsl(var(--text-muted))] hover:text-[hsl(var(--accent-primary))] mb-8 text-sm transition-colors duration-300"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>

            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                <UserPlus size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[hsl(var(--text-primary))] mb-2">
                Join Super CV
              </h1>
              <p className="text-[hsl(var(--text-secondary))] text-sm">Create an account to start optimizing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-[hsl(var(--surface-elevated))] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-4 text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:border-[hsla(var(--accent-primary)/0.5)] focus:shadow-[0_0_20px_hsla(var(--accent-primary)/0.15)] outline-none transition-all duration-300"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-[hsl(var(--surface-elevated))] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-4 text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:border-[hsla(var(--accent-primary)/0.5)] focus:shadow-[0_0_20px_hsla(var(--accent-primary)/0.15)] outline-none transition-all duration-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full bg-[hsl(var(--surface-elevated))] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-4 text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:border-[hsla(var(--accent-primary)/0.5)] focus:shadow-[0_0_20px_hsla(var(--accent-primary)/0.15)] outline-none transition-all duration-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <RippleButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full h-14"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
              </RippleButton>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-black/[0.06] dark:bg-white/[0.08] flex-1" />
              <span className="text-xs uppercase text-[hsl(var(--text-muted))] tracking-wider">Or continue with</span>
              <div className="h-px bg-black/[0.06] dark:bg-white/[0.08] flex-1" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full h-14 glass-button font-medium rounded-xl flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-[hsl(var(--text-secondary))]">
              Already have an account?{" "}
              <Link
                href={callbackUrl && callbackUrl !== "/" ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
                className="text-[hsl(var(--accent-primary))] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </LazyTiltCard>
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
          <Loader2 className="animate-spin text-white" size={24} />
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}