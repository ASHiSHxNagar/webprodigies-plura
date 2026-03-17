import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/site(.*)",
  "/agency/sign-in(.*)",
  "/agency/sign-up(.*)",
  "/api/uploadthing(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const hostname = req.headers.get("host") || "";

  const pathWithSearchParams =
    `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // 🔐 Protect routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // 🌐 Subdomain logic
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "";
  const customSubDomain = hostname
    .split(domain)
    .filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    );
  }

  // 🔁 Redirect old /sign-in → new path
  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(
      new URL("/agency/sign-in", req.url)
    );
  }

  // 🏠 Root → /site
  if (
    url.pathname === "/" ||
    (url.pathname === "/site" && hostname === domain)
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  // 🧭 Allow agency/subaccount routes
  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(
      new URL(pathWithSearchParams, req.url)
    );
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};