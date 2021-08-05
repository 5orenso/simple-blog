import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import querystring from 'querystring';
import util from 'preact-util';
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
    const { apiServer, jwtToken, articleId, sheetId, tableClass, className, style, showDocTitle = false } = props;
    const tableClasses = tableClass ? tableClass.split(',').join(' ') : '';
    const classNames = className ? className.split(',').join(' ') : '';
    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState({});
    const [doc, setDoc] = useState({});
    const [rowid, setRowId] = useState(0);
    const [currentSheet, setCurrentSheet] = useState(0);
    const [input, setInput] = useState({});
    const [apiResponse, setApiResponse] = useState({});

    const googleSheetId = sheetId || article['sheet-sheetId'];

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
                url: `/api/sheets/${googleSheetId}`,
                settings: {
                    apiServer,
                },
            });
            setDoc(result);
        };
        if (googleSheetId) {
            fetchData();
        }
    }, [googleSheetId]);

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
        <div class={`${article['sheet-class']} ${classNames}`} style={`${article['sheet-style']} ${style}`}>
            {/* {JSON.stringify(doc, null, 4)} */}
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article['sheet-sheetId'])} */}
            {/* rowid: {rowid}<br /> */}

            {doc && doc.title ? <>
                {(showDocTitle || article['sheet-showDocTitle']) && <h3>{doc.title}</h3>}
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
                            <table class={`table ${article['sheet-table-class']} ${tableClasses}`}>
                                <thead>
                                    <tr>
                                        {sheet.headers && sheet.headers.map((col) => {
                                            const meta = sheet.headersMeta[col];
                                            const { textFormat = {}, horizontalAlignment, verticalAlignment, backgroundColor = {} } = meta.userEnteredFormat || {};
                                            const { fontSize, bold, underline, strikethrough, italic, foregroundColor = {} } = textFormat;
                                            const { red: bgRed, green: bgGreen, blue: bgBlue } = backgroundColor;
                                            const { red: fgRed, green: fgGreen, blue: fgBlue } = foregroundColor;
                                            const bgColor = (bgRed || bgGreen || bgBlue) ? `rgb(${util.normalizeBetween(bgRed || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(bgGreen || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(bgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
                                            const fgColor = (fgRed || fgGreen || fgBlue) ? `rgb(${util.normalizeBetween(fgRed || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(fgGreen || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(fgBlue || 0, 0, 1, 0, 255)})` : 'inherit';

                                            return (<th style={{
                                                'color': fgColor,
                                                'background-color': bgColor,
                                                'font-size': `${fontSize ? `${fontSize}pt` : ''}`,
                                                'text-align': horizontalAlignment,
                                                'vertical-align': verticalAlignment,
                                                'font-weight': bold ? 'bold' : 'normal',
                                                'text-decoration-line': underline ? 'underline' : (strikethrough ? 'line-through' : 'none'),
                                                'font-style': italic ? 'italic' : 'none',
                                            }}>
                                                {col}
                                            </th>);
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sheet.rows && sheet.rows.map((row, rowIdx) => <>
                                        <tr onClick={onClickRow} data-id={row.id}>
                                            {sheet.headers && sheet.headers.map((col) => {
                                                const meta = sheet.meta[rowIdx][col] || {};
                                                // {
                                                //     "value": "id",
                                                //     "valueType": "stringValue",
                                                //     "formattedValue": "id",
                                                //     "formula": null,
                                                //     "formulaError": null,
                                                //     "effectiveFormat": {
                                                //         "backgroundColor": {
                                                //             "red": 1,
                                                //             "green": 1,
                                                //             "blue": 1
                                                //         },
                                                //         "padding": {
                                                //             "top": 2,
                                                //             "right": 3,
                                                //             "bottom": 2,
                                                //             "left": 3
                                                //         },
                                                //         "horizontalAlignment": "LEFT",
                                                //         "verticalAlignment": "BOTTOM",
                                                //         "wrapStrategy": "OVERFLOW_CELL",
                                                //         "textFormat": {
                                                //             "foregroundColor": {},
                                                //             "fontFamily": "Arial",
                                                //             "fontSize": 10,
                                                //             "bold": true,
                                                //             "italic": false,
                                                //             "strikethrough": false,
                                                //             "underline": false,
                                                //             "foregroundColorStyle": {
                                                //                 "rgbColor": {}
                                                //             }
                                                //         },
                                                //         "hyperlinkDisplayType": "PLAIN_TEXT",
                                                //         "backgroundColorStyle": {
                                                //             "rgbColor": {
                                                //                 "red": 1,
                                                //                 "green": 1,
                                                //                 "blue": 1
                                                //             }
                                                //         }
                                                //     }
                                                // }
                                                const { userEnteredFormat = {}, value, valueType, formattedValue, hyperlink } = meta;
                                                const { textFormat = {}, horizontalAlignment, verticalAlignment, backgroundColor = {} } = userEnteredFormat;
                                                const { fontSize, bold, underline, strikethrough, italic, foregroundColor = {} } = textFormat;
                                                const { red: bgRed, green: bgGreen, blue: bgBlue } = backgroundColor;
                                                const { red: fgRed, green: fgGreen, blue: fgBlue } = foregroundColor;
                                                const bgColor = (bgRed || bgGreen || bgBlue) ? `rgb(${util.normalizeBetween(bgRed || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(bgGreen || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(bgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
                                                const fgColor = (fgRed || fgGreen || fgBlue) ? `rgb(${util.normalizeBetween(fgRed || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(fgGreen || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(fgBlue || 0, 0, 1, 0, 255)})` : 'inherit';

                                                return (<td style={{     
                                                    'color': fgColor,
                                                    'background-color': bgColor,
                                                    'font-size': `${fontSize ? `${fontSize}pt` : ''}`,
                                                    'text-align': horizontalAlignment,
                                                    'vertical-align': verticalAlignment,
                                                    'font-weight': bold ? 'bold' : 'normal',
                                                    'text-decoration-line': underline ? 'underline' : (strikethrough ? 'line-through' : 'none'),
                                                    'font-style': italic ? 'italic' : 'none',
                                                }}>
                                                    {hyperlink ? <>
                                                        {meta.valueType === 'stringValue' ? <Markdown markdown={`<a href="${hyperlink}" target="_blank">${row[col]}</a>`} markdownOpts={MARKDOWN_OPTIONS} /> : <>{row[col]}</>}
                                                    </> : <>
                                                        {meta.valueType === 'stringValue' ? <Markdown markdown={row[col]} markdownOpts={MARKDOWN_OPTIONS} /> : <>{row[col]}</>}
                                                    </>}
                                                </td>);
                                            })}
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