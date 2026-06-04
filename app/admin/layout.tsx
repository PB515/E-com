/**
 * Admin section shell (Phase 0 placeholder).
 * SECURITY (Phase 4, app-03): a server-side deny-by-default guard goes here /
 * in middleware — no session or non-admin role → redirect to /admin/login.
 * Cross-user / logged-out denial must be PROVEN before any admin feature ships.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-full flex-1 flex-col bg-surface">{children}</div>;
}
