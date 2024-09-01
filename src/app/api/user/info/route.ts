import { createClerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  console.log(userId)
  if (!userId) {
    return NextResponse.json({error: "No user_id"})
  }
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  try {
    const user = await clerkClient.users.getUser(userId);
    console.log(user)
    return NextResponse.json({user})
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({error: "Failed to fetch user"}, { status: 500 });
  }
}
