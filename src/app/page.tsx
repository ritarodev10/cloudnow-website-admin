import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering - this page requires Supabase auth check
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
