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
    const {
        apiServer,
        jwtToken,
        categoryId = '',
        categoryIn = '',
        idIn = '',
        tag,
        imageSize = '400x',
        containerClass = '',
        rowClass = '',
        colClass = '',
        containerStyle = '',
        rowStyle = '',
        colStyle = '',
        imageClass = 'img-fluid',
        imageStyle = '',
        titleClass = '',
        titleStyle = '',
        ingressClass = '',
        ingressStyle = '',
        showTitle = 1,
        showIngress = 1,
        showImage = 1,
        linkTarget = '',
    } = props;

    const [artlist, setArtlist] = useState([]);
    const [imageServer, setImageServer] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [imageIdx, setImageidx] = useState(0);
    const [autoscroll, setAutoscroll] = useState(true);
    const imageScrollerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/?categoryId=${categoryId}&categoryIn=${categoryIn}&idIn=${idIn}`,
                settings: {
                    apiServer,
                },
            })
            setArtlist(result.artlist);
            setImageServer(result.imageServer);
            setImagePath(result.imagePath);
        };
        if (categoryId) {
            fetchData();
        }
    }, [categoryId, categoryIn, idIn]);

    return (
        <div class={`${containerClass || 'container-fluid'}`} style={containerStyle}>
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article)} */}

            <div class={`${rowClass || 'row'}`} style={rowStyle}>
                {artlist && artlist.map((art, idx) => {
                    const img = art.img && art.img.length > 0 ? art.img[0] : null;
                    return (
                        <div class={`position-relative ${colClass || 'col'}`} style={colStyle}>
                            {showImage == 1 && img && <>
                                <a href={art.url} class='stretched-link' target={linkTarget}>
                                    <img
                                        src={`https://${imageServer}/${imageSize}/${imagePath}/${img.src}`}
                                        class={imageClass}
                                        style={imageStyle}
                                    />
                                </a>
                            </>}
                                
                            {showTitle == 1 && <h5
                                class={titleClass}
                                style={titleStyle}
                            >
                                <a href={art.url} class='stretched-link' target={linkTarget}>
                                    {art.title}
                                </a>
                            </h5>}
                            {showIngress == 1 && <div 
                                class={ingressClass}
                                style={ingressStyle}
                            >
                                {art.teaser ? <>
                                    {art.teaser && <Markdown markdown={art.teaser} markdownOpts={MARKDOWN_OPTIONS} />}
                                </> : <>
                                    {art.ingress && <Markdown markdown={art.ingress} markdownOpts={MARKDOWN_OPTIONS} />}
                                </>}
                            </div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}