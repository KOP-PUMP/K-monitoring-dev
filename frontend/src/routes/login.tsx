import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthService from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginForm,
});

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate({ from: "/login" });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await AuthService.login(email, password);
      navigate({ to: "/" });
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={() => AuthService.login(email, password)}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/signup" className="underline">
              Have problem? Contact us
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://img.freepik.com/free-photo/portrait-engineers-during-work-hours-job-site_23-2151589548.jpg"
          alt="Image"
          width="626"
          height="351"
          loading="lazy"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
