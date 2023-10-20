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

const FIELDS = {
    email: {
        validation: 'email',
        help: 'E-post adressen er ikke gyldig. Sjekk at du har skrevet den riktig.',
        required: true,
    },
    cellphone: {
        // validation: '^(0047|\\\+47|47)?[2-9]\\\d{7}$',
        validation: '^\\\+?[0-9]{8,}$',
        removechars: '[ a-zA-Z]',
        help: 'Mobilnummer er ikke gyldig. Sjekk at du har skrevet det riktig.',
        required: true,
    },
    firstname: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Fornavnet er ikke gyldig. Må være minst 2 bokstaver langt.',
        required: true,
    },
    lastname: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Etternavnet er ikke gyldig. Må være minst 2 bokstaver langt.',
        required: true,
    },
    childname: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Barnets navn er ikke gyldig. Må være minst 2 bokstaver langt.',
        required: true,
    },
    childbirth: {
        required: true,
    },
    address: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Adressen er ikke gyldig. Må være minst 2 bokstaver langt.',
    },
    team: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Team er ikke gyldig. Må være minst 2 bokstaver langt.',
    },
    club: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Klubb er ikke gyldig. Må være minst 2 bokstaver langt.',
    },
    postalplace: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Stedsnavn er ikke gyldig. Må være minst 2 bokstaver langt.',
    },
    postalcode: {
        validation: '^\d{4}$',
        removechars: null,
        help: 'Postnummer er ikke gyldig. Må være kun 4 tall.',
    },
    country: {
        validation: '^.{2,}$',
        removechars: null,
        help: 'Land er ikke gyldig. Må være minst 2 bokstaver langt.',
    },
};

