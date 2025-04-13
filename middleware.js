// middleware.ts

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/leaderboard",
    "/api/webhook(.*)",
    "/api/test/(.*)",
  ],
  ignoredRoutes: [
    "/api/public(.*)",
  ],
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
