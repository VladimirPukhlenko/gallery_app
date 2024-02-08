import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const API_URL = process.env.API_URL;

export async function middleware(request: NextRequest) {
  const refresh_token =
    request.cookies.get("refresh_token_client")?.value || "";

  const isValidUser = await refreshTokenVerification(refresh_token);

  if (!isValidUser && request.nextUrl.pathname === "/registration") {
    return NextResponse.next();
  }
  if (isValidUser && request.nextUrl.pathname !== "/registration") {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/my_images",
    "/favorites",
    "/albums/:path*",
    "/registration",
    "/all_albums",
  ],
};

const refreshTokenVerification = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/refresh?type=validate`, {
      headers: {
        Cookie: `refresh_token=${token};`,
      },
    });
    return res.status === 200;
  } catch (e) {
    return false;
  }
};
