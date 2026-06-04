import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

// The SECOND gate (defense in depth, app-03): middleware already requires an
// authenticated user on /admin/*; here we require the ADMIN ROLE via is_admin().
// A signed-in non-admin sees access-denied, never any admin data.
export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="font-heading text-3xl text-ink">Access denied</h1>
        <p className="max-w-sm text-sm text-ink-muted">
          You are signed in as {user.email}, but this account is not an admin.
        </p>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AdminNav email={user.email} />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10 sm:px-8">
        {children}
      </div>
    </div>
  );
}
