import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, deleteLink } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const link = await getLinkByCode(code);

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error("GET /api/links/[code] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const deleted = await deleteLink(code);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Link /${code} successfully deleted`,
    });
  } catch (error) {
    console.error("DELETE /api/links/[code] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
