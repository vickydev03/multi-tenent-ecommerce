import { exportTraceState } from "next/dist/trace";
import { NextRequest, NextResponse } from "next/server";

export const config = () => {
  matcher: ["/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)"];
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  // extract the hostname like nexttrade.com
  const hostName = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

  if (hostName.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostName.replace(`.${rootDomain}`, "");
    return NextResponse.rewrite(
      new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}
