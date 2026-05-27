import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, badRequest, ok, created } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const condition = searchParams.get("condition")
  const exchangeType = searchParams.get("exchangeType")
  const search = searchParams.get("search")
  const status = searchParams.get("status") ?? "available"
  const posterId = searchParams.get("posterId")

  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })

  if (status !== "all") query = query.eq("status", status)
  if (category) query = query.eq("category", category)
  if (condition) query = query.eq("condition", condition)
  if (exchangeType) query = query.eq("exchange_type", exchangeType)
  if (posterId) query = query.eq("poster_id", posterId)
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  const { data, error } = await query
  if (error) return badRequest(error.message)
  return ok(data)
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const body = await request.json()
  const { title, description, category, condition, exchangeType, image, location } = body

  if (!title || !description || !category || !location) {
    return badRequest("Missing required fields: title, description, category, location")
  }

  const { data, error } = await supabase
    .from("items")
    .insert({
      title,
      description,
      category,
      condition: condition ?? "tot",
      exchange_type: exchangeType ?? "mienphi",
      image: image ?? "",
      location,
      posted_by: user.name,
      poster_id: user.id,
      poster_faculty: user.faculty ?? "",
    })
    .select()
    .single()

  if (error) return badRequest(error.message)
  return created(data)
}
