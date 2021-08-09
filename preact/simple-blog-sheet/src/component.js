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
    const { apiServer, jwtToken, articleId, sheetId, tableClass, className, style, showDocTitle = false, limit, showSearch } = props;
    const tableClasses = tableClass ? tableClass.split(',').join(' ') : '';
    const classNames = className ? className.split(',').join(' ') : '';
    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState({});
    const [doc, setDoc] = useState({});
    const [rowid, setRowId] = useState(0);
    const [currentSheet, setCurrentSheet] = useState(0);
    const [page, setPage] = useState(1);
    const [input, setInput] = useState({});
    const [apiResponse, setApiResponse] = useState({});
    const [searchText, setSearchText] = useState('');

    const bgClasses = ['bg-success', 'bg-warning', 'bg-danger', 'bg-primary', 'bg-secondary'];
    const searchWords = searchText.trim().split(' ');
    const regexpList = searchWords.map(word => new RegExp(`(${word})`, 'i'));
    const replacer = (match, p1, offset, string) => {
        const stringWithoutHtml = string.replace(/<.+?>/g, '');
        const bgClass = searchWords.findIndex(e => e.toLowerCase() === p1.toLowerCase());
        if (stringWithoutHtml.match(new RegExp(p1, 'i'))) {
            return `<span class='${bgClasses[bgClass] || 'bg-secondary'} text-white'>${p1}</span>`;
        }
        return `${p1}`;
    }
    const replaceAllStrings = (string) => {
        let result = string;
        for (let i = 0, l = regexpList.length; i < l; i += 1) {
            const regexp = regexpList[i];
            result = result.replace(regexp, replacer);
        }
        return result;
    }

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
        setSearchText('');
        setPage(1);
    }, [rowid]);

    const onClickPage = useCallback((e) => {
        const { idx } = e.target.closest('button').dataset;
        setPage(parseInt(idx, 10));
    }, [page]);

    const onClickBack = useCallback((e) => {
        setRowId(0);
        setApiResponse({});
    }, [0]);

    const onInputSearch = useCallback((e) => {
        const { value } = e.target;
        setSearchText(value);
        setPage(1);
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
                    const searchFilter = searchText !== '' ? (row) => {
                        const results = regexpList.map((regexp) => {
                            for (let i = 0, l = sheet.headers.length; i < l; i += 1) {
                                const col = sheet.headers[i];
                                if (regexp.test(`${row[col]}`)) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (results.includes(false)) {
                            return false;
                        }
                        return true;
                    } : () => { return true };
                    const sheetRows = sheet.rows.filter(searchFilter);
                    let finalSheetRows = sheetRows;
                    const pageNumbers = [];
                    const totalPerPage = parseInt(article['sheet-limit'] || limit, 10);
                    if (article['sheet-limit'] || limit) {
                        for (let i = 1; i <= Math.ceil(sheetRows.length / totalPerPage); i++) {
                            pageNumbers.push(i);
                        }
                        // const pages = this.makePageArray(pageNumbers);
                        const startIdx = (page - 1) * totalPerPage;
                        const endIdx = page * totalPerPage;
                        finalSheetRows = sheetRows.slice(startIdx, endIdx);
                    }

                    if (currentSheet !== idx) {
                        return '';
                    }
                    return (<>
                        {(article['sheet-showSearch'] || showSearch) && <div class='mb-2'>
                            <div class='form-group row'>
                                <div class='col-6 offset-3'>
                                    <input type='text' class='form-control form-control-lg' placeholder={`Search inside "${sheet.title}"`} onInput={onInputSearch} value={searchText} />
                                </div>
                            </div>
                        </div>}

                        <div class='table-responsive'>
                            {/* <xmp>{JSON.stringify(sheet.headers)}</xmp> */}
                            <table class={`table ${article['sheet-table-class']} ${tableClasses}`} style={`table-layout: fixed;`}>
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
                                            const { pixelSize: columnWidth } = meta.columnMeta;

                                            return (<th style={{
                                                'color': fgColor,
                                                'background-color': bgColor,
                                                'font-size': `${fontSize ? `${fontSize}pt` : ''}`,
                                                'text-align': horizontalAlignment,
                                                'vertical-align': verticalAlignment,
                                                'font-weight': bold ? 'bold' : 'normal',
                                                'text-decoration-line': underline ? 'underline' : (strikethrough ? 'line-through' : 'none'),
                                                'font-style': italic ? 'italic' : 'none',
                                                'width': `${columnWidth}px`,
                                                // 'height': `${rowHeight}px`,
                                            }}>
                                                {col}
                                            </th>);
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {finalSheetRows && finalSheetRows.map((row, rowIdx) => <>
                                        <tr onClick={onClickRow} data-id={row.id}>
                                            {sheet.headers && sheet.headers.map((col) => {
                                                const headerMeta = sheet.headersMeta[col];
                                                const meta = sheet.meta[rowIdx][col] || {};
                                                // {
                                                //     'value': 'id',
                                                //     'valueType': 'stringValue',
                                                //     'formattedValue': 'id',
                                                //     'formula': null,
                                                //     'formulaError': null,
                                                //     'effectiveFormat': {
                                                //         'backgroundColor': {
                                                //             'red': 1,
                                                //             'green': 1,
                                                //             'blue': 1
                                                //         },
                                                //         'padding': {
                                                //             'top': 2,
                                                //             'right': 3,
                                                //             'bottom': 2,
                                                //             'left': 3
                                                //         },
                                                //         'horizontalAlignment': 'LEFT',
                                                //         'verticalAlignment': 'BOTTOM',
                                                //         'wrapStrategy': 'OVERFLOW_CELL',
                                                //         'textFormat': {
                                                //             'foregroundColor': {},
                                                //             'fontFamily': 'Arial',
                                                //             'fontSize': 10,
                                                //             'bold': true,
                                                //             'italic': false,
                                                //             'strikethrough': false,
                                                //             'underline': false,
                                                //             'foregroundColorStyle': {
                                                //                 'rgbColor': {}
                                                //             }
                                                //         },
                                                //         'hyperlinkDisplayType': 'PLAIN_TEXT',
                                                //         'backgroundColorStyle': {
                                                //             'rgbColor': {
                                                //                 'red': 1,
                                                //                 'green': 1,
                                                //                 'blue': 1
                                                //             }
                                                //         }
                                                //     }
                                                // }
                                                const { userEnteredFormat = {}, value, valueType, formattedValue, hyperlink, props = {} } = meta;
                                                const { textFormat = {}, horizontalAlignment, verticalAlignment, backgroundColor = {}, wrapStrategy } = userEnteredFormat;
                                                const { fontSize, bold, underline, strikethrough, italic, foregroundColor = {} } = textFormat;
                                                const { red: bgRed, green: bgGreen, blue: bgBlue } = backgroundColor;
                                                const { red: fgRed, green: fgGreen, blue: fgBlue } = foregroundColor;
                                                const bgColor = (bgRed || bgGreen || bgBlue) ? `rgb(${util.normalizeBetween(bgRed || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(bgGreen || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(bgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
                                                const fgColor = (fgRed || fgGreen || fgBlue) ? `rgb(${util.normalizeBetween(fgRed || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(fgGreen || 0, 0, 1, 0, 255)}, ${util.normalizeBetween(fgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
                                                const cellContent = row[col] || '';
                                                const content = searchText !== '' ? replaceAllStrings(cellContent) : cellContent;
                                                const { pixelSize: columnWidth } = headerMeta.columnMeta;
                                                const { pixelSize: rowHeight } = props;

                                                return (<td 
                                                    class='py-0 px-1'
                                                    style={{     
                                                        'color': fgColor,
                                                        'background-color': bgColor,
                                                        'font-size': `${fontSize ? `${fontSize}pt` : ''}`,
                                                        'text-align': horizontalAlignment,
                                                        'vertical-align': verticalAlignment,
                                                        'font-weight': bold ? 'bold' : 'normal',
                                                        'text-decoration-line': underline ? 'underline' : (strikethrough ? 'line-through' : 'none'),
                                                        'font-style': italic ? 'italic' : 'none',
                                                        'width': `${columnWidth}px`,
                                                        'height': `${rowHeight}px`,
                                                        // 'overflow': `${wrapStrategy === 'OVERFLOW_CELL' ? 'visible' : 'inherit'}`,
                                                    }}
                                                >
                                                    {hyperlink ? <>
                                                        <Markdown markdown={`<a href='${hyperlink}' target='_blank'>${content}</a>`} markdownOpts={MARKDOWN_OPTIONS} />
                                                    </> : <>
                                                        <Markdown markdown={`${content}`} markdownOpts={MARKDOWN_OPTIONS} />
                                                    </>}
                                                </td>);
                                            })}
                                        </tr>
                                    </>)}
                                </tbody>
                            </table>
                        </div>

                        {(article['sheet-limit'] || limit) && <div class='mt-2 d-flex justify-content-center'>
                            <nav class='text-center'>
                                <ul class='pagination pagination-lg mb-0'>
                                    {pageNumbers && pageNumbers.map(p => <>
                                        <li class={`page-item ${page === p ? 'active' : ''}`}>
                                            <button
                                                type='button'
                                                class={`btn btn-link page-link`}
                                                onClick={onClickPage}
                                                data-idx={p}
                                            >
                                                {p}
                                            </button>
                                        </li>
                                    </>)}
                                </ul>
                                <small class='text-muted'>
                                    Total: {sheetRows.length}
                                </small>
                            </nav>
                        </div>}

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