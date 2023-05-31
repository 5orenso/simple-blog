const myMongoose = require('../lib/class/mongoose');
const Image = require('../lib/class/image');
const Article = require('../lib/class/article');
const ImageUtil = require('../lib/class/image-util');

const DEMO_KEY = 'iaL1ZdFRHYm21k21T9YIeWJBygvgCUwhf00KXNxJ';

async function fetchNASAPictureOfTheDay() {
    // Fetch NASA picture of the day:
    const fetch = require('node-fetch');
    // https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${DEMO_KEY}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    console.log('data', data);
}

const main = async () => {
    await fetchNASAPictureOfTheDay();
}

main();