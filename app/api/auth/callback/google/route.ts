import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        console.error("Google OAuth error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=No+code+provided`);
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

        // 1. Exchange code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: clientId!,
                client_secret: clientSecret!,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokens = await tokenResponse.json();

        if (tokens.error) {
            console.error("Token exchange error:", tokens.error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=Token+exchange+failed`);
        }

        // 2. Get user info
        const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const googleUser = await userResponse.json();

        if (googleUser.error) {
            console.error("User info error:", googleUser.error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=Failed+to+get+user+info`);
        }

        const { id: googleId, email, name } = googleUser;

        // 3. Find or create user
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId },
                    { email }
                ]
            }
        });

        if (!user) {
            // Create user
            user = await prisma.user.create({
                data: {
                    email,
                    googleId,
                    username: name || email.split("@")[0],
                    isVerified: true, // Google accounts are pre-verified
                },
            });
        } else if (!user.googleId) {
            // Link Google ID if user exists but hasn't used Google before
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId, isVerified: true },
            });
        }

        // 4. Sign JWT
        const token = await signToken({ userId: user.id, email: user.email });

        // 5. Redirect with cookie
        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);

        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("Callback catch error:", err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=Internal+server+error`);
    }
}
