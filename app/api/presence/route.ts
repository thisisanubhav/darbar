import { NextResponse } from "next/server";

const WINDOW_MS = 45_000;

const globalStore = globalThis as typeof globalThis & {
  __darbarListeners?: Map<string, number>;
};

const listeners =
  globalStore.__darbarListeners ??
  (globalStore.__darbarListeners = new Map<string, number>());

function prune(now: number) {
  for (const [id, seen] of listeners) {
    if (now - seen > WINDOW_MS) listeners.delete(id);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: unknown };
  const id = typeof body?.id === "string" ? body.id.slice(0, 80) : "";
  if (!id) return NextResponse.json({ count: 0 }, { status: 400 });

  const now = Date.now();
  listeners.set(id, now);
  prune(now);

  return NextResponse.json({ count: listeners.size });
}
