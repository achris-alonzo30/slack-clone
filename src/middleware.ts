import {
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
  convexAuthNextjsMiddleware,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/signin"])

export default convexAuthNextjsMiddleware((req) => {
  if (!isPublicRoute(req) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(req, "/signin");
  }
});

export const config = { matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"] };