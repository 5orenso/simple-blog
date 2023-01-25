import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';

const MARKDOWN_OPTIONS = {
	pedantic: false,
	gfm: true,
	breaks: true,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: true,
};

const RELOAD_INTERVAL_IN_SEC = 60;
const MAX_ARTICLE_TO_SHOW = 10;

@observer
class Live extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            height: 150,
            maxHeight: 150,
            isOverflow: {},
            isExpanded: {},
            actualHeight: {},
            heights: {},
            newArticle: {},
        };
        this.blockRefs = {};
        this.updateTimer;
    }

    loadAll = async () => {
        const { categoryLive, categoryLiveId } = this.props;
        const { articleStore } = this.props.stores;
        await articleStore.loadArtlist({ limit: 10, category: categoryLive, key: 'live' });
        this.checkHeights();

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);
    }

    checkHeights = () => {
        // console.log('checkHeights');
        const keys = Object.keys(this.blockRefs);
        keys.forEach((key) => {
            const element = this.blockRefs[key];
            this.checkHeight(key, element);
        });
    }

    checkHeight = (id, element) => {
        const { maxHeight, isOverflow, actualHeight } = this.state;
        const clientHeight = element?.clientHeight || maxHeight;
        const scrollHeight= element?.scrollHeight || maxHeight;
        if (scrollHeight > clientHeight) {
            isOverflow[id] = true;
            actualHeight[id] = scrollHeight;
            this.setState({
                isOverflow,
                actualHeight,
            });
        }
    }

    toggleSize = (e, id) => {
        const { isExpanded, maxHeight, actualHeight, heights } = this.state;
        isExpanded[id] = !isExpanded[id];
        heights[id] = isExpanded[id] ? actualHeight[id] : maxHeight;
        this.setState({
            isExpanded,
            heights,
        });
    }

    toggleShowMore = (e) => {
        const { showMore } = this.state;
        this.setState({
            showMore: !showMore,
        });
    }

    toggleInput = (e) => {
        const { showInput } = this.state;
        this.setState({
            showInput: !showInput,
        });
    }

    createArticle = async () => {
        const { newArticle } = this.state;
        const { categoryLive, categoryLiveId } = this.props;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;

        await articleStore.createArticle({
            author: currentEmail,
            category: categoryLive,
            cateogryId: categoryLiveId,
            status: 2,
            ...newArticle,
        });
        this.loadAll();
        this.setState({
            showInput: false,
            newArticle: {
                title: '',
                body: '',
            },
        });
    }

    componentDidMount() {
        this.loadAll();
    }

    render() {
        const { height, heights, isExpanded, isOverflow, newArticle, showInput, showMore } = this.state;
        const { articleStore, appState } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        const { artlistLive } = articleStore;
        let finalArtlist;
        if (showMore) {
            finalArtlist = artlistLive.slice(0, artlistLive.length);
        } else {
            finalArtlist = artlistLive.slice(0, MAX_ARTICLE_TO_SHOW);
        }
        return (<>
            {isAdmin && <>
                {showInput ? <>
                    <button type='button' class='btn btn-sm btn-link float-right' onClick={this.toggleInput}>
                        <i class='fas fa-times'></i> Avbryt
                    </button>
                </> : <>
                    <button type='button' class='btn btn-sm btn-primary float-right' onClick={this.toggleInput}>
                        <i class='fas fa-plus'></i> Nytt innlegg
                    </button>
                </>}
            </>}
            <h5 class='border-bottom pb-2'>Siste nytt</h5>
            {/* {JSON.stringify(artlist)} */}

            {isAdmin && <>
                {showInput && <>
                    <div class='d-flex flex-column justify-content-start overflow-auto mb-5'>
                        <div class='bg-primary text-white px-3 py-1'>
                            <h5>Legg til nyhet</h5>
                        </div>
                        <div class='form-group'>
                            <label for='tittelInput'>Tittel</label>
                            <input
                                type='text'
                                class='form-control'
                                id='tittelInput'
                                placeholder='Fin tittel...'
                                onInput={linkState(this, 'newArticle.title')}
                                value={newArticle.title}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='bodyInput'>Innhold</label>
                            <textarea
                                class='form-control'
                                id='bodyInput'
                                rows='3'
                                onInput={linkState(this, 'newArticle.body')}
                                value={newArticle.body}
                            />
                        </div>
                        <button type='button' class='btn btn-block btn-primary' onClick={this.createArticle}>
                            <i class='fas fa-save'></i> Lagre
                        </button>
                    </div>
                </>}
            </>}

            <div class='d-flex flex-column overflow-auto'>
                {finalArtlist && finalArtlist.map((art, i) => {
                    const dateDiff = util.dateDiff(art.published, new Date());
                    const inThePast = dateDiff.seconds > 0;
                    const isToday = dateDiff.days === 0;
                    const isThisWeek = dateDiff.days < 7;
                    return (<>
                        <div
                            class='col-12 px-0'
                            style={`
                                height: ${heights[art.id] || height}px;
                                max-height: ${heights[art.id] || height}px;
                                overflow-y: hidden;
                                transition: max-height 700ms ease-in-out;
                            `}
                            ref={c => this.blockRefs[art.id] = c}
                        >
                            <div
                                class='px-2 rounded-lg bg-live-dark text-live-light'
                            >
                                {art.title}
                            </div>
                            <div class='body'>
                                {art.img && art.img[0] && <>
                                    <div class='w-25 float-right'>
                                        <img src={`https://litt.no/400x/litt.no/${art.img[0].src}`} class='img-fluid' />
                                    </div>
                                </>}
                                <Markdown markdown={`<strong>${
                                    isToday ? util.formatDate(art.published, {
                                        locale: 'nb',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }, true) : util.formatDate(art.published, {
                                        locale: 'nb',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: 'numeric',
                                        month: 'short',
                                    }, true)
                                    }</strong> ${art.ingress || art.body}`} markedOpts={MARKDOWN_OPTIONS} />
                            </div>
                        </div>
                            {isOverflow[art.id] && <>
                                {isExpanded[art.id] ? <>
                                    <button
                                        class='btn btn-block btn-sm btn-link text-dark'
                                        type='button'
                                        onClick={e => this.toggleSize(e, art.id)}
                                        >
                                        Vis mindre ^
                                    </button>
                                </> : <>
                                    <button
                                        class='btn btn-block btn-sm btn-link text-dark'
                                        type='button'
                                        onClick={e => this.toggleSize(e, art.id)}
                                    >
                                        Les mer v
                                    </button>
                                </>}
                            </>}
                    </>);
                })}

                <div class='d-flex justify-content-center'>
                    {finalArtlist.length <= artlistLive.length && <>
                        {showMore ? <>
                            <button
                                type='button'
                                class='btn btn-link'
                                onClick={this.toggleShowMore}
                            >
                                Vis færre
                            </button>
                        </> : <>
                            <button
                                type='button'
                                class='btn btn-link'
                                onClick={this.toggleShowMore}
                            >
                                Vis flere
                            </button>
                        </>}
                    </>}
                </div>
            </div>

        </>);
    }
}

export default Live;
