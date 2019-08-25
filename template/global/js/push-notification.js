function registerServiceWorker() {
    return navigator.serviceWorker.register('/service-worker.js')
        .then(registration => registration)
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
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            // eslint-disable-next-line
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
        return Promise.reject(new Error('sendSubscriptionToBackEnd: No subscripton found'));
    }
    const rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
    const rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    const authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
    const endpoint = subscription.endpoint;

    // Send the subscription details to the server using the Fetch API.
    return fetch('/push-register', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            // eslint-disable-next-line
            endpoint,
            key,
            authSecret,
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
        let serviceWorkerRegistration;
        return navigator.serviceWorker.ready
            .then((swReg) => {
                serviceWorkerRegistration = swReg;
                return serviceWorkerRegistration.pushManager.getSubscription();
            })
            .then((subscription) => {
                if (subscription) {
                    console.log('[push]  pushManager.getSubscription.subscription:', subscription);
                    return resolve(subscription);
                }
                console.log('[push]  pushManager.getSubscription: No subscription found. '
                    + 'Asking for permission.');
                return askPermission()
                    .then(() => {
                        const subscribeOptions = { userVisibleOnly: true };
                        console.log(`[push] pushManager.subscribe(${JSON.stringify(subscribeOptions)})`);
                        return serviceWorkerRegistration.pushManager.subscribe(subscribeOptions);
                    })
                    .then((pushSubscription) => {
                        console.log('[push]  pushManager.subscribe.pushSubscription:', pushSubscription);
                        return resolve(pushSubscription);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
    });
}

if (1 === 2) {
    if ('serviceWorker' in navigator) {
        registerServiceWorker()
            .then(registration => subscribeUserToPush(registration))
            .then(subscription => sendSubscriptionToBackEnd(subscription))
            .then((result) => {
                // All ok. Service worker is registered and sent to the server.
                console.log('[push-notifications.js]  Response from server:', result);
            })
            .catch((error) => {
                // Something went wrong. Trying to send error to the server.
                console.log('[push-notifications.js]  Ok, so something went wrong:', error);
                sendErrorToBackend(error)
                    .then((response) => {
                        // Error sent to the server.
                        console.log(`[push-notifications.js]  sendErrorToBackend.response: ${JSON.stringify(response)}`);
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            });
    } else {
        // Server worker is not supported.
        console.log('[push-notifications.js]  Service workers are not supported.');
    }
}