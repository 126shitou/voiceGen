import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from '@/mongodb/database';
import User from "@/models/User";
import { getServerSession } from "next-auth"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 })
    }


    try {
        // Connect to the database
        await connectToDB();

        // Get the URL from the request body
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // Find the user and update their collection
        const user = await User.findOneAndUpdate(
            { _id: params.id },
            // TODO 意思？
            { $addToSet: { collect: url } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, collection: user.collect });
    } catch (error) {
        console.error("Error adding to collection:", error);
        return NextResponse.json(
            { error: "Failed to add to collection" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Connect to the database
        await connectToDB();

        // Find the user
        const user = await User.findById(params.id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ collection: user.collect });
    } catch (error) {
        console.error("Error fetching collection:", error);
        return NextResponse.json(
            { error: "Failed to fetch collection" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Connect to the database
        await connectToDB();

        // Get the URL from the request body
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // Find the user and update their collection
        const user = await User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { collect: url } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, collection: user.collect });
    } catch (error) {
        console.error("Error removing from collection:", error);
        return NextResponse.json(
            { error: "Failed to remove from collection" },
            { status: 500 }
        );
    }
}