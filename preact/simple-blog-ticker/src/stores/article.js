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

    @observable artlistCheckpoint = [];

    @observable artlistWebtv = [];

    @observable artlistWebcam = [];

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

    async loadArtlist({ isAdmin, isExpert, limit, category, key, loadAll, loadUnpublished, status = 2, sort, tag }) {
        const query = {};
        if (sort) {
            query.sort = sort;
        }
        if (tag) {
            query.tag = tag;
        }
        let response;
        if (isAdmin || isExpert) {
            response = await util.fetchApi(`/api/article/`, {
                publish: true,
                method: 'GET',
            }, {
                sort,
                category,
                limit,
                status,
                loadAll,
                loadUnpublished,
                tag,
            });
        } else {
            response = await util.fetchApi(`/api/article/public/${encodeURIComponent(category)}/${limit}/${status}/`, { publish: true, method: 'GET' }, query);
        }
        if (response.artlist) {
            if (key === 'live') {
                this.updateKeyValue('artlistLive', response.artlist);
            } else if (key === 'checkpoint') {
                this.updateKeyValue('artlistCheckpoint', response.artlist);
            } else if (key === 'webtv') {
                this.updateKeyValue('artlistWebtv', response.artlist);
            } else if (key === 'webcam') {
                this.updateKeyValue('artlistWebcam', response.artlist);
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

    async loadArticle(id) {
        let response;
        response = await util.fetchApi(`/api/article/${id}`, { publish: true, method: 'GET' });

        if (response.article) {
            this.updateKeyValue('article', response.article);
        }
        return response.article;
    }
}

const store = new ArticleStore();
export default store;
