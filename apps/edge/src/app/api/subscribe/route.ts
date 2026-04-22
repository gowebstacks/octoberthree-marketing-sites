import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }   

    const res = await fetch(
      "https://api.hsforms.com/submissions/v3/integration/submit/4293115/fce28be1-0ef7-4d68-93bd-b3427e85479a",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            {
              name: "email",
              value: email,
            },
          ],
          context: {
            pageUri: req.headers.get("referer") || "",
            pageName: "CTA Subscribe",
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("HubSpot error:", data);

      return NextResponse.json(
        { error: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}