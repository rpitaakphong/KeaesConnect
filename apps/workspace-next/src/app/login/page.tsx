import { LoginForm } from "@/features/auth/login-form";
import { PortalPage } from "@/components/app-shell/portal-page";

export default function LoginPage() {
  return (
    <PortalPage>
      <section className="login-layout" aria-labelledby="loginTitle">
        <article className="login-copy">
          <p className="eyebrow">Employee access</p>
          <h1 id="loginTitle">Welcome to Keaes Workspace.</h1>
          <p>Staff access is handled by Supabase Auth. Use an approved staff account to continue.</p>
        </article>
        <LoginForm />
      </section>
    </PortalPage>
  );
}
