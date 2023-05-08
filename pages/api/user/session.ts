import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  isLoggedIn: boolean;
  address: string;
};

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    res.status(200).json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.status(200).json({
      isLoggedIn: false,
      address: "",
    });
  }
}