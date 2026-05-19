"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        username: form.username,
        password: form.password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 tracking-wider">
            ⚱ SANDS OF ETERNITY
          </h1>
          <p className="text-stone-400 mt-2 text-sm">
            Egyptian × Mesopotamian Idle RPG
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-700 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-stone-100 mb-6">
            Buat akun baru
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="kamu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="3-20 karakter"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="minimal 6 karakter"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-stone-400 mb-1">Konfirmasi Password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
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
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-stone-500 text-sm mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}