import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { code: string } }) {
  const code = params.code;
  try {
    // Update click count and lastClickedAt
    await db.link.update({
      where: { code },
      data: { clicks: { increment: 1 }, lastClickedAt: new Date() },
    });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }
}
