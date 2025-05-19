import NextAuth from "next-auth"
declare module "next-auth" {
    interface Session {
        user: {
            id?: string
            name?: string | null
            email?: string | null
            image?: string | null
            CrateDate?: string | null
            UpdateDate: string | null
        }
    }
    interface User {
        id?: string
        name?: string
        email?: string
        image?: string | null
        image?: string | null
        CrateDate?: string | null
        UpdateDate: string | null
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        provider?: string
        picture?: string | null
    }
}
