import { h, Component } from 'preact';

import ImageUpload from './imageUpload';

import util from '../util';
import utilHtml from '../util-html';

const initialState = {
    currentMenu: 'preview',
};
const debug = false;
const editMode = 'textarea'; // div

export default class ArticleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
        this.parent = props.that;
        this.imageServer = this.parent.props.apiServer;
    }

    handleMenuClick = (event) => {
        event.preventDefault();
        const el = event.target;

        const currentMenu = el.dataset.menu;
        this.setState({ currentMenu });
        // if (currentMenu === 'preview') {
        // } else if (currentMenu === 'images') {
        // }
    };

    handleClickCode = (event) => {
        event.preventDefault();
        const el = event.target;
        console.log('el', el);
        this.parent.typeInTextarea(this.state.currentTextarea, el.dataset.content || el.innerHTML);
    };

    handleTextareaFocus = (event) => {
        const el = event.target;
        this.setState({ currentTextarea: el });
    };

    render(props) {
        const { currentMenu } = this.state;
        const styles = props.styles;
        const article = props.article;
        const handleInput = props.handleInput;
        const handleAddImage = props.handleAddImage;
        const handleRemoveImageClick = props.handleRemoveImageClick;
        const handleTextareaInput = props.handleTextareaInput;
        const handleClickSave = props.handleClickSave;
        const handleClickNew = props.handleClickNew;

        const images = article.img || [];
        const imagesTotal = images.length;
        const renderImages = images.slice(0, 1).map(img => {
            return (
                <img src={`${this.imageServer}/pho/${img.src}?w=750`} alt='' title='' class='img-fluid' />
            );
        });

        const renderedMenu = (
            <nav class='nav nav-pills nav-fill mb-3'>
                <a class={`nav-item nav-link ${currentMenu === 'preview' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='preview'>Forhåndsvisning</a>
                <a class={`nav-item nav-link ${currentMenu === 'images' ? 'active' : ''}`} href='#'
                    onClick={this.handleMenuClick} data-menu='images'>Bilder ({imagesTotal})</a>
            </nav>
        );

        return (
            <div class='container-fluid'>
                <div class='row'>
                    <div class='col-6'>
                        <button type='submit' class='btn btn-success float-right' onClick={handleClickSave}>Lagre</button>
                        <h3>Redigering</h3>
                    </div>
                    <div class='col-6'>
                        <button class='btn btn-info float-right' onClick={handleClickNew}>+ Ny artikkel</button>
                    </div>
                    <div class='col-1'>
                        <div class='form-group'>
                            <label for='statusInput'>Status</label>
                            <input type='number' class='form-control' id='statusInput' placeholder='Status'
                                min='1' max='3' step='1'
                                name='status'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={article.status} />
                        </div>
                    </div>
                    <div class='col-2'>
                        <div class='form-group'>
                            <label for='authorInput'>Forfatter</label>
                            <input type='text' class='form-control' id='authorInput' placeholder='Forfatter'
                                name='author'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={article.author} />
                        </div>
                    </div>
                    <div class='col-3'>
                        <div class='form-group'>
                            <label for='categoryInput'>Kategori</label>
                            <input type='text' class='form-control' id='categoryInput' placeholder='Kategori'
                                name='category'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={article.category} />
                        </div>
                    </div>
                    <div class='col-3'>
                        <div class='form-group'>
                            <label for='publishedInput'>Published</label>
                            <input type='text' class='form-control' id='publishedInput' placeholder='Publiseringsdato'
                                name='published'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={util.isoDateNormalized(article.published)} />
                        </div>
                    </div>
                    <div class='col-3'>
                        <div class='form-group'>
                            <label for='tagsInput'>Tags</label>
                            <input type='text' class='form-control' id='tagsInput' placeholder='Tags'
                                name='tags'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={article.tags} />
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group'>
                            <label for='imageInput'>Bilder</label>
                            <ImageUpload that={this.parent} styles={styles}
                                category={article.category}
                                title={article.title}
                                handleAddImage={handleAddImage}
                            />
                        </div>
                    </div>
                    <div class='col-6'>
                        <div class='form-group'>
                            <label for='youtubeInput'>Youtube link</label>
                            <input type='text' class='form-control' id='youtubeInput' placeholder='Youtube link'
                                name='youtube'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={article.youtube} />
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                    </div>
                    <div class='col-6'>
                        {renderedMenu}
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6' style="display: flex; flex-direction: column;   justify-content: space-around;">

                        <div class='form-group'>
                            <label for='titleInput'>Tittel</label>
                            <input type='text' class='form-control' id='titleInput' placeholder='Tittel'
                                name='title'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={article.title} />
                        </div>
                        <div class='form-group'>
                            <label for='teaserInput'>Teaser</label>
                            <input type='text' class='form-control' id='teaserInput' placeholder='Teaser'
                                name='teaser'
                                onChange={handleInput}
                                onKeyup={handleInput}
                                value={article.teaser} />
                        </div>
                        <div class='form-group' style='flex: 1;'>
                            <label for='bodyInput'>Brødtekst</label>
                            <textarea name='body' class={`${styles.textareaAutoHeight} form-control`} id='bodyInput' rows='10'
                                onChange={handleTextareaInput}
                                onKeyup={handleInput}
                                onFocus={this.handleTextareaFocus}
                                value={article.body} />
                        </div>

                        <button type='submit' class='btn btn-success' onClick={handleClickSave}>Lagre</button>
                    </div>
                    {currentMenu === 'preview' && (
                        <div class='col-6'>
                            {renderImages}
                            <h1>{article.title}</h1>
                            <h5>{article.teaser}</h5>
                            <div id='bodyDisplay' dangerouslySetInnerHTML={{
                                __html: utilHtml.replaceMarked(
                                    utilHtml.replaceDataTags(article.body, article)
                                ),
                            }}></div>
                        </div>
                    )}
                    {currentMenu === 'images' && (
                        <div class='col-6'>
                        <ul class='list-group'>
                            {article && article.img && article.img.map((img, idx) => (
                                <li class='list-group-item list-group-item-action flex-column align-items-start'>
                                    <div class='d-flex w-100 justify-content-between'>
                                        <span class='mb-1'>{img.src}</span>
                                        <small>{util.formatBytes(util.getString(img, 'stats', 'size'), 2)}</small>
                                        <button class='btn btn-danger btn-sm' data-image={idx} onClick={handleRemoveImageClick}>X</button>
                                    </div>
                                    <div class='d-flex w-100 justify-content-between'>
                                        <p><img src={`${this.imageServer}/pho/${img.src}?w=150`} height='50'  class='img-fluid' /></p>
                                        <small>
                                            <button class='btn btn-sm m-2' onClick={this.handleClickCode} data-content={`![${img.text || 'Image title'}](/pho/${img.src}?w=750 "Image description")\n`}>
                                                Image
                                            </button>
                                            <button class='btn btn-sm m-2' onClick={this.handleClickCode} data-content={`![${img.text || 'Image title'}](/pho/${img.src}?w=750#card "Image description")\n`}>
                                                Card
                                            </button>
                                            <button class='btn btn-sm m-2' onClick={this.handleClickCode} data-content={`![${img.text || 'Image title'}](/pho/${img.src}?w=750#card2 "Image description")\n`}>
                                                Card 2
                                            </button>
                                            <button class='btn btn-sm m-2' onClick={this.handleClickCode} data-content={`<h5>Detaljer om bildet</h5>
<ul>
    <li>Kamera: [:img.${idx}.exif.model]</li>
    <li>Objektiv: [:img.${idx}.exif.lensModel]</li>
    <li>Blender: f/[:img.${idx}.exif.fNumber]</li>
    <li>Brennvidde: [:img.${idx}.exif.focalLength] mm</li>
    <li>Eksponering: [:img.${idx}.exif.exposureTime] sec</li>
    <li>ISO: [:img.${idx}.exif.photographicSensitivity]</li>
    <li>Oppløsning: [:img.${idx}.exif.pixelXDimension]x[:img.${idx}.exif.pixelYDimension]px ([:img.${idx}.stats.size size])</li>
    <li>Dato: [:img.${idx}.exif.dateTimeOriginal date]</li>
    <li>Høyde: [:img.${idx}.exif.gpsAltitude] moh</li>
</ul>
`}>Bildeinfo
                                            </button>
                                            <button class='btn btn-sm m-2' onClick={this.handleClickCode} data-content={`@[:img.${idx}.exif.lat],[:img.${idx}.exif.lng]\n`}>
                                                GPS
                                            </button>
                                            <button class='btn btn-sm m-2' onClick={this.handleClickCode} data-content={`**Dette bildet er tilsalgs. Send meg en _[e-post](mailto:sorenso@gmail.com?subject=Henvendelse%20ang%20bilde:%20[:img.${idx}.src])_ eller ta kontakt på _[Facebook](http://facebook.com/sorenso)_ om du er interessert.**\n`}>
                                                Kjøp
                                            </button>
                                        </small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}