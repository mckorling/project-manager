import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

export const hashPassword = (password: string) => bcrypt.hash(password, 10); // asynchronous, implicit return


export const comparePasswords = (plainTextPassword: string, hashedPassword: any) => 
    bcrypt.compare(plainTextPassword, hashedPassword)

// json webtoken (jwt). stateless way to do authentication. 
// take an obj and convert it to standard stream that's unique. 
// when server gets stream, undo the operation, and get back the obj

// create JWT
export const createJWT = (user: User) => {
    // return jwt.sign({ id: user.id }, 'cookies')
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7; // expire a week from today 

    return new SignJWT({ payload: { id: user.id, email: user.email } }) // using two unique fields so that it's easy to determine when we get it back
        .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // there are other algorithms that can be used
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET)); // turns it to a buffer and sign it with secret, sercret ensures it comes from right server
}; // sends back a string

// validate a JWT
export const validateJWT = async (jwt: string) => {
    const { payload } = await jwtVerify(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET) // same secret is used to verify it
    );

    return payload.payload as any;
};

// env variables: need to restart the server so it picks up new ones
// in production should use someting that produces the secret automatically

// Getting the JWT from cookies
// check that user is in the database, extra step to guarantee validity
// cookies is coming from Next.js library 
export const getUserFromCookie = async (cookies) => {
    const jwt = cookies.get(process.env.COOKIE_NAME);

    const { id } = await validateJWT(jwt.value);
    
    // db is a cached instance of prisma
    const user = await db.user.findUnique({
        where: {
            id: id as string,
        },
    });

    return user;
};