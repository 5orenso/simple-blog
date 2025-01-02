import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import querystring from 'querystring';
import putil from 'preact-util';
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

function getLang() {
    if (navigator.languages !== undefined) {
        return navigator.languages[0];
    }
    return navigator.language;
}

function formatDate(input, short) {
    const locale = getLang();
    const date = new Date(input);

    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (short) {
        options = {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: 'numeric'
        };
    }

    return date.toLocaleDateString(locale, options);
}

function getHeaderColStyles(col, sheet) {
    const meta = sheet.headersMeta[col];
    const { textFormat = {}, horizontalAlignment, verticalAlignment, backgroundColor = {} } = meta.userEnteredFormat || {};
    const { fontSize, bold, underline, strikethrough, italic, foregroundColor = {} } = textFormat;
    const { red: bgRed, green: bgGreen, blue: bgBlue } = backgroundColor;
    const { red: fgRed, green: fgGreen, blue: fgBlue } = foregroundColor;
    const bgColor = (bgRed || bgGreen || bgBlue) ? `rgb(${putil.normalizeBetween(bgRed || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(bgGreen || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(bgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
    const fgColor = (fgRed || fgGreen || fgBlue) ? `rgb(${putil.normalizeBetween(fgRed || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(fgGreen || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(fgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
    const { pixelSize: columnWidth } = meta.columnMeta;
    return {
        'color': fgColor,
        'background-color': bgColor,
        'font-size': `${fontSize ? `${fontSize}pt` : ''}`,
        'text-align': horizontalAlignment,
        'vertical-align': verticalAlignment,
        'font-weight': bold ? 'bold' : 'normal',
        'text-decoration-line': underline ? 'underline' : (strikethrough ? 'line-through' : 'none'),
        'font-style': italic ? 'italic' : 'none',
        // 'width': `${columnWidth}px`,
        // 'height': `${rowHeight}px`,
    };
}

function getColStyles({ col, row, rowIdx, sheet }) {
    const headerMeta = sheet.headersMeta[col];
    const meta = sheet.meta[rowIdx][col] || {};
    const { userEnteredFormat = {}, value, valueType, formattedValue, hyperlink, props = {} } = meta;
    const { textFormat = {}, horizontalAlignment, verticalAlignment, backgroundColor = {}, wrapStrategy } = userEnteredFormat;
    const { fontSize, bold, underline, strikethrough, italic, foregroundColor = {} } = textFormat;
    const { red: bgRed, green: bgGreen, blue: bgBlue } = backgroundColor;
    const { red: fgRed, green: fgGreen, blue: fgBlue } = foregroundColor;
    const bgColor = (bgRed || bgGreen || bgBlue) ? `rgb(${putil.normalizeBetween(bgRed || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(bgGreen || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(bgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
    const fgColor = (fgRed || fgGreen || fgBlue) ? `rgb(${putil.normalizeBetween(fgRed || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(fgGreen || 0, 0, 1, 0, 255)}, ${putil.normalizeBetween(fgBlue || 0, 0, 1, 0, 255)})` : 'inherit';
    const { pixelSize: columnWidth } = headerMeta.columnMeta;
    const { pixelSize: rowHeight } = props;
    return {
        'color': fgColor,
        'background-color': bgColor,
        'font-size': `${fontSize ? `${fontSize}pt` : ''}`,
        'text-align': horizontalAlignment,
        'vertical-align': verticalAlignment,
        'font-weight': bold ? 'bold' : 'normal',
        'text-decoration-line': underline ? 'underline' : (strikethrough ? 'line-through' : 'none'),
        'font-style': italic ? 'italic' : 'none',
        // 'width': `${columnWidth}px`,
        // 'height': `${rowHeight}px`,
        // 'overflow': `${wrapStrategy === 'OVERFLOW_CELL' ? 'visible' : 'inherit'}`,
    };
}

export default function App(props) {
    const { apiServer, jwtToken, articleId, sheetId, tableClass, className, style } = props;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState({});
    const [sheet, setSheet] = useState({});
    const [rowid, setRowId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({});
    const [apiResponse, setApiResponse] = useState({});
    const [invalidFields, setInvalidFields] = useState({});

    const googleSheetId = sheetId || article['form-sheetId'];
    const localStorageKey = `data-${googleSheetId}`;

    useEffect(() => {
        const data = localStorage.getItem(localStorageKey);
        if (data) {
            setInput(JSON.parse(data));
        }
    }, [googleSheetId])

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
                url: `/api/forms/${googleSheetId}`,
                settings: {
                    apiServer,
                },
            });
            setSheet(result);
        };
        if (googleSheetId) {
            fetchData();
        }
    }, [googleSheetId]);

    const onClickRow = useCallback((e) => {
        const { id } = e.target.closest('tr').dataset;
        setRowId(id);
    }, [rowid]);

    const onClickBack = useCallback((e) => {
        setRowId(0);
        setApiResponse({});
    }, [0]);

    const onInput = useCallback((e) => {
        const { name, value } = e.target;
        const { validation, removechars, help } = e.target.dataset;
        let newValue = value;
        if (name === 'email') {
            newValue = value.toLowerCase();
        }
        if (removechars) {
            const removeRegExp = new RegExp(`${removechars}`, 'g');
            newValue = `${newValue}`.replace(removeRegExp, '');
        }
        const newInput = { ...input };
        newInput[name] = newValue;
        setInput(newInput);
        if (googleSheetId) {
            localStorage.setItem(localStorageKey, JSON.stringify(newInput));
        }

        // Validate input
        if (validation) {
            const newInvalidFields = { ...invalidFields };
            if (validation === 'email') {
                if (putil.validateEmail(newValue)) {
                    e.target.classList.remove('is-invalid');
                    e.target.classList.add('is-valid');
                    delete newInvalidFields[name];
                } else {
                    e.target.classList.remove('is-valid');
                    e.target.classList.add('is-invalid');
                    newInvalidFields[name] = help;
                }
            } else {
                const regexp = new RegExp(`${validation}`);
                if (regexp.test(newValue)) {
                    e.target.classList.remove('is-invalid');
                    e.target.classList.add('is-valid');
                    delete newInvalidFields[name];
                } else {
                    e.target.classList.remove('is-valid');
                    e.target.classList.add('is-invalid');
                    newInvalidFields[name] = help;
                }
            }
            setInvalidFields(newInvalidFields);
        }
    }, [input]);

    const submitForm = useCallback(async () => {
        const postData = async () => {
            const result = await fetchApi({
                url: `/api/forms/${googleSheetId}`,
                body: {
                    ...input,
                },
                settings: {
                    apiServer,
                    method: 'POST',
                },
            });
            setApiResponse(result);
        };
        if (Object.keys(invalidFields).length === 0) {
            setLoading(true);
            await postData();
            setLoading(false);
        }
    }, [input, rowid]);

    if (apiResponse && apiResponse.status) {
        return <>
            <div class={`${article['form-class']} ${className}`} style={`${article['form-style']} ${style}`}>
                {apiResponse.status < 300 ? <>
                    <div class='alert alert-success' role='alert'>
                        <i class='fas fa-check text-success' /> Påmeldingen er mottatt.
                    </div>
                </> : <>
                    <div class='alert alert-danger' role='alert'>
                        <i class='fas fa-exclamation-triangle text-danger' /> {apiResponse.data}
                    </div>
                </>}
            </div>
        </>;
    }

    return (
        <div class={`${article['form-class']} row ${className}`} style={`${article['form-style']} ${style}`}>
            {/* <xmp>{JSON.stringify(input, null, 4)}</xmp> */}
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article['form-sheetId'])} */}
            {/* rowid: {rowid}<br /> */}

            {/* <xmp>{JSON.stringify(sheet.headers)}</xmp> */}
            {sheet && sheet.title ? <>
                {sheet.rows && sheet.rows.map((row, rowIdx) => {
                    if (row.type === 'headerRow') {
                        const values = row.values.split(',');
                        const titles = row.titles.split(',');
                        return <>
                            {(row.heading || row.description) && <div class='col-12'>
                                {row.heading && <h5 class='mt-5'>{row.heading}</h5>}
                                {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                            </div>}
                            <div class={'col-12'}>
                                <div class='row'>
                                    <div class={row.classes || 'col-3'}>
                                        {row.title && <label for={`${row.name}Input`}>{row.title}</label>}
                                    </div>
                                    {values && values.map((val, valIdx) => <div class={`${row.valueClasses || 'col-12'}`}>
                                        {titles[valIdx] || val}
                                    </div>)}
                                </div>
                            </div>
                        </>;
                    }

                    if (row.type === 'checkboxHorizontal') {
                        const values = row.values.split(',');
                        const titles = row.titles.split(',');
                        return <>
                            {(row.heading || row.description) && <div class='col-12'>
                                {row.heading && <h5 class='mt-5'>{row.heading}</h5>}
                                {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                            </div>}
                            <div class={'col-12'}>
                                <div class='row'>
                                    <div class={row.classes || 'col-3'}>
                                        {row.title && <label for={`${row.name}Input`}>{row.title}</label>}
                                    </div>
                                    {values && values.map((val, valIdx) => <div class={`${row.valueClasses || 'col-12'}`}>
                                        <div class={row.classes || 'col-3'}>
                                            <div class={`form-check`}>
                                                <input class='form-check-input' type='checkbox' name={`${row.name}-${val}`} checked={input[`${row.name}-${val}`] === '1' ? 'checked' : false} id={`${row.name}Input${val}`} value={1} onInput={onInput} />
                                                <label class='form-check-label' for={`${row.name}Input${val}`}>
                                                    {titles[valIdx]}
                                                </label>
                                            </div>
                                        </div>
                                    </div>)}
                                </div>
                                {row.help && <small id={`${row.name}Help`} class='form-text text-muted'>{row.help}</small>}
                            </div>
                        </>;
                    }

                    if (row.type === 'radio') {
                        const values = row.values.split(',');
                        const titles = row.titles.split(',');
                        return <>
                            {(row.heading || row.description) && <div class='col-12'>
                                {row.heading && <h5 class='mt-5'>{row.heading}</h5>}
                                {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                            </div>}
                            <div class={row.classes || 'col-12'}>
                                {row.title && <label for={`${row.name}Input`}>{row.title}</label>}
                                <div class='row'>
                                    {values && values.map((val, valIdx) => <div class={`${row.valueClasses || 'col-12'}`}>
                                        <div class={`form-check`}>
                                            <input class='form-check-input' type='radio' name={`${row.name}-${val}`} checked={input[`${row.name}-${val}`] === '1' ? 'checked' : false} id={`${row.name}Input${val}`} value={1} onInput={onInput} />
                                            <label class='form-check-label' for={`${row.name}Input${val}`}>
                                                {titles[valIdx] || val}
                                            </label>
                                        </div>
                                    </div>)}
                                </div>
                                {row.help && <small id={`${row.name}Help`} class='form-text text-muted'>{row.help}</small>}
                            </div>
                        </>;
                    }

                    if (row.type === 'select') {
                        const values = row.values.split(',');
                        const titles = row.titles.split(',');
                        return <>
                            {(row.heading || row.description) && <div class='col-12'>
                                {row.heading && <h5 class='mt-5'>{row.heading}</h5>}
                                {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                            </div>}
                            <div class={row.classes || 'col-12'}>
                                <div class='form-group'>
                                    <label for={`${row.name}Input`}>{row.title}</label>
                                    <select id={`${row.name}Input`} class='form-control' onInput={onInput} name={row.name}>
                                        <option selected>-- velg --</option>
                                        {values && values.map((val, valIdx) => <>
                                            <option value={val} selected={input[row.name] === val ? 'selected' : false}>{titles[valIdx] || val}</option>
                                        </>)}
                                    </select>
                                    {row.help && <small id={`${row.name}Help`} class='form-text text-muted'>{row.help}</small>}
                                </div>
                            </div>
                        </>;
                    }

                    if (row.type === 'checkbox') {
                        const values = row.values.split(',');
                        const titles = row.titles.split(',');
                        return <>
                            {(row.heading || row.description) && <div class='col-12'>
                                {row.heading && <h5 class='mt-5'>{row.heading}</h5>}
                                {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                            </div>}
                            <div class={row.classes || 'col-12'}>
                                {row.title && <label for={`${row.name}Input`}>{row.title}</label>}
                                <div class='row'>
                                    {values && values.map((val, valIdx) => <div class={`${row.valueClasses || 'col-12'}`}>
                                        <div class={`form-check`}>
                                            <input class='form-check-input' type='checkbox' name={`${row.name}-${val}`} checked={input[`${row.name}-${val}`] === '1' ? 'checked' : false} id={`${row.name}Input${val}`} value={1} onInput={onInput} />
                                            <label class='form-check-label' for={`${row.name}Input${val}`}>
                                                {titles[valIdx] || val}
                                            </label>
                                        </div>
                                    </div>)}
                                </div>
                                {row.help && <small id={`${row.name}Help`} class='form-text text-muted'>{row.help}</small>}
                            </div>
                        </>;
                    }

                    if (row.type === 'textarea') {
                        return <>
                            {(row.heading || row.description) && <div class='col-12'>
                                {row.heading && <h5 class='mt-5'>{row.heading}</h5>}
                                {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                            </div>}
                            <div class={row.classes || 'col-12'}>
                                {/* <xmp>{JSON.stringify(row)}</xmp> */}
                                <div class='form-group'>
                                    {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                                    <label for={`${row.name}Input`}>{row.title}</label>
                                    <textarea rows={5} class='form-control' id={`${row.name}Input`} name={row.name} value={input[row.name]} aria-describedby={`${row.name}Help`} onInput={onInput} data-validation={row.validation} data-removechars={row.removechars} data-help={row.helpvalidation} />
                                    {row.help && <small id={`${row.name}Help`} class='form-text text-muted'>{row.help}</small>}
                                </div>
                            </div>
                        </>;
                    }

                    return <>
                        {(row.heading || row.description) && <div class='col-12'>
                            {row.heading && <h5 class='mt-5'>{row.heading}</h5>}
                            {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                        </div>}
                        <div class={row.classes || 'col-12'}>
                            {/* <xmp>{JSON.stringify(row)}</xmp> */}
                            <div class='form-group'>
                                {row.description && <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />}
                                <label for={`${row.name}Input`}>{row.title}</label>
                                <input
                                    type={row.type}
                                    class='form-control'
                                    id={`${row.name}Input`}
                                    name={row.name}
                                    value={input[row.name]}
                                    aria-describedby={`${row.name}Help`}
                                    onInput={onInput}
                                    data-validation={row.validation}
                                    data-removechars={row.removechars}
                                    data-help={row.helpvalidation}
                                    min={row.min}
                                    max={row.max}
                                />
                                {row.help && <small id={`${row.name}Help`} class='form-text text-muted'>{row.help}</small>}
                                {invalidFields[row.name] && <div id={`validationFeedback${row.name}`} class='invalid-feedback'>
                                    {invalidFields[row.name]}
                                </div>}
                            </div>
                        </div>
                    </>;
                })}
                {loading && <>
                    <div class='d-flex justify-content-center py-3'>
                        <div class='spinner-border' role='status'>
                            <span class='sr-only'>Sender inn informasjonen...</span>
                        </div>
                        <div class='ml-3'>
                            Sender inn informasjonen...
                        </div>
                    </div>
                </>}
                <div class='col-12 mt-5'>
                    {invalidFields && Object.keys(invalidFields).length > 0 && <>
                        <div class='alert alert-danger' role='alert'>
                            <ul>
                                {Object.keys(invalidFields).map(field => <li>
                                    {invalidFields[field] || field}
                                </li>)}
                            </ul>
                        </div>
                    </>}
                    <button type='button' class={`btn btn-block btn-${(Object.keys(invalidFields).length >  0 || loading) ? 'secondary' : 'primary'} float-right`} onClick={submitForm} disabled={loading || Object.keys(invalidFields).length > 0}>
                        {Object.keys(invalidFields).length === 0 ? <>
                            Send inn skjema
                        </> : <>
                            Fyll inn feltene over...
                        </>}
                    </button>
                </div>
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
