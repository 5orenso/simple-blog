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

const fieldSorter = (fields) => (a, b) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') {
        dir = -1;
        o = o.substring(1);
    }
    // eslint-disable-next-line no-nested-ternary
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
}).reduce((p, n) => (p || n), 0);

export default function App(props) {
    const { apiServer, jwtToken, articleId, start, end, size = '220x', className = '', style = '', photoClass = '', imgClass = '', autoScroll } = props;

    const [article, setArticle] = useState({});
    const [artlist, setArticleList] = useState([]);
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState(0);
    const [autoscroll, setAutoscroll] = useState(true);
    const imageScrollerRef = useRef(null);

    useEffect(() => {
        if (!articleId) { return; }
        let cancelled = false;
        (async () => {
            const result = await fetchApi({
                url: `/api/article/${articleId}`,
                settings: { apiServer },
                body: { cacheContent: true }
            });
            if (cancelled) { return; }
            const articleObj = result.article || {};
            setArticle(articleObj);
            setImageServer(result.imageServer);
            setImagePath(result.imagePath);

            const category = (articleObj['logo-grid-category'] || '').trim();
            if (category) {
                const res2 = await fetchApi({
                    url: `/api/article/public/${category}`,
                    settings: { apiServer },
                    body: { cacheContent: true }
                });
                if (!cancelled) {
                    setArticleList(res2?.artlist || []);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [articleId, apiServer]);

    const { img: images = [] } = article;
    let filteredImages = images;

    if (article['logo-grid-start'] || article['logo-grid-end'] || start || end) {
        const startIdx = parseInt(start || article['logo-grid-start'] || 0, 10);
        const endIdx = parseInt(end || article['logo-grid-end'] || images.length, 10);
        filteredImages = images.slice(startIdx, endIdx);
    }

    const hasPrev = imageIdx > 1;
    const hasNext = imageIdx < filteredImages.length;
    const selectedImage = filteredImages[imageIdx - 1];

    if (article['logo-grid-category']) {
        const { 'logo-grid-category': category } = article;
        const allCategories = category.split(',').map(c => c.trim());
        return (<>
            {allCategories.map((category, idx) => {
                const catArtlist = artlist.filter(a => a.category === category).sort(fieldSorter(['sort']));
                const maxHeight = idx === 0 ? '50vh' : '200px';
                const width = idx === 0 ? '100%' : '30%';
                const imageSize = idx === 0 ? '1024x' : '220x';
                return <>
                    <h5 class='text-center'>{`${category}`.replace(/•/g, '')}</h5>
                    <div class={`d-flex flex-wrap justify-content-center mb-5 ${article['logo-grid-wrapper-class']}`}>
                        {catArtlist.length > 0 ? (<>
                            {catArtlist.map(article => {
                                const articleImages = article.img || [];
                                return (<>
                                    {articleImages && articleImages.map((img, imgIdx) => (
                                        <div class={`d-flex mx-1 my-1`} style={`width: ${width};`}>
                                            <div
                                                class={`d-flex flex-column text-center w-100 p-2 rounded-lg imageContainer overflow-hidden d-flex justify-content-start align-items-center ${article['logo-grid-img-wrapper-class']} p-1`}
                                                style={`
                                                    // background-color: rgba(0, 0, 0, 0.4);
                                                    border: 1px solid rgba(0, 0, 0, 0.2);
                                                    ${article['logo-grid-img-wrapper-style']}
                                                `}
                                            >
                                                <a href={article.url} target='_blank'>
                                                    {img.src ? <img
                                                        class={`img-fluid rounded-lg position-relative ${article['logo-grid-class-photo-img']} ${imgClass}`}
                                                        src={`https://${imageServer}/${imageSize}/${imagePath}/${img.src}`}
                                                        loading='lazy'
                                                        style={`
                                                            max-height: ${maxHeight};
                                                            ${imgIdx !== imageIdx ? '' : ''}
                                                            ${article['logo-grid-img-style']}
                                                        `}
                                                    /> : <>
                                                        <span class='display-1 text-muted'>
                                                            <i class='fas fa-camera' />
                                                        </span>
                                                    </>}
                                                </a>
                                                {article.ingress && <div class='d-flex font-weight-lighter pt-3 pb-2 w-100 justify-content-center'>
                                                    {article.ingress && <Markdown markdown={article.ingress} markdownOpts={MARKDOWN_OPTIONS} />}
                                                </div>}
                                            </div>
                                        </div>
                                    ))}

                                </>);
                            })}
                        </>) : (
                            <p class='text-muted'>No articles found.</p>
                        )}
                    </div>
                </>;
            })}
        </>);
    }

    return (
        <div class={`${article['logo-grid-class']} ${className}`} style={`${article['logo-grid-style']} ${style}`}>

            <div class={`w-100 ${article['logo-grid-wrapper-class']}`}>
                {/* <xmp>{JSON.stringify(filteredImages.sort(fieldSorter(['sort'])).map(i => i.sort), null, 2)}</xmp> */}
                <div class={`d-flex flex-wrap ${article['logo-grid-wrapper-inner-class']}`}>
                    {filteredImages && filteredImages.sort(fieldSorter(['sort'])).map((img, idx) => (
                        <div
                            style={`
                                // width: 33%;
                            `}
                        >
                            <div class='w-100 h-100 p-1'>
                                <div
                                    class={`position-relative w-100 h-100 text-center rounded-lg imageContainer overflow-hidden d-flex justify-content-center align-items-center ${article['logo-grid-img-wrapper-class']} p-1`}
                                    style={`
                                        max-height: 200px;
                                        width: 200px;
                                        // background-color: rgba(0, 0, 0, 0.4);
                                        border: 1px solid rgba(0, 0, 0, 0.2);
                                        ${article['logo-grid-img-wrapper-style']}
                                    `}
                                >
                                    <a href={img.url} target='_blank'>
                                        {img.src ? <img
                                            class={`img-fluid rounded-lg position-relative ${article['logo-grid-class-photo-img']} ${imgClass}`}
                                            src={`https://${imageServer}/${size}/${imagePath}/${img.src}`}
                                            loading='lazy'
                                            style={`
                                                max-height: 100%;
                                                ${idx !== imageIdx ? '' : ''}
                                                ${article['logo-grid-img-style']}
                                            `}
                                        /> : <>
                                            <span class='display-1 text-muted'>
                                                <i class='fas fa-camera' />
                                            </span>
                                        </>}
                                    </a>
                                    {/* {img.title && <div class='position-absolute text-white font-weight-lighter pt-1 pb-4 w-100' style='bottom: 0px; background-color: rgba(0, 0, 0, 0.6)'>
                                        {img.text && <Markdown markdown={`__${img.title}__ ${img.text}`} markdownOpts={MARKDOWN_OPTIONS} />}
                                    </div>} */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* imageIdx: {imageIdx} */}

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
                                    style={`
                                        max-height: 90vh;
                                        border-radius: 20px; !important;
                                    `}
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