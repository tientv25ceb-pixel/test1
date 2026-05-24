import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { getAuthUser, unauthorized, notFound, badRequest, ok } from "@/lib/api-helpers"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabase.from("items").select("*").eq("id", id).single()
  if (error || !data) return notFound("Item not found")
  return ok(data)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { id } = await params
  const { data: item } = await supabase.from("items").select("poster_id").eq("id", id).single()
  if (!item) return notFound("Item not found")
  if (item.poster_id !== user.id) return unauthorized()

  const body = await request.json()
  const updateData: Record<string, any> = {}

  if (body.title !== undefined) updateData.title = body.title
  if (body.description !== undefined) updateData.description = body.description
  if (body.category !== undefined) updateData.category = body.category
  if (body.condition !== undefined) updateData.condition = body.condition
  if (body.exchangeType !== undefined) updateData.exchange_type = body.exchangeType
  if (body.exchange_type !== undefined) updateData.exchange_type = body.exchange_type
  if (body.image !== undefined) updateData.image = body.image
  if (body.location !== undefined) updateData.location = body.location
  if (body.status !== undefined) updateData.status = body.status

  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("items")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) return badRequest(error.message)
  return ok(data)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser()
  if (!user) return unauthorized()

  const { id } = await params
  const { data: item } = await supabase.from("items").select("poster_id").eq("id", id).single()
  if (!item) return notFound("Item not found")
  if (item.poster_id !== user.id) return unauthorized()

  const { error } = await supabase.from("items").delete().eq("id", id)
  if (error) return badRequest(error.message)
  return ok({ success: true })
}
