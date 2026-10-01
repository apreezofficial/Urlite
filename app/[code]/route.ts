import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, recordClick } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Skip favicon or internal assets
    if (!code || code === "favicon.ico" || code.startsWith("_")) {
      return new NextResponse(null, { status: 404 });
    }

    const link = await getLinkByCode(code);

    if (!link) {
      const url = new URL("/", request.url);
      url.searchParams.set("not_found", code);
      return NextResponse.redirect(url);
    }

    // Increment click count asynchronously
    await recordClick(code);

    // 307 Temporary Redirect so browsers don't cache and future clicks increment analytics
    return NextResponse.redirect(link.originalUrl, 307);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
