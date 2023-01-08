const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            );
        }, s * 1000);
    });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

console.log('Test');

const getJSON = async url => {
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

const showRecipe = async function (url) {
    try {
        const {
            data: { recipe: recipeData },
        } = await Promise.race([getJSON(url), timeout(15)]);

        let recipe = Object.fromEntries(
            Object.entries(recipeData).map(([key, value]) => {
                const str = key.split('_');

                if (str.length < 2) return [key, value];

                console.log(1111);
                const finalStr = str
                    .map((word, i) => {
                        if (i === 0) return word;
                        // return word[0].toUpperCase() + word.slice(1);
                        return word.replace(word[0], word[0].toUpperCase());
                    })
                    .join('');

                console.log(finalStr);

                return [finalStr, value];
            })
        );

        console.log(recipe);
    } catch (err) {
        alert(err);
    }
};

showRecipe(
    'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
);
