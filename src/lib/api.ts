// these are going to be using client components
// unit test seperately, they don't need to be set up with components
// separation of concern- no ui or anything like that going on here
// this might be a reusable function

// use fetch to get and mutate data
export const fetcher = async ({url, method, body, json=true}) => {
    const res = await fetch(url, {
        method,
        body: body && JSON.stringify(body),
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
export const register = async (user) => {
    return fetcher({
        url: "/api/register",
        method: "POST",
        body: user,
        json: false,
    });
};

// Allow a user to signin
export const signin = async (user) => {
    return fetcher({
        url: "/api/signin",
        method: "POST",
        body: user,
        json: false,
    });
};