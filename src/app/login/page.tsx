"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="bg-white border border-neutral-200 w-full max-w-md p-8">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
            <rect width="40" height="40" fill="#000" />
            <path d="M5 32 L16 14 L22 22 L28 11 L35 32 Z" fill="none" stroke="#e8500a" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
          <span className="font-heading font-bold text-xl tracking-[0.2em] uppercase">
            Kohpema<span className="text-[#e8500a]">Gear</span>
          </span>
        </Link>
        <h1 className="font-heading font-bold uppercase text-2xl tracking-tight text-center mb-6">
          Admin Login
        </h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="admin@kohpema.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              placeholder="••••••••"
            />
          </div>
          {state?.error && (
            <div className="text-red-600 text-sm">{state.error}</div>
          )}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-xs text-neutral-400 mt-6">
          <Link href="/" className="hover:text-black">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
