
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/links/:code - Stats for one code
export async function GET(request: Request, { params }: { params: { code: string } }) {
  const code = params.code;
  const link = await db.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json(link);
}

// DELETE /api/links/:code - Delete link
export async function DELETE(request: Request, { params }: { params: { code: string } }) {
  const code = params.code;
  const deletedLink = await db.link.delete({ where: { code } });

  if (!deletedLink) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Link deleted successfully." }, { status: 200 });
}
