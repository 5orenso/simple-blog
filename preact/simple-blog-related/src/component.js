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
    const { apiServer, jwtToken, categoryId, start, end, size = '220x', 
        containerClass = '',
        rowClass = '',
        colClass = '',
        containerStyle = '',
        rowStyle = '',
        colStyle = '',
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
                url: `/api/article/?category${categoryId}`,
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
    }, [categoryId]);

    return (
        <div class={`${containerClass || 'container-fluid'}`} style={containerStyle}>
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article)} */}

            <div class={`${rowClass || 'row'}`} style={rowStyle}>
                {artlist && artlist.map((art, idx) => (
                    <div class={`${colClass || 'col'}`} style={colStyle}>
                        {art.title}
                    </div>
                ))}
            </div>
        </div>
    );
}