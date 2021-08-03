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

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState({});
    const [doc, setDoc] = useState({});
    const [rowid, setRowId] = useState(0);
    const [currentSheet, setCurrentSheet] = useState(0);
    const [input, setInput] = useState({});
    const [apiResponse, setApiResponse] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/${articleId}`,
                settings: {
                    apiServer,
                },
            });
            setArticle(result.article);
            setImageServer(result.imageServer);
            setImagePath(result.imagePath);
        };
        if (articleId) {
            fetchData();
        }
    }, [articleId]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/sheets/${article['sheet-sheetId']}`,
                settings: {
                    apiServer,
                },
            });
            setDoc(result);
        };
        if (article['sheet-sheetId']) {
            fetchData();
        }
    }, [article['sheet-sheetId']]);

    const onClickRow = useCallback((e) => {
        const { id } = e.target.closest('tr').dataset;
        setRowId(id);
    }, [rowid]);
 
    const onClickTab = useCallback((e) => {
        const { idx } = e.target.closest('button').dataset;
        setCurrentSheet(parseInt(idx, 10));
    }, [rowid]);

    const onClickBack = useCallback((e) => {
        setRowId(0);
        setApiResponse({});
    }, [0]);

    return (
        <div class={`${article['sheet-class']}`} style={`${article['sheet-style']}`}>
            {/* {JSON.stringify(doc, null, 4)} */}
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article['sheet-sheetId'])} */}
            {/* rowid: {rowid}<br /> */}

            {doc && doc.title ? <>
                <h3>{doc.title}</h3>
                <div class='mb-2'>
                    <ul class='nav nav-pills'>
                        {doc.sheets && doc.sheets.map((sheet, idx) => <>
                            <li class='nav-item mr-3'>
                                <button class={`btn nav-link ${currentSheet === idx ? 'active' : ''}`} data-idx={idx} onClick={onClickTab}>{sheet.title}</button>
                            </li>
                        </>)}
                    </ul>
                </div>

                {doc.sheets && doc.sheets.map((sheet, idx) => {
                    if (currentSheet !== idx) {
                        return '';
                    }
                    return (<>
                        <div class='table-responsive'>
                            {/* <xmp>{JSON.stringify(sheet.headers)}</xmp> */}
                            <table class={`table ${article['sheet-table-class']}`}>
                                <thead>
                                    <tr>
                                        {sheet.headers && sheet.headers.map(col => <th>
                                        {col}
                                        </th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sheet.rows && sheet.rows.map(row => <>
                                        <tr onClick={onClickRow} data-id={row.id} style='cursor: pointer;'>
                                            {sheet.headers && sheet.headers.map(col => <td>
                                                {row[col]}
                                            </td>)}
                                        </tr>
                                    </>)}
                                </tbody>
                            </table>
                        </div>
                    </>);
                })}
            </> : <>
                <div class='d-flex justify-content-center py-3'>
                    <div class='spinner-border' role='status'>
                        <span class='sr-only'>Loading...</span>
                    </div>
                </div>
            </>}
        </div>
    );
}