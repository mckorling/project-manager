import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { comparePasswords, createJWT } from "@/lib/auth";
import { serialize } from "cookie";

export default async function signin(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const user = await db.user.findUnique({
        where: {
          email: req.body.email
        }
      })
  
      const isUser = await comparePasswords(req.body.password, user?.password)
      
      if (isUser) {
        const jwt = await createJWT(user);
  
        res.setHeader(
          "Set-Cookie",
          serialize(process.env.COOKIE_NAME, jwt, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          })
        );
        res.status(201);
        res.json({});
      }
    } else {
      res.status(402)
      res.json({})
    }
}

// export default async function signin(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === "POST") {
//         const user = await db.user.findUnique({
//             where: {
//                 email: req.body.email,
//             },
//         });
//         // many assumptions are being made
//         // should (for production) verifying more things and have fallbacks for it

//         if (!user) {
//             res.status(401);
//             res.json({ error: "Invalid login" });
//             return;
//         }

//         const isUser = await comparePasswords(req.body.password, user.password);

//         if (isUser) {
//             const jwt = await createJWT(user);
//             res.setHeader(
//                 "Set-Cookie",
//                 serialize(process.env.COOKIE_NAME, jwt, {
//                     httpOnly: true,
//                     path: "/",
//                     maxAge: 60 * 60 * 24 * 7,
//                 })
//             );
//             res.status(201);
//             res.end();
//         } else {
//             res.status(401);
//             res.json({ error: "Invalid login" });
//         }
//     } else {
//         res.status(402);
//         res.end();
//     }
// }