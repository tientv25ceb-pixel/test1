import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, badRequest, ok, created } from "@/lib/api-helpers"

export async function GET() {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { data, error } = await supabase
    .from("favorites")
    .select("item_id")
    .eq("user_id", user.id)

  if (error) return badRequest(error.message)
  return ok((data ?? []).map((f) => f.item_id))
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { itemId } = await request.json()
  if (!itemId) return badRequest("itemId is required")

  const { data, error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, item_id: itemId })
    .select()
    .single()

  if (error && error.code === "23505") return ok({ favorited: true })
  if (error) return badRequest(error.message)
  return created(data)
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get("itemId")
  if (!itemId) return badRequest("itemId is required")

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("item_id", itemId)

  if (error) return badRequest(error.message)
  return ok({ favorited: false })
}
