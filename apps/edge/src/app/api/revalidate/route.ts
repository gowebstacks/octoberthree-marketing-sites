import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")?.replace(/\/+$/, "");

  if (secret !== process.env.STORYBLOK_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const slug = body?.story_id ?? body?.full_slug ?? "unknown";

    revalidatePath("/", "layout");

    console.log(`[revalidate] Revalidated all pages (trigger: ${slug})`);

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
