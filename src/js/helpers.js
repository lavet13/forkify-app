import { TIMEOUT_SEC } from './config';

export const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} seconds`)
            );
        }, s * 1000);
    });
};

// this function returns resolved value of the promise that the getJSON function returns
export const getJSON = async function (url) {
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

        const { status } = res;

        if (!res.ok) {
            const { message } = await res.json();
            throw new Error(`${message} (${status})`);
        }

        return await res.json();
    } catch (err) {
        throw err;
    }
};
