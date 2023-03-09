// make sure we are in a post request
// then attempt to create a user
// schema has a restraint on unique email so we don't have to check if the user already exists
// if successful-then create a JWT and send back a user

import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { createJWT, hashPassword } from "@/lib/auth";
import { serialize } from "cookie";

export default async function register(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method === "POST") { // has to be all caps for POST
        const user = await db.user.create({
        data: {
            email: req.body.email,
            password: await hashPassword(req.body.password), // await can go on a field
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            },
        });
        
        // create web token
        const jwt = await createJWT(user);
        res.setHeader(
            "Set-Cookie", // tells browswer when it gets the response back to set the following cookies
            serialize(process.env.COOKIE_NAME as string, jwt, {
                httpOnly: true, // can't access cookies via js
                path: "/", 
                maxAge: 60 * 60 * 24 * 7, // cookie valid for a week.
            })
        );
        res.status(201);
        res.json({});
    } else {
        res.status(402);
        res.json({});
    }
}