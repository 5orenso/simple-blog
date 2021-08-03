import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import querystring from 'querystring';

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
    const { apiServer, jwtToken, articleId } = props;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState({});

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
    const scrollImages = (e) => {
        const totalImages = images.length - 1;

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

    return (
        <div class={`${article['gallery-class']}`} style={`${article['gallery-style']}`}>
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article)} */}

            <div class='w-100'>
                <div
                    class={`d-flex flex-row flex-nowrap border-top border-bottom ${article['gallery-class-photo'] || 'bg-dark'}`}
                    style='overflow: auto; scroll-snap-type: x mandatory;'
                    onScroll={scrollImages}
                >
                    {images && images.map((img, idx) => (
                        <div class='col-12 clearfix position-relative p-0'>
                            <div
                                class={`w-100 h-100 text-center rounded-lg imageContainer d-flex justify-content-center align-items-center`}
                                style={`
                                    scroll-snap-align: start;
                                    flex-wrap: wrap;
                                    overflow-y: hidden;
                                `}
                            >					
                                {img.src ? <img
                                    class='img-fluid'
                                    src={`https://${imageServer}/800x/${imagePath}/${img.src}`}
                                    loading='lazy'
                                    style={`max-height: 75vh; ${idx !== imageIdx ? '' : ''}`}
                                /> : <>
                                    <span class='display-1 text-muted'>
                                        <i class='fas fa-camera' />
                                    </span>
                                </>}
                                {img.title && <div class='position-absolute text-white font-weight-lighter px-3 w-100' style='bottom: 10px; background-color: rgba(0, 0, 0, 0.3)'>
                                    <strong>{img.title}</strong> {img.text}
                                </div>}
                                <div
                                    class='position-absolute text-white font-weight-lighter px-1 py-1 rounded-lg'
                                    style='top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.3); line-height: 0.6em;'
                                >
                                    <small><small>{idx + 1} / {images.length}</small></small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {images && images.length > 1 && <>
                    <div class='w-100 text-center'>
                        <small>
                            <small>
                                {images && images.map((img, idx) => <>
                                    <i class={`${idx === imageIdx ? 'fas' : 'far'} fa-circle mr-1`} />
                                </>)}
                            </small>
                        </small>
                    </div>
                </>}
            </div>

        </div>
    );
}