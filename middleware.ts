import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is signed in and tries to visit auth pages, redirect to home (or dashboard)
  if (
    userId &&
    isPublicRoute(req) &&
    ["/sign-in", "/sign-up"].some((path) =>
      req.nextUrl.pathname.startsWith(path),
    )
  ) {
    return NextResponse.redirect(new URL("/", req.url)); // or "/dashboard"
  }

  // Protect private routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
