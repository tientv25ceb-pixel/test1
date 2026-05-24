import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { Provider } from "next-auth/providers"
import { supabase } from "./supabase"

const ALLOWED_DOMAINS = [
  "sv1.dut.udn.vn",
  "sv2.dut.udn.vn",
  "due.edu.vn",
  "ued.udn.vn",
  "udn.vn",
]

async function syncUser(email: string, name: string, avatar: string | undefined) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (existing) {
    await supabase
      .from("users")
      .update({ name, avatar, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
    return existing.id
  }

  const domain = email.split("@")[1]
  let faculty = "Khác"
  if (domain?.includes("dut")) faculty = "CNTT - ĐH Bách Khoa"
  else if (domain?.includes("due")) faculty = "Quản trị KD - ĐH Kinh tế"
  else if (domain?.includes("ued")) faculty = "Sư phạm Toán - ĐH Sư phạm"
  else if (domain?.includes("udn")) faculty = "Khác - ĐH Đà Nẵng"

  const { data: newUser } = await supabase
    .from("users")
    .insert({ email, name, avatar, faculty })
    .select("id")
    .single()

  return newUser?.id
}

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  }),
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? ""
      const domain = email.split("@")[1]
      const allowed = ALLOWED_DOMAINS.some((d) => domain === d || domain?.endsWith("." + d))
      if (!allowed) return false
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single()
        if (dbUser.data) {
          session.user.id = dbUser.data.id
          session.user.faculty = dbUser.data.faculty
          session.user.role = dbUser.data.role
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const id = await syncUser(user.email, user.name ?? "User", user.image ?? undefined)
        token.sub = id
      }
      return token
    },
  },
  pages: {
    signIn: "/",
  },
})