function hasAllFields(object, fields) {
    // const fields = Object.keys(FIELDS);
    const isMissingInfo = fields.some((field) => {
        if (FIELDS[field].required && !object[field]) {
            return true;
        }
        return false;
    });
    return !isMissingInfo;
}

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
    const {
        apiServer,
        jwtToken,
        articleId,
        sheetId,
        fields = 'email,cellphone,firstname,lastname,childname,childbirth,address,postalplace',
        participantsFields = 'name,country,team,club',
        // fields = 'email,cellphone,firstname,lastname,address,postalplace,team,club,country',
        showParticipants = false,
        showSendEmail = false,
        tableClass,
        className,
        style,
    } = props;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState({});
    const [sheet, setSheet] = useState({});
    const [rowid, setRowId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [viewParticipants, toggleParticipants] = useState(false);
    const [viewEmail, toggleEmail] = useState(false);
    const [isOkToSubmit, setIsOkToSubmit] = useState(false);
    const [input, setInput] = useState({});
    const [emailInput, setEmailInput] = useState({
        body: 'Hei [:firstname],\n\nTakk for at du ...\n\nMvh,\nSimple Blog',
    });
    const [apiResponse, setApiResponse] = useState({});
    const [invalidFields, setInvalidFields] = useState({});

    const googleSheetId = sheetId || article['booking-sheetId'];
    const parsedFields = fields.split(',').map(f => f.trim());
    const parsedParticipantsFields = participantsFields.split(',').map(f => f.trim());

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/${articleId}`,
                settings: {
                    apiServer,
                },
                body: {
                    cacheContent: true,
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
                url: `/api/bookings/${googleSheetId}`,
                settings: {
                    apiServer,
                },
                body: {
                    cacheContent: true,
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

    const onSendEmailInput = useCallback((e) => {
        const { value } = e.target;
        const { name } = e.target.dataset;
        setEmailInput({ ...emailInput, [name]: value });
    }, [emailInput]);

    const onInput = useCallback((e) => {
        const { name, value } = e.target;
        const { validation, removechars } = e.target.dataset;
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
        // Check all required fields
        setIsOkToSubmit(hasAllFields(newInput, parsedFields));

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
                    newInvalidFields[name] = true;
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
                    newInvalidFields[name] = true;
                }
            }
            setInvalidFields(newInvalidFields);
        }
    }, [input]);

    const onBlur = useCallback(async () => {
        const postData = async () => {
            const result = await fetchApi({
                url: `/api/bookings/log/${googleSheetId}`,
                body: {
                    ...input,
                    course: rowid,
                },
                settings: {
                    apiServer,
                    method: 'POST',
                },
            });
        };
        await postData();
    }, [input, rowid]);

    const submitForm = useCallback(async () => {
        const postData = async () => {
            const result = await fetchApi({
                url: `/api/bookings/${googleSheetId}`,
                body: {
                    ...input,
                    course: rowid,
                },
                settings: {
                    apiServer,
                    method: 'POST',
                },
            });
            setApiResponse(result);
        };
        if (input.email && putil.validateEmail(input.email) && Object.keys(invalidFields).length === 0) {
            setLoading(true);
            await postData();
            setLoading(false);
        }
    }, [input, rowid]);

    const submitSendEmailForm = useCallback(async () => {
        const postData = async () => {
            const result = await fetchApi({
                url: `/api/bookings/sendemail/${googleSheetId}`,
                body: {
                    ...emailInput,
                },
                settings: {
                    apiServer,
                    method: 'POST',
                },
            });
            setApiResponse(result);
        };
        if (emailInput.field && emailInput.body) {
            setLoading(true);
            await postData();
            setLoading(false);
        }
    }, [emailInput]);

    if (rowid && sheet.rows) {
        const row = sheet.rows.find(e => e.id === rowid);

        return (
            <div class={`${article['booking-class']} ${className}`} style={`${article['booking-style']} ${style}`}>
                <button class='btn btn-link btn-lg rounded-circle' type='button' onClick={onClickBack}><i class='fas fa-arrow-left' /> Tilbake</button>
                {row.photo && <>
                    <div>
                        <img class='img-fluid w-100' src={row.photo} />
                    </div>
                </>}
                <h2>
                    <Markdown markdown={`${row.name}`} markdownOpts={MARKDOWN_OPTIONS} />
                </h2>
                <div>
                    <span class='font-weight-lighter'><i class='fas fa-calendar-alt text-muted' /> Dato:</span> {formatDate(row['date from'])} - {formatDate(row['date to'])}
                </div>
                <div class='mt-3'>
                    <span class='font-weight-lighter'><i class='fas fa-file-alt text-muted' /> Beskrivelse:</span><br/>
                    <Markdown markdown={`${row.description}`} markdownOpts={MARKDOWN_OPTIONS} />
                </div>
                {row.address && <>
                    <div class='mt-3'>
                        <span class='font-weight-lighter'><i class='fas fa-map-marked-alt text-muted' /> Sted:</span><br/>
                        <Markdown markdown={`${row.address}`} markdownOpts={MARKDOWN_OPTIONS} />
                        {row.postalcode && <>{row.postalcode} {row.postalplace}<br/></>}
                    </div>
                </>}
                <div class='mt-3'>
                    <span class='font-weight-lighter'>Antall plasser:</span> {row['total seats']}<br/>
                    <span class='font-weight-lighter'>Ledige plasser:</span> {row['free seats']}<br />
                </div>

                {apiResponse && apiResponse.status ? <>
                    {apiResponse.status < 300 ? <>
                        <div class='alert alert-success' role='alert'>
                            <i class='fas fa-check text-success' /> Påmeldingen er mottatt.
                        </div>
                    </> : <>
                        <div class='alert alert-danger' role='alert'>
                            <i class='fas fa-exclamation-triangle text-danger' /> {apiResponse.data}
                        </div>
                    </>}
                </> : <>
                    {row['free seats'] > 0 ? <>
                        <h2 class='mt-5'><i class='fas fa-user-plus text-muted' /> Påmeldingskjema</h2>
                        <div class='row'>
                            {parsedFields.indexOf('email') > -1 && <div class='col-6 form-group'>
                                <label for='inputEmail'><i class='fas fa-at text-muted' /> E-post</label>
                                <input type='email' class='form-control' id='inputEmail' aria-describedby='emailHelp' name='email' value={input.email} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.email.validation} data-removechars={FIELDS.email.removechars} />
                            </div>}
                            {parsedFields.indexOf('cellphone') > -1 && <div class='col-6 form-group'>
                                <label for='inputCellphone'><i class='fas fa-mobile-alt text-muted' /> Mobil</label>
                                <input type='tel' class='form-control' id='inputCellphone' name='cellphone' value={input.cellphone} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.cellphone.validation} data-removechars={FIELDS.cellphone.removechars} />
                            </div>}
                            {/* <div class='col-6 form-group'>
                                <label for='inputPassword'>Passord</label>
                                <input type='password' class='form-control' id='inputPassword' name='password' value={input.password} onInput={onInput} onBlur={onBlur} />
                            </div> */}
                        </div>
                        <div class='row'>
                            {parsedFields.indexOf('firstname') > -1 && <div class='col-6 form-group'>
                                <label for='inputFirstname'>Fornavn</label>
                                <input type='text' class='form-control' id='inputFirstname' name='firstname' value={input.firstname} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.firstname.validation} data-removechars={FIELDS.firstname.removechars} />
                                <small id='inputFirstnameHelp' class='form-text text-muted'>Ditt fornavn.</small>
                            </div>}
                            {parsedFields.indexOf('lastname') > -1 && <div class='col-6 form-group'>
                                <label for='inputLastname'>Etternavn</label>
                                <input type='text' class='form-control' id='inputLastname' name='lastname' value={input.lastname} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.lastname.validation} data-removechars={FIELDS.lastname.removechars} />
                                <small id='inputLastnameHelp' class='form-text text-muted'>Ditt etternavn.</small>
                            </div>}
                        </div>
                        <div class='row'>
                            {parsedFields.indexOf('childname') > -1 && <div class='col-6 form-group'>
                                <label for='inputChildname'><i class='fas fa-baby text-muted' /> Barnets navn</label>
                                <input type='text' class='form-control' id='inputChildname' name='childname' value={input.childname} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.childname.validation} data-removechars={FIELDS.childname.removechars} />
                                <small id='inputChildnameHelp' class='form-text text-muted'>Fullt navn på barnet som skal på kurs.</small>
                            </div>}
                            {parsedFields.indexOf('childbirth') > -1 && <div class='col-6 form-group'>
                                <label for='inputChildBirth'><i class='fas fa-birthday-cake text-muted' /> Barnets fødselsdato</label>
                                <input type='date' class='form-control' id='inputChildBirth' name='childbirth' value={input.childbirth} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.childbirth.validation} data-removechars={FIELDS.childbirth.removechars}  />
                            </div>}
                        </div>
                        <div class='row'>
                            {parsedFields.indexOf('team') > -1 && <div class='col-6 form-group'>
                                <label for='inputTeam'>Team</label>
                                <input type='text' class='form-control' id='inputTeam' name='team' value={input.team} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.team.validation} data-removechars={FIELDS.team.removechars} />
                                <small id='inputTeamHelp' class='form-text text-muted'>Navn på teamet ditt</small>
                            </div>}
                            {parsedFields.indexOf('club') > -1 && <div class='col-6 form-group'>
                                <label for='inputClub'>Klubb</label>
                                <input type='text' class='form-control' id='inputClub' name='club' value={input.club} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.club.validation} data-removechars={FIELDS.club.removechars} />
                                <small id='inputClubHelp' class='form-text text-muted'>Navn på klubb eller idrettslag</small>
                            </div>}
                        </div>
                        <div class='row'>
                            {parsedFields.indexOf('address') > -1 && <div class='col-12 form-group'>
                                <label for='inputAddress'>Adresse</label>
                                <input type='text' class='form-control' id='inputAddress' name='address' value={input.address} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.address.validation} data-removechars={FIELDS.address.removechars} />
                            </div>}
                        </div>
                        <div class='row'>
                            {parsedFields.indexOf('postalplace') > -1 && <div class='col-12 form-group'>
                                <label for='inputPostalcode'>Postnr-/sted</label>
                                <div class='row'>
                                    <div class='col-3'>
                                        <input type='text' class='form-control' id='inputPostalcode' name='postalcode' value={input.postalcode} onInput={onInput} onBlur={onBlur} cols='4' data-validation='^\d{4}$' data-removechars='[^0-9]' />
                                    </div>
                                    <div class='col-9'>
                                        <input type='text' class='form-control' name='postalplace' value={input.postalplace} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.postalplace.validation} data-removechars={FIELDS.postalplace.removechars} />
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div class='row'>
                            {parsedFields.indexOf('country') > -1 && <div class='col-12 form-group'>
                                <label for='inputCountry'>Land</label>
                                <input type='text' class='form-control' id='inputCountry' name='country' value={input.country} onInput={onInput} onBlur={onBlur} data-validation={FIELDS.country.validation} data-removechars={FIELDS.country.removechars} />
                            </div>}
                        </div>

                        {invalidFields && Object.keys(invalidFields).length > 0 && <>
                            <div class='alert alert-warning' role='alert'>
                                <ul>
                                    {Object.keys(invalidFields).map(field => <li>
                                        {FIELDS[field].help}
                                    </li>)}
                                </ul>
                            </div>
                        </>}

                        <button type='button' class={`btn btn-${isOkToSubmit ? 'primary' : 'secondary'} float-right`} onClick={submitForm} disabled={loading || !isOkToSubmit}>
                            {isOkToSubmit ? <>
                                Meld meg på!
                            </> : <>
                                Fyll inn feltene over...
                            </>}
                        </button>

                        {loading && <div class='d-flex justify-content-center py-3'>
                            <div class='spinner-border' role='status'>
                                <span class='sr-only'>Sender inn informasjonen...</span>
                            </div>
                            <div class='ml-3'>
                                Sender inn informasjonen...
                            </div>
                        </div>}
                    </> : <>
                        <div class='alert alert-danger text-center py-3 mt-3' role='alert'>
                            <i class='fas fa-exclamation-triangle' /> Dessverre fulltegnet.
                        </div>
                    </>}

                </>}
            </div>
        );
    }

    if (viewEmail) {
        return (<>
            <button type='button' class='btn btn-primary mb-3' onClick={() => toggleEmail(false)}>
                <i class='fas fa-chevron-left' /> Tilbake
            </button>

            {/* <div class='input-group mb-1'>
                <div class='input-group-prepend'>
                    <span class='input-group-text' id='basic-addon1'>Avsender</span>
                </div>
                <input type='text' class='form-control' placeholder='Username' aria-label='Username' aria-describedby='basic-addon1' />
            </div> */}

            {/* <xmp>{JSON.stringify(emailInput, null, 4)}</xmp> */}

            {sheet && sheet.title ? <>
                <div class='input-group mb-2'>
                    <div class='input-group-prepend'>
                        <label class='input-group-text' for='inputGroupSelect01'>Felt</label>
                    </div>
                    <select class='custom-select' id='inputGroupSelect01' data-name={'field'} onInput={onSendEmailInput}>
                        <option selected>Choose...</option>
                        {sheet?.participantsHeadersAll?.map(header => <option value={header}>{header}</option>)}
                    </select>
                </div>
                <div class='input-group mb-0'>
                    <div class='input-group-prepend'>
                        <span class='input-group-text' id='basic-addon1'>Verdi</span>
                    </div>
                    <input type='text' class='form-control' placeholder='Betalt' aria-label='Username' aria-describedby='basic-addon1' data-name={'value'} onInput={onSendEmailInput} />
                </div>
                <small id='emailHelp' class='form-text text-muted mb-2'>Tomt felt betyr alle som ikke har noe i valgte felt.</small>
            </> : <>
                <div class='d-flex justify-content-center py-3'>
                    <div class='spinner-border' role='status'>
                        <span class='sr-only'>Loading...</span>
                    </div>
                </div>
            </>}

            <div class='input-group mb-2'>
                <div class='input-group-prepend'>
                    <span class='input-group-text' id='basic-addon1'>Subject</span>
                </div>
                <input type='text' class='form-control' placeholder='' aria-label='' aria-describedby='basic-addon1' data-name={'subject'} onInput={onSendEmailInput} />
            </div>

            <div class='input-group mb-2'>
                <div class='input-group-prepend'>
                    <span class='input-group-text'>E-post</span>
                </div>
                <textarea class='form-control' aria-label='With textarea' rows={20} data-name={'body'} onInput={onSendEmailInput}>{emailInput.body}</textarea>
            </div>
            <small id='emailHelp' class='form-text text-muted mb-2'>Støtter tagger. Feks: [:firstname] [:lastname]</small>

            {apiResponse && apiResponse.status ? <>
                {apiResponse.status < 300 ? <>
                    <div class='alert alert-success' role='alert'>
                        <i class='fas fa-check text-success' /> E-post er sent<br />
                        {apiResponse?.emailRecipients?.length} mottakere<br />
                        <hr />
                        {apiResponse?.emailRecipients?.map(e => <div>{e.firstname} {e.lastname} ({e.email})</div>)}

                    </div>
                </> : <>
                    <div class='alert alert-danger' role='alert'>
                        <i class='fas fa-exclamation-triangle text-danger' /> {JSON.stringify(apiResponse, null, 4)}
                    </div>
                </>}
            </> : <>
                <button type='button' class='btn btn-block btn-success mb-4' onClick={submitSendEmailForm}>
                    <i class='fas fa-paper-plane' /> Send e-post
                </button>
            </>}


            <xmp>{JSON.stringify(apiResponse, null, 4)}</xmp>

        </>);
    }

    if (viewParticipants) {
        return (<>
            <button type='button' class='btn btn-primary' onClick={() => toggleParticipants(false)}>
                <i class='fas fa-chevron-left' /> Tilbake
            </button>

            {sheet && sheet.title ? <>
                {/* <xmp>{JSON.stringify(sheet.headers)}</xmp> */}
                {sheet.rows && sheet.rows.filter(e => e.visible == '1').map((row, rowIdx) => {
                    if (!row.id) {
                        return '';
                    }
                    return (<>
                        <div class='font-weight-bold text-center mb-2' style='font-size: 20px;'>
                            {row.name}
                            <span class='font-weight-light ml-2 float-right'>({row['free seats']}/{row['total seats']})</span>
                        </div>
                        <table class='table table-sm table-striped mb-5'>
                            <thead>
                                <tr>
                                    {parsedParticipantsFields.indexOf('startnumber') > -1 && <th>Startnr</th>}
                                    {parsedParticipantsFields.indexOf('name') > -1 && <th>Navn</th>}
                                    {parsedParticipantsFields.indexOf('country') > -1 && <th>country</th>}
                                    {parsedParticipantsFields.indexOf('team') > -1 && <th>team</th>}
                                    {parsedParticipantsFields.indexOf('club') > -1 && <th class='d-none d-lg-block'>club</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {sheet.participantsRows && sheet.participantsRows.filter(e => row.id === e.course).map((participant, participantIdx) => {
                                    return (<tr>

                                        {parsedParticipantsFields.indexOf('startnumber') > -1 && <td>{participant.startnumber}</td>}
                                        {parsedParticipantsFields.indexOf('name') > -1 && <td>{participant.firstname} {participant.lastname}</td>}
                                        {parsedParticipantsFields.indexOf('country') > -1 && <td>{participant.country}</td>}
                                        {parsedParticipantsFields.indexOf('team') > -1 && <td>{participant.team}</td>}
                                        {parsedParticipantsFields.indexOf('club') > -1 && <td class='d-none d-lg-block'>{participant.club}</td>}
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                        {/* {JSON.stringify(sheet.participantsRows.filter(e => row.id === e.course), null, 4)} */}
                    </>);
                })}
            </> : <>
                <div class='d-flex justify-content-center py-3'>
                    <div class='spinner-border' role='status'>
                        <span class='sr-only'>Loading...</span>
                    </div>
                </div>
            </>}

        </>);
    }

    return (
        <div class={`${article['booking-class']} ${className}`} style={`${article['booking-style']} ${style}`}>
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article['booking-sheetId'])} */}
            {/* rowid: {rowid}<br /> */}

            {showParticipants && <>
                <button type='button' class='btn btn-primary mb-2 float-right ml-2' onClick={() => toggleParticipants(true)}>
                    Vis deltakere <i class='fas fa-chevron-right' />
                </button>
            </>}
            {showSendEmail && <>
                <button type='button' class='btn btn-primary mb-2 float-right' onClick={() => toggleEmail(true)}>
                    Send e-post <i class='fas fa-chevron-right' />
                </button>
            </>}

            {sheet && sheet.title ? <>
                {/* <xmp>{JSON.stringify(sheet.headers)}</xmp> */}
                <table class={`table ${article['booking-table-class']} ${tableClass}`}>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th style={getHeaderColStyles('name', sheet)}>Arrangement</th>
                            <th class='text-center'>Dato</th>
                            <th class='text-right' style='width: 10%;'>Ledige plasser</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sheet.rows && sheet.rows.map((row, rowIdx) => {
                            if (!row.id) {
                                return '';
                            }
                            if (row.id === 'header') {
                                return (<>
                                    <tr>
                                        <td colspan='4' class='text-center'
                                            style={getColStyles({
                                                col: 'name',
                                                row,
                                                rowIdx,
                                                sheet
                                            })}
                                        >
                                            <span class='font-weight-bold'>{row.name}</span>
                                        </td>
                                    </tr>
                                </>);
                            }
                            const hasFreeSeats = row['free seats'] > 0;
                            return (<>
                                <tr onClick={onClickRow} data-id={row.id} style='cursor: pointer;'>
                                    <td class='py-1 px-1'
                                        style={getColStyles({
                                            col: 'name',
                                            row,
                                            rowIdx,
                                            sheet
                                        })}
                                    ><button class={`btn btn-sm btn-${hasFreeSeats ? 'success' : 'danger'} rounded-circle`}><i class='fas fa-arrow-right' /></button></td>
                                    <td class='py-1 px-1'
                                        style={getColStyles({
                                            col: 'name',
                                            row,
                                            rowIdx,
                                            sheet
                                        })}
                                    >
                                        <Markdown markdown={`${row.name}`} markdownOpts={MARKDOWN_OPTIONS} />
                                    </td>
                                    <td class='text-center py-1 px-1'
                                        style={getColStyles({
                                            col: 'name',
                                            row,
                                            rowIdx,
                                            sheet
                                        })}
                                    ><nobr>{formatDate(row['date from'], true)}</nobr> - <nobr>{formatDate(row['date to'], true)}</nobr></td>
                                    <td class='text-right py-1 px-1'
                                        style={getColStyles({
                                            col: 'name',
                                            row,
                                            rowIdx,
                                            sheet
                                        })}
                                    >{row['free seats']}</td>
                                </tr>
                            </>);
                        })}
                    </tbody>
                </table>
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
