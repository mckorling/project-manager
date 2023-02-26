import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// middleware doesn't check here, and need to check auth here anyway\
// comes from api.ts in lib folder
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

    await db.project.create({
        data: {
            name: req.body.name,
            ownerId: user.id,
        },
    });

    res.json({ data: { message: "ok" } });
}