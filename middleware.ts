import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("adoptAppToken")?.value;
  const step1Complete = req.cookies.get("adoptStep1Complete")?.value === "true";
  const step2Complete = req.cookies.get("adoptStep2Complete")?.value === "true";
  const step3Complete = req.cookies.get("adoptStep3Complete")?.value === "true";
  const currentTime = Math.floor(Date.now() / 1000);

  const isStep2 = pathname === "/adopt/application/step2";
  const isStep3 = pathname === "/adopt/application/step3";
  const isStep4 = pathname === "/adopt/application/step4";
  const isRootApp = pathname === "/adopt/application";

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.exp && payload.exp > currentTime) {
        // Valid token — redirect to step4 unless already there
        if (!isStep4) {
          return NextResponse.redirect(
            new URL("/adopt/application/step4", req.url)
          );
        }
        return NextResponse.next();
      } else {
        // Token expired — delete and redirect to step1
        const res = NextResponse.redirect(
          new URL("/adopt/application/step1", req.url)
        );
        res.cookies.delete("adoptAppToken");
        return res;
      }
    } catch {
      // Invalid token — delete and redirect to step1
      const res = NextResponse.redirect(
        new URL("/adopt/application/step1", req.url)
      );
      res.cookies.delete("adoptAppToken");
      return res;
    }
  }

  // No token or invalid token handled above
  // Redirect root /adopt/application to step1 if no valid token
  if (isRootApp) {
    return NextResponse.redirect(new URL("/adopt/application/step1", req.url));
  }

  // Step gating logic:
  if (isStep2 && !step1Complete) {
    return NextResponse.redirect(new URL("/adopt/application/step1", req.url));
  }

  if (isStep3 && !step2Complete) {
    return NextResponse.redirect(new URL("/adopt/application/step2", req.url));
  }

  if (isStep4 && !step3Complete) {
    return NextResponse.redirect(new URL("/adopt/application/step3", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adopt/application/:path*"],
};
