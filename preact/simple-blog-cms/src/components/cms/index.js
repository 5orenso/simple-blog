import { h, Component } from 'preact';

import styles from './style.css';
import util from '../../../lib/util';
import utilHtml from '../../../lib/util-html';
import ProgressBar from '../../../lib/components/progressbar';
import Messages from '../../../lib/components/messages';
import ArticleList from '../../../lib/components/articleList';
import ImageList from '../../../lib/components/imageList';
import IotList from '../../../lib/components/iotList';
import IotDeviceList from '../../../lib/components/iotDeviceList';
import CategoryList from '../../../lib/components/categoryList';
import ArticleEdit from '../../../lib/components/articleEdit';
import CategoryEdit from '../../../lib/components/categoryEdit';
import IotEdit from '../../../lib/components/iotEdit';
import IotDeviceEdit from '../../../lib/components/iotDeviceEdit';
import Pagination from '../../../lib/components/pagination';

const widgetName = 'simpleBlogCms';
const debug = false;
const initialState = {
    infoStatus: '',
    loadingProgress: 0,

    previewJwtToken: '',
    imageServer: '',
    imagePath: '',

    currentMenu: 'articles',
    messages: [],

    article: {},
    artlist: [],
    artlistTotal: 0,

    image: {},
    imglist: [],
    imglistTotal: 0,

    iot: {},
    iotlist: [],
    iotlistTotal: 0,

    iotDevice: {},
    iotDeviceList: [],
    iotDeviceListTotal: 0,

    category: {},
    catlist: [],
    catlistTotal: 0,

    taglist: [],
    taglistTotal: 0,

    currentPage: 1,
    articlesPerPage: 20,
    categoriesPerPage: 50,
    tagsPerPage: 20,

    query: '',
    queryImage: '',
    filterQuery: {},
    filter: {},
};

export default class SimpleBlogCms extends Component {
    constructor($props) {
        const props = $props;
        if (props.apiServer.length < 1) {
            props.apiServer = `${window.location.protocol}//${window.location.host}`;
        }
        super(props);
        this.state = util.getResetState(this.state, initialState);
        this.updateTimeIntervalMs = 5 * 1000;
        this.messageAgeInSeconds = 5;
        this.loadArtlist();
        this.loadCatlist();
    }

