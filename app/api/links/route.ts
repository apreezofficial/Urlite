import { NextRequest, NextResponse } from "next/server";
import { getAllLinks, createLink } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const links = await getAllLinks();
    
    let filteredLinks = links;
    if (email) {
      filteredLinks = links.filter((l) => l.ownerEmail === email);
    }
    
    return NextResponse.json({ success: true, links: filteredLinks });
  } catch (error) {
    console.error("GET /api/links error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customCode, title, ownerEmail } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid URL" },
        { status: 400 }
      );
    }

    const { link, error } = await createLink({
      url,
      customCode,
      title,
      ownerEmail,
    });

    if (error || !link) {
      return NextResponse.json(
        { success: false, error: error || "Could not create short URL" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error) {
    console.error("POST /api/links error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
