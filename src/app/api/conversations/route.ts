import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, badRequest, ok, created } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .contains("participant_ids", [user.id])
    .order("last_message_time", { ascending: false })

  if (error) return badRequest(error.message)
  return ok(data ?? [])
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const body = await request.json()
  const { otherUserId, otherUserName, itemId, itemTitle } = body

  if (!otherUserId) return badRequest("otherUserId is required")

  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .contains("participant_ids", [user.id, otherUserId])
    .maybeSingle()

  if (existing) return ok(existing)

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      participant_ids: [user.id, otherUserId],
      participant_names: [user.name, otherUserName],
      item_id: itemId ?? null,
      item_title: itemTitle ?? "",
    })
    .select()
    .single()

  if (error) return badRequest(error.message)
  return created(data)
}
