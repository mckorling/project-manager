import { User, Project } from "@prisma/client";

// these are going to be using client components
// unit test seperately, they don't need to be set up with components
// separation of concern- no ui or anything like that going on here
// this might be a reusable function

type FetcherProps = {
    url: string,
    method: string,
    body: Partial<User> | Partial<Project>,
    json?: boolean
}


// use fetch to get and mutate data
export const fetcher = async ({url, method, body, json=true} : FetcherProps) => {
    const res = await fetch(url, {
        method,
        ...(body && {body: JSON.stringify(body)}),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    });

    if (!res.ok) {
        throw new Error("API error");
    }

    if (json) {
        const data = await res.json();
        return data;
    }
};

// Allow a user to register
export const register = async (user: User) => {
    return fetcher({
        url: "/api/register",
        method: "POST",
        body: user,
        json: false,
    });
};

// Allow a user to signin
export const signin = async (user: User) => {
    return fetcher({
        url: "/api/signin",
        method: "POST",
        body: user,
        json: false,
    });
};

// will be called in a client component
// looking at schema, a new project really only needs a name
export const createNewProject = (name: string) => {
    return fetcher({
        url: "/api/project", // goes to pages/api/project which does the db work
        method: "POST",
        body: { name },
    });
};