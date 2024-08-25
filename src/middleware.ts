import {
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
  convexAuthNextjsMiddleware,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/auth"])

export default convexAuthNextjsMiddleware((req) => {
  if (!isPublicRoute(req) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(req, "/auth");
  }

  if (isPublicRoute(req) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(req, "/");
  }

});

export const config = { matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"] };