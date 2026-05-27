import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@/lib/auth"
import { getAuthUser, unauthorized, badRequest, ok } from "@/lib/api-helpers"

export async function POST(req: NextRequest) {
  const session = await auth()
  console.log("--- UPLOAD API DEBUG ---")
  console.log("Session:", JSON.stringify(session))
  const user = await getAuthUser(req)
  console.log("User:", JSON.stringify(user))
  if (!user) return unauthorized()

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return badRequest("No file provided")

  const ext = file.name.split(".").pop() ?? "jpg"
  const fileName = `${user.id}/${Date.now()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { data, error } = await supabase.storage
    .from("items")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return badRequest(error.message)

  const { data: urlData } = supabase.storage.from("items").getPublicUrl(fileName)
  return ok({ url: urlData.publicUrl })
}
