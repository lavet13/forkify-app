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
        const res = await fetch(url);

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

export const getValidProperties = (recipe, char = '_') =>
    Object.fromEntries(
        Object.entries(recipe).map(([key, value]) => {
            const splitString = key.split(char);

            if (splitString.length < 2) return [key, value];

            const newKey = splitString.reduce((str, cur, i) => {
                if (i === 0) return (str += cur);

                return (str += cur.replace(cur[0], cur[0].toUpperCase()));
            }, ``);

            return [newKey, value];
        })
    );

export const getBackProperties = inputs => {
    const ingredients = Object.entries(inputs)
        .filter(([key, value]) => key.startsWith('ingredient') && value !== '')
        .reduce((acc, [key, value], _, arr) => {
            const ingredient = value.replaceAll(' ', '').split(',');
            if (ingredient.indexOf(',') !== -1)
                throw new Error(`Invalid data was received. ${key}`);
            if (ingredient.length !== 3)
                throw new Error(
                    `Wrong ingredient format! Please use the correct format :) ${key}`
                );
            const [quantity, unit, description] = ingredient;
            acc.push({
                quantity: quantity ? +quantity : null,
                unit: !quantity ? '' : unit,
                description,
            });
            return acc;
        }, []);

    const recipeData = Object.entries(inputs).filter(
        ([key]) => !/ingredient-[0-9]/.test(key)
    );

    return {
        ...Object.fromEntries(
            recipeData.map(([key, value], _, arr) => {
                const found = key.match(/[A-Z]/g);
                if (!found) {
                    if (!(key === 'servings')) return [key, value];

                    if (Number.isFinite(+value)) return [key, +value];

                    if (!Number.isFinite(+value))
                        throw new Error(
                            `The value isn't a number! Please type a number! ${key}`
                        );
                }

                const newKey = found
                    .reduce((acc, char) => {
                        const split = key.split(char);
                        split[1] = char.toLowerCase() + split[1];
                        return [...acc, ...split];
                    }, [])
                    .join('_');

                if (newKey === 'cooking_time' && Number.isFinite(+value)) {
                    return [newKey, +value];
                }

                if (!Number.isFinite(+value) && newKey === 'cooking_time')
                    throw new Error(
                        `The value isn't a number! Please type a number instead on a field ${newKey}`
                    );

                return [newKey, value];
            })
        ),
        ingredients,
    };
};

const guidGenerator = function () {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
    );
};

export const parseHTML = function (markup) {
    const t = document.createElement('template');
    t.innerHTML = markup;
    return t.content;
};
