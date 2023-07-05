import { h, Component } from 'preact';

import MessagesLite from '../messagesLite';

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
            article,
            imageServer,
            handleInput,
            handleTagAdd,
            handleTagRemove,
            handleTagsInput,
            handleKeydown,
            currentTag,
            currentTagIdx,
            taglist,
        } = this.props;

        return (<div class='col-12'>
            <div class='row'>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='publishedInput'>Published</label>
                        <input type='datetime-local' class='form-control' id='publishedInput' placeholder='Publiseringsdato'
                            name='published'
                            onInput={handleInput}
                            value={util.isoDate(article.published, false, false)} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='dateInput'>Date</label>
                        <input type='datetime-local' class='form-control' id='dateInput' placeholder='Dato'
                            name='date'
                            onInput={handleInput}
                            value={article.date ? util.isoDate(article.date, false, false) : ''} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='dateEndInput'>Date End</label>
                        <input type='datetime-local' class='form-control' id='dateEndInput' placeholder='Dato slutt'
                            name='dateEnd'
                            onInput={handleInput}
                            value={article.dateEnd ? util.isoDate(article.dateEnd, false, false) : ''} />
                    </div>
                </div>

                <div class='col-12'>
                    <div class='form-group'>
                        <label for='urlTitleInput'>urlTitle</label>
                        <input type='text' class='form-control' id='urlTitleInput' placeholder='urlTitle'
                            name='urlTitle'
                            onInput={handleInput}
                            value={article.urlTitle} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='hideInArtlistInput'>hideInArtlist</label>
                        <input type='number' class='form-control' id='hideInArtlistInput' placeholder='hideInArtlist'
                            name='hideInArtlist'
                            onInput={handleInput}
                            value={article.hideInArtlist} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='urlDescriptionInput'>urlDescription</label>
                        <input type='text' class='form-control' id='urlDescriptionInput' placeholder='urlDescription'
                            name='urlDescription'
                            onInput={handleInput}
                            value={article.urlDescription} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='urlImageInput'>urlImage</label>
                        <input type='text' class='form-control' id='urlImageInput' placeholder='urlImage'
                            name='urlImage'
                            onInput={handleInput}
                            value={article.urlImage} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='urlIconInput'>urlIcon</label>
                        <input type='text' class='form-control' id='urlIconInput' placeholder='urlIcon'
                            name='urlIcon'
                            onInput={handleInput}
                            value={article.urlIcon} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='urlBaseUrlInput'>urlBaseUrl</label>
                        <input type='text' class='form-control' id='urlBaseUrlInput' placeholder='urlBaseUrl'
                            name='urlBaseUrl'
                            onInput={handleInput}
                            value={article.urlBaseUrl} />
                    </div>
                </div>
                <div class='col-12'>
                    <div class='form-group'>
                        <label for='urlThemeColorInput'>urlThemeColor</label>
                        <input type='text' class='form-control' id='urlThemeColorInput' placeholder='urlThemeColor'
                            name='urlThemeColor'
                            onInput={handleInput}
                            value={article.urlThemeColor} />
                    </div>
                </div>

                <div class='col-12'>
                    <div class='form-group'>
                        <label for='youtubeInput'>Youtube link</label>
                        <input type='text' class='form-control' id='youtubeInput' placeholder='Youtube link'
                            name='youtube'
                            onInput={handleInput}
                            value={article.youtube} />
                    </div>
                </div>
                <div class='col-6'>
                    <div class='form-group'>
                        <label for='latInput'>Lat</label>
                        <input type='number' class='form-control' id='latInput' placeholder=''
                            name='lat'
                            onInput={handleInput}
                            value={article.lat} />
                    </div>
                </div>
                <div class='col-6'>
                    <div class='form-group'>
                        <label for='lonInput'>Lon</label>
                        <input type='number' class='form-control' id='lonInput' placeholder=''
                            name='lon'
                            onInput={handleInput}
                            value={article.lon} />
                    </div>
                </div>
                <div class='col-6'>
                    <div class='form-group'>
                        <label for='altitudeInput'>Altitude</label>
                        <input type='number' class='form-control' id='altitudeInput' placeholder=''
                            name='altitude'
                            onInput={handleInput}
                            value={article.altitude} />
                    </div>
                </div>

                <div class='col-12'>
                    <div class='form-group'>
                        <label for='tagsInput'>Tags</label>
                        <input type='text' class='form-control' id='tagsInput' placeholder='Tags'
                            name='tagSearch'
                            onInput={e => handleTagsInput(e, handleInput)}
                            onKeydown={e => handleKeydown(e, handleInput, taglist)}
                            value={currentTag || article.tagSearch} />

                        {Array.isArray(taglist) && taglist.map((tag, idx) =>
                            <span class={`badge badge-${currentTagIdx === idx ? 'warning' : 'light'} mr-1`}
                                onClick={e => handleTagAdd(e, handleInput, tag.title)}
                            >{tag.title} <small class='text-muted'>({tag.count})</small> <i class='fas fa-plus' /></span>
                        )}

                        {Array.isArray(article.tags) && article.tags.map(tag =>
                            <span class='badge badge-info mr-1'>{tag} <i class='fas fa-times-circle'
                                onClick={e => handleTagRemove(e, handleInput, tag)}
                                /></span>
                        )}
                        <div class='mt-3 mb-3'>
                            <small>
                                {Array.isArray(article.classifiedWords) ? <h5>Language classification</h5> : ''}
                                {Array.isArray(article.classifiedWords) && article.classifiedWords.map(word =>
                                    <span class='badge badge-success mr-1'
                                        onClick={e => handleTagAdd(e, handleInput, word)}
                                    ><i class='fas fa-comment-dots mr-1' /> {word} <i class='fas fa-plus' /></span>
                                )}
                            </small>
                            <small>
                                {Array.isArray(article.relevantWords) ? <h5>Language processing</h5> : ''}
                                {Array.isArray(article.relevantWords) && article.relevantWords.map(word =>
                                    <span class='badge badge-danger mr-1'
                                        onClick={e => handleTagAdd(e, handleInput, word)}
                                    ><i class='fas fa-comment-dots mr-1' /> {word} <i class='fas fa-plus' /></span>
                                )}
                            </small>
                        </div>
                        <div class='mb-3'>
                            <small>
                                {Array.isArray(article.img) ? <h5>Image recognition</h5> : ''}
                                {Array.isArray(article.img) && article.img.map(img => {
                                    let geoInfo = [];
                                    let geoInfoExtra = [];
                                    util.geoAddressFields().map(key => {
                                        const geoData = util.getString(img, 'geo', 'address', key);
                                        if (geoData) {
                                            geoInfo.push(geoData);
                                            const geoDataExtra = util.geoAddressGetExtraTags(key);
                                            if (geoDataExtra) {
                                                geoInfoExtra = geoInfoExtra.concat(geoDataExtra);
                                            }
                                        }
                                    });
                                    const geoDisplayName = util.getString(img, 'geo', 'display_name');
                                    if (geoDisplayName) {
                                        geoDisplayName.split(', ').map(val => {
                                            if (val && geoInfo.indexOf(val) === -1) {
                                                geoInfo.push(val);
                                            }
                                        })
                                    }
                                    geoInfo = util.asUniqArray(geoInfo);

                                    return (
                                        <div class='row mb-3'>
                                            <div class='col-4'>
                                                {img.src && <img src={`https://${imageServer}/pho/${img.src}?w=500`} class='img-fluid' onError={this.handleImageErrored} />}
                                            </div>
                                            <div class='col-8'>
                                                {geoInfo.map(info =>
                                                    <span class='badge badge-primary mr-1'
                                                        onClick={e => handleTagAdd(e, handleInput, info)}
                                                    >
                                                        <i class='fas fa-map-marker-alt mr-1' /> {info} <i class='fas fa-plus' />
                                                    </span>
                                                )}
                                                {geoInfoExtra.map(info =>
                                                    <span class='badge badge-danger mr-1'
                                                        onClick={e => handleTagAdd(e, handleInput, info)}
                                                    >
                                                        <i class='fas fa-map-marker-alt mr-1' /> {info} <i class='fas fa-plus' />
                                                    </span>
                                                )}
                                                <br />

                                                {Array.isArray(img.predictions) && img.predictions.map(pre =>
                                                    <span class='badge badge-secondary mr-1'
                                                        onClick={e => handleTagAdd(e, handleInput, pre.className)}
                                                    ><i class='fas fa-tag mr-1' /> {pre.className} <i class='fas fa-plus' /></span>
                                                )}
                                                {Array.isArray(img.predictionsCocoSsd) && img.predictionsCocoSsd.map(pre =>
                                                    <span class='badge badge-dark mr-1'
                                                        onClick={e => handleTagAdd(e, handleInput, pre.class)}
                                                    ><i class='fas fa-tag mr-1' /> {pre.class} <i class='fas fa-plus' /></span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
