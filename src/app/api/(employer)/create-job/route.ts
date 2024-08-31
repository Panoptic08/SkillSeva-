import { supabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const body = await req.json();
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "No Authorization header provided" },
      { status: 400 }
    );
  }
  const token = authHeader.split(" ")[1];
  const supabase = await supabaseClient(token);

  if (!body) {
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  }

  const { title, description, skills, budget, category, job_type } = body;

  // Validate title
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }

  // Validate description
  if (!description || typeof description !== "string") {
    return NextResponse.json({ error: "Invalid description" }, { status: 400 });
  }
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount < 30 || wordCount > 250) {
    return NextResponse.json(
      { error: "Description must be between 30 and 250 words" },
      { status: 400 }
    );
  }

  // Validate skills
  if (!Array.isArray(skills) || skills.length === 0) {
    return NextResponse.json(
      { error: "Skills must be an array with at least one element" },
      { status: 400 }
    );
  }

  // Validate budget
  if (!budget || budget <= 0) {
    return NextResponse.json({ error: "Invalid budget" }, { status: 400 });
  }

  // Validate category
  if (
    !category ||
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  // Validate job_type
  if (!job_type || (job_type !== "individual" && job_type !== "agency")) {
    return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
  }

  // If all validations pass, proceed with processing
  console.log(body);
  const { data, error } = await supabase
    .from("jobs")
    .insert([{ ...body, user_id: userId }])
    .select();

  if (data) {
    console.log(data);
    return NextResponse.json(
      { message: "Job created successfully" },
      { status: 200 }
    );
  } else {
    console.log(error);
    return NextResponse.json(
      { message: "Job created failed" },
      { status: 500 }
    );
  }
}