    // - - - [ Functions ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    componentCleanup() {
        if (debug) {
            console.log(widgetName, 'componentCleanup');
        }
        // this.saveHistoryToLocalStorage('productsInBasket', []);
        clearInterval(this.timer);
    }

    doHandleTextareaInput(element) {
        // console.log('doHandleTextareaInput:', element);
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }

    loadArtlist(currentPage = 1) {
        const limit = this.state.articlesPerPage;
        const offset = (currentPage - 1) * this.state.articlesPerPage;
        const { query } = this.state;
        const filter = this.state.filter;

        util.fetchApi(`/api/article/`, { query, limit, offset, ...filter, loadUnpublished: 1 }, this)
            .then((result) => {
                this.setState({
                    previewJwtToken: result.jwtToken,
                    imageServer: result.imageServer,
                    imagePath: result.imagePath,
                    artlist: result.artlist,
                    artlistTotal: result.total,
                });
            })
            .catch(error => this.addError(error.toString()));
    }

    loadImglist(currentPage = 1, $limit) {
        const limit = $limit || this.state.articlesPerPage;
        const offset = (currentPage - 1) * limit;
        const { queryImage, filterQuery } = this.state;
        const query = {
            ...filterQuery,
        };
        if (queryImage.length > 0) {
            query.query = queryImage;
        }
        util.fetchApi(`/api/image/`, { ...query, limit, offset }, this)
            .then((result) => {
                // console.log('result', result);
                this.setState({
                    imglist: result.imglist,
                    imglistTotal: result.total,
                    imageServer: result.imageServer,
                    imagePath: result.imagePath,
                });
            })
            .catch(error => this.addError(error.toString()));
    }

    loadIotlist(currentPage = 1, $limit) {
        const limit = $limit || this.state.articlesPerPage;
        const offset = (currentPage - 1) * limit;
        const { queryImage, filterQuery } = this.state;
        const query = {
            ...filterQuery,
        };
        if (queryImage.length > 0) {
            query.query = queryImage;
        }
        util.fetchApi(`/api/iot/`, { ...query, limit, offset }, this)
            .then((result) => {
                // console.log('result', result);
                this.setState({
                    iotlist: result.iotlist,
                    iotlistTotal: result.total,
                });
            })
            .catch(error => this.addError(error.toString()));
    }

    loadIotDeviceList(currentPage = 1, $limit) {
        const limit = $limit || this.state.articlesPerPage;
        const offset = (currentPage - 1) * limit;
        const { queryImage, filterQuery } = this.state;
        const query = {
            ...filterQuery,
        };
        if (queryImage.length > 0) {
            query.query = queryImage;
        }
        util.fetchApi(`/api/iotdevice/`, { ...query, limit, offset }, this)
            .then((result) => {
                // console.log('result', result);
                this.setState({
                    iotDeviceList: result.iotDeviceList,
                    iotDeviceListTotal: result.total,
                });
            })
            .catch(error => this.addError(error.toString()));
    }

    loadCatlist(currentPage = 1) {
        const limit = this.state.categoriesPerPage;
        const offset = (currentPage - 1) * this.state.categoriesPerPage;
        util.fetchApi('/api/category/', { limit, offset }, this)
            .then((result) => {
                // console.log('result', result);
                this.setState({
                    catlist: result.catlist,
                    catlistTotal: result.total,
                    imageServer: result.imageServer,
                    imagePath: result.imagePath,
                });
            })
            .catch(error => this.addError(error.toString()));
    }

    loadTaglist(currentPage = 1, query) {
        const limit = this.state.tagsPerPage;
        const offset = (currentPage - 1) * this.state.tagsPerPage;
        const article = this.state.article;
        let titleNin;
        if (typeof article.tags === 'object' && Array.isArray(article.tags)) {
            titleNin = article.tags.join(',');
        }
        util.fetchApi('/api/tag/', { query, titleNin, limit, offset }, this)
            .then((result) => {
                // console.log('result', result);
                this.setState({
                    taglist: result.taglist,
                    taglistTotal: result.total,
                });
            })
            .catch(error => this.addError(error.toString()));
    }

    loadPage(currentPage) {
        const currentMenu = this.state.currentMenu;
        if (currentMenu === 'articles') {
            this.loadArtlist(currentPage);
        } else if (currentMenu === 'categories') {
            this.loadCatlist(currentPage);
        } else if (currentMenu === 'images') {
            this.loadImglist(currentPage);
        } else if (currentMenu === 'iot') {
            this.loadIotlist(currentPage);
        } else if (currentMenu === 'iotDevice') {
            this.loadIotDeviceList(currentPage);
        }
    }

    typeInTextarea(el, newText) {
        if (el && newText) {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const name = el.name;

            const article = this.state.article;
            if (typeof article[name] !== 'string') {
                article[name] = '';
            }
            const before = article[name].substring(0, start);
            const after  = article[name].substring(end, article[name].length);
            article[name] = (before + newText + after);

            this.setState({
                article,
            }, () => {
                if (el) {
                    el.focus();
                    el.selectionStart = start + newText.length;
                    el.selectionEnd = start + newText.length;
                }
            });
        }
    }

    cleanMessages() {
        const messages = [];
        const messagesPrev = this.state.messages;
        const now = parseInt(new Date().getTime() / 1000, 10);
        for (let i = 0, l = messagesPrev.length; i < l; i += 1) {
            const msg = messagesPrev[i];
            if (now - msg[0] < this.messageAgeInSeconds) {
                messages.push(msg);
            }
        }
        if (messages.length !== messagesPrev.length) {
            this.setState({ messages });
        }
    }

    addMessage(msg, type) {
        const messages = this.state.messages;
        messages.push([parseInt(new Date().getTime() / 1000, 10), msg, type]);
        this.setState({ messages });
    }

    addError(msg) {
        const messages = this.state.messages;
        messages.push([parseInt(new Date().getTime() / 1000, 10), msg, 'error']);
        this.setState({ messages });
    }

    addWarning(msg) {
        const messages = this.state.messages;
        messages.push([parseInt(new Date().getTime() / 1000, 10), msg, 'warning']);
        this.setState({ messages });
    }

    saveArticle() {
        const data = {
            method: 'PATCH',
            ...this.state.article,
        }
        util.fetchApi(`/api/tag/`, { method: 'POST', tags: data.tags }, this)
            .then((result) => {
                // console.log('/api/tag/ result', result);
            })
            .catch(error => this.addError(error.toString()));

        // console.log('trying to save', this.state.article);
        util.fetchApi(`/api/article/${this.state.article.id}`, data, this)
            .then((result) => {
                this.addMessage('Artikkel oppdatert', 'done');
                this.loadArtlist();
            })
            .catch(error => this.addError(error.toString()));
    }

    handleAddImage = (file) => {
        const article = this.state.article;
        if (!Array.isArray(article.img)) {
            article.img = [];
        }
        article.img.push(file);
        this.setState({ article });
        this.saveArticle();
    }

    handleImgAddImage = (file) => {
        this.loadImglist();
    };

    // - - - [ Events ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    handleMenuClick = (event) => {
        event.preventDefault();
        const el = event.target.closest('a');

        const currentMenu = el.dataset.menu;
        const currentPage = 1;
        const query = '';
        const queryImage = '';
        this.setState({ currentMenu, currentPage, query, queryImage });
        if (currentMenu === 'articles') {
            this.loadArtlist();
        } else if (currentMenu === 'categories') {
            this.loadCatlist();
        } else if (currentMenu === 'images') {
            this.loadImglist();
        } else if (currentMenu === 'iot') {
            this.loadIotlist();
        } else if (currentMenu === 'iotDevice') {
            this.loadIotDeviceList();
        }
    };

    handleArticleEditBackClick = (event) => {
        event.preventDefault();
        this.setState({ article: {} });
    };

    handleCategoryEditBackClick = (event) => {
        event.preventDefault();
        // console.log('handleCategoryEditBackClick');
        this.setState({ category: {} });
    };

    handleIotEditBackClick = (event) => {
        event.preventDefault();
        // console.log('handleIotEditBackClick');
        this.setState({ iot: {} });
    };

    handleIotDeviceEditBackClick = (event) => {
        event.preventDefault();
        // console.log('handleIotDeviceEditBackClick');
        this.setState({ iotDevice: {} });
    };

    handleArtlistClick = (event) => {
        event.preventDefault();
        const trElement = event.target.closest('tr');
        const artId = parseInt(trElement.dataset.id, 10);
        util.fetchApi(`/api/article/${artId}`, { loadUnpublished: 1 }, this)
            .then((result) => {
                this.setState({
                    article: result.article,
                });
            })
            .catch(error => this.addError(error.toString()));
    };

    handleImglistClick = (event) => {
        event.preventDefault();
        const trElement = event.target.closest('tr');
        const imgId = parseInt(trElement.dataset.id, 10);
        // util.fetchApi(`/api/image/${imgId}`, {}, this)
        //     .then((result) => {
        //         this.setState({
        //             image: result.image,
        //         });
        //     });

    };

    handleCatlistClick = (event) => {
        event.preventDefault();
        const trElement = event.target.closest('tr');
        const artId = parseInt(trElement.dataset.id, 10);
        util.fetchApi(`/api/category/${artId}`, {}, this)
            .then((result) => {
                this.setState({
                    category: result.category,
                });
            })
            .catch(error => this.addError(error.toString()));
    };

    handleIotlistClick = (event) => {
        event.preventDefault();
        const trElement = event.target.closest('tr');
        const artId = parseInt(trElement.dataset.id, 10);
        util.fetchApi(`/api/iot/${artId}`, {}, this)
            .then((result) => {
                this.setState({
                    iot: result.iot,
                });
            })
            .catch(error => this.addError(error.toString()));
    };

    handleIotDeviceListClick = (event) => {
        event.preventDefault();
        const trElement = event.target.closest('tr');
        const artId = parseInt(trElement.dataset.id, 10);
        util.fetchApi(`/api/iotdevice/${artId}`, {}, this)
            .then((result) => {
                this.setState({
                    iotDevice: result.iotDevice,
                });
            })
            .catch(error => this.addError(error.toString()));
    };

    handleFilterClick = (event) => {
        event.preventDefault();
        const el = event.target;
        const key = el.dataset.key;
        const val = util.isNumber(el.dataset.val) ? parseFloat(el.dataset.val) : el.dataset.val;
        const filter = this.state.filter;
        if (filter[key] && (filter[key] === val || val === '')) {
            delete filter[key];
        } else {
            filter[key] = val;
        }
        this.setState({ filter });
        this.loadArtlist(1);
    };

    handleArticleClickSave = (event) => {
        event.preventDefault();
        this.saveArticle();
    };

    handleArticleClickNew = (event, article = {}) => {
        event.preventDefault();
        const data = {
            method: 'POST',
            ...article,
            loadUnpublished: 1,
        }
        // console.log('trying to save', this.state.article);
        util.fetchApi(`/api/article/`, data, this)
            .then((result) => {
                const article = result;
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'Artikkel opprettet']);
                this.setState({ messages, article });
                this.loadArtlist();
            })
            .catch(error => this.addError(error.toString()));
    };

    handleCategoryClickNew = (event, category = {}) => {
        event.preventDefault();
        const data = {
            method: 'POST',
            ...category,
        }
        // console.log('trying to save', this.state.category);
        util.fetchApi(`/api/category/`, data, this)
            .then((result) => {
                const category = result;
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'Kategori opprettet']);
                this.setState({ messages, category });
                this.loadCatlist();
            })
            .catch(error => this.addError(error.toString()));
    };

    handleCategoryClickSave = (event) => {
        event.preventDefault();
        const data = {
            method: 'PATCH',
            ...this.state.category,
        }
        // console.log('trying to save', this.state.article);
        util.fetchApi(`/api/category/${this.state.category.id}`, data, this)
            .then((result) => {
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'Kategori oppdatert']);
                this.setState({ messages });
                this.loadCatlist();
            })
            .catch(error => this.addError(error.toString()));
    };

    handleIotClickNew = (event, iot = {}) => {
        event.preventDefault();
        const data = {
            method: 'POST',
            ...iot,
        }
        // console.log('trying to save', this.state.category);
        util.fetchApi(`/api/iot/`, data, this)
            .then((result) => {
                const iot = result;
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'Iot query opprettet']);
                this.setState({ messages, iot });
                this.loadIotlist();
            })
            .catch(error => this.addError(error.toString()));
    };

    handleIotClickSave = (event) => {
        event.preventDefault();
        const data = {
            method: 'PATCH',
            ...this.state.iot,
        }
        // console.log('trying to save', this.state.article);
        util.fetchApi(`/api/iot/${this.state.iot.id}`, data, this)
            .then((result) => {
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'Iot query oppdatert']);
                this.setState({ messages });
                this.loadIotlist();
            })
            .catch(error => this.addError(error.toString()));
    };

    handleIotDeviceClickNew = (event, iotDevice = {}) => {
        event.preventDefault();
        const data = {
            method: 'POST',
            ...iotDevice,
        }
        // console.log('trying to save', this.state.category);
        util.fetchApi(`/api/iotdevice/`, data, this)
            .then((result) => {
                const iotDevice = result;
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'IotDevice opprettet']);
                this.setState({ messages, iotDevice });
                this.loadIotDeviceList();
            })
            .catch(error => this.addError(error.toString()));
    };

    handleIotDeviceClickSave = (event) => {
        event.preventDefault();
        const data = {
            method: 'PATCH',
            ...this.state.iotDevice,
        }
        // console.log('trying to save', this.state.article);
        util.fetchApi(`/api/iotdevice/${this.state.iotDevice.id}`, data, this)
            .then((result) => {
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'IotDevice oppdatert']);
                this.setState({ messages });
                this.loadIotDeviceList();
            })
            .catch(error => this.addError(error.toString()));
    };

    handleArticleTextareaInput = (event) => {
        // event.preventDefault();
        const el = event.target;
        const name = el.name;
        const article = this.state.article;
        // let value = el.value;
        // if (event.key) {
        //     value += event.key;
        // }
        article[name] = el.value;
        this.setState({ article });
        // this.doHandleTextareaInput(el);
    };

    handleCategoryTextareaInput = (event) => {
        event.preventDefault();
        const el = event.target;
        const name = el.name;
        // let value = el.value;
        // if (event.key) {
        //     value += event.key;
        // }
        const category = this.state.category;
        category[name] = el.value;
        this.setState({ category });
    };

    handleIotTextareaInput = (event) => {
        event.preventDefault();
        const el = event.target;
        const name = el.name;
        // let value = el.value;
        // if (event.key) {
        //     value += event.key;
        // }
        const iot = this.state.iot;
        iot[name] = el.value;
        this.setState({ iot });
    };

    handleIotDeviceTextareaInput = (event) => {
        event.preventDefault();
        const el = event.target;
        const name = el.name;
        // let value = el.value;
        // if (event.key) {
        //     value += event.key;
        // }
        const iotDevice = this.state.iotDevice;
        iotDevice[name] = el.value;
        this.setState({ iotDevice });
    };

    articleInputAdd = (name, value, type) => {
        const article = this.state.article;
        const taglist = this.state.taglist;
        if (type === 'array') {
            if (!Array.isArray(article[name])) {
                article[name] = [];
            }
            if (value && article[name].indexOf(value) === -1) {
                article[name].push(value);
                const idx = taglist.findIndex(x => x.title === value);
                taglist.splice(idx, 1);
            }
        } else {
            article[name] = value;
        }
        this.setState({ article, taglist });
    }

    articleInputRemove(name, value, type) {
        const article = this.state.article;
        if (type === 'array') {
            if (typeof article[name] === 'object' && Array.isArray(article[name])) {
                const idx = article[name].indexOf(value);
                article[name].splice(idx, 1);
            }
        } else {
            delete article[name];
        }
        this.setState({ article });
    }

    handleArticleInput = (event, opt = {}) => {
        event.preventDefault();
        const el = event.target;
        let name = el.name;
        let value = el.value || '';

        if (opt.name && (opt.action === 'add' || value.match(/[,]$/))) {
            let val = opt.value || value;
            val = val.replace(/[, ]+$/, '');
            this.articleInputAdd(opt.name, val, opt.type);
            value = '';
        } else if (opt.name && opt.action === 'remove') {
            return this.articleInputRemove(opt.name, opt.value, opt.type);
        } else if (opt.action === 'search') {
            if (opt.name === 'tags' && value.length >= 1) {
                let loadTaglistTimer = this.state.loadTaglistTimer;
                clearTimeout(loadTaglistTimer);
                loadTaglistTimer = setTimeout(() => this.loadTaglist(1, value), 500);
                this.setState({ loadTaglistTimer });
            }
        } else if (opt.name && opt.value) {
            name = opt.name;
            value = opt.value;
        }

        this.articleInputAdd(name, value);
    };

    handleArticleSearchInput = (event, limit) => {
        const el = event.target;
        const name = el.name;
        let query = el.value;

        if (event.key === 'Enter') {
            this.setState({ query }, () => {
                this.handleArticleSearchClick(event, limit);
            });
        } else {
            if (event.key) {
                query += event.key;
            }
            this.setState({ query });
        }
    };

    handleArticleSearchClick = (event, limit) => {
        const currentPage = 1;
        this.setState({ currentPage });
        this.loadArtlist(currentPage, limit);
    };

    handleImageSearchInput = (event, limit) => {
        const el = event.target;
        const name = el.name;
        let queryImage = el.value;
        if (event.key === 'Enter') {
            this.setState({ queryImage }, () => {
                this.handleImageSearchClick(event, limit);
            });
        } else {
            if (event.key) {
                queryImage += event.key;
            }
            this.setState({ queryImage });
        }
    };

    handleImageSearchClick = (event, limit) => {
        const currentPage = 1;
        this.setState({ currentPage });
        this.loadImglist(currentPage, limit);
    };

    handleImageSearchResultClick = (event) => {
        event.preventDefault();
        const el = event.target;
        const imageIdx = el.dataset.idx;
        const image = this.state.imglist[imageIdx];

        const article = this.state.article;
        if (!Array.isArray(article.img)) {
            article.img = [];
        }
        article.img.push(image);
        this.setState({ article });
    }

    handleImageTagClick = (event) => {
        // const el = event.target;
        const el = event.target.closest('span');
        const name = el.dataset.name;
        const value = el.dataset.value;
        const { filterQuery } = this.state;
        if (filterQuery[name] === value) {
            delete filterQuery[name];
        } else {
            filterQuery[name] = value;
        }
        this.setState({ filterQuery });
        this.handleImageSearchClick(event, 0, filterQuery);
    };

    handleCategoryInput = (event, opt = {}) => {
        event.preventDefault();
        const category = this.state.category;
        const el = event.target;
        let name = el.name;
        let value = el.value;

        if (opt.name && opt.value >= 0) {
            name = opt.name;
            value = opt.value;
        } else if (event.key) {
            value += event.key;
        }
        if (typeof category[name] === 'object' && Array.isArray(category[name])) {
            category[name] = value.split(/, ?/);
        } else {
            category[name] = value;
        }
        this.setState({ category });
    };

    handleIotInput = (event) => {
        event.preventDefault();
        const el = event.target;
        const name = el.name;
        const iot = this.state.iot;
        let value = el.value;
        if (event.key) {
            value += event.key;
        }
        if (typeof iot[name] === 'object' && Array.isArray(iot[name])) {
            iot[name] = value.split(/, ?/);
        } else {
            iot[name] = value;
        }
        this.setState({ iot });
    };

    handleIotDeviceInput = (event) => {
        event.preventDefault();
        const el = event.target;
        const name = el.name;
        const iotDevice = this.state.iotDevice;
        let value = el.value;
        if (event.key) {
            value += event.key;
        }
        if (typeof iotDevice[name] === 'object' && Array.isArray(iotDevice[name])) {
            iotDevice[name] = value.split(/, ?/);
        } else {
            iotDevice[name] = value;
        }
        this.setState({ iotDevice });
    };

    handlePaginationClick = (event) => {
        event.preventDefault();
        const currentPage = Number(event.target.id);
        this.setState({ currentPage });
        this.loadPage(currentPage);
    };

    handlePaginationDecClick = (event) => {
        event.preventDefault();
        const currentPage = Number(this.state.currentPage - 1);
        this.setState({ currentPage });
        this.loadPage(currentPage);
    };

    handlePaginationIncClick = (event) => {
        event.preventDefault();
        const currentPage = Number(this.state.currentPage + 1);
        this.setState({ currentPage });
        this.loadPage(currentPage);
    };

    handleRemoveImageClick = (event) => {
        event.preventDefault();
        const el = event.target;
        const imageIdx = el.dataset.image;
        const article = this.state.article;
        // console.log('article.img', article.img, imageIdx);

        if (Array.isArray(article.img)) {
            // console.log('article.img', article.img, imageIdx);
            article.img.splice(imageIdx, 1);
            this.setState({ article });
        }
    };

    // - - - [ Component events from Preact it self: ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    componentWillMount() {
        if (debug) {
            console.log(widgetName, 'componentWillMount', this.props);
        }
    }

    componentDidMount() {
        if (debug) {
            console.log(widgetName, 'componentDidMount', this.props);
        }
        window.addEventListener('beforeunload', () => this.componentCleanup());

        // const tx = document.getElementsByTagName('textarea');
        // for (var i = 0; i < tx.length; i++) {
        //     tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
        // }

        // update time every second
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.cleanMessages();
        }, this.updateTimeIntervalMs);
    }

    componentWillUnmount() {
        if (debug) {
            console.log(widgetName, 'componentWillUnmount', this.props);
        }
        this.componentCleanup();
    }

    // Every time something happens:
    shouldComponentUpdate(nextProps, nextState) {
        if (debug) {
            console.log(widgetName, 'shouldComponentUpdate', this.props, nextProps, nextState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (debug) {
            console.log(widgetName, 'componentDidUpdate', prevProps, prevState, this.state);
        }
    }

    // Render the shit:
    render() {
        const {
            currentMenu,
            messages,
            previewJwtToken,
            imageServer,
            imagePath,

            article,
            artlist,
            artlistTotal,

            image,
            imglist,
            imglistTotal,

            iot,
            iotlist,
            iotlistTotal,

            iotDevice,
            iotDeviceList,
            iotDeviceListTotal,

            category,
            catlist,
            catlistTotal,

            taglist,
            taglistTotal,

            currentPage,
            articlesPerPage,
            categoriesPerPage,

            filter,
        } = this.state;
        const { apiServer } = this.props;
        const sessionEmail = this.props.sessionEmail;
        const sessionAge = this.props.sessionAge;

        let renderedMenu;
        if (article.id) {
            renderedMenu = '';
        } else {
            renderedMenu = (
                <nav class='nav nav-pills nav-fill mb-3'>
                    <a class={`nav-item nav-link ${currentMenu === 'articles' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='articles'><i class="fas fa-newspaper"></i> Artikler</a>
                    <a class={`nav-item nav-link ${currentMenu === 'categories' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='categories'><i class="fas fa-folder-open"></i> Kategorier</a>
                    <a class={`nav-item nav-link ${currentMenu === 'images' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='images'><i class="fas fa-images"></i> Bilder</a>
                    <a class={`nav-item nav-link ${currentMenu === 'iot' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='iot'><i class="fas fa-temperature-low"></i> Iot</a>
                    <a class={`nav-item nav-link ${currentMenu === 'iotDevice' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='iotDevice'><i class="fas fa-robot"></i> Iot Device</a>
                </nav>
            );
        }

        if (currentMenu === 'articles') {
            return (
                <div class={`container-fluid p-0 ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}
                    {!article.id && <div class='d-flex justify-content-center'>
                        <ArticleList styles={styles}
                            sessionEmail={sessionEmail}
                            previewJwtToken={previewJwtToken}
                            imageServer={imageServer}
                            imagePath={imagePath}

                            that={this}
                            artlist={artlist}
                            catlist={catlist}
                            handleInput={this.handleArticleSearchInput}
                            handleSubmit={this.handleArticleSearchClick}
                            handleListClick={this.handleArtlistClick}
                            handleFilterClick={this.handleFilterClick}
                            handleClickNew={this.handleArticleClickNew}
                            filter={filter}
                        />
                    </div>}
                    {!article.id && <div class='d-flex justify-content-center'>
                        <Pagination styles={styles}
                            artlistTotal={artlistTotal}
                            currentPage={currentPage}
                            articlesPerPage={articlesPerPage}
                            handlePaginationClick={this.handlePaginationClick}
                            handlePaginationDecClick={this.handlePaginationDecClick}
                            handlePaginationIncClick={this.handlePaginationIncClick}
                        />
                    </div>}
                    {!article.id && <div class='d-flex justify-content-center'>
                        <Messages styles={styles} messages={messages} />
                    </div>}

                    {article.id && <div class='d-flex justify-content-center'>
                        <ArticleEdit styles={styles}
                            sessionEmail={sessionEmail}
                            previewJwtToken={previewJwtToken}
                            jwtToken={previewJwtToken}
                            apiServer={apiServer}
                            imageServer={imageServer}
                            imagePath={imagePath}

                            article={article}
                            catlist={catlist}
                            that={this}
                            messages={messages}

                            taglist={taglist}

                            handleInput={this.handleArticleInput}
                            handleInputRaw={this.articleInputAdd}
                            handleAddImage={this.handleAddImage}
                            handleRemoveImageClick={this.handleRemoveImageClick}
                            handleTextareaInput={this.handleArticleTextareaInput}
                            handleClickSave={this.handleArticleClickSave}
                            handleClickNew={this.handleArticleClickNew}
                            handleClickBack={this.handleArticleEditBackClick}

                            imglist={imglist}
                            filterQuery={this.state.filterQuery}
                            handleImageInput={this.handleImageSearchInput}
                            handleImageSubmit={this.handleImageSearchClick}
                            handleImglistClick={this.handleImageSearchResultClick}
                            handleImageTagClick={this.handleImageTagClick}
                        />
                    </div>}
                </div>
            );
        } else if (currentMenu === 'categories') {
            return (
                <div class={`container-fluid p-0 ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}

                    {!category.id && <div class='d-flex justify-content-center'>
                        <CategoryList styles={styles}
                            catlist={catlist}
                            imageServer={imageServer}
                            imagePath={imagePath}
                            handleListClick={this.handleCatlistClick}
                            handleClickNew={this.handleCategoryClickNew}
                        />
                    </div>}
                    {!category.id && <div class='d-flex justify-content-center'>
                        <Pagination styles={styles}
                            artlistTotal={catlistTotal}
                            currentPage={currentPage}
                            articlesPerPage={categoriesPerPage}
                            handlePaginationClick={this.handlePaginationClick}
                            handlePaginationDecClick={this.handlePaginationDecClick}
                            handlePaginationIncClick={this.handlePaginationIncClick}
                        />
                    </div>}
                    {!category.id && <div class='d-flex justify-content-center'>
                        <Messages styles={styles} messages={messages} />
                    </div>}
                    {category.id && <div class='d-flex justify-content-center'>
                        <CategoryEdit styles={styles}
                            imageServer={imageServer}
                            imagePath={imagePath}
                            category={category}
                            messages={messages}
                            handleInput={this.handleCategoryInput}
                            handleTextareaInput={this.handleCategoryTextareaInput}
                            handleClickSave={this.handleCategoryClickSave}
                            handleClickNew={this.handleCategoryClickNew}
                            handleClickBack={this.handleCategoryEditBackClick}
                            bgColorMenu={this.props.bgColorMenu}
                        />
                    </div>}
                </div>
            );
        } else if (currentMenu === 'images') {
            return (
                <div class={`container-fluid p-0 ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}

                    <div class='d-flex justify-content-center'>
                        <ImageList styles={styles}
                            that={this}
                            imageServer={imageServer}
                            imagePath={imagePath}
                            imageId={image.id}
                            imglist={imglist}
                            handleInput={this.handleImageSearchInput}
                            handleSubmit={this.handleImageSearchClick}
                            handleTagClick={this.handleImageTagClick}
                            filterQuery={this.state.filterQuery}
                            handleImglistClick={this.handleImglistClick}
                            handleAddImage={this.handleImgAddImage}
                        />
                    </div>
                    <div class='d-flex justify-content-center'>
                        <Pagination styles={styles}
                            artlistTotal={imglistTotal}
                            currentPage={currentPage}
                            articlesPerPage={categoriesPerPage}
                            handlePaginationClick={this.handlePaginationClick}
                            handlePaginationDecClick={this.handlePaginationDecClick}
                            handlePaginationIncClick={this.handlePaginationIncClick}
                        />
                    </div>
                </div>
            );
        } else if (currentMenu === 'iot') {
            return (
                <div class={`container-fluid p-0 ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}

                    {!iot.id && <div class='d-flex justify-content-center'>
                        <IotList styles={styles}
                            that={this}
                            imageId={iot.id}
                            iotlist={iotlist}
                            handleListClick={this.handleIotlistClick}
                            handleClickNew={this.handleIotClickNew}
                        />
                    </div>}
                    {!iot.id && <div class='d-flex justify-content-center'>
                        <Pagination styles={styles}
                            artlistTotal={iotlistTotal}
                            currentPage={currentPage}
                            articlesPerPage={categoriesPerPage}
                            handlePaginationClick={this.handlePaginationClick}
                            handlePaginationDecClick={this.handlePaginationDecClick}
                            handlePaginationIncClick={this.handlePaginationIncClick}
                        />
                    </div>}
                    {!iot.id && <div class='d-flex justify-content-center'>
                        <Messages styles={styles} messages={messages} />
                    </div>}
                    {iot.id && <div class='d-flex justify-content-center'>
                        <IotEdit styles={styles}
                            iot={iot}
                            messages={messages}
                            handleInput={this.handleIotInput}
                            handleTextareaInput={this.handleIotTextareaInput}
                            handleClickSave={this.handleIotClickSave}
                            handleClickNew={this.handleIotClickNew}
                            handleClickBack={this.handleIotEditBackClick}
                        />
                    </div>}
                </div>
            );
        } else if (currentMenu === 'iotDevice') {
            return (
                <div class={`container-fluid p-0 ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}

                    {!iotDevice.id && <div class='d-flex justify-content-center'>
                        <IotDeviceList styles={styles}
                            that={this}
                            imageId={iotDevice.id}
                            iotDeviceList={iotDeviceList}
                            handleListClick={this.handleIotDeviceListClick}
                            handleClickNew={this.handleIotDeviceClickNew}
                        />
                    </div>}
                    {!iotDevice.id && <div class='d-flex justify-content-center'>
                        <Pagination styles={styles}
                            artlistTotal={iotDeviceListTotal}
                            currentPage={currentPage}
                            articlesPerPage={categoriesPerPage}
                            handlePaginationClick={this.handlePaginationClick}
                            handlePaginationDecClick={this.handlePaginationDecClick}
                            handlePaginationIncClick={this.handlePaginationIncClick}
                        />
                    </div>}
                    {!iotDevice.id && <div class='d-flex justify-content-center'>
                        <Messages styles={styles} messages={messages} />
                    </div>}
                    {iotDevice.id && <div class='d-flex justify-content-center'>
                        <IotDeviceEdit styles={styles}
                            that={this}
                            iotDevice={iotDevice}
                            messages={messages}
                            handleInput={this.handleIotDeviceInput}
                            handleTextareaInput={this.handleIotDeviceTextareaInput}
                            handleClickSave={this.handleIotDeviceClickSave}
                            handleClickNew={this.handleIotDeviceClickNew}
                            handleClickBack={this.handleIotDeviceEditBackClick}
                        />
                    </div>}
                </div>
            );
        }
    }
}
