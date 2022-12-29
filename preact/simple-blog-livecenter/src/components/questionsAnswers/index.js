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

@observer
class Program extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            newArticle: {},
            showAnswer: {},
        };
    }

    loadAll = async () => {
        const { categoryQa, categoryQaId } = this.props;
        const { articleStore, appState } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        if (isAdmin || isExpert) {
            await articleStore.loadArtlist({ limit: 50, category: categoryQa, key: 'qa', loadAll: 1 });
        } else {
            await articleStore.loadArtlist({ limit: 10, category: categoryQa, key: 'qa' });
        }
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

        await articleStore.createArticle({
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
                title: '',
                body: '',
            },
        });
    }


    answerQuestion = async (e) => {
        const { id } = e.target.closest('button').dataset;
        const { newArticle } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;

        await articleStore.updateArticle({
            author: currentEmail,
            id: parseInt(id, 10),
            status: 2,
            ...newArticle,
        });
        this.loadAll();
        this.setState({
            showInput: false,
            newArticle: {
                title: '',
                teaser: '',
                body: '',
            },
        });
    }

    componentDidMount() {
        this.loadAll();
    }

    render() {
        const { newArticle, showInput, showMore, showAnswer } = this.state;
        const { articleStore, appState } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        const { artlistQa } = articleStore;
        let finalArtlist;
        if (showMore) {
            finalArtlist = artlistQa.slice(0, artlistQa.length);
        } else {
            finalArtlist = artlistQa.slice(0, 3);
        }

        return (<>
            {showInput ? <>
                <button type='button' class='btn btn-sm btn-link float-right' onClick={this.toggleInput}>
                    <i class='fas fa-times'></i> Avbryt
                </button>
            </> : <>
                <button type='button' class='btn btn-sm btn-success float-right' onClick={this.toggleInput}>
                    <i class='fas fa-plus'></i> Nytt spørsmål
                </button>
            </>}

            <h5 class='border-bottom pb-2'>Spør våre eksperter</h5>

            {showInput && <>
                <div class='d-flex flex-column justify-content-start overflow-auto mb-5'>
                    <div
                        class='px-3 py-1'
                        style={`
                            background-color: rgb(35, 139, 147);
                            color: rgb(172, 219, 226);
                        `}
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
                    <button type='button' class='btn btn-block btn-success' onClick={this.createArticle}>
                        <i class='fas fa-save'></i> Send inn spørsmål
                    </button>
                </div>
            </>}

            <div class='d-flex flex-column'>

                {finalArtlist && finalArtlist.map((art, i) => {
                    const dateDiff = util.dateDiff(art.published, new Date());
                    const inThePast = dateDiff.seconds > 0;
                    const isToday = dateDiff.days === 0;
                    const isThisWeek = dateDiff.days < 7;

                    const updatedDateDiff = util.dateDiff(art.updatedDate, new Date());
                    const updatedInThePast = dateDiff.seconds > 0;
                    const updatedIsToday = dateDiff.days === 0;
                    const updatedIsThisWeek = dateDiff.days < 7;

                    return (<>
                        <div class='d-flex flex-column mb-3'>
                            <div class='d-flex justify-content-start'>
                                <div class='d-flex flex-column' style='max-width: 80%;'>
                                    <div class={`p-2 ${art.status === 1 ? 'bg-warning' : 'bg-secondary'} text-white rounded-lg overflow-hidden`} style='max-height: 70vh;'>
                                        {art.ingress || art.title}
                                    </div>
                                    <div class='text-right'>
                                        <small>
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
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div class='d-flex justify-content-end'>
                                <div class='d-flex flex-column' style='max-width: 80%;'>
                                    {art.status === 1 ? <>
                                        {showAnswer[art.id] ? <>
                                            <div class='p-2 bg-primary text-white rounded-lg overflow-hidden' style='max-height: 70vh;'>
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
                                                    <button type='button' class='btn btn-block btn-primary' onClick={this.answerQuestion} data-id={art.id}>
                                                        <i class='fas fa-save'></i> Svar på spørsmål
                                                    </button>
                                                    <button type='button' class='btn btn-block btn-link' onClick={this.toggleShowAnswer} data-id={art.id}>
                                                        Avbryt
                                                    </button>
                                                </div>
                                            </div>
                                        </> : <>
                                            {isAdmin && <>
                                                <button type='button' class='btn btn-block btn-link' onClick={this.toggleShowAnswer} data-id={art.id}>
                                                    Svar på spørsmål
                                                </button>
                                            </>}
                                        </>}

                                    </> : <>
                                        <div class='p-2 bg-primary text-white rounded-lg overflow-hidden' style='max-height: 70vh;'>
                                            <Markdown markdown={`${art.body}`} markedOpts={MARKDOWN_OPTIONS} />
                                        </div>
                                        <div class='text-right'>
                                            <small>
                                                {art.author} - {updatedIsToday ? util.formatDate(art.updatedDate, {
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
