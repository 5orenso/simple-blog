import { observable, configure, action, computed, autorun, toJS } from 'mobx';
import util from 'preact-util';
import { route } from 'preact-router';

configure({ enforceActions: 'always' });

function merge(a, b, prop){
    const reduced =  a.filter(aitem => !b.find(bitem => aitem[prop] === bitem[prop]));
    return reduced.concat(b);
}

function scrollTo(element, top = 0, left = 0) {
    // element.scrollTop = to;
    element.scrollTo({
        top,
        left,
        behavior: 'smooth'
    });
}

class AppState {
    constructor() {
        this.setView(util.getObject('view'));
    }

    @observable isDevelopment = process.env.NODE_ENV === 'development';

    @observable state = 'active';

    @observable currentEmail = null;

    @observable isAdmin = false;

    @observable isExpert = false;

    @observable mousePos = [];

    @observable view = {};

    @observable latlng = null;

    @observable mapColorMode = 'incline';

    @observable mapRange = [];

    @observable mapRangeMin = -13;

    @observable mapRangeMax = 13;

    @observable mapColors = [];

    @observable drawerHeightLarge = '100vh';

    @observable drawerHeightMedium = '95vh';

    @observable drawerHeightSmall = '60vh';

    @observable drawerHeight = '500px';

    @observable focusOnMushers = util.get('focusOnMushers') || [];

    @observable infoOnMushers = [];

    @observable darkmode = util.get('darkmode');

    @observable viewmode = util.get('viewmode') || 'normal';

    @observable counter = util.get('counter');

    @observable language = util.get('language') || 'en';

    @observable mapChecked = util.get('mapChecked') || 'OpenStreetMap.Mapnik';

    @observable checkpointId = util.get('checkpointId');

    @observable userEmail = util.getUserEmail();

    @observable jwtToken = util.getJwtToken();

    @observable apiServer = util.getApiServer();

    @observable apiServerChanged = false;

    @observable fingerprint = '';

    @observable path = '/';

    @observable previousPath = '';

    @observable workoutType = 'all';

    @observable prevScroll = 0;

    @observable publicTrackFilter = '';

    @observable hasShareApi = false;

    @observable isCordova = false;

    @observable cordovaIsReady = false;

    @observable connectionStatus = 'unknown';

    @observable displayDetails = util.get('displayDetails') || {};

    @observable editUserDetails = {};

    @observable veterinaryUserDetails = {};

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

    @observable swipeRightIndicate = () => {};

    @observable swipeLeftIndicate = () => {};

    @observable swipeUpIndicate = () => {};

    @observable swipeDownIndicate = () => {};

    @observable swipeRightIndicates = [];

    @observable swipeLeftIndicates = [];

    @observable swipeUpIndicates = [];

    @observable swipeDownIndicates = [];

    @observable showDashoard = false;

    @observable appContainer = null;

    @observable showDrawer = false;

    @observable showDrawer2 = false;

    @observable showDrawer3 = false;

    @observable drawerComponent = null;

    @observable drawerComponent2 = null;

    @observable drawerComponent3 = null;

    @observable drawerProps = {};

    @observable drawerProps2 = {};

    @observable drawerProps3 = {};

    @observable logs = [];

    @observable mainView = 'webcam';

    @observable weather = [];

