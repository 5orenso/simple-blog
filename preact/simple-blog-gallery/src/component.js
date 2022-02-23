import { h } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import querystring from 'querystring';
import Markdown from 'preact-markdown';

const MARKDOWN_OPTIONS = {
	pedantic: false,
	gfm: true,
	breaks: true,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: true,
};

function fetchApi({ url, headers = {}, body = {}, settings = {} }) {
    const fetchOpt = {
        credentials: 'omit',
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {},
    };
    if (settings.jwtToken) {
        fetchOpt.headers = {
            Authorization: `Bearer ${settings.jwtToken}`,
        };
    }

    let qs = '';
    if (settings.method === 'POST' || settings.method === 'PUT' || settings.method === 'PATCH' || settings.method === 'DELETE') {
        fetchOpt.method = settings.method;
        fetchOpt.body = JSON.stringify(body);
        fetchOpt.headers['Content-Type'] = 'application/json';
    } else {
        qs = querystring.stringify(body);
    }
    // console.log('fetchOpt', fetchOpt);
    // console.log(`${main.props.apiServer}${endpoint}${qs ? `?${qs}` : ''}`);
    return fetch(`${settings.apiServer}${url}${qs ? `?${qs}` : ''}`, fetchOpt)
        .then((response) => {
            return response;
        })
        .then(response => response.json())
        .catch((error) => {
            throw (error);
        });
}

export default function App(props) {
    const { apiServer, jwtToken, articleId, start, end, size = '800x', className = '', style = '', photoClass = '', imgClass = '' } = props;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState(0);
    const imageScrollerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/${articleId}`,
                settings: {
                    apiServer,
                },
            })
            setArticle(result.article);
            setImageServer(result.imageServer);
            setImagePath(result.imagePath);
        };
        if (articleId) {
            fetchData();
        }
    }, [articleId]);

    const { img: images = [] } = article;
    let filteredImages = images;
    if (article['gallery-start'] || article['gallery-end'] || start || end) {
        const startIdx = parseInt(start || article['gallery-start'] || 0, 10);
        const endIdx = parseInt(end || article['gallery-end'] || images.length, 10);
        filteredImages = images.slice(startIdx, endIdx);
    }

    const scrollImages = (e) => {
        const totalImages = filteredImages.length - 1;

        const { scrollLeft, scrollWidth, clientWidth } = e.target;
        const imageStep = clientWidth;
        const imageIdx = scrollLeft / imageStep;
        // console.log({ e, imageStep, imageIdx, scrollLeft, scrollWidth, clientWidth });

        const nearestInt = Math.round(imageIdx);
        const diff = Math.abs(nearestInt - imageIdx);
        // console.log({ nearestInt, diff });
        if (Number.isInteger(imageIdx) || diff < 0.1) {
            setImageidx(nearestInt);
        }
    }

    const onClickScrollLeft = useCallback((e) => {
        const el = imageScrollerRef;
        const width = 0 - el.current.clientWidth;
        el.current.scrollBy({
            top: 0,
            left: width,
            behavior: 'smooth'
        });
    }, []);

    const onClickScrollRight = useCallback((e) => {
        const el = imageScrollerRef;
        const width = el.current.clientWidth;
        el.current.scrollBy({
            top: 0,
            left: width,
            behavior: 'smooth'
        });
    }, []);

    const hasPrev = imageIdx > 0;
    const hasNext = imageIdx < filteredImages.length - 1;

    return (
        <div class={`position-relative ${article['gallery-class']} ${className}`} style={`${article['gallery-style']} ${style}`}>
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article)} */}

            <div class={`w-100 ${article['gallery-wrapper-class']}`}>
                <div
                    class={`d-flex flex-row flex-nowrap ${article['gallery-wrapper-inner-class'] ? article['gallery-wrapper-inner-class'] : 'border-top border-bottom'}`}
                    style='overflow: auto; scroll-snap-type: x mandatory;'
                    onScroll={scrollImages}
                    ref={imageScrollerRef}
                >
                    {filteredImages && filteredImages.map((img, idx) => (
                        <div class={`col-12 clearfix position-relative p-0 ${article['gallery-class-photo']} ${photoClass}`}>
                            <div
                                class={`w-100 h-100 text-center rounded-lg imageContainer d-flex justify-content-center align-items-center ${article['gallery-img-wrapper-class']}`}
                                style={`
                                    scroll-snap-align: start;
                                    overflow-y: hidden;
                                `}
                            >
                                {!article['gallery-skip-background-images'] && <div
                                    class='position-absolute w-100 h-100'
                                    style={`
                                        background-image: url('${`https://${imageServer}/400x/${imagePath}/${img.src}`}'); background-size: cover;
                                        filter: blur(10px);
                                        opacity: 0.5;
                                    `}
                                />}
                                {img.src ? <img
                                    class={`img-fluid position-relative ${article['gallery-class-photo-img']} ${imgClass}`}
                                    src={`https://${imageServer}/${size}/${imagePath}/${img.src}`}
                                    loading='lazy'
                                    style={`${idx !== imageIdx ? '' : ''}`}
                                /> : <>
                                    <span class='display-1 text-muted'>
                                        <i class='fas fa-camera' />
                                    </span>
                                </>}
                                {img.title && <div class='position-absolute text-white font-weight-lighter pt-1 pb-4 w-100' style='bottom: 0px; background-color: rgba(0, 0, 0, 0.6)'>
                                    {img.text && <Markdown markdown={`__${img.title}__ ${img.text}`} markdownOpts={MARKDOWN_OPTIONS} />}
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredImages && filteredImages.length > 1 && <>
                    <div class='w-100 text-center position-absolute text-white' style='bottom: 20px;'>
                        <small>
                            <small>
                                {filteredImages && filteredImages.map((img, idx) => <>
                                    <i class={`${idx === imageIdx ? 'fas' : 'far'} fa-circle mr-1`} />
                                </>)}
                            </small>
                        </small>
                    </div>
                    <div
                        class='position-absolute text-white font-weight-lighter px-1 py-1 rounded-lg'
                        style='top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.3); line-height: 0.6em;'
                    >
                        <small>{imageIdx + 1} / {filteredImages.length}</small>
                    </div>
                </>}

                {hasPrev && <div
                    class='position-absolute d-none d-lg-block'
                    style={`${article['gallery-nav-back'] ? article['gallery-nav-back'] : 'top: 50%; left: 5px;'}`}
                >
                    <button type='button' class={`btn btn-link ${article['gallery-nav-class'] ? article['gallery-nav-class'] : 'text-secondary'}`} style='font-size: 3.0em; opacity: 0.7;' onClick={onClickScrollLeft}><i class='fas fa-arrow-circle-left' /></button>
                </div>}
                {hasNext && <div
                    class='position-absolute d-none d-lg-block'
                    style={`${article['gallery-nav-forward'] ? article['gallery-nav-forward'] : 'top: 50%; right: 5px;'}`}
                >
                    <button type='button' class={`btn btn-link ${article['gallery-nav-class'] ? article['gallery-nav-class'] : 'text-secondary'}`} style='font-size: 3.0em; opacity: 0.7;' onClick={onClickScrollRight}><i class='fas fa-arrow-circle-right' /></button>
                </div>}

            </div>

        </div>
    );
}