import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            httpOptions: {
                timeout: 30000
            }
        })
    ],
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
      },
    callbacks: {
        async signIn({ user, account, profile }) {
            return true
        },
        async jwt({ token, account, user }) {

            
            // Add provider and user ID to the token
            if (account) {
                token.provider = account.provider
            }
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            console.log("session callback++");

            // Add provider and ID to the session user
            if (session.user) {
                session.user.provider = token.provider as string
                session.user.id = token.id as string
            }
            return session
        },
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
