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

const MAX_ARTICLE_TO_SHOW = 5;
const RELOAD_INTERVAL_IN_SEC = 60;

@observer
class Program extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            newArticle: {},
            showAnswer: {},
        };
        this.updateTimer = null;
    }

    loadAll = async () => {
        const { categoryQa, categoryQaId } = this.props;
        const { articleStore, appState } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        if (isAdmin || isExpert) {
            await articleStore.loadArtlist({ isAdmin, isExpert, limit: 100, category: categoryQa, key: 'qa', loadAll: 1 });
        } else {
            await articleStore.loadArtlist({ isAdmin, isExpert, limit: 100, category: categoryQa, key: 'qa' });
        }
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);
    }

    toggleShowMore = (e) => {
        const { showMore } = this.state;
        this.setState({
            showMore: !showMore,
        });
    }

    toggleShowAnswer = (e) => {
        const { showAnswer } = this.state;
        const { id } = e.target.closest('button').dataset;
        showAnswer[id] = !showAnswer[id];
        this.setState({
            showAnswer,
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
        const { categoryQa, categoryQaId } = this.props;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;

        await articleStore.createPublicArticle({
            author: currentEmail,
            category: categoryQa,
            cateogryId: categoryQaId,
            status: 1,
            title: `Spørsmål fra bruker: ${currentEmail}`,
            ...newArticle,
        });
        this.loadAll();
        this.setState({
            showInput: false,
            newArticle: {
                teaser: '',
                body: '',
                author: '',
            },
            message: 'Spørsmålet er sendt inn.',
        });
    }

    answerQuestion = async (e) => {
        const { id, author } = e.target.closest('button').dataset;
        const { newArticle } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;
        const { imageDomainPath } = this.props;

        await articleStore.updateArticle({
            author: currentEmail,
            id: parseInt(id, 10),
            status: 2,
            ...newArticle,
        });
        if (author) {
            await appState.sendEmailPlain({
                to: author,
                subject: `Question answered on ${imageDomainPath}`,
                body: `Hi,

Your question has been answered. Please visit ${imageDomainPath} to see the answer.

Regards,
${imageDomainPath}

`,
            });
        }
        this.loadAll();
        this.setState({
            showInput: false,
            newArticle: {
                teaser: '',
                body: '',
            },
        });
    }

    componentDidMount() {
        this.loadAll();
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    render() {
        const { newArticle, showInput, showMore, showAnswer, message } = this.state;
        const { showQaInputButton = true, imageDomainPath } = this.props;
        const { articleStore, appState } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        const { artlistQa } = articleStore;
        let finalArtlist;
        if (showMore) {
            finalArtlist = artlistQa.slice(0, artlistQa.length);
        } else {
            finalArtlist = artlistQa.slice(0, MAX_ARTICLE_TO_SHOW);
        }

        return (<>
            {showQaInputButton && showQaInputButton !== 'false' && <>
                {showInput ? <>
                    <button type='button' class='btn btn-sm btn-link float-right' onClick={this.toggleInput}>
                        <i class='fas fa-times'></i> Avbryt
                    </button>
                </> : <>
                    <button type='button' class='btn btn-sm bg-live-light text-live-dark float-right' onClick={this.toggleInput}>
                        <i class='fas fa-plus'></i> Nytt spørsmål
                    </button>
                </>}
            </>}

            <h3 class='border-bottom pb-2'>Spør oss</h3>

            {message && <>
                <div class='alert alert-success' role='alert'>
                    {message} <i class='fas fa-smile' />
                </div>
            </>}

            {showInput && <>
                <div class='d-flex flex-column   overflow-auto mb-5'>
                    <div
                        class='px-3 py-1 bg-live-light text-live-dark'
                    >
                        <h5>Nytt spørsmål</h5>
                    </div>
                    <div class='form-group mt-2'>
                        <input
                            type='text'
                            class='form-control'
                            id='teaserInput'
                            placeholder='Fullt navn'
                            onInput={linkState(this, 'newArticle.teaser')}
                            value={newArticle.teaser}
                        />
                    </div>
                    <div class='form-group mt-2'>
                        <input
                            type='text'
                            class='form-control'
                            id='authorInput'
                            placeholder='E-post'
                            onInput={linkState(this, 'newArticle.author')}
                            value={newArticle.author}
                        />
                    </div>
                    <div class='form-group'>
                        <textarea
                            class='form-control'
                            id='bodyInput'
                            rows='3'
                            placeholder='Skriv inn spørsmål her...'
                            onInput={linkState(this, 'newArticle.ingress')}
                            value={newArticle.ingress}
                        />
                    </div>
                    <button type='button' class='btn btn-block bg-live-dark text-live-light' onClick={this.createArticle}>
                        <i class='fas fa-save'></i> Send inn spørsmål
                    </button>
                </div>
            </>}

            <div class='d-flex flex-column'>

                {finalArtlist && finalArtlist.map((art, i) => {
                    const dateDiff = util.dateDiff(art.published, new Date());
                    const inThePast = dateDiff.seconds > 0;
                    const isToday = dateDiff.hours <= 6;
                    const isLast24Hours = dateDiff.hours <= 24;
                    const isThisWeek = dateDiff.days < 7;

                    const updatedDateDiff = util.dateDiff(art.updatedDate, new Date());
                    const updatedInThePast = dateDiff.seconds > 0;
                    const updatedIsToday = dateDiff.hours <= 6;
                    const updatedIsLast24Hours = dateDiff.hours <= 24;
                    const updatedIsThisWeek = dateDiff.days < 7;

                    return (<>
                        <div class='d-flex flex-column mb-4'>
                            <div class='d-flex justify-content-start'>
                                <div class='d-flex flex-column' style='max-width: 80%;'>
                                    <div class={`p-2 ${art.status === 1 ? 'bg-warning' : 'bg-live-light text-live-dark'} rounded-lg overflow-hidden`} style='max-height: 70vh;'>
                                        <Markdown markdown={`${art.ingress}`} markedOpts={MARKDOWN_OPTIONS} />
                                    </div>
                                    <div class='text-right'>
                                        <small class='text-muted'>
                                            {art.teaser || 'anonym'} - {isLast24Hours ? <>
                                                {util.formatDistance(art.published, new Date(), { locale: 'no-NB' })} ago<br />
                                            </> : <>
                                                {isToday ? util.formatDate(art.published, {
                                                    locale: 'nb',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }, true) : util.formatDate(art.published, {
                                                    locale: 'nb',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: 'numeric',
                                                    month: 'short',
                                                }, true)}
                                            </>}
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div class='d-flex justify-content-end'>
                                <div class='d-flex flex-column' style='max-width: 80%;'>
                                    {art.status === 1 ? <>
                                        {showAnswer[art.id] ? <>
                                            <div class='p-2 bg-light text-white rounded-lg overflow-hidden' style='max-height: 70vh;'>
                                                <div class='d-flex flex-column justify-content-start overflow-auto mb-5'>
                                                    <div class='bg-primary text-white px-3 py-1'>
                                                        <h5>{currentEmail}:</h5>
                                                    </div>
                                                    <div class='form-group'>
                                                        <textarea
                                                            class='form-control'
                                                            id='bodyInput'
                                                            rows='3'
                                                            placeholder='Skriv inn svar her...'
                                                            onInput={linkState(this, 'newArticle.body')}
                                                            value={newArticle.body}
                                                        />
                                                    </div>
                                                    <button type='button' class='btn btn-block btn-primary' onClick={this.answerQuestion} data-id={art.id} data-author={art.author}>
                                                        <i class='fas fa-save'></i> Svar på spørsmål
                                                    </button>
                                                    <button type='button' class='btn btn-block btn-link' onClick={this.toggleShowAnswer} data-id={art.id}>
                                                        Avbryt
                                                    </button>
                                                </div>
                                            </div>
                                        </> : <>
                                            {isAdmin && <>
                                                <button type='button' class='btn btn-sm btn-block btn-primary' onClick={this.toggleShowAnswer} data-id={art.id}>
                                                    <i class='fas fa-megaphone' /> Svar på spørsmål
                                                </button>
                                            </>}
                                        </>}

                                    </> : <>
                                        <div class='p-2 bg-live-dark text-live-light rounded-lg overflow-hidden qa' style='max-height: 70vh;'>
                                            {art.img && art.img[0] && <>
                                                <div class='w-50 float-right pl-3'>
                                                    <img src={`${imageDomain}/400x/${imageDomainPath}/${art.img[0].src}`} class='img-fluid' />
                                                </div>
                                            </>}
                                            <Markdown markdown={`${art.body}`} markedOpts={MARKDOWN_OPTIONS} />
                                        </div>
                                        <div class='text-right'>
                                            <small class='text-muted'>
                                                {imageDomainPath} - {updatedIsLast24Hours ? <>
                                                    {util.formatDistance(art.updatedDate, new Date(), { locale: 'no-NB' })} ago<br />
                                                </> : <>
                                                    {updatedIsToday ? util.formatDate(art.updatedDate, {
                                                        locale: 'nb',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }, true) : util.formatDate(art.updatedDate, {
                                                        locale: 'nb',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: 'numeric',
                                                        month: 'short',
                                                    }, true)}
                                                </>}
                                                {/* {util.formatDate(art.updatedDate, { locale: 'nb', hour: '2-digit', minute: '2-digit' })} */}
                                            </small>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                    </>);
                })}

                <div class='d-flex justify-content-center'>
                    {finalArtlist.length <= artlistQa.length && <>
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

export default Program;
