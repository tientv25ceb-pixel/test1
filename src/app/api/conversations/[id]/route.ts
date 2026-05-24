import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, notFound, badRequest, ok } from "@/lib/api-helpers"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { id } = await params
  const { data: conv, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !conv) return notFound("Conversation not found")
  if (!conv.participant_ids.includes(user.id)) return unauthorized()

  return ok(conv)
}
