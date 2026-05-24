import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, badRequest, ok, created } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetId = searchParams.get("userId")
  if (!targetId) return badRequest("userId is required")

  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("target_id", targetId)
    .order("created_at", { ascending: false })

  if (error) return badRequest(error.message)
  return ok(data ?? [])
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const body = await request.json()
  const { targetId, score, comment, itemId } = body

  if (!targetId || !score) return badRequest("targetId and score are required")
  if (score < 1 || score > 5) return badRequest("Score must be between 1 and 5")
  if (targetId === user.id) return badRequest("Cannot rate yourself")

  const { data, error } = await supabase
    .from("ratings")
    .insert({
      rater_id: user.id,
      target_id: targetId,
      score,
      comment: comment ?? "",
      item_id: itemId ?? null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return badRequest("Already rated this user for this item")
    return badRequest(error.message)
  }

  const { data: stats } = await supabase
    .from("ratings")
    .select("score")
    .eq("target_id", targetId)

  if (stats && stats.length > 0) {
    const avg = stats.reduce((sum, r) => sum + r.score, 0) / stats.length
    await supabase
      .from("users")
      .update({ rating_avg: Math.round(avg * 10) / 10, rating_count: stats.length })
      .eq("id", targetId)
  }

  return created(data)
}
