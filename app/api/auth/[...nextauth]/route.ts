import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { connectToDB } from "@/mongodb/database"
import User from "@/models/User"
import { getCurrentTime } from '@/lib/utils'

export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            httpOptions: {
                timeout: 30000
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            httpOptions: {
                timeout: 30000
            }
        })
    ],
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 30 天

    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("user+++", user, account, profile);
            await connectToDB()

            const dbUser = await User.findOne({ email: user.email });
            if (!dbUser) {
                console.log("InsertUser nox exist!");

                const InsertUser = new User({
                    thirdPartId: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    balance: 0,
                    createDate: getCurrentTime()
                });
                await InsertUser.save()
                console.log("InsertUser insert success!");
                return InsertUser
            }

            return true
        },
        async jwt({ token, account, user }) {

            if (account) {
                token.provider = account.provider
            }
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            const sessionUser = await User.findOne({ email: session.user.email });
            session.user.id = sessionUser._id.toString();

            session.user = { ...session.user, ...sessionUser._doc }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET

}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
