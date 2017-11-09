function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
    ;
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('[push-notifications.js]  Service worker successfully registered.');
            registration.onupdatefound = () => {
                // If updatefound is fired, it means that there's a new service worker being installed.
                // You can listen for changes to the installing service worker's state
                // via installingWorker.onstatechange
                var installingWorker = registration.installing;
                console.log('[push-notifications.js]  A new service worker is being installed:', installingWorker);
            };
            return registration;
        })
        .catch((err) => {
            throw new Error(`Unable to register service worker: ${err}`);
        });
}

function askPermission() {
    return new Promise((resolve, reject) => {
        const permissionResult = Notification.requestPermission((result) => {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then((permissionResult) => {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}

function sendErrorToBackend(error) {
    return fetch('/push-error', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            error: error.name,
            errorMessage: error.message,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Bad status code from server.');
            }
            return response.json();
        })
        .then((responseData) => {
            if (!(responseData.data && responseData.data.success)) {
                throw new Error('Bad response from server.');
            }
            return responseData;
        });
}

function sendSubscriptionToBackEnd(subscription) {
    // Retrieve the user's public key.
    if (typeof subscription !== 'object') {
        return Promise.reject('sendSubscriptionToBackEnd: No subscripton found');
    }
    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    var key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
    var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
    endpoint = subscription.endpoint;

    // Send the subscription details to the server using the Fetch API.
    return fetch('/push-register', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: subscription.endpoint,
            key: key,
            authSecret: authSecret,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Bad status code from server.');
            }
            return response.json();
        })
        .then((responseData) => {
            if (!(responseData.data && responseData.data.success)) {
                throw new Error('Bad response from server.');
            }
            return responseData;
        });
}

function subscribeUserToPush() {
    return new Promise((resolve, reject) => {
        return navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
            console.log('[push-notifications.js]  Service worker is ready.');
            return serviceWorkerRegistration.pushManager.getSubscription()
                .then((subscription) => {
                    // If a subscription was found, return it.
                    if (subscription) {
                        console.log('[push-notifications.js]  pushManager.getSubscription.subscription:', subscription);
                        return resolve(subscription);
                    }

                    console.log('[push-notifications.js]  pushManager.getSubscription: No subscription found. Asking for permission.');
                    return askPermission()
                        .then(() => {
                            // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
                            // send browser push notifications that don't have a visible effect for the user).
                            const subscribeOptions = {
                                userVisibleOnly: true,
                                // applicationServerKey: urlBase64ToUint8Array(
                                //     '',
                                // ),
                            };
                            console.log(`[push-notifications.js]  pushManager.subscribe(${JSON.stringify(subscribeOptions)})`);
                            return serviceWorkerRegistration.pushManager.subscribe(subscribeOptions);
                        })
                        .then((pushSubscription) => {
                            console.log('[push-notifications.js]  pushManager.subscribe.pushSubscription:', pushSubscription);
                            // console.log('[push-notifications.js]  pushSubscription.subscriptionId:', pushSubscription.subscriptionId);
                            // The push subscription details needed by the application
                            // server are now available, and can be sent to it using,
                            // for example, an XMLHttpRequest.
                            return resolve(pushSubscription);
                        })
                        .catch((error) => {
                            // During development it often helps to log errors to the
                            // console. In a production environment it might make sense to
                            // also report information about errors back to the
                            // application server.
                            // console.log('[push-notifications.js]  pushManager.subscribe.error: ', error);
                            reject(error);
                        });
                });
        });
    });
}

if ('serviceWorker' in navigator) {
    registerServiceWorker()
        .then((registration) => subscribeUserToPush(registration))
        .then((subscription) => sendSubscriptionToBackEnd(subscription))
        .then((result) => {
            console.log('[push-notifications.js]  Response from server:', result);
        })
        .catch((error) => {
            console.log('[push-notifications.js]  Ok, so something went wrong:', error);
            sendErrorToBackend(error)
                .then((response) => {
                    console.log(`[push-notifications.js]  sendErrorToBackend.response: ${JSON.stringify(response)}`);
                })
                .catch((err) => {
                    throw new Error(err);
                });
        });
} else {
    console.log('[push-notifications.js]  Service workers are not supported.');
}
