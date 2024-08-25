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

  // TODO: Redirect user away from "/auth" once authenticated "/home"
});

export const config = { matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"] };