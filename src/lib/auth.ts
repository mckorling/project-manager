import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { RequestCookies, RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { db } from "./db";

export const hashPassword = (password: string) => bcrypt.hash(password, 10); 

export const comparePasswords = (plainTextPassword: string, hashedPassword: any) => 
    bcrypt.compare(plainTextPassword, hashedPassword)

export const createJWT = (user: User) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7; // expire a week from today 

    return new SignJWT({ payload: { id: user.id, email: user.email } }) 
        .setProtectedHeader({ alg: "HS256", typ: "JWT" }) 
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}; 

export const validateJWT = async (jwt: string) => {
    const { payload } = await jwtVerify(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET) 
    );

    return payload.payload as any;
};

export const getUserFromCookie = async (cookies: RequestCookies) => {
    const jwt = cookies.get(process.env.COOKIE_NAME as string) as RequestCookie;

    const { id } = await validateJWT(jwt.value as string);
    
    const user = await db.user.findUnique({
        where: {
            id: id as string,
        },
    });

    return user;
};