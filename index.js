const cheerio = require('cheerio')
const axios = require('axios')

const getData = async () => {
    const url = 'https://www.fakenamegenerator.com/'
    try {
        const requests = [];

        for (let index = 0; index < 100; index++) {
            requests.push(axios.get(url));
        }

        const responses = await Promise.all(requests);
        return mapData(responses);
    } catch (error) {
        throw new Error('Error while fetching data from ', url);
    }
}

const mapData = (responses) => {
    const cache = {};

    const countName = (name) => {
        if (cache[name]) {
            cache[name]++;
        } else {
            cache[name] = 1;
        }
    }

    for (response of responses) {
        try {
            const $ = cheerio.load(response.data);
            const name = $('.address')[0].children[1].children[0].data.split(' ');
            const firstName = name[0];
            const secondName = name[2];
            countName(firstName);
            countName(secondName);
        } catch (error) {
            console.log('Error while parsing response');
        }
    }
    const mostPopularNames = Object.entries(cache).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return mostPopularNames;
}

const init = async () => {
    const start = Date.now();
    const mostPopularNames = await getData();
    console.log({
        mostPopularNames
    });
    const end = Date.now();
    console.log(`Execution time: ${(end - start) / 1000} seconds`);
}

init();