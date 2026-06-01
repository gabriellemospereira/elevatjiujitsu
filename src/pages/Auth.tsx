import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import logo from "@/assets/Logo.png";

const signInSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Informe seu nome").max(100),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/app/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
      return;
    }
    toast.success("Bem-vindo de volta!");
    navigate("/app/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
      fullName: form.get("fullName"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message.includes("already registered") ? "E-mail já cadastrado" : error.message);
      return;
    }
    toast.success("Conta criada! Você já pode entrar.");
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/app/dashboard`,
    });
    if (result.error) {
      toast.error("Falha no login com Google");
      setSubmitting(false);
      return;
    }
    if (result.redirected) return;
    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-card to-background">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="Elevate" className="w-12 aspect-square object-cover" />
          <span className="text-3xl font-heading font-bold text-gradient">ELEVATE</span>
        </Link>

        <div className="card-elevated p-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email-in">E-mail</Label>
                  <Input id="email-in" name="email" type="email" required maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="pass-in">Senha</Label>
                  <Input id="pass-in" name="password" type="password" required maxLength={72} />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name-up">Nome completo</Label>
                  <Input id="name-up" name="fullName" type="text" required maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="email-up">E-mail</Label>
                  <Input id="email-up" name="email" type="email" required maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="pass-up">Senha</Label>
                  <Input id="pass-up" name="password" type="password" required minLength={6} maxLength={72} />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button onClick={handleGoogle} variant="outline" className="w-full" disabled={submitting}>
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Entrar com Google
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="hover:text-primary">← Voltar ao site</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;