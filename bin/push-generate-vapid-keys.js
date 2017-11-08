const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

// Prints 2 URL Safe Base64 Encoded Strings
console.log('publicKey:', `'${vapidKeys.publicKey}',`);
console.log('privateKey:', `'${vapidKeys.privateKey}',`);
