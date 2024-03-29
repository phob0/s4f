import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from "iron-session/edge";
import type { IronSessionOptions } from "iron-session";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string || "2gyZ3GDw3LHZQKDhPnPDL3sjREVRXPr7",
    cookieName: "iron-session/s4f",
    cookieOptions: {
       secure: true //process.env.NODE_ENV === "production", TODO: set to true when SSL
    },
  };
  const session = await getIronSession(req, res, sessionOptions);

  const { user } = session;

  if (req.nextUrl.pathname !== '/') {
    if (user?.isLoggedIn) {
      return res;
    } else {
      return NextResponse.redirect(new URL('/', req.url))  
    }
  }
};

export const config = {
  matcher: ["/tasks", "/task", "/task/:path*"],
};