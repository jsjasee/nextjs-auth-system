import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// logic part
// login and sign up are public paths, people with tokens should not be able to access these paths.
// profile are private paths, people without tokens should not be able to access these paths.
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname; // this is how you can get the path

  const isPublicPath = path === "/login" || path === "/signup";

  // this token might or might not there, hence we use the ?
  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl)); // what is the request.nextUrl used for here?? why cannot use request.url? why is this param even here? - they need a url to build the url to redirect users, can use request.url or request.nextUrl here. request.nextUrl is a url object with more features because it has methods that can extract specific info from the url. the request.url is the FULL url String?
  } else if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// this is the matching part (which route to run middleware)
export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/signup"],
  // /:path* means /profile and /profile/123 are covered
};
