import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    faculty?: string
    role?: string
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      faculty?: string
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string
    faculty?: string
    role?: string
  }
}
