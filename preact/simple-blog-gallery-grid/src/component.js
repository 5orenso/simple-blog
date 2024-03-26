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
    const { apiServer, jwtToken, articleId, start, end, size = '220x', className = '', style = '', photoClass = '', imgClass = '', autoScroll } = props;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState(0);
    const [autoscroll, setAutoscroll] = useState(true);
    const imageScrollerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/${articleId}`,
                settings: {
                    apiServer,
                },
                body: {
                    cacheContent: true,
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

    const hasPrev = imageIdx > 1;
    const hasNext = imageIdx < filteredImages.length;
    const selectedImage = filteredImages[imageIdx - 1];

    return (
        <div class={`${article['gallery-class']} ${className}`} style={`${article['gallery-style']} ${style}`}>

            <div class={`w-100 ${article['gallery-wrapper-class']}`}>
                <div class={`d-flex flex-wrap ${article['gallery-wrapper-inner-class']}`}>
                    {filteredImages && filteredImages.map((img, idx) => (
                        <div
                            style={`
                                width: 33%;
                            `}
                        >
                            <div class='w-100 h-100 p-1'>
                                <div
                                    class={`position-relative w-100 h-100 text-center rounded-lg imageContainer d-flex justify-content-center align-items-center ${article['gallery-img-wrapper-class']}`}
                                    style={`
                                        ${article['gallery-img-wrapper-style']}
                                    `}
                                    onClick={() => {
                                        setImageidx(idx + 1);
                                    }}
                                >
                                    {img.src ? <img
                                        class={`img-fluid rounded-lg position-relative ${article['gallery-class-photo-img']} ${imgClass}`}
                                        src={`https://${imageServer}/${size}/${imagePath}/${img.src}`}
                                        loading='lazy'
                                        style={`
                                            ${idx !== imageIdx ? '' : ''}
                                            ${article['gallery-img-style']}
                                        `}
                                    /> : <>
                                        <span class='display-1 text-muted'>
                                            <i class='fas fa-camera' />
                                        </span>
                                    </>}
                                    {/* {img.title && <div class='position-absolute text-white font-weight-lighter pt-1 pb-4 w-100' style='bottom: 0px; background-color: rgba(0, 0, 0, 0.6)'>
                                        {img.text && <Markdown markdown={`__${img.title}__ ${img.text}`} markdownOpts={MARKDOWN_OPTIONS} />}
                                    </div>} */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                imageIdx: {imageIdx}

            </div>

            {imageIdx > 0 && filteredImages && filteredImages.length > 0 && <>
                <div
                    class='fixed-top w-100 h-100'
                    style='top: 0; left: 0;'
                    onClick={() => {
                        setImageidx(0);
                    }}
                >
                    <div class='position-absolute w-100 h-100' style='top: 0; left: 0; background-color: rgba(0, 0, 0, 0.8);'>
                        <div class='d-flex justify-content-end align-items-center px-2'>
                            <div class='d-flex justify-content-center align-items-center'>
                                <div class='text-white font-weight-lighter'>
                                    <small>{imageIdx} / {filteredImages.length}</small>
                                </div>
                            </div>
                        </div>
                        <div class='d-flex justify-content-between align-items-center h-100'>
                            <div class='flex-row justify-content-center d-none d-lg-block' style='min-width: 65px;'>
                                {hasPrev ? <>
                                    <button type='button' class={`btn btn-link text-white p-0`} style='font-size: 3.0em; opacity: 0.7;' onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (!hasPrev) return;
                                        setImageidx(imageIdx - 1);
                                    }}><i class='fas fa-arrow-circle-left' /></button>
                                </> : <>
                                    <span style='font-size: 3.0em; opacity: 0.7;'>&nbsp;</span>
                                </>}
                            </div>
                            <div>
                                <img
                                    class='img-fluid'
                                    style='border-radius: 20px; !important;'
                                    src={`https://${imageServer}/1920x/${imagePath}/${selectedImage.src}`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (!hasNext) return;
                                        setImageidx(imageIdx + 1);
                                    }}
                                />
                                {selectedImage.title && <div class='text-white font-weight-lighter pt-1 pb-4 w-100'>
                                    {selectedImage.text && <Markdown markdown={`__${selectedImage.title}__ ${selectedImage.text}`} markdownOpts={MARKDOWN_OPTIONS} />}
                                </div>}
                            </div>
                            <div class='flex-row justify-content-center d-none d-lg-block' style='min-width: 65px;'>
                                {hasNext ? <>
                                    <button type='button' class={`btn btn-link text-white p-0`} style='font-size: 3.0em; opacity: 0.7;' onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (!hasNext) return;
                                        setImageidx(imageIdx + 1);
                                    }}><i class='fas fa-arrow-circle-right' /></button>
                                </> : <>
                                    <span style='font-size: 3.0em; opacity: 0.7;'>&nbsp;</span>
                                </>}
                            </div>
                        </div>

                    </div>
                </div>
            </>}

        </div>
    );
}