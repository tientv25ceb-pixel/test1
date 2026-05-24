import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { notFound, ok } from "@/lib/api-helpers"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
  if (error || !data) return notFound("User not found")
  return ok(data)
}
