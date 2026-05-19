import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/combat/:path*",
    "/inventory/:path*",
    "/skills/:path*",
    "/crafting/:path*",
    "/guild/:path*",
    "/leaderboard/:path*",
    "/profile/:path*",
    "/lore/:path*",
    "/pets/:path*",
  ],
};
