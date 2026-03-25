
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, portalId, formId } = await req.json();

    if (!email || !portalId || !formId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api-na2.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [{ name: "email", value: email }],
          context: {
            pageUri: req.headers.get("origin") || "",
            pageName: "CTA Subscribe",
          },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("HubSpot error:", text);

      return NextResponse.json(
        { error: "HubSpot failed" },
        { status: 500 }
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