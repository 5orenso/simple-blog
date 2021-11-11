import { h, Component } from 'preact';

import MessagesLite from '../messagesLite';

import util from '../../util';
import utilHtml from '../../util-html';

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

    render() {
        const {
        } = this.state;

        const {
            language,
            article = {},
            imageServer,
            imagePath,

            backgroundHex,
            forgroundHex,
        } = this.props;

        const images = article.img || [];
        const imagesTotal = images.length;
        const renderImages = images.slice(0, 1).map((img) => {
            const isImg = isImage(img.ext || img.src);
            if (img.src && isImg) {
                return (
                    <img src={`https://${imageServer}/800x/${imagePath}/${img.src}`} alt='' title='' class='img-fluid' onError={this.handleImageErrored} />
                );
            }
        });

        const shareLink = `${imageServer}/${utilHtml.asLinkPart(article.category)}/${utilHtml.asLinkPart(article.title)}/${article.id}`;

        return (<div class='col-12 pt-3'>
            <div class='row'>
                <div class='col-12 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                    {renderImages}
                    <h1 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH1}rem; font-weight: ${article.fontweightH1};`}>{article.title}</h1>
                    <h5>{article.teaser}</h5>
                    <div>
                        <small>
                            {util.asHumanReadable(article.published)}
                            {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                            &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                            &nbsp; / &nbsp;
                            <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                {util.getStatus(article.status)}
                            </span>
                            &nbsp; / 
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                <i class='fab fa-facebook' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                <i class='fab fa-twitter' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                + `&url=${shareLink}`
                                + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                <i class='fab fa-linkedin-in' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                + `${utilHtml.asUrlSafe(article.title)}`
                                + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                + `Les mer: ${shareLink}`}>
                                <i class='far fa-envelope' />
                            </a>
                            &nbsp; /                        
                            Ord: {util.wordCount(article.body)}
                            &nbsp; /                        
                            Lesetid: {util.readTime(article.body, 'no')}
                        </small>
                    </div>
                    <div class='mb-3'>
                        <small>
                            {Array.isArray(article.tags) && article.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag}</span>
                            )}
                        </small>
                    </div>
                    <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.ingress, article)
                        ),
                    }}></div>
                </div>
            </div>
            <div class='row mt-4'>
                <div class='col-4 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                    {renderImages}
                    <h3 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH3}rem; font-weight: ${article.fontweightH3};`}>{article.title}</h3>
                    <h5>{article.teaser}</h5>
                    <div>
                        <small>
                            {util.asHumanReadable(article.published)}
                            {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                            &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                            &nbsp; / &nbsp;
                            <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                {util.getStatus(article.status)}
                            </span>
                            &nbsp; / 
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                <i class='fab fa-facebook' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                <i class='fab fa-twitter' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                + `&url=${shareLink}`
                                + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                <i class='fab fa-linkedin-in' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                + `${utilHtml.asUrlSafe(article.title)}`
                                + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                + `Les mer: ${shareLink}`}>
                                <i class='far fa-envelope' />
                            </a>
                            &nbsp; /                        
                            Ord: {util.wordCount(article.body)}
                            &nbsp; /                        
                            Lesetid: {util.readTime(article.body, 'no')}
                        </small>
                    </div>
                    <div class='mb-3'>
                        <small>
                            {Array.isArray(article.tags) && article.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag}</span>
                            )}
                        </small>
                    </div>
                    <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.ingress, article)
                        ),
                    }}></div>
                </div>
                <div class='col-3 offset-1 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                    {renderImages}
                    <h3 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH3}rem; font-weight: ${article.fontweightH3};`}>{article.title}</h3>
                    <h6>{article.teaser}</h6>
                    <div>
                        <small>
                            {util.asHumanReadable(article.published)}
                            {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                            &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                            &nbsp; / &nbsp;
                            <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                {util.getStatus(article.status)}
                            </span>
                            &nbsp; / 
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                <i class='fab fa-facebook' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                <i class='fab fa-twitter' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                + `&url=${shareLink}`
                                + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                <i class='fab fa-linkedin-in' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                + `${utilHtml.asUrlSafe(article.title)}`
                                + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                + `Les mer: ${shareLink}`}>
                                <i class='far fa-envelope' />
                            </a>
                            &nbsp; /                        
                            Ord: {util.wordCount(article.body)}
                            &nbsp; /                        
                            Lesetid: {util.readTime(article.body, 'no')}
                        </small>
                    </div>
                    <div class='mb-3'>
                        <small>
                            {Array.isArray(article.tags) && article.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag}</span>
                            )}
                        </small>
                    </div>
                    <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.ingress, article)
                        ),
                    }}></div>
                </div>
                <div class='col-2 offset-1 pt-3' style={`background-color: ${backgroundHex}; color: ${forgroundHex};`}>
                    {renderImages}
                    <h5 style={`color: ${forgroundHex}; font-size: ${article.fontsizeH5}rem; font-weight: ${article.fontweightH5};`}>{article.title}</h5>
                    <h6>{article.teaser}</h6>
                    <div>
                        <small>
                            {util.asHumanReadable(article.published)}
                            {util.asHumanReadable(article.published) !== util.asHumanReadable(article.updatedDate) && <span class='text-muted'> / <i class='fas fa-undo' /> {util.asHumanReadable(article.updatedDate)}</span>}
                            &nbsp; /  <i class='far fa-folder-open' /> {article.category}
                            &nbsp; / &nbsp;
                            <span class={`badge badge-${util.getStatusClass(article.status)} p-2`}>
                                {util.getStatus(article.status)}
                            </span>
                            &nbsp; / 
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.facebook.com/sharer.php?u=${shareLink}`}>
                                <i class='fab fa-facebook' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://twitter.com/intent/tweet?url=${shareLink}`
                                + `&text=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&via=${utilHtml.asUrlSafe(this.imageServer)}`
                                + `&hashtags=${utilHtml.asUrlSafe(article.tags)}`}>
                                <i class='fab fa-twitter' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true`
                                + `&url=${shareLink}`
                                + `&summary=${utilHtml.asUrlSafe(article.title)}.%20`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}`
                                + `&source=${utilHtml.asUrlSafe(this.imageServer)}`}>
                                <i class='fab fa-linkedin-in' />
                            </a>
                            &nbsp;<a rel='noopener' target='_blank' href={`mailto:?subject=Tips: `
                                + `${utilHtml.asUrlSafe(article.title)}`
                                + `&body=Tips fra ${utilHtml.asUrlSafe(this.imageServer)}:%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(utilHtml.uc(article.title))}%0D%0A%0D%0A`
                                + `${utilHtml.asUrlSafe(article.teaser || article.ingress)}%0D%0A%0D%0A`
                                + `Les mer: ${shareLink}`}>
                                <i class='far fa-envelope' />
                            </a>
                            &nbsp; /                        
                            Ord: {util.wordCount(article.body)}
                            &nbsp; /                        
                            Lesetid: {util.readTime(article.body, 'no')}
                        </small>
                    </div>
                    <div class='mb-3'>
                        <small>
                            {Array.isArray(article.tags) && article.tags.map(tag =>
                                <span class='badge badge-info mr-1'>{tag}</span>
                            )}
                        </small>
                    </div>
                    <div class='lead' id='ingressDisplay' dangerouslySetInnerHTML={{
                        __html: utilHtml.replaceMarked(
                            utilHtml.replaceDataTags(article.ingress, article)
                        ),
                    }}></div>
                </div>
            </div>
        </div>);
    }
}
