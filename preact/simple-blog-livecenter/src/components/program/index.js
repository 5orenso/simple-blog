import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';
import linkState from 'linkstate';
import { route } from 'preact-router';

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

@observer
class Program extends Component {
  	constructor(props) {
        super(props);
        this.state = {
            boxIdx: props.boxIdx || 0,
            newArticle: {
                date: util.isoDate(),
                dateEnd: util.isoDate(),
            },
        };
        this.scrollerRef;
        this.elScrollerRef;
    }

    scrollBoxes = (e) => {
        const { callback = () => {} } = this.props;

        const { articleStore } = this.props.stores;
        const { artlistProgram } = articleStore;
        const totalBoxes = artlistProgram.length - 1;

        // scrollHeight: 705
        // scrollLeft: 564
        // scrollTop: 0
        // scrollWidth: 1692

        const { scrollLeft, scrollWidth, clientWidth } = e.target;
        const boxStep = clientWidth;
        const boxIdx = scrollLeft / boxStep;
        // console.log({ e, boxStep, boxIdx, scrollLeft, scrollWidth, clientWidth });

        const nearestInt = Math.round(boxIdx);
        const diff = Math.abs(nearestInt - boxIdx);
        // console.log({ nearestInt, diff });
        if (Number.isInteger(boxIdx) || diff < 0.1) {
            this.setState({
                boxIdx: nearestInt,
            });
            callback(nearestInt);
        }
    }

