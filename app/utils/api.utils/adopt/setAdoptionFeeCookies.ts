import { NextResponse } from "next/server";

const setAdoptionFeeCookies = (
  response: NextResponse,
  token: string,
  exp: number
) => {
  response.cookies.set("adoptAppToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  response.cookies.set("feeExp", exp?.toString() ?? "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: exp ? exp - Math.floor(Date.now() / 1000) : 1800,
    path: "/",
  });
};

export default setAdoptionFeeCookies;
