
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateShortCode, isValidUrl } from "@/lib/utils";

// GET /api/links - List all links
export async function GET() {
  // Return links ordered newest first so newly created links appear at the top.
  const links = await db.link.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(links);
}

// POST /api/links - Create a new link
export async function POST(request: Request) {
  try {
    const { url, code } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    const shortCode = code || generateShortCode();

    // If a custom code is provided, ensure uniqueness only. We no longer
    // enforce the 6-8 character restriction per user request.
    if (code) {
      const existing = await db.link.findUnique({ where: { code: shortCode } });
      if (existing) {
        return NextResponse.json({ error: "This custom code is already in use." }, { status: 409 });
      }
    }

    const newLink = await db.link.create({
      data: {
        url,
        code: shortCode,
      },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
