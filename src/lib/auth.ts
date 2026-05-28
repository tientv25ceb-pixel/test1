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
  console.log("--- syncUser DEBUG ---", { email, name, avatar })
  const { data: existing, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (selectError) {
    console.log("syncUser: Select error:", selectError.message, selectError)
  }

  if (existing) {
    console.log("syncUser: User exists with ID:", existing.id)
    const { error: updateError } = await supabase
      .from("users")
      .update({ name, avatar, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
    if (updateError) {
      console.log("syncUser: Update error:", updateError.message, updateError)
    }
    return existing.id
  }

  const domain = email.split("@")[1]
  let faculty = "Khác"
  if (domain?.includes("dut")) faculty = "CNTT - ĐH Bách Khoa"
  else if (domain?.includes("due")) faculty = "Quản trị KD - ĐH Kinh tế"
  else if (domain?.includes("ued")) faculty = "Sư phạm Toán - ĐH Sư phạm"
  else if (domain?.includes("udn")) faculty = "Khác - ĐH Đà Nẵng"

  console.log("syncUser: Creating new user with faculty:", faculty)
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({ email, name, avatar, faculty })
    .select("id")
    .single()

  if (insertError) {
    console.log("syncUser: Insert error:", insertError.message, insertError)
  }

  console.log("syncUser: Created user:", newUser)
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
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? ""
      const domain = email.split("@")[1]
      const allowed = ALLOWED_DOMAINS.some((d) => domain === d || domain?.endsWith("." + d))
      if (!allowed) return false
      return true
    },
    async session({ session }) {
      console.log("--- session callback START ---", session.user?.email)
      if (session.user?.email) {
        let dbUser = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single()
        
        if (dbUser.error) {
          console.log("session callback: dbUser select error:", dbUser.error.message, dbUser.error)
        }

        if (!dbUser.data) {
          console.log("session callback: User not found in DB, attempting syncUser...")
          // Tự động đồng bộ lại nếu user chưa tồn tại trong DB (do lỗi RLS trước đó hoặc reset DB)
          const id = await syncUser(session.user.email, session.user.name ?? "User", session.user.image ?? undefined)
          console.log("session callback: syncUser returned ID:", id)
          if (id) {
            dbUser = await supabase
              .from("users")
              .select("*")
              .eq("id", id)
              .single()
            if (dbUser.error) {
              console.log("session callback: dbUser select error after sync:", dbUser.error.message, dbUser.error)
            }
          }
        }

        if (dbUser.data) {
          console.log("session callback: Found dbUser data, setting session properties")
          session.user.id = dbUser.data.id
          session.user.faculty = dbUser.data.faculty
          session.user.role = dbUser.data.role
        } else {
          console.log("session callback: dbUser.data is still empty!")
        }
      }
      console.log("--- session callback END ---", JSON.stringify(session))
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
