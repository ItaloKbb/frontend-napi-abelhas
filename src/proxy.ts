import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/login(.*)", "/register(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return;
  }

  const session = await auth.protect();

  if (isAdminRoute(request)) {
    if (session.orgRole !== "org:admin") {
      return NextResponse.redirect(new URL("/amostras", request.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
