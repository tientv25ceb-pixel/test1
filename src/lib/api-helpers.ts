import { NextResponse, NextRequest } from "next/server"
import { auth } from "./auth"
import { supabase } from "./supabase"

export async function getAuthUser(req?: NextRequest) {
  let userId: string | undefined

  if (req) {
    const reqWithAuth = req as NextRequest & { auth?: unknown }
    let session = reqWithAuth.auth
    if (!session) {
      session = await auth()
    }
    userId = (session as any)?.user?.id
  } else {
    const session = await auth()
    userId = session?.user?.id
  }

  if (!userId) return null

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
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
