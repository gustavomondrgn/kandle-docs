"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset password modal
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSecret, setResetSecret] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");

    if (resetPassword !== resetConfirm) {
      setResetError("As senhas não coincidem.");
      return;
    }

    setResetLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: resetEmail,
        resetSecret,
        newPassword: resetPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setResetSuccess(true);
    } else {
      setResetError(data.error ?? "Erro ao redefinir senha.");
    }

    setResetLoading(false);
  }

  function handleResetClose() {
    setResetOpen(false);
    setResetEmail("");
    setResetSecret("");
    setResetPassword("");
    setResetConfirm("");
    setResetError("");
    setResetSuccess(false);
  }

  return (
    <>
      <div className="min-h-screen bg-[--background] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-[--foreground] tracking-tight">
              Kandle <span className="text-[--muted-foreground] font-normal">Admin</span>
            </h1>
            <p className="mt-1 text-sm text-[--muted-foreground]">
              Acesse o painel de gerenciamento
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kandle.studio"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="text-sm text-[--muted-foreground] hover:text-[--foreground] transition-colors underline-offset-4 hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={resetOpen} onOpenChange={handleResetClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              Informe seu email, o token de reset (definido no servidor) e a nova senha.
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <div className="space-y-4 py-2">
              <p className="text-sm text-green-600">
                Senha redefinida com sucesso. Faça login com a nova senha.
              </p>
              <Button onClick={handleResetClose} className="w-full">
                Fechar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@kandle.studio"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reset-secret">Token de reset</Label>
                <Input
                  id="reset-secret"
                  type="password"
                  value={resetSecret}
                  onChange={(e) => setResetSecret(e.target.value)}
                  placeholder="Token configurado no servidor"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reset-new-password">Nova senha</Label>
                <Input
                  id="reset-new-password"
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reset-confirm">Confirmar nova senha</Label>
                <Input
                  id="reset-confirm"
                  type="password"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  required
                />
              </div>

              {resetError && (
                <p className="text-sm text-red-500">{resetError}</p>
              )}

              <Button type="submit" className="w-full" disabled={resetLoading}>
                {resetLoading ? "Redefinindo..." : "Redefinir senha"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
