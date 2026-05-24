import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, badRequest, ok, created } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") ?? "all"

  let query = supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (type === "sent") {
    query = query.eq("requester_id", user.id)
  } else if (type === "received") {
    const { data: myItems } = await supabase
      .from("items")
      .select("id")
      .eq("poster_id", user.id)
    const itemIds = myItems?.map((i) => i.id) ?? []
    if (itemIds.length === 0) return ok([])
    query = query.in("item_id", itemIds)
  } else {
    // type === "all"
    const { data: myItems } = await supabase
      .from("items")
      .select("id")
      .eq("poster_id", user.id)
    const itemIds = myItems?.map((i) => i.id) ?? []
    if (itemIds.length > 0) {
      query = query.or(`requester_id.eq.${user.id},item_id.in.(${itemIds.join(",")})`)
    } else {
      query = query.eq("requester_id", user.id)
    }
  }

  const { data, error } = await query
  if (error) return badRequest(error.message)
  return ok(data)
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const body = await request.json()
  const { itemId } = body
  if (!itemId) return badRequest("itemId is required")

  const { data: item } = await supabase.from("items").select("*").eq("id", itemId).single()
  if (!item) return badRequest("Item not found")
  if (item.poster_id === user.id) return badRequest("Cannot request your own item")
  if (item.status !== "available") return badRequest("Item is not available")

  const { data: existing } = await supabase
    .from("requests")
    .select("id")
    .eq("item_id", itemId)
    .eq("requester_id", user.id)
    .single()
  if (existing) return badRequest("Already requested this item")

  const { data, error } = await supabase
    .from("requests")
    .insert({
      item_id: itemId,
      item_title: item.title,
      requester_id: user.id,
      requester_name: user.name,
      poster_name: item.posted_by,
    })
    .select()
    .single()

  if (error) return badRequest(error.message)

  await supabase
    .from("items")
    .update({ requested_count: (item.requested_count ?? 0) + 1 })
    .eq("id", itemId)

  return created(data)
}
