import { observable, configure, action, computed, autorun } from 'mobx';
import util from 'preact-util';
import { route } from 'preact-router';
import PubSub, { topics } from './pubsub';
import mu from './musher-util';

configure({ enforceActions: 'always' });

class AppState {
    constructor() {
        this.setView(util.getObject('view'));
    }

    @observable mousePos = [];

    @observable view = {};

    @observable latlng = null;

    @observable mapColorMode = 'incline';

    @observable mapRange = [];

    @observable mapRangeMin = -13;

    @observable mapRangeMax = 13;

    @observable mapColors = [];

    @observable focusOnMushers = util.get('focusOnMushers') || [];

    @observable infoOnMushers = [];

    @observable darkmode = util.get('darkmode');

    @observable viewmode = util.get('viewmode') || 'normal';

    @observable counter = util.get('counter');

    @observable language = util.get('language') || 'en';

    @observable userEmail = util.getUserEmail();

    @observable jwtToken = util.getJwtToken();

    @observable apiServer = util.getApiServer();

    @observable apiServerChanged = false;

    @observable fingerprint = '';

    @observable jwtToken = '';

    @observable path = '';

    @observable previousPath = '';
    
    @observable prevScroll = 0;

    @observable publicTrackFilter = '';

    @observable hasShareApi = false;

    @observable isCordova = false;

    @observable cordovaIsReady = false;

    @observable displayDetails = util.get('displayDetails') || {};

    @observable editUserDetails = {};

    @observable selectedClassIds = util.get('selectedClassIds') || [];

    @observable searchResultStories = [];

    @observable searchResultDogs = [];

    @observable searchResultWorkouts = [];

    @observable searchResultTeams = [];

    @observable searchResultTracks = [];

    @observable searchResultUsers = [];

    @observable publicTeams = [];

    @observable publicUsers = [];

    @observable swipeLeft = () => {};

    @observable swipeRight = () => {};

    @observable swipeUp = () => {};

    @observable swipeDown = () => {};

    @observable swipeRights = [];

    @observable swipeLefts = [];

    @observable swipeUps = [];

    @observable swipeDowns = [];

    @action
    setSwipeLeft(func) {
        if (typeof func === 'function') {
            this.swipeLefts.push(this.swipeLeft);
            this.swipeLeft = func;
        } else {
            this.swipeLeft = this.swipeLefts.pop();
        }
    }

    @action
    setSwipeRight(func) {
        if (typeof func === 'function') {
            this.swipeRights.push(this.swipeRight);
            this.swipeRight = func;
        } else {
            this.swipeRight = this.swipeRights.pop();
        }
    }

    @action
    setSwipeUp(func) {
        if (typeof func === 'function') {
            this.swipeUps.push(this.swipeUp);
            this.swipeUp = func;
        } else {
            this.swipeUp = this.swipeUps.pop();
        }
    }

    @action
    setSwipeDown(func) {
        if (typeof func === 'function') {
            this.swipeDowns.push(this.swipeDown);
            this.swipeDown = func;
        } else {
            this.swipeDown = this.swipeDowns.pop();
        }
    }

    @action
    setApiServer(apiServer) {
        util.setApiServer(apiServer);
        this.apiServer = apiServer;
        this.apiServerChanged = true;
    }

    @action
    localUpdateField(key, value) {
        this[key] = value;
    }

    @action
    addSelectedClassId(classId) {
        // console.log('addSelectedClassId', classId);
        if (classId) {
            const idx = this.selectedClassIds.indexOf(classId);
            if (idx === -1) {
                this.selectedClassIds.push(classId);
            }
            util.set('selectedClassIds', this.selectedClassIds);
        }
    }

    @action
    removeSelectedClassId(classId) {
        if (classId) {
            const idx = this.selectedClassIds.indexOf(classId);
            if (idx > -1) {
                this.selectedClassIds.splice(idx, 1);
            }
            this.selectedClassIds = this.selectedClassIds.filter(e => e !== null);
            util.set('selectedClassIds', this.selectedClassIds);
        }
    }

