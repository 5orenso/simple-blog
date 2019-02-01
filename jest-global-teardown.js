const myMongoose = require('./lib/class/mongoose');

// teardown.js
module.exports = async function() {
    console.log('==> Final teardown!');
    // await global.__MONGOOSE__.connection.close();
    myMongoose.close();
};
