import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
//   console.log("Session Claims:", sessionClaims);

  const userRole = sessionClaims?.publicMetadata?.role;
//   console.log("user role",userRole); // 👈 fetch from metadata

  // Check if the user is trying to access an admin route
  if (isAdminRoute(req)) {
    if (!userId || userRole !== "admin") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }

  // Redirect to sign-in if the user is not logged in and the route is not public
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
