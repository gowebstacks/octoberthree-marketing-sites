import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  let changed = false;

  // http → https
  if (url.protocol === "http:") {
    url.protocol = "https:";
    changed = true;
  }
  // non-www → www
  // Disabled because Vercel preview domains do not support `www`
  // and were causing SSL certificate errors (`ERR_CERT_COMMON_NAME_INVALID`).
  // Re-enable only for custom production domains if needed.
  // if (!url.hostname.startsWith('www.')) {
  //   url.hostname = `www.${url.hostname}`;
  //   changed = true;
  // }
  // no trailing slash → add trailing slash (except for files with extensions)
  if (!url.pathname.includes(".") && !url.pathname.endsWith("/")) {
    url.pathname += "/";
    changed = true;
  }
  if (changed) {
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}
