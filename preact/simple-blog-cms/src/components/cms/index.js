import { h, Component } from 'preact';

import styles from './style.css';
import util from '../../../lib/util';
import utilHtml from '../../../lib/util-html';
import ProgressBar from '../../../lib/components/progressbar';
import Messages from '../../../lib/components/messages';
import ArticleList from '../../../lib/components/articleList';
import ImageList from '../../../lib/components/imageList';
import CategoryList from '../../../lib/components/categoryList';
import ArticleEdit from '../../../lib/components/articleEdit';
import CategoryEdit from '../../../lib/components/categoryEdit';
import Pagination from '../../../lib/components/pagination';

const widgetName = 'simpleBlogCms';
const debug = false;
const initialState = {
    infoStatus: '',
    loadingProgress: 0,

    currentMenu: 'articles',
    messages: [],

    article: {},
    artlist: [],
    artlistTotal: 0,

    image: {},
    imglist: [],
    imglistTotal: 0,

    category: {},
    catlist: [],
    catlistTotal: 0,

    taglist: [],
    taglistTotal: 0,

    currentPage: 1,
    articlesPerPage: 20,
    categoriesPerPage: 20,
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

        util.fetchApi(`/api/article/`, { query, limit, offset, ...filter }, this)
            .then((result) => {
                this.setState({
                    artlist: result.artlist,
                    artlistTotal: result.total,
                })
            });
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
                })
            });
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
                })
            });
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
                })
            });
    }

    loadPage(currentPage) {
        const currentMenu = this.state.currentMenu;
        if (currentMenu === 'articles') {
            this.loadArtlist(currentPage);
        } else if (currentMenu === 'categories') {
            this.loadCatlist(currentPage);
        } else if (currentMenu === 'images') {
            this.loadImglist(currentPage);
        }
    }

    typeInTextarea(el, newText) {
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

    saveArticle() {
        const data = {
            method: 'PATCH',
            ...this.state.article,
        }

        util.fetchApi(`/api/tag/`, { method: 'POST', tags: data.tags }, this)
            .then((result) => {
                console.log('/api/tag/ result', result);
            });

        // console.log('trying to save', this.state.article);
        util.fetchApi(`/api/article/${this.state.article.id}`, data, this)
            .then((result) => {
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'Artikkel oppdatert']);
                this.setState({ messages });
                this.loadArtlist();
            });
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

    // - - - [ Events ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    handleMenuClick = (event) => {
        event.preventDefault();
        const el = event.target;

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
        }
    };

    handleArticleEditBackClick = (event) => {
        event.preventDefault();
        this.setState({ article: {} });
    };

    handleArtlistClick = (event) => {
        event.preventDefault();
        const trElement = event.target.closest('tr');
        const artId = parseInt(trElement.dataset.id, 10);
        util.fetchApi(`/api/article/${artId}`, {}, this)
            .then((result) => {
                this.setState({
                    article: result.article,
                });
            });

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
            });

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
        }
        // console.log('trying to save', this.state.article);
        util.fetchApi(`/api/article/`, data, this)
            .then((result) => {
                const article = result;
                const messages = this.state.messages;
                messages.push([parseInt(new Date().getTime() / 1000, 10), 'Artikkel opprettet']);
                this.setState({ messages, article });
                this.loadArtlist();
            });
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
            });
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

    articleInputAdd(name, value, type) {
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

    handleCategoryInput = (event) => {
        event.preventDefault();
        const el = event.target;
        const name = el.name;
        const category = this.state.category;
        let value = el.value;
        if (event.key) {
            value += event.key;
        }
        if (typeof category[name] === 'object' && Array.isArray(category[name])) {
            category[name] = value.split(/, ?/);
        } else {
            category[name] = value;
        }
        this.setState({ category });
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

            article,
            artlist,
            artlistTotal,

            image,
            imglist,
            imglistTotal,

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
        const sessionEmail = this.props.sessionEmail;
        const sessionAge = this.props.sessionAge;

        let renderedMenu;
        if (article.id) {
            renderedMenu = '';
        } else {
            renderedMenu = (
                <nav class='nav nav-pills nav-fill mb-3'>
                    <a class={`nav-item nav-link ${currentMenu === 'articles' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='articles'><i class="fas fa-newspaper"></i> Articles</a>
                    <a class={`nav-item nav-link ${currentMenu === 'categories' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='categories'><i class="fas fa-folder-open"></i> Categories</a>
                    <a class={`nav-item nav-link ${currentMenu === 'images' ? 'active' : ''}`} href='#'
                        onClick={this.handleMenuClick} data-menu='images'><i class="fas fa-images"></i> Images</a>
                </nav>
            );
        }

        if (currentMenu === 'articles') {
            return (
                <div class={`container-fluid ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}
                    {!article.id && <div class='d-flex justify-content-center'>
                        <ArticleList styles={styles}
                            that={this}
                            artlist={artlist}
                            catlist={catlist}
                            handleInput={this.handleArticleSearchInput}
                            handleSubmit={this.handleArticleSearchClick}
                            handleArtlistClick={this.handleArtlistClick}
                            handleFilterClick={this.handleFilterClick}
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
                    {article.id && <div class='d-flex justify-content-center'>
                        <ArticleEdit styles={styles}
                            sessionEmail={sessionEmail}

                            article={article}
                            catlist={catlist}
                            that={this}
                            messages={messages}

                            taglist={taglist}

                            handleInput={this.handleArticleInput}
                            handleAddImage={this.handleAddImage}
                            handleRemoveImageClick={this.handleRemoveImageClick}
                            handleTextareaInput={this.handleArticleTextareaInput}
                            handleClickSave={this.handleArticleClickSave}
                            handleClickNew={this.handleArticleClickNew}
                            handleArticleEditBackClick={this.handleArticleEditBackClick}

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
                <div class={`container-fluid ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}

                    <div class='d-flex justify-content-center'>
                        <CategoryList styles={styles}
                            catlist={catlist}
                            handleCatlistClick={this.handleCatlistClick}
                        />
                    </div>
                    <div class='d-flex justify-content-center'>
                        <Pagination styles={styles}
                            artlistTotal={catlistTotal}
                            currentPage={currentPage}
                            articlesPerPage={categoriesPerPage}
                            handlePaginationClick={this.handlePaginationClick}
                            handlePaginationDecClick={this.handlePaginationDecClick}
                            handlePaginationIncClick={this.handlePaginationIncClick}
                        />
                    </div>
                    <div class='d-flex justify-content-center'>
                        <Messages styles={styles} messages={messages} />
                    </div>
                    <div class='d-flex justify-content-center'>
                        <CategoryEdit styles={styles}
                            category={category}
                            handleInput={this.handleCategoryInput}
                            handleTextareaInput={this.handleCategoryTextareaInput}
                            handleClickSave={this.handleCategoryClickSave}
                        />
                    </div>
                    <div class='d-flex justify-content-center'>
                        <Messages styles={styles} messages={messages} />
                    </div>
                </div>
            );
        } else if (currentMenu === 'images') {
            return (
                <div class={`container-fluid ${styles.mainApp}`}>
                    <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                    {renderedMenu}

                    <div class='d-flex justify-content-center'>
                        <ImageList styles={styles}
                            that={this}
                            imageId={image.id}
                            imglist={imglist}
                            handleInput={this.handleImageSearchInput}
                            handleSubmit={this.handleImageSearchClick}
                            handleTagClick={this.handleImageTagClick}
                            filterQuery={this.state.filterQuery}
                            handleImglistClick={this.handleImglistClick}
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
        }
    }
}
