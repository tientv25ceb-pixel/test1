import { NextResponse } from "next/server"
import { auth } from "./auth"
import { supabase } from "./supabase"

export async function getAuthUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()
  return data
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function ok<T>(data: T) {
  return NextResponse.json(data)
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}
