import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MIT2025';

    if (typeof password !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
