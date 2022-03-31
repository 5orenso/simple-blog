import { h, Component } from 'preact';

import linkstate from 'linkstate';

import MessagesLite from '../messagesLite';
import ImageUpload from '../imageUpload';

import util from '../../util';

const initialState = {

};

const debug = false;

function pad(n) {
    return (n.length < 2) ? `0${n}` : n;
}

function isImage(filename = '') {
    return filename.match(/(jpg|jpeg|png|gif|heic|heif|svg|webp|tif)/i);
}

export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    handleImageErrored = (e) => {
        const image = e.target;

        if (!image.dataset.retry) {
            image.dataset.retry = 0;
        }
        image.dataset.retry = parseInt(image.dataset.retry, 10) + 1;
        if (image.dataset.retry > 5) {
            return false;
        }

        image.onerror = null;
        setTimeout(() => {
            image.src += `?${new Date()}`;
        }, 1000);
    }

    render() {
        const {
        } = this.state;

        const {
            that,
            article,
            imglist,
            handleRemoveImageClick,
            handleClickCode,
            imageServer,
            imagePath,
            apiUrl,
            filterQuery,
            handleAddImage,
            handleImageInput,
            handleImageSubmit,
            handleImglistClick,
            handleImageTagClick,
        } = this.props;

        return (<div class='col-12'>

            <h3>Bilder i artikkelen:</h3>
            <ul class='list-group mb-4'>
                {article && (!article.img || article.img.length <= 0) && (
                    <div class='col-12 text-center text-muted'>
                        <h1><i class='fas fa-images' /> Ingen bilder i artikkelen</h1>
                        <h5>Slik legger du til bilder:</h5>
                        <ul>
                            <li>Last opp nye bilder med bildeopplastingen under.</li>
                            <li>Søk etter bilder du allerede har i arkivet.</li>
                        </ul>
                        <br /><br /><br /><br /><br />
                    </div>
                )}
                {article && article.img && article.img.map((img, idx) => {
                    const isImg = isImage(img.ext || img.src);
                    const ext = img.ext ? img.ext.replace(/\./, '') : '';

                    return (
                        <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                            <div class='d-flex w-100 justify-content-between'>
                                <div>
                                    <h5 class='m-0'>{img.name}</h5>
                                    <span class='mb-1'><small>{img.src}</small></span>
                                </div>
                                <small>{util.formatBytes(img.bytes || util.getString(img, 'stats', 'size'), 2)}</small>
                                <button class='btn btn-danger btn-sm' data-image={idx} onClick={handleRemoveImageClick}>X</button>
                            </div>
                            <div class='d-flex w-100 justify-content-between'>
                                {isImg && <p>{img.src && <img src={`https://${imageServer}/150x/${imagePath}/${img.src}`} style='max-height: 150px;'  class='img-fluid' onError={this.handleImageErrored} />}</p>}
                                {!isImg && ext && <div class='display-4 text-muted'>
                                    {ext === 'gpx' ? <i class='fas fa-map-marked-alt' /> : <i class={`fas fa-file-${ext}`} />}
                                </div>}
                                <small>
                                    <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`[${img.title|| ''}](https://${imageServer}/original/${imagePath}/${img.src} '${img.text || ''}')\n`}>
                                        <i class='fas fa-image' /> Org
                                    </button>
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/1024x/${imagePath}/${img.src} '${img.text || ''}')\n`}>
                                        <i class='fas fa-image' /> Image
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`[![${img.title|| ''}](https://${imageServer}/1024x/${imagePath}/${img.src}#nolink '${img.text || ''}')](${img.url})\n`}>
                                        <i class='fas fa-image' /> Image w/link
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/1920x/${imagePath}/${img.src}#fullwidth '${img.text || ''}')\n`}>
                                        <i class='fas fa-link' /> Full width
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`[![${img.title|| ''}](https://${imageServer}/1024x/${imagePath}/${img.src}#card '${img.text || ''}')](${img.url})\n`}>
                                        <i class='fas fa-link' /> Link
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#card '${img.text || ''}')\n`}>
                                        <i class='fas fa-file-image' /> Card
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#cardleft '${img.text || ''}')\n`}>
                                        <i class='fas fa-file-image' /> Card left
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#card2 '${img.text || ''}')\n`}>
                                        <i class='far fa-image' /> Card 2
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/1024x/${imagePath}/${img.src}#plain '${img.text || ''}')\n`}>
                                        <i class='far fa-image' /> Plain
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/800x/${imagePath}/${img.src}#circle '${img.text || ''}')\n`}>
                                        <i class='far fa-image' /> Circle
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`![${img.title|| ''}](https://${imageServer}/1024x/${imagePath}/${img.src}#nolink '${img.text || ''}')\n`}>
                                        <i class='far fa-image' /> No link
                                    </button>}
                                    {isImg && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`<h5>Detaljer om bildet</h5>
<ul>
<li><i class='fas fa-camera' /> [:img.${idx}.exif.model]</li>
<li>Objektiv: [:img.${idx}.exif.lensModel]</li>
<li>Blender: f/[:img.${idx}.exif.fNumber]</li>
<li>Brennvidde: [:img.${idx}.exif.focalLength] mm</li>
<li>Eksponering: [:img.${idx}.exif.exposureTime] sec</li>
<li>ISO: [:img.${idx}.exif.photographicSensitivity]</li>
<li>Oppløsning: [:img.${idx}.features.width] x [:img.${idx}.features.height]px ([:img.${idx}.stats.size size])</li>
<li><i class='fas fa-clock' /> [:img.${idx}.exif.dateTimeOriginal date]</li>
<li><i class='fas fa-mountain' /> [:img.${idx}.exif.gpsAltitude] moh</li>
<li><i class='fas fa-location-arrow' /> [:img.${idx}.exif.lat position], [:img.${idx}.exif.lng position]</li>
<li><i class='fas fa-print' /> [:img.${idx}.features.print+size dim] cm</li>
</ul>
`}><i class='fas fa-info-circle' /> Bildeinfo
                                    </button>}
                                    <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`@[:img.${idx}.exif.lat],[:img.${idx}.exif.lng]\n`}>
                                        <i class='fas fa-location-arrow' /> GPS
                                    </button>
                                    {ext === 'gpx' && <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`{{widget name=map fileIdx=${idx}}}\n`}>
                                        <i class='fas fa-location-arrow' /> Widget map
                                    </button>}
                                    <button class='btn btn-sm m-1' onClick={handleClickCode} data-content={`**Dette bildet er tilsalgs. Send meg en _[e-post](mailto:sorenso@gmail.com?subject=Henvendelse%20ang%20bilde:%20[:img.${idx}.src])_ eller ta kontakt på _[Facebook](http://facebook.com/sorenso)_ om du er interessert.**\n`}>
                                        <i class='fas fa-shopping-cart' /> Kjøp
                                    </button>
                                </small>
                                <br />

                            </div>
                            <div class='d-flex w-100 justify-content-between row'>
                                {idx === 0 && <div class='col-12 alert alert-primary' role='alert'>
                                    Bilde 1 blir brukt som hovedbilde i artikkelen.
                                </div>}

                                <div class='form-group col-2'>
                                    <label for={`img${idx}Title`}>Tittel</label>
                                </div>
                                <div class='form-group col-10'>
                                    <input type='text' class='form-control' id={`img${idx}Title`}
                                        onInput={linkstate(that, `article.img.${idx}.title`)}
                                        value={article.img[idx].title} />
                                </div>

                                <div class='form-group col-2'>
                                    <label for={`img${idx}URL`}>URL</label>
                                </div>
                                <div class='form-group col-10'>
                                    <input type='text' class='form-control' id={`img${idx}URL`}
                                        onInput={linkstate(that, `article.img.${idx}.url`)}
                                        value={article.img[idx].url} />
                                </div>

                                <div class='form-group col-2'>
                                    <label for={`img${idx}Text`}>Tekst</label>
                                </div>
                                <div class='form-group col-10'>
                                    <textarea class='form-control' id={`img${idx}Text`}
                                        onInput={linkstate(that, `article.img.${idx}.text`)}
                                        value={article.img[idx].text} />
                                </div>

                            </div>
                        </li>
                    );
                })}
            </ul>

            <h3>Last opp nytt bilde:</h3>
            <div class='form-group mb-4'>
                <ImageUpload
                    apiUrl={apiUrl}
                    apiServer={that.props.apiServer}
                    jwtToken={that.props.jwtToken}
                    handleAddImage={handleAddImage}
                />
            </div>

            <h3>Bildearkivet:</h3>
            <div class='col-12'>
                <div class='d-flex justify-content-center'>
                    <div class='col-10 mb-2'>
                        <input type='text' class='form-control' placeholder='Søk etter bilder' name='q'
                            onKeypress={e => handleImageInput(e, 54)}
                        />
                    </div>
                    <div class='col-2'>
                        <button class='btn btn-success' onclick={e => handleImageSubmit(e, 54)}><i class='fas fa-search' /> Søk</button>
                    </div>

                </div>
            </div>
            <div class='row mb-4'>
                <div class='col-1 text-right text-muted'>
                    {Object.keys(filterQuery).length > 0 && 'Filters:'}
                </div>
                <div class='col-12'>
                    {Object.keys(filterQuery).map(key =>
                        <span class={`mr-1 badge badge-danger`}
                            data-name={key}
                            data-value={filterQuery[key]}
                            onClick={handleImageTagClick}
                        >
                            {filterQuery[key]}
                            <i class='ml-1 fas fa-times-circle' />
                        </span>
                    )}
                </div>
                {imglist.length <= 0 && (
                    <div class='col-12 text-center text-muted'>
                        <h1><i class='fas fa-images' /> Ingen bilder å vise...</h1>
                        <h5>Du kan forsøke å søke etter stikkord i bildene.</h5>
                        Feks: 'person', 'norway', 'kolsås', 'dog', 'ski'
                        <br /><br /><br /><br /><br />
                    </div>
                )}
                {imglist.map((img, idx) => {
                    const isImg = isImage(img.ext || img.src);
                    const ext = img.ext ? img.ext.replace(/\./, '') : '';

                    return (
                        <div class='col-2 p-1'>
                            {isImg && <img src={`https://${imageServer}/150x/${imagePath}/${img.src}`} class='img-fluid' data-idx={idx} onclick={handleImglistClick} onError={this.handleImageErrored}/>}
                            {!isImg && ext && <div class='display-4 text-muted'>
                                {ext === 'gpx' ? <i class='fas fa-map-marked-alt' /> : <i class={`fas fa-file-${ext}`} />}
                            </div>}
                            <small class='text-muted'>
                                {img.name}
                            </small>
                        </div>
                    );
                })}
            </div>
        </div>);
    }
}
