import { observable, configure, action, computed } from 'mobx';
import StoreModel from 'preact-storemodel';
import util from 'preact-util';
import { route } from 'preact-router';

configure({ enforceActions: 'always' });

class ArticleStore extends StoreModel {
    constructor() {
        super('article', {
            namePlural: 'articles',
            sort: 'createdDate',
            limit: 20,
            api: {
                search: {
                    url: '/api/article/',
                    params: {
                        limit: 15,
                        sort: 'createdDate',
                    },
                },
                load: {
                    url: '/api/article/',
                    params: {},
                },
                save: {
                    url: '/api/article/',
                    params: {},
                },
            },
        });
    }

    @observable article = {};

    @observable articles = [];

    @observable artlist = [];

    @observable artlistLive = [];

    @observable artlistWebtv = [];

    @observable artlistPhoto = [];

    @observable artlistDirektesport = [];

    @observable artlistQa = [];

    @observable artlistProgram = [];

    @observable artlistAdTop = [];

    @observable artlistAdCenter = [];

    @observable artlistAdBottom = [];

    @observable tags = [];

    @observable time = new Date().getTime();

    @action
    setTime() {
        this.time = new Date().getTime();
    }

    async loadArtlist({ limit, category, key, loadAll, status = 2, sort }) {
        const response = await util.fetchApi(`/api/article/public/${encodeURIComponent(category)}`, { publish: true, method: 'GET' }, { cacheContent: true, status, limit, loadAll, sort });
        if (response.artlist) {
            if (key === 'live') {
                this.updateKeyValue('artlistLive', response.artlist);
            } else if (key === 'webtv') {
                this.updateKeyValue('artlistWebtv', response.artlist);
            } else if (key === 'photo') {
                this.updateKeyValue('artlistPhoto', response.artlist);
            } else if (key === 'direktesport') {
                this.updateKeyValue('artlistDirektesport', response.artlist);
            } else if (key === 'qa') {
                this.updateKeyValue('artlistQa', response.artlist);
            } else if (key === 'program') {
                this.updateKeyValue('artlistProgram', response.artlist);
            } else if (key === 'adTop') {
                this.updateKeyValue('artlistAdTop', response.artlist);
            } else if (key === 'adCenter') {
                this.updateKeyValue('artlistAdCenter', response.artlist);
            } else if (key === 'adBottom') {
                this.updateKeyValue('artlistAdBottom', response.artlist);
            } else {
                this.updateKeyValue('artlist', response.artlist);
            }
        }
        return response;
    }

    async createArticle({ author, category, categoryId, title, youtube, teaser, ingress, body, status = 2, date, dateEnd, url }) {
        // {
        //     "author":"sorenso",
        //     "category":"/v2/about/",
        //     "categoryId":3,
        // }
        const response = await util.fetchApi(`/api/article/`, { publish: true, method: 'POST' }, {
            author,
            category,
            categoryId,
            title,
            youtube,
            teaser,
            ingress,
            body,
            status,
            date,
            dateEnd,
            url,
        });
        return response;
    }

    async updateArticle({ id, title, teaser, ingress, body, status = 2 }) {
        const response = await util.fetchApi(`/api/article/${id}`, { publish: true, method: 'PATCH' }, {
            title,
            teaser,
            ingress,
            body,
            status,
        });
        return response;
    }
}

const store = new ArticleStore();
export default store;
