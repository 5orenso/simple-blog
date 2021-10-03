import PubSub from 'pubsub-js';

const topics = {
    LOG_OUT: 'logOut',

    // to show progress when running long-living tasks. Should be [0-100]
    LOADING_PROGRESS: 'loadingProgress',

    // when user has authenticated, this is used to update to the new token
    JWT_TOKEN_CHANGED: 'jwtTokenChanged',

    ERROR_MESSAGE: 'errorMessage',

    STATUS_MESSAGE: 'statusMessage',

    INDICATE_FETCH_CONTENT_START: 'indicateFetchContentStart',
    INDICATE_FETCH_CONTENT_STOP: 'indicateFetchContentStop',

    PULL_REFRESH: 'pullDownToRefresh',
    PULL_REFRESH_DONE: 'pullDownToRefreshDone',

    APP_PAUSE: 'appPause',
    APP_RESUME: 'appResume',

    SCROLL_BOTTOM: 'appNearBottom',

    REFRESH_PAGE: 'appPage',

    CORDOVA: 'CORDOVA',
};

const ps = {
    publish: (topic, message) => {
        PubSub.publish(topic, message);
    },

    subscribe: (topic, callback) => {
        PubSub.subscribe(topic, (_, message) => {
            callback(message);
        });
    },

    unsubscribe: (topic) => {
        PubSub.unsubscribe(topic);
    }
};

export default ps;
export { topics };