    scrollToBox = (boxIdx) => {
        const el = this.scrollerRef;
        const elBox = this.elScrollerRef;
        if (el && elBox) {
            const width = elBox.clientWidth * boxIdx;
            setTimeout(() => {
                el.scrollBy({
                    top: 0,
                    left: width,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }

    loadAll = async () => {
        const { articleStore, appState } = this.props.stores;
        const { categoryProgram, categoryProgramId } = this.props;
        const { isAdmin, isExpert } = appState;
        await articleStore.loadArtlist({ isAdmin, isExpert, limit: 50, category: categoryProgram, key: 'program', sort: 'date' });
        this.scrollToNextProgram();

        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.loadAll();
        }, RELOAD_INTERVAL_IN_SEC * 1000);
    }

    scrollToNextProgram = () => {
        const { articleStore } = this.props.stores;
        const { artlistProgram } = articleStore;
        let nextIdx = 0;
        artlistProgram.forEach((program, idx) => {
            const dateDiff = util.dateDiff(new Date(), program.date);
            const dateEndDiff = util.dateDiff(new Date(), program.dateEnd);
            const inFuture = dateDiff.seconds > 0;
            const endInFuture = dateEndDiff.seconds > 0;
            const hasBeen = !inFuture && !endInFuture;
            if (hasBeen) {
                nextIdx = idx + 1;
            }
        });
        this.scrollToBox(nextIdx);
    }

    toggleInput = (e) => {
        const { showInput } = this.state;
        this.setState({
            showInput: !showInput,
        });
    }

    createArticle = async () => {
        const { newArticle } = this.state;
        const { categoryProgram, categoryProgramId } = this.props;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail } = appState;

        await articleStore.createArticle({
            author: currentEmail,
            category: categoryProgram,
            cateogryId: categoryProgramId,
            status: 2,
            ...newArticle,
        });
        this.loadAll();
        this.setState({
            showInput: false,
            newArticle: {
                title: '',
                body: '',
                url: '',
            },
        });
    }

    gotoProgram = (e) => {
        const { url } = e.target.closest('.article').dataset;
        if (url) {
            route(url);
        }
    }

    componentDidMount() {
        this.loadAll();
    }

    componentWillUnmount() {
        clearTimeout(this.updateTimer);
    }

    render() {
        const { newArticle, showInput } = this.state;
        const { appState, articleStore } = this.props.stores;
        const { currentEmail, isAdmin, isExpert } = appState;
        const { artlistProgram } = articleStore;

        const { boxIdx } = this.state;

        return (<>
            {isAdmin && <>
                <div class='w-100 d-flex justify-content-end'>
                    {showInput ? <>
                        <button type='button' class='btn btn-sm btn-link' onClick={this.toggleInput}>
                            <i class='fas fa-times'></i> Avbryt
                        </button>
                    </> : <>
                        <button type='button' class='btn btn-sm btn-primary position-absolute' style='top: 10px; right: 0px; z-index: 10000;' onClick={this.toggleInput}>
                            <i class='fas fa-plus'></i> Nytt program
                        </button>
                    </>}
                </div>
            </>}
            {isAdmin && <>
                {showInput && <>
                    <div class='d-flex flex-column justify-content-start overflow-auto mb-5'>
                        <div class='bg-primary text-white px-3 py-1'>
                            <h5>Legg til program</h5>
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
                        <div class='d-flex flex-row'>
                            <div class='form-group mr-3'>
                                <label for='dateinput'>Dato</label>
                                <input
                                    type='datetime-local'
                                    class='form-control'
                                    id='dateinput'
                                    placeholder='Dato og tid'
                                    onInput={linkState(this, 'newArticle.date')}
                                    value={newArticle.date}
                                />
                            </div>
                            <div class='form-group'>
                                <label for='dateendinput'>Dato slutt</label>
                                <input
                                    type='datetime-local'
                                    class='form-control'
                                    id='dateendinput'
                                    placeholder='Dato og tid'
                                    onInput={linkState(this, 'newArticle.dateEnd')}
                                    value={newArticle.dateEnd}
                                />
                            </div>
                        </div>
                        <div class='form-group'>
                            <label for='urlInput'>URL</label>
                            <input
                                type='text'
                                class='form-control'
                                id='urlInput'
                                placeholder='URL til sending'
                                onInput={linkState(this, 'newArticle.url')}
                                value={newArticle.url}
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
            <div class='w-100 position-relative'>
                <div
                    class='d-flex flex-row flex-nowrap no-scrollbar'
                    style={`
                        overflow-x: auto;
                        overflow-y: auto;
                        scroll-snap-type: x mandatory;
                    `}
                    onScroll={this.scrollBoxes}
                    ref={c => this.scrollerRef = c}
                >
                    {artlistProgram && artlistProgram.map((program, idx) => {
                        const dateDiff = util.dateDiff(new Date(), program.date);
                        const dateEndDiff = util.dateDiff(new Date(), program.dateEnd);
                        const inFuture = dateDiff.seconds > 0;
                        const isThisWeek = dateDiff.days < 7;
                        const endInFuture = dateEndDiff.seconds > 0;
                        const isLiveNow = !inFuture && endInFuture;
                        const hasBeen = !inFuture && !endInFuture;

                        return (
                            <div
                                class='col-6 col-md-4 col-lg-3 clearfix p-0'
                                style={`
                                    line-height: 1.1em;
                                    ${hasBeen ? 'opacity: 0.5' : ''};
                                `}
                                ref={c => this.elScrollerRef = c}
                            >
                                <div
                                    class={`w-100 h-100 d-flex justify-content-center align-items-center position-relative p-1`}
                                    style={`
                                        scroll-snap-align: start;
                                        flex-wrap: wrap;
                                    `}
                                    onTouchstart={(e) => { e.stopPropagation(); }}
                                    onTouchend={(e) => { e.stopPropagation(); }}
                                    onTouchmove={(e) => { e.stopPropagation(); }}
                                >
                                    <div
                                        class='d-flex flex-row flex-nowrap h-100 w-100 article'
                                        onClick={this.gotoProgram}
                                        data-url={program.hasSpecificUrl ? program.url : null}
                                    >
                                        <div
                                            class='h-100 w-25 text-center py-1'
                                            style={`
                                                background-color: ${isLiveNow ? 'rgb(231, 94, 46)' : 'rgb(29, 138, 146)'};
                                                color: #ffffff;
                                            `}
                                        >
                                            <small>
                                                {isThisWeek ? <>
                                                    {util.formatDate(program.date, {
                                                        locale: 'nb',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        weekday: 'short',
                                                    }, true)}
                                                </> : <>
                                                    {util.formatDate(program.date, {
                                                        locale: 'nb',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: 'numeric',
                                                        month: 'short',
                                                    }, true)}
                                                </>}
                                            </small>
                                        </div>
                                        <div
                                            class='flex-grow-1 px-2 py-1'
                                            style={`
                                                background-color: ${isLiveNow ? '#ffffff' : 'rgb(87, 190, 199)'};
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                display: -webkit-box;
                                                -webkit-line-clamp: 2; /* number of lines to show */
                                                        line-clamp: 2;
                                                -webkit-box-orient: vertical;
                                            `}
                                        >
                                            <small>
                                                <Markdown markdown={`<strong>${program.title}</strong><br />${program.ingress || program.body || ''}`} markedOpts={MARKDOWN_OPTIONS} />
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>);
    }
}

export default Program;
