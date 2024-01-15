"use server";
import { cookies } from "next/headers";

// This functions are used because the my server and client are on different domains,
// which restricts the use of cookies set by the server. To access these cookies, I duplicate the necessary cookies
// from one server to the Next.js server. If not done, the cookies() function will not have access to the required cookies.

const expirationTime = {
  access_token_client: Date.now() + +process.env.ACCESS_TOKEN_EXP_MSEC!,
  refresh_token_client: Date.now() + +process.env.REFRESH_TOKEN_EXP_MSEC!,
  // recovery_token_client: Date.now() + +process.env.RECOVERY_TOKEN_EXP_MSEC!,
};
export const setToken = (
  tokenName: keyof typeof expirationTime,
  value: string
) => {
  cookies().set(tokenName, value, {
    httpOnly: process.env.NEXT_ENV === "production",
    path: "/",
    maxAge: expirationTime[tokenName],
  });
};
export const clearToken = async (tokenName: keyof typeof expirationTime) => {
  cookies().delete(tokenName);
};
