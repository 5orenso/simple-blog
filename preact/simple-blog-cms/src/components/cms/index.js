import { h, Component } from 'preact';

import styles from './style.css';
import util from '../../../lib/util';
import utilHtml from '../../../lib/util-html';
import ProgressBar from '../../../lib/components/progressbar';

const widgetName = 'simpleBlogCms';
const debug = false;
const initialState = {
    infoStatus: '',
    loadingProgress: 0,
    article: {},
    artlist: [],
};
const editMode = 'textarea'; // div

export default class SimpleBlogCms extends Component {
    constructor($props) {
        const props = $props;
        if (props.apiServer.length < 1) {
            props.apiServer = `${window.location.protocol}//${window.location.host}`;
        }
        super(props);
        this.state = util.getResetState(this.state, initialState);

        util.fetchApi('/api/article/', {}, this)
            .then((result) => {
                this.setState({
                    artlist: result,
                })
            });
    }

    // - - - [ Functions ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    componentCleanup() {
        if (debug) {
            console.log(widgetName, 'componentCleanup');
        }
        // this.saveHistoryToLocalStorage('productsInBasket', []);
    }

    doHandleTextareaInput(element) {
        console.log('doHandleTextareaInput:', element);
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }

    // - - - [ Events ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // eslint-disable-next-line
    handleArtlistClick = (event) => {
        event.preventDefault();
        const trElement = event.target.closest('tr');
        const artId = parseInt(trElement.dataset.id, 10);
        util.fetchApi(`/api/article/${artId}`, {}, this)
            .then((result) => {
                this.setState({
                    article: result,
                });
            });

    };

    handleClickSave = (event) => {
        event.preventDefault();
        // const body = document.getElementById('bodyInput');
        // console.log(body.innerText);
        // console.log(body.innerHTML);
        //
        // const body = document.getElementById('bodyInput');
    };

    handleTextareaInput = (event) => {
        event.preventDefault();
        const el = event.target;
        const article = this.state.article;
        article.body = el.value;
        this.setState({ article });
        // this.doHandleTextareaInput(el);
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
        const body = document.getElementById('bodyInput');
        this.doHandleTextareaInput(body);
    }

    // Render the shit:
    render() {
        return (
            <div class="container-fluid">
                <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                <div class="row">
                    <div class="col-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Kategori</th>
                                    <th scope="col">Tittel</th>
                                    <th scope="col">Pub.dato</th>
                                    <th scope="col">Forfatter</th>
                                </tr>
                            </thead>
                        <tbody>
                        {this.state.artlist.map(art =>
                            <tr data-id={art.id} onClick={this.handleArtlistClick}>
                                <th scope="row">{art.id}</th>
                                <td>{art.category}</td>
                                <td>{art.title}</td>
                                <td>{art.published}</td>
                                <td>{art.author}</td>
                            </tr>
                        )}
                        </tbody>
                        </table>

                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="titleInput">Tittel</label>
                            <input type="text" class="form-control" id="titleInput" placeholder="Tittel" value={this.state.article.title} />
                        </div>
                        <div class="form-group">
                            <label for="teaserInput">Teaser</label>
                            <input type="text" class="form-control" id="teaserInput" placeholder="Teaser" value={this.state.article.teaser} />
                        </div>
                        <div class="form-group">
                            <label for="authorInput">Forfatter</label>
                            <input type="text" class="form-control" id="authorInput" placeholder="Forfatter" value={this.state.article.author} />
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label for="bodyInput">Brødtekst</label>
                            {editMode === 'textarea' ? (
                                <textarea name='body' class={`${styles.textareaAutoHeight} form-control`} id="bodyInput" rows="3"
                                    onKeyup={this.handleTextareaInput}
                                    onPaste={this.handleTextareaInput}
                                    value={this.state.article.body} />
                            ) : (
                                <div id='fakeBody' contenteditable dangerouslySetInnerHTML={{
                                    __html: utilHtml.replaceMarked(
                                        utilHtml.replaceDataTags(this.state.article.body, this.state.article)
                                    ),
                                }}></div>
                            )}
                        </div>
                        <button type="submit" class="btn btn-primary" onClick={this.handleClickSave}>Lagre</button>
                    </div>
                    <div class="col-6">
                        <label for="bodyInput">Forhåndsvisning</label>
                        <div id='bodyDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(this.state.article.body, this.state.article)
                            ),
                        }}></div>
                    </div>
                </div>
            </div>
        );
    }
}
