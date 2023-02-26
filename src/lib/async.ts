export const delay = (time: number | undefined) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(1), time);
    });

// this is just used to delay things to show loading time for learning purposes