    @observable checkpoints = [
        {
            id: 1,
            name: 'CP Røros',
            lat: 62.575349,
            lon: 11.385504,
            altitude: 640,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=452562',
        },
        {
            id: 2,
            name: 'CP Tufsingdalen',
            lat: 62.280182,
            lon: 11.738756,
            altitude: 608,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=1775594',
        },
        {
            id: 3,
            name: 'CP Drevsjø',
            lat: 61.890906,
            lon: 12.033327,
            altitude: 691.7,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
        {
            id: 4,
            name: 'CP Flendalen / Trysil',
            lat: 61.3153401,
            lon: 12.2595506,
            altitude: 620,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
        {
            id: 5,
            name: 'CP Søvollen',
            lat: 62.135736,
            lon: 11.056272,
            altitude: 801.7,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
        {
            id: 6,
            name: 'CP Tynset bru',
            lat: 62.365875,
            lon: 10.916175,
            altitude: 500,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
        {
            id: 7,
            name: 'CP Orkelbogen',
            lat: 62.42566,
            lon: 10.869325,
            altitude: 720,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
        {
            id: 8,
            name: 'CP Tolga',
            lat: 62.492184,
            lon: 11.189174,
            altitude: 544,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
        {
            id: 9,
            name: 'CP MÅL',
            lat: 62.575349,
            lon: 11.385504,
            altitude: 640,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
        {
            id: 10,
            name: 'Live Scooter',
            lat: 62.575349,
            lon: 11.385504,
            altitude: 500,
            camera: 'https://webkamera.atlas.vegvesen.no/public/kamera?id=197147',
        },
    ];

    @observable checkpoint = 1;

    @observable currentCheckpoint = this.checkpoints[0];

    @observable loadMore = () => {};

    @action
    setLoadMore(func) {
        if (util.isFunction(func)) {
            this.loadMore = func;
        }
    }

    @action
    setState(state) {
        this.state = state;
    }

    @action
    toggleDrawer(state) {
        this.showDrawer = false; // state ? state : !this.showDrawer;
        this.showDrawer2 = false;
        this.showDrawer3 = false;
        util.toggleBodyClasses('noscroll', false);
    }

    @action
    openDrawer(component, props) {
        this.drawerComponent = component;
        this.drawerProps = props;
        this.showDrawer = true;
        util.toggleBodyClasses('noscroll', true);
    }

    @action
    toggleDrawer2(state) {
        this.showDrawer2 = false; //state ? state : !this.showDrawer2;
        this.showDrawer3 = false;
        // util.toggleBodyClasses('noscroll', false);
    }

    @action
    openDrawer2(component, props) {
        this.drawerComponent2 = component;
        this.drawerProps2 = props;
        this.showDrawer2 = true;
        // util.toggleBodyClasses('noscroll', true);
    }

    @action
    toggleDrawer3(state) {
        this.showDrawer3 = false; //state ? state : !this.showDrawer3;
        // util.toggleBodyClasses('noscroll', false);
    }

    @action
    openDrawer3(component, props) {
        this.drawerComponent3 = component;
        this.drawerProps3 = props;
        this.showDrawer3 = true;
        // util.toggleBodyClasses('noscroll', true);
    }

    @action
    setAppContainer(ref) {
        this.appContainer = ref;
    }

    appContainerScrollTop(top = 0, left = 0) {
        scrollTo(this.appContainer, top, left);
    }

    @action
    toggleDashboard() {
        this.showDashoard = !this.showDashoard;
    }

    @action
    chooseCheckpoint(e) {
        const { id } = e.target.closest('button').dataset;
        const cpId = parseInt(id, 10);
        const currentCheckpoint = this.checkpoints.find(c => c.id === cpId);
        this.checkpoint = cpId;
        this.currentCheckpoint = currentCheckpoint;
    }

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
    setSwipeRightIndicate(func) {
        if (typeof func === 'function') {
            this.swipeRightIndicates.push(this.swipeRightIndicate);
            this.swipeRightIndicate = func;
        } else {
            this.swipeRightIndicate = this.swipeRightIndicates.pop();
        }
    }

    @action
    setSwipeLeftIndicate(func) {
        if (typeof func === 'function') {
            this.swipeLeftIndicates.push(this.swipeLeftIndicate);
            this.swipeLeftIndicate = func;
        } else {
            this.swipeLeftIndicate = this.swipeLeftIndicates.pop();
        }
    }

    @action
    setSwipeUpIndicate(func) {
        if (typeof func === 'function') {
            this.swipeUpIndicates.push(this.swipeUpIndicate);
            this.swipeUpIndicate = func;
        } else {
            this.swipeUpIndicate = this.swipeUpIndicates.pop();
        }
    }

    @action
    setSwipeDownIndicate(func) {
        if (typeof func === 'function') {
            this.swipeDownIndicates.push(this.swipeDownIndicate);
            this.swipeDownIndicate = func;
        } else {
            this.swipeDownIndicate = this.swipeDownIndicates.pop();
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
    setSelectedClassId(classId) {
        // console.log('addSelectedClassId', classId);
        if (classId) {
            this.selectedClassIds = [classId];
            util.set('selectedClassIds', this.selectedClassIds);
        }
    }

    @action
    selectCheckpoint(checkpointId) {
        // console.log('addSelectedClassId', classId);
        if (checkpointId) {
            this.checkpointId = checkpointId;
            util.set('checkpointId', this.checkpointId);
        }
    }

    @action
    addSelectedClassId(classId) {
        // console.log('addSelectedClassId', classId);
        if (classId) {
            const idx = this.selectedClassIds?.indexOf(classId);
            if (idx === -1) {
                this.selectedClassIds.push(classId);
            }
            util.set('selectedClassIds', this.selectedClassIds);
        }
    }

    @action
    removeSelectedClassId(classId) {
        if (classId) {
            const idx = this.selectedClassIds?.indexOf(classId);
            if (idx > -1) {
                this.selectedClassIds.splice(idx, 1);
            }
            this.selectedClassIds = this.selectedClassIds.filter(e => e !== null);
            util.set('selectedClassIds', this.selectedClassIds);
        }
    }

    @action
    hasSelectedClassId(classId) {
        const idx = this.selectedClassIds?.indexOf(classId);
        if (idx > -1) {
            return true;
        }
        return false;
    }

    @action
    toggleSelectedClassId(classId, single) {
        // console.log('toggleSelectedClassId', classId, this.selectedClassIds);
        if (single) {
            this.setSelectedClassId(classId);
        } else if (this.hasSelectedClassId(classId)) {
            this.removeSelectedClassId(classId);
        } else {
            this.addSelectedClassId(classId);
        }
    }

    @action
    addFocusOnMusher(musherId) {
        if (musherId) {
            const idx = this.focusOnMushers?.indexOf(musherId);
            if (idx === -1) {
                this.focusOnMushers.push(musherId);
            }
            util.set('focusOnMushers', this.focusOnMushers);
        }
    }

    @action
    removeFocusOnMusher(musherId) {
        if (musherId) {
            const idx = this.focusOnMushers?.indexOf(musherId);
            if (idx > -1) {
                this.focusOnMushers.splice(idx, 1);
            }
            this.focusOnMushers = this.focusOnMushers.filter(e => e !== null);
            util.set('focusOnMushers', this.focusOnMushers);
        }
    }

    @action
    hasFocusOnMusher(musherId) {
        const idx = this.focusOnMushers?.indexOf(musherId);
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
            const idx = this.infoOnMushers?.indexOf(musherId);
            if (idx === -1) {
                this.infoOnMushers.push(musherId);
            }
            util.set('infoOnMushers', this.infoOnMushers);
        }
    }

    @action
    removeInfoOnMusher(musherId) {
        if (musherId > 0) {
            const idx = this.infoOnMushers?.indexOf(musherId);
            if (idx > -1) {
                this.infoOnMushers.splice(idx, 1);
            }
            this.infoOnMushers = this.infoOnMushers.filter(e => e !== null);
            util.set('infoOnMushers', this.infoOnMushers);
        }
    }

    @action
    hasInfoOnMusher(musherId) {
        const idx = this.infoOnMushers?.indexOf(musherId);
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
    toggleVeterinaryUserDetails(email, onlyOne) {
        if (onlyOne) {
            const prevValue = this.veterinaryUserDetails[email];
            this.veterinaryUserDetails = {};
            this.veterinaryUserDetails[email] = !prevValue;
        } else {
            this.veterinaryUserDetails[email] = !this.veterinaryUserDetails[email];
        }
    }

    @action
    setLanguage(language) {
        this.language = language;
        util.set('language', language);
    }

    @action
    setMapChecked(mapChecked) {
        this.mapChecked = mapChecked;
        util.set('mapChecked', mapChecked);
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
    setWorkoutType(type) {
        this.workoutType = type;
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
        if (navigator && navigator.share) {
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
        // if(!window.cordova && !window.BackgroundGeolocation) {
        if(!window.cordova) {
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
    setConnectionStatus(status) {
        this.connectionStatus = status;
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
    toggleDarkmode(value) {
        // console.log('toggleDarkmode', this.darkmode);
        if (util.isDefined(value)) {
            this.darkmode = value;
        } else {
            this.darkmode = !this.darkmode;
        }
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

    @action
    findPublicTeams(teams = []) {
        const results = this.publicTeams.filter(e => teams?.indexOf(e.id) > -1 && e.public).map(e => toJS(e));
        return results;
    }

    @action
    findPublicTeam(team) {
        const idx = this.publicTeams?.findIndex(e => e.id === team);
        if (idx > -1) {
            return this.publicTeams[idx];
        }
    }

    @action
    findPublicTeamByUuidv4(team) {
        const idx = this.publicTeams?.findIndex(e => e.uuidv4 === team);
        if (idx > -1) {
            return this.publicTeams[idx];
        }
    }

    @action
    findPublicTeamByMembers(user) {
        if (!user) {
            return [];
        }
        const teams = this.publicTeams.filter(e => e.members?.indexOf(user) > -1);
        return teams;
    }

    @action
    findPublicUser(user) {
        if (!this.publicUsers) {
            return {};
        }
        const idx = this.publicUsers?.findIndex(e => e.id === user);
        if (idx > -1) {
            return this.publicUsers[idx];
        }
    }

    @action
    setMainView(view) {
        this.mainView = view;
    }

    async getFingerprint() {
        const res = await util.fetchApi('/api/public/fingerprint/', { publish: false });
        if (res.status === 200) {
            this.updateField('fingerprint', res.fingerprint);
            this.updateField('jwtToken', res.jwtToken);
        }
    }

    async getInfo() {
        const res = await util.fetchApi('/api/info', { publish: false, credentials: 'include' });
        if (res.status === 200) {
            this.updateField('isAdmin', res.data.isAdmin);
            this.updateField('isExpert', res.data.isExpert);
            this.updateField('currentEmail', res.data.currentEmail);
            this.updateField('jwtToken', res.data.jwtToken);
            util.setJwtToken(res.data.jwtToken);
        }
    }

    async sendEmail({ to = [], subject = '', body = '', raceId, raceClassId }) {
        const response = await util.fetchApi(`/api/email/`, { publish: true, method: 'POST' }, { to, subject, body, raceId, raceClassId });
        switch (response.status) {
            case 200:
                return response;
            case 401:
                route('/');
                break;
            default:
                return response;
        }
    }

    async sendEmailPlain({ to = [], subject = '', body = '', from }) {
        const response = await util.fetchApi(`/api/email/plain`, { publish: true, method: 'POST' }, { from, to, subject, body });
        switch (response.status) {
            case 200:
                return response;
            case 401:
                route('/');
                break;
            default:
                return response;
        }
    }

    @action
    resetSearch() {
        this.localUpdateField('searchResultStories', []);
        this.localUpdateField('searchResultDogs', []);
        this.localUpdateField('searchResultWorkouts', []);
        this.localUpdateField('searchResultTeams', []);
        this.localUpdateField('searchResultTracks', []);
        this.localUpdateField('searchResultUsers', []);

        this.localUpdateField('publicTeams', []);
        this.localUpdateField('publicUsers', []);
    }

    async getSearch(search, params = { limit: 25, offset: 0 }) {
        const response = await util.fetchApi(`/api/search/${search}`, { publish: true, method: 'GET' }, { ...params });
        switch (response.status) {
            case 200:
                if (params.offset > 0) {
                    if (response.data.stories && response.data.stories.length > 0) {
                        let searchResultStories = toJS(this.searchResultStories);
                        searchResultStories.push(...response.data.stories);
                        this.localUpdateField('searchResultStories', searchResultStories);
                    }

                    if (response.data.dogs && response.data.dogs.length > 0) {
                        let searchResultDogs = toJS(this.searchResultDogs);
                        searchResultDogs.push(...response.data.dogs);
                        this.localUpdateField('searchResultDogs', searchResultDogs);
                    }

                    if (response.data.workouts && response.data.workouts.length > 0) {
                        let searchResultWorkouts = toJS(this.searchResultWorkouts);
                        searchResultWorkouts.push(...response.data.workouts);
                        this.localUpdateField('searchResultWorkouts', searchResultWorkouts);
                    }

                    if (response.data.teams && response.data.teams.length > 0) {
                        let searchResultTeams = toJS(this.searchResultTeams);
                        searchResultTeams.push(...response.data.teams);
                        this.localUpdateField('searchResultTeams', searchResultTeams);
                    }

                    if (response.data.tracks && response.data.tracks.length > 0) {
                        let searchResultTracks = toJS(this.searchResultTracks);
                        searchResultTracks.push(...response.data.tracks);
                        this.localUpdateField('searchResultTracks', searchResultTracks);
                    }

                    if (response.data.users && response.data.users.length > 0) {
                        let searchResultUsers = toJS(this.searchResultUsers);
                        searchResultUsers.push(...response.data.users);
                        this.localUpdateField('searchResultUsers', searchResultUsers);
                    }

                    const publicTeams = merge(toJS(this.publicTeams), response.included.teams, 'id');
                    this.localUpdateField('publicTeams', publicTeams);
                    const publicUsers = merge(toJS(this.publicUsers), response.included.users, 'id');
                    this.localUpdateField('publicUsers', publicUsers);
                } else {
                    this.localUpdateField('searchResultStories', response.data.stories);
                    this.localUpdateField('searchResultDogs', response.data.dogs);
                    this.localUpdateField('searchResultWorkouts', response.data.workouts);
                    this.localUpdateField('searchResultTeams', response.data.teams);
                    this.localUpdateField('searchResultTracks', response.data.tracks);
                    this.localUpdateField('searchResultUsers', response.data.users);

                    this.localUpdateField('publicTeams', response.included.teams);
                    this.localUpdateField('publicUsers', response.included.users);
                }
                return response;
            case 401:
                route('/');
                break;
        }
    }

    hrStart = () => {
        return new Date().getTime();
    }

    @action
    addLog = (hrStart, message, title) => {
        this.logs.push({
            timeused: new Date().getTime() - hrStart,
            title,
            message,
        });
        return this.hrStart();
    }

    @action
    getLogs = () => {
        const logs = [...this.logs];
        this.logs = [];
        return logs;
    }

    printLogs = () => {
        this.logs.forEach((e) => {
            console.log(`${e.message}: ${e.timeused} ms`);
        });
    }

    @action
    setWeather = (weather) => {
        this.weather = weather;
    }

    async postLog({ type = 'appPerformance', deviceInfo, currentLocation }) {
        const lines = this.getLogs();
        const response = await util.fetchApi(`/api/logs/`, { publish: true, method: 'POST' }, {
            lines,
            deviceInfo,
            currentLocation,
            type,
        });
        switch (response.status) {
            case 201:
                return response;
            case 401:
                route('/');
                break;
        }
    }

    async getWeather({ lat, lon, altitude }) {
        const response = await util.fetchApi(`/api/yr/`, { publish: true, method: 'GET' }, {
            lat, lon, altitude,
        });
        switch (response.status) {
            case 200:
                this.setWeather(response.data);
                return response.data;
            case 401:
                route('/');
                break;
        }
    }

    onPhotoURISuccess = (imageURI) => {
        console.log(JSON.stringify(imageURI));
    }

    onFail = (message) => {
        console.log('Failed because: ' + message);
    }

    uploadPhoto = (imageURI) => {
        const options = new FileUploadOptions();
        options.fileKey = 'file';
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '.jpg';
        options.mimeType = 'text/plain';

        var params = new Object();
        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), win, fail, options);
    }

    win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    fail(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    getPhoto(source = Camera?.PictureSourceType?.PHOTOLIBRARY) {
        if (navigator.camera) {
            navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, {
                quality: 50,
                mediaType: Camera?.MediaType?.PICTURE,
                destinationType: Camera?.DestinationType?.FILE_URI,
                sourceType: source,
                correctOrientation: true,
                saveToPhotoAlbum: true,
                cameraDirection: Camera?.Direction?.BACK,
            });
        }

    }


}

const store = new AppState();

autorun(() => {
    // console.log(store.counter);
})

export default store;
