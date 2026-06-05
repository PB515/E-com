import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/admin") ? redirect : "/admin";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8">
        <p className="font-heading text-2xl text-ink">Bugadi.co</p>
        <h1 className="mt-1 text-sm uppercase tracking-[0.18em] text-ink-muted">
          Admin
        </h1>
        <div className="mt-7">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
