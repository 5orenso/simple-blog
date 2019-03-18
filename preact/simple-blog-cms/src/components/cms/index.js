import { h, Component } from 'preact';

import styles from './style.css';
import util from '../../../lib/util';
import utilHtml from '../../../lib/util-html';
import ProgressBar from '../../../lib/components/progressbar';
import ImageUpload from '../../../lib/components/ImageUpload';

const widgetName = 'simpleBlogCms';
const debug = false;
const initialState = {
    infoStatus: '',
    loadingProgress: 0,
    article: {},
    artlist: [],
    artlistTotal: 0,

    currentPage: 1,
    articlesPerPage: 10,
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
        this.loadArtlist();
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

    loadArtlist(currentPage = 1) {
        const limit = this.state.articlesPerPage;
        const offset = (currentPage - 1) * this.state.articlesPerPage;
        util.fetchApi('/api/article/', { limit, offset }, this)
            .then((result) => {
                console.log('result', result);
                this.setState({
                    artlist: result.artlist,
                    artlistTotal: result.total,
                })
            });
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
                    article: result.article,
                });
            });

    };

    handleClickSave = (event) => {
        event.preventDefault();
        const data = {
            method: 'PATCH',
            ...this.state.article,
        }
        console.log('trying to save', this.state.article);
        util.fetchApi(`/api/article/${this.state.article.id}`, data, this)
            .then((result) => {
                console.log(result);
                // this.setState({
                //     article: result,
                // });
            });
    };

    handleTextareaInput = (event) => {
        // event.preventDefault();
        const el = event.target;
        const article = this.state.article;
        article.body = el.value;
        this.setState({ article });
        // this.doHandleTextareaInput(el);
    };

    handleInput = (event) => {
        // event.preventDefault();
        const el = event.target;
        const name = el.name;
        const article = this.state.article;
        if (typeof article[name] === 'object' && Array.isArray(article[name])) {
            article[name] = el.value.split(/, ?/);
        } else {
            article[name] = el.value;
        }
        this.setState({ article });
    };

    handleImageChange = (event) => {
        event.preventDefault();
        const el = event.target;
        console.log('image.el', el);
    }

    handlePaginationClick = (event) => {
        const currentPage = Number(event.target.id);
        this.setState({ currentPage });
        this.loadArtlist(currentPage);
    };

    handlePaginationDecClick = (event) => {
        const currentPage = Number(this.state.currentPage - 1);
        this.setState({ currentPage });
        this.loadArtlist(currentPage);
    };

    handlePaginationIncClick = (event) => {
        const currentPage = Number(this.state.currentPage + 1);
        this.setState({ currentPage });
        this.loadArtlist(currentPage);
    };

    handleAddImage = (file) => {
        const article = this.state.article;
        if (!Array.isArray(article.img)) {
            article.img = [];
        }
        article.img.push(file);
        this.setState({ article });
    };

    handleRemoveImageClick = (event) => {
        event.preventDefault();
        const el = event.target;
        const imageIdx = el.dataset.image;
        const article = this.state.article;
        console.log('article.img', article.img, imageIdx);

        if (Array.isArray(article.img)) {
            console.log('article.img', article.img, imageIdx);
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
        const { artlistTotal, currentPage, articlesPerPage, article } = this.state;

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(artlistTotal / articlesPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li class={`page-item ${this.state.currentPage === number ? 'active' : ''}`}>
                    <a class="page-link"
                        id={number}
                        onClick={this.handlePaginationClick}
                        href="#">{number}</a>
                </li>
            );
        });

        const images = this.state.article.img || [];
        const renderImages = images.slice(0, 1).map(img => {
            return (
                <img src={`http://localhost:8080/pho/${img.src}?w=750`} alt="" title="" class="img-fluid" />
            );
        })

        return (
            <div class='container-fluid'>
                <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                <div class='row'>
                    <div class='col-12'>
                        <table class='table'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Kategori</th>
                                    <th scope='col'>Tittel</th>
                                    <th scope='col'>Pub.dato</th>
                                    <th scope='col'>Forfatter</th>
                                </tr>
                            </thead>
                        <tbody>
                        {this.state.artlist.map(art =>
                            <tr data-id={art.id} onClick={this.handleArtlistClick}>
                                <th scope='row'>{art.id}</th>
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

                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class={`page-item ${this.state.currentPage > 1 ? '' : 'disabled'}`}>
                            <a class="page-link"
                                onClick={this.handlePaginationDecClick}
                                href="#">Previous</a>
                        </li>
                        {renderPageNumbers}
                        <li class={`page-item ${this.state.currentPage < pageNumbers.length ? '' : 'disabled'}`}>
                            <a class="page-link"
                                onClick={this.handlePaginationIncClick}
                                href="#">Next</a>
                        </li>
                    </ul>
                </nav>

                <h3>Redigering</h3>
                <div class='row'>
                    <div class='col-12'>
                    </div>
                    <div class='col-3'>
                        <div class='form-group'>
                            <label for='authorInput'>Forfatter</label>
                            <input type='text' class='form-control' id='authorInput' placeholder='Forfatter'
                                name='author'
                                onKeyup={this.handleInput}
                                onPaste={this.handleInput}
                                value={this.state.article.author} />
                        </div>
                    </div>
                    <div class='col-3'>
                        <div class='form-group'>
                            <label for='categoryInput'>Kategori</label>
                            <input type='text' class='form-control' id='categoryInput' placeholder='Kategori'
                                name='category'
                                onKeyup={this.handleInput}
                                onPaste={this.handleInput}
                                value={this.state.article.category} />
                        </div>
                    </div>
                    <div class='col-3'>
                        <div class='form-group'>
                            <label for='publishedInput'>Published</label>
                            <input type='text' class='form-control' id='publishedInput' placeholder='Publiseringsdato'
                                name='published'
                                onKeyup={this.handleInput}
                                onPaste={this.handleInput}
                                value={this.state.article.published} />
                        </div>
                    </div>
                    <div class='col-3'>
                        <div class='form-group'>
                            <label for='tagsInput'>Tags</label>
                            <input type='text' class='form-control' id='tagsInput' placeholder='Tags'
                                name='tags'
                                onKeyup={this.handleInput}
                                onPaste={this.handleInput}
                                value={this.state.article.tags} />
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group'>
                            <label for='imageInput'>Bilder</label>
                            <ImageUpload that={this} styles={styles}
                                category={this.state.article.category}
                                title={this.state.article.title}
                                handleAddImage={this.handleAddImage}
                            />
                        </div>
                    </div>
                    <div class='col-6'>
                        <div class='form-group'>
                            <label for='youtubeInput'>Youtube link</label>
                            <input type='text' class='form-control' id='youtubeInput' placeholder='Youtube link'
                                name='youtube'
                                onKeyup={this.handleInput}
                                onPaste={this.handleInput}
                                value={this.state.article.youtube} />
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                    </div>
                    <div class='col-6'>
                        <label for='bodyInput'>Forhåndsvisning</label>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>

                        <ul class='list-group'>
                            {article && article.img && article.img.map((img, idx) => (
                                <li class='list-group-item list-group-item-action flex-column align-items-start'>
                                    <div class="d-flex w-100 justify-content-between">
                                        <span class="mb-1">{img.src}</span>
                                        <small>{util.formatBytes(util.getString(img, 'stats', 'size'), 2)}</small>
                                        <button class='btn btn-danger btn-sm' data-image={idx} onClick={this.handleRemoveImageClick}>X</button>
                                    </div>
                                    <p><img src={`http://localhost:8080/pho/${img.src}?w=150`} height='50' /></p>
                                    <small>
                                        <code>
                                            ![{img.text}](/pho/{img.src}?w=750)
                                        </code>
                                    </small>
                                </li>
                            ))}
                        </ul>

                        <div class='form-group'>
                            <label for='titleInput'>Tittel</label>
                            <input type='text' class='form-control' id='titleInput' placeholder='Tittel'
                                name='title'
                                onKeyup={this.handleInput}
                                onPaste={this.handleInput}
                                value={this.state.article.title} />
                        </div>
                        <div class='form-group'>
                            <label for='teaserInput'>Teaser</label>
                            <input type='text' class='form-control' id='teaserInput' placeholder='Teaser'
                                name='teaser'
                                onKeyup={this.handleInput}
                                onPaste={this.handleInput}
                                value={this.state.article.teaser} />
                        </div>
                        <label for='bodyInput'>Brødtekst</label>
                    </div>
                    <div class='col-6'>
                        {renderImages}
                        <h1>{this.state.article.title}</h1>
                        <h5>{this.state.article.teaser}</h5>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            {editMode === 'textarea' ? (
                                <textarea name='body' class={`form-control h-100`} id='bodyInput' rows='3'
                                    onKeyup={this.handleTextareaInput}
                                    value={this.state.article.body} />
                            ) : (
                                <div id='fakeBody' contenteditable dangerouslySetInnerHTML={{
                                    __html: utilHtml.replaceMarked(
                                        utilHtml.replaceDataTags(this.state.article.body, this.state.article)
                                    ),
                                }}></div>
                            )}
                        </div>
                    </div>
                    <div class='col-6'>
                        <div id='bodyDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(this.state.article.body, this.state.article)
                            ),
                        }}></div>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-12'>
                        <button type='submit' class='btn btn-primary' onClick={this.handleClickSave}>Lagre</button>
                    </div>
                </div>
            </div>
        );
    }
}
