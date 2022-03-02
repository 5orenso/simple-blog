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
    const { apiServer, jwtToken, categoryId, start, end, size = '220x', className = '', style = '' } = props;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState(0);
    const [autoscroll, setAutoscroll] = useState(true);
    const imageScrollerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/?category${categoryId}`,
                settings: {
                    apiServer,
                },
            })
            setArticle(result.article);
            setImageServer(result.imageServer);
            setImagePath(result.imagePath);
        };
        if (categoryId) {
            fetchData();
        }
    }, [categoryId]);

    const { img: images = [] } = article;

    return (
        <div class={`position-relative ${article['gallery-class']} ${className}`} style={`${article['gallery-style']} ${style}`}>
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article)} */}

            <div class={`w-100 ${article['gallery-wrapper-class']}`}>
                {images && images.map((img, idx) => (
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
        </div>
    );
}