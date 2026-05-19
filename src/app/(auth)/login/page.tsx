"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 tracking-wider">
            ⚱ SANDS OF ETERNITY
          </h1>
          <p className="text-stone-400 mt-2 text-sm">
            Egyptian × Mesopotamian Idle RPG
          </p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-700 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-stone-100 mb-6">
            Masuk ke duniamu
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="kamu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-semibold rounded-lg px-4 py-2.5 transition-colors"
            >
              {loading ? "Memuat..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-stone-500 text-sm mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-amber-400 hover:text-amber-300">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
