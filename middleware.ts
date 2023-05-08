import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "./lib/session";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
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