    @action
    hasSelectedClassId(classId) {
        const idx = this.selectedClassIds.indexOf(classId);
        if (idx > -1) {
            return true;
        }
        return false;
    }

    @action
    toggleSelectedClassId(classId) {
        // console.log('toggleSelectedClassId', classId, this.selectedClassIds);
        
        if (this.hasSelectedClassId(classId)) {
            this.removeSelectedClassId(classId);
        } else {
            this.addSelectedClassId(classId);
        }
    }

    @action
    addFocusOnMusher(musherId) {
        if (musherId > 0) {
            const idx = this.focusOnMushers.indexOf(musherId);
            if (idx === -1) {
                this.focusOnMushers.push(musherId);
            }
            util.set('focusOnMushers', this.focusOnMushers);
        }
    }

    @action
    removeFocusOnMusher(musherId) {
        if (musherId > 0) {
            const idx = this.focusOnMushers.indexOf(musherId);
            if (idx > -1) {
                this.focusOnMushers.splice(idx, 1);
            }
            this.focusOnMushers = this.focusOnMushers.filter(e => e !== null);
            util.set('focusOnMushers', this.focusOnMushers);
        }
    }

    @action
    hasFocusOnMusher(musherId) {
        const idx = this.focusOnMushers.indexOf(musherId);
        if (idx > -1) {
            return true;
        }
        return false;
    }

    @action
    toggleFocusOnMusher(musherId) {
        if (this.hasFocusOnMusher(musherId)) {
            this.removeFocusOnMusher(musherId);
        } else {
            this.addFocusOnMusher(musherId);
        }
    }

    @action
    addInfoOnMusher(musherId) {
        if (musherId > 0) {
            const idx = this.infoOnMushers.indexOf(musherId);
            if (idx === -1) {
                this.infoOnMushers.push(musherId);
            }
            util.set('infoOnMushers', this.infoOnMushers);
        }
    }

    @action
    removeInfoOnMusher(musherId) {
        if (musherId > 0) {
            const idx = this.infoOnMushers.indexOf(musherId);
            if (idx > -1) {
                this.infoOnMushers.splice(idx, 1);
            }
            this.infoOnMushers = this.infoOnMushers.filter(e => e !== null);
            util.set('infoOnMushers', this.infoOnMushers);
        }
    }

    @action
    hasInfoOnMusher(musherId) {
        const idx = this.infoOnMushers.indexOf(musherId);
        if (idx > -1) {
            return true;
        }
        return false;
    }

    @action
    toggleInfoOnMusher(musherId) {
        if (this.hasInfoOnMusher(musherId)) {
            this.removeInfoOnMusher(musherId);
        } else {
            this.addInfoOnMusher(musherId);
        }
    }

    @action
    toggleDisplayDetails(email) {
        this.displayDetails[email] = !this.displayDetails[email];
        util.set('displayDetails', this.displayDetails);
    }

    @action
    toggleEditUserDetails(email) {
        this.editUserDetails[email] = !this.editUserDetails[email];
    }

    @action
    setLanguage(language) {
        this.language = language;
        util.set('language', language);
    }

    @action
    setPath(path) {
        this.path = path;
    }

    @action
    setPrevPath(path) {
        this.previousPath = path;
    }
    @action
    setPrevScroll(scroll) {
        this.prevScroll = scroll;
    }

    @action
    setMousePosition(pos = []) {
        this.mousePos = pos;
    }

    @action
    setView(view) {
        this.view = view;
        util.setObject('view', view);
    }

    @action
    setViewKey(key, value) {
        this.view[key] = value;
    }

    @action
    setKey(key, value) {
        this[key] = value;
    }

    @action
    checkShareApi() {
        if (navigator.share) {
            // Web Share is supported
            this.hasShareApi = true;
        }
    }

