// This middleware is to protect the proxied api to be called only by the same host
// In the future it could get more logic, for example JWT tokens, etc.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "./lib/session";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);

  // do anything with session here:
  const { user } = session;

  // like mutate user:
  // user.something = someOtherThing;
  // or:
  // session.user = someoneElse;

  // uncomment next line to commit changes:
  // await session.save();
  // or maybe you want to destroy session:
  // await session.destroy();

  if (req.nextUrl.pathname === '/tasks') {
    if (user?.isLoggedIn) {
      return res;
    } else {
      return NextResponse.redirect(new URL('/', req.url))  
    }
  }

};


export const config = {
  matcher: ['/tasks', '/task'],
};
