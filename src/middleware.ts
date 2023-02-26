import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // using jose because it works in edge runtimes
const PUBLIC_FILE = /\.(.*)$/;

// this file needs to be on the same level as pages folder (tutorial didn't have src folder so I had an error for awhile when this was in the root)

// by default middleware sits infront of every route
// so we need to tell it what to be between
// users will be able to access appropriate pages only by checking for jwt in cookies and verifying them

// had to make this again here as the other one is in a file with bcrypt which is not supported on edge runtimes
const verifyJWT = async (jwt) => {
    const { payload } = await jwtVerify(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload;
};

export default async function middleware(req, res) {
    const { pathname } = req.nextUrl;
    if ( // free to go to these sites
        pathname.startsWith("/_next") || // this is related to developement
        pathname.startsWith("/api") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/signin") ||
        pathname.startsWith("/register") ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    const jwt = req.cookies.get(process.env.COOKIE_NAME);

    if (!jwt) {
        // set the path name to where the user will be redirect if they don't have valid jwt
        req.nextUrl.pathname = "/signin";
        return NextResponse.redirect(req.nextUrl);
    }

    // can't run prisma
    try {
        // successfully went to user's requested page
        // jwt is an object and the value property is the token
        await verifyJWT(jwt.value);
        return NextResponse.next();
    } catch (e) {
        // authorized, but for some reason couldn't access user's requested page
        console.error(e);
        req.nextUrl.pathname = "/signin";
        return NextResponse.redirect(req.nextUrl);
    }
}