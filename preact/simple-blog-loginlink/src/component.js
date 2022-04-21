import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
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
    const [apiResponse, setApiResponse] = useState({});

    const getLink = useCallback(async () => {
        const postData = async () => {
            const result = await fetchApi({
                url: `/api/send-magic-link`,
                body: {},
                settings: {
                    apiServer,
                    method: 'POST',
                },
            });
            setApiResponse(result);
        };
        await postData();
    }, []);

    return (<>
        {apiResponse.status === 200 ? <>
            <i class='fas fa-check text-success' /> {apiResponse.title}
        </> : <>
            <button class='btn btn-link btn-sm' onClick={getLink}>
                Send a magic link 🎩 to login.
            </button>
        </>}
    </>);
}