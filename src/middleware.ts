import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname; // relative path

    // manage route protection
    const token = await getToken({ req });
    const isAuth = !!token;

    const isAuthPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard", "/build", "/meal"];

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return null;
    }

    if (
      !isAuth &&
      sensitiveRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    //forces middleware run
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
)

// runs middleware when these are run
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/build", "/meal/:path*"],
}
