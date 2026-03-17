import { authMiddleware } from "@clerk/ nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/site",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/api/uploadthing",
  ],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (auth.userId && auth.isPublicRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
