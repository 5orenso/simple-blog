if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            registration.onupdatefound = function() {
                // If updatefound is fired, it means that there's a new service worker being installed.
                var installingWorker = registration.installing;
                console.log('A new service worker is being installed:', installingWorker);
                // You can listen for changes to the installing service worker's state
                // via installingWorker.onstatechange
            };

            return navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
                return serviceWorkerRegistration.pushManager.getSubscription()
                    .then(function(subscription) {
                        // If a subscription was found, return it.
                        if (subscription) {
                            console.log('==> subscription found:', subscription);
                            return subscription;
                        }
                        // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
                        // send browser push notifications that don't have a visible effect for the user).
                        return serviceWorkerRegistration.pushManager.subscribe({
                            userVisibleOnly: true,
                        })
                            .then(function(pushSubscription) {
                                console.log('==> pushSubscription.endpoint:', pushSubscription.endpoint);
                                console.log('==> pushSubscription.subscriptionId:', pushSubscription.subscriptionId);
                                // The push subscription details needed by the application
                                // server are now available, and can be sent to it using,
                                // for example, an XMLHttpRequest.
                            }, function(error) {
                                // During development it often helps to log errors to the
                                // console. In a production environment it might make sense to
                                // also report information about errors back to the
                                // application server.
                                console.log('==> error: ', error);
                            });
                    });
            });
        })
        .then(function(subscription) {
            console.log('==> subscription ready:', subscription);
            // Retrieve the user's public key.
            var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
            var key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
            var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
            authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
            endpoint = subscription.endpoint;

            // Send the subscription details to the server using the Fetch API.
            fetch('/push-register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    key: key,
                    authSecret: authSecret,
                }),
            });
        })
        .catch(function(error) {
            console.log('Service worker registration failed:', error);
        });
} else {
    console.log('Service workers are not supported.');
}
