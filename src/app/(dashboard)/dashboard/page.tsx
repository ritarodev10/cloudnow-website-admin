import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back{user?.email ? `, ${user.email}` : ""}!
        </p>
      </div>
      <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-sm">
        <p className="text-gray-700">
          Welcome to your admin dashboard. Content will be added here later.
        </p>
      </div>
    </div>
  );
}
