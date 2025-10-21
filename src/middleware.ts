import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/sign-in", "/sign-up"];
const privatePaths = ["/dashboard", "/home"];

export default clerkMiddleware(async (auth, request) => {
  const { userId, isAuthenticated } = await auth();
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const authenticated = isAuthenticated && userId;

  if (!authenticated) {
    if (pathname === "/home" || pathname === "/studio")
      return NextResponse.rewrite(new URL("/", request.url));
  }

  if (authenticated) {
    if (pathname === "/")
      return NextResponse.rewrite(new URL("/home", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
