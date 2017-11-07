"use strict";

var url = [];
var count = 0;

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); //will install the service worker
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); //will activate the serviceworker
});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function(clientList) {
            if (clients.openWindow) {
                var c = count;
                count++;
                return clients.openWindow(url[c]);
            }
        })
    );
});

self.addEventListener('push', function(event) {
    event.waitUntil(
        self.registration.pushManager.getSubscription()
            .then(function(subscription) {
                //   console.log("subscription", subscription, event.data.text());
                var payload = event.data ? JSON.parse(event.data.text()) : {
                    title: 'Simple-Blog',
                    body: 'Come back and visit us :)',
                    icon: '/template/kotha/img/sorenso-logo.png',
                    url: '//litt.no/'
                };

                url.push(payload.url);
                return self.registration.showNotification(payload.title, {
                    body: payload.body,
                    icon: payload.icon,
                    tag: payload.url + payload.body + payload.icon + payload.title
                });
            })
    );
});

// 'use strict';
//
// const protocolPattern = /^http:/;
//
// self.addEventListener('install', function(event) {
//     // Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
//     // there are still previous incarnations of this service worker registration active.
//     event.waitUntil(self.skipWaiting());
// });
//
// self.addEventListener('activate', function(event) {
//     // Claim any clients immediately, so that the page will be under SW control without reloading.
//     event.waitUntil(self.clients.claim());
// });
//
// function recieveInfoFromClient(client) {
//     if (!client) {
//         throw new Error('Missing client');
//     }
//
//     return new Promise((resolve, reject) => {
//         let msgChan = new MessageChannel();
//
//         let timer = setTimeout(reject.bind(null, new Error('Page not responding to message')), 1000);
//
//         msgChan.port1.onmessage = function(event) {
//             if (event.data.error) {
//                 throw event.data.error;
//             } else {
//                 clearTimeout(timer);
//                 resolve(JSON.parse(event.data));
//             }
//         };
//
//         client.postMessage('get:page-url', [msgChan.port2]);
//     });
// }
//
// self.addEventListener('fetch', (event) => {
//     let url = event.request.url;
//
//     if (protocolPattern.test(url)) {
//         self.clients.get(event.clientId)
//             .then(recieveInfoFromClient)
//             .then(info => {
//                 return fetch('//localhost:8080/api/stpeter/log', {
//                     method: 'POST',
//                     mode: 'cors',
//                     body: JSON.stringify({
//                         'csp-report': {
//                             referrer: info['page-url'],
//                             violation : url
//                         }
//                     })
//                 });
//             })
//             .catch((err) => console.error(err));
//     }
// });

// /*
//  chrome://serviceworker-internals/
//      Scope: https://www.ifinnmark.no/
//      Registration ID: 10
//      Active worker:
//      Installation Status: ACTIVATED
//      Running Status: STOPPED
//      Fetch handler existence: EXISTS
//      Script: https://www.ifinnmark.no/serviceworker.js
//      Version ID: 124
//      Renderer process ID: 0
//      Renderer thread ID: -1
//      DevTools agent route ID: -2
//      Log:
// */
