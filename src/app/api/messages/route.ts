import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, badRequest, ok, created } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversationId")
  if (!conversationId) return badRequest("conversationId is required")

  const { data: conv } = await supabase
    .from("conversations")
    .select("participant_ids")
    .eq("id", conversationId)
    .single()

  if (!conv) return badRequest("Conversation not found")
  if (!conv.participant_ids.includes(user.id)) return unauthorized()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) return badRequest(error.message)
  return ok(data ?? [])
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const body = await request.json()
  const { conversationId, text } = body
  if (!conversationId || !text) return badRequest("conversationId and text are required")

  const { data: conv } = await supabase
    .from("conversations")
    .select("participant_ids")
    .eq("id", conversationId)
    .single()

  if (!conv) return badRequest("Conversation not found")
  if (!conv.participant_ids.includes(user.id)) return unauthorized()

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      text,
    })
    .select()
    .single()

  if (error) return badRequest(error.message)

  await supabase
    .from("conversations")
    .update({ last_message: text, last_message_time: new Date().toISOString() })
    .eq("id", conversationId)

  return created(data)
}