    async shareUrl({ url, title, text }) {
        try {
            await navigator.share({ url, title, text });
            return true;
        } catch (e) {
            console.error('Could not share!', e);
            return false;
        }
    }

    @action
    checkCordova() {
        if(!window.cordova && !document.cordova) {
            this.isCordova = false;
            // document.body.style['margin-top'] = '200px';
        } else {
            this.isCordova = true;
            // document.body.style['margin-top'] = '200px';
        }
    }

    @action
    cordovaSetToReady() {
        this.cordovaIsReady = true;
    }

    @action
    incCounter() {
        this.counter += 1;
        util.set('counter', this.counter);
    }

    @action
    decCounter() {
        this.counter -= 1;
        util.set('counter', this.counter);
    }

    @computed
    get counterTimes2() {
        return this.counter * 2;
    }

    @action
    toggleDarkmode() {
        // console.log('toggleDarkmode', this.darkmode);
        this.darkmode = !this.darkmode;
        util.set('darkmode', this.darkmode);
        util.toggleDarkModeClasses(this.darkmode);
    }

    @action
    toggleViewmode(mode) {
        // console.log('toggleViewmode', this.viewmode);
        this.viewmode = mode || !this.viewmode;
        util.set('viewmode', this.viewmode);
    }

    @action
    toggleField(key, val) {
        this[key] = val ? val : !this.val;
    }

    @action
    setLatlng(latlng = []) {
        this.latlng = latlng;
    }

    @action
    setMapColorMode(colorMode) {
        this.mapColorMode = colorMode;
    }

    @action
    setMapRange(range, min, max) {
        this.mapRange = range;
        this.mapRangeMin = min;
        this.mapRangeMax = max;
    }

    @action
    setMapColors(colors) {
        this.mapColors = colors;
    }

    @action
    updateField(key, val) {
        this[key] = val;
    }

    async getFingerprint() {
        const res = await util.fetchApi('/api/public/fingerprint/', { publish: false });
        if (res.status === 200) {
            this.updateField('fingerprint', res.fingerprint);
            this.updateField('jwtToken', res.jwtToken);
        }
    }

    async sendEmail({ to = [], subject = '', body = '', raceId, raceClassId }) {
        const response = await util.fetchApi(`/api/email/`, { publish: true, method: 'POST' }, { to, subject, body, raceId, raceClassId });
        switch (response.status) {
            case 200:
                return response;
            case 401:
                PubSub.publish(topics.LOG_OUT);
                route('/', true);
                break;
            default:
                return response;
        }
    }

    async sendEmailPlain({ to = [], subject = '', body = '' }) {
        const response = await util.fetchApi(`/api/email/plain`, { publish: true, method: 'POST' }, { to, subject, body });
        switch (response.status) {
            case 200:
                return response;
            case 401:
                PubSub.publish(topics.LOG_OUT);
                route('/', true);
                break;
            default:
                return response;
        }
    }

    async getSearch(search) {
        const response = await util.fetchApi(`/api/search/${search}`, { publish: true, method: 'GET' }, {});
        switch (response.status) {
            case 200:
                this.localUpdateField('searchResultStories', response.data.stories);
                this.localUpdateField('searchResultDogs', response.data.dogs);
                this.localUpdateField('searchResultWorkouts', response.data.workouts);
                this.localUpdateField('searchResultTeams', response.data.teams);
                this.localUpdateField('searchResultTracks', response.data.tracks);
                this.localUpdateField('searchResultUsers', response.data.users);

                this.localUpdateField('publicTeams', response.included.teams);
                this.localUpdateField('publicUsers', response.included.users);

                return response;
            case 401:
                PubSub.publish(topics.LOG_OUT);
                route('/', true);
                break;
        }
    }
}

const store = new AppState();

autorun(() => {
    // console.log(store.counter);
})

export default store;
