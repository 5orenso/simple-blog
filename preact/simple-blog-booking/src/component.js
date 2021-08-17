import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import querystring from 'querystring';
import putil from 'preact-util';

const FIELDS = {
    email: {
        validation: 'email',
        help: 'E-post adressen er ikke gyldig. Sjekk at du har skrevet den riktig.',
        required: true,
    },
    cellphone: {
        validation: '^(0047|\\\+47|47)?[2-9]\\\d{7}$',
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
};

function hasAllFields(object) {
    const fields = Object.keys(FIELDS);
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
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "numeric"
        };
    }

    return date.toLocaleDateString(locale, options);
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
    const [isOkToSubmit, setIsOkToSubmit] = useState(false);
    const [input, setInput] = useState({});
    const [apiResponse, setApiResponse] = useState({});
    const [invalidFields, setInvalidFields] = useState({});

    const googleSheetId = sheetId || article['booking-sheetId'];

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
                url: `/api/bookings/${googleSheetId}`,
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
        setIsOkToSubmit(hasAllFields(newInput));

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

    if (rowid && sheet.rows) {
        const row = sheet.rows.find(e => e.id === rowid);

        return (
            <div class={`${article['booking-class']} ${className}`} style={`${article['booking-style']} ${style}`}>
                {/* {JSON.stringify(images, null, 4)} */}
                {/* {JSON.stringify(article['booking-sheetId'])} */}
                {/* rowid: {rowid}<br /> */}
                <button class='btn btn-link' type='button' onClick={onClickBack}><i class='fas fa-arrow-left' /> Tilbake</button>
                {row.photo && <>
                    <div>
                        <img class='img-fluid w-100' src={row.photo} />
                    </div>
                </>}
                <h2>{row.name}</h2>
                <div>
                    <span class='font-weight-lighter'><i class='fas fa-calendar-alt' /> Dato:</span> {formatDate(row['date from'])} - {formatDate(row['date to'])}
                </div>
                <div class='mt-3'>
                    <span class='font-weight-lighter'><i class='fas fa-file-alt' /> Beskrivelse:</span><br/>
                    {row.description}
                </div>
                {row.address && <>
                    <div class='mt-3'>
                        <span class='font-weight-lighter'><i class='fas fa-map-marked-alt' /> Sted:</span><br/>
                        {row.address && <>{row.address}<br /></>}
                        {row.postalcode && <>{row.postalcode} {row.postalplace}<br/></>}
                    </div>
                </>}
                <div class='mt-3'>
                    <span class='font-weight-lighter'>Antall plasser:</span> {row['total seats']}<br/>
                    <span class='font-weight-lighter'>Ledige plasser:</span> {row['free seats']}
                </div>

                {apiResponse && apiResponse.status ? <>
                    {apiResponse.status < 300 ? <>
                        <div class='alert alert-success' role='alert'>
                            <i class='fas fa-check text-success' /> Påmeldingen er mottatt.
                        </div>
                    </> : <>
                        <div class='alert alert-warning' role='alert'>
                            <i class='fas fa-exclamation-triangle text-danger' /> Noe gikk feil: {apiResponse.data}
                        </div>
                    </>}
                </> : <>
                    <h2 class='mt-5'><i class='fas fa-user-plus' /> Påmeldingskjema</h2>
                    <div class='row'>
                        <div class='col-6 form-group'>
                            <label for='inputEmail'><i class='fas fa-at' /> E-post</label>
                            <input type='email' class='form-control' id='inputEmail' aria-describedby='emailHelp' name='email' value={input.email} onInput={onInput} data-validation={FIELDS.email.validation} data-removechars={FIELDS.email.removechars} />
                        </div>
                        <div class='col-6 form-group'>
                            <label for='inputCellphone'><i class='fas fa-mobile-alt' /> Mobil</label>
                            <input type='tel' class='form-control' id='inputCellphone' name='cellphone' value={input.cellphone} onInput={onInput} data-validation={FIELDS.cellphone.validation} data-removechars={FIELDS.cellphone.removechars} />
                        </div>
                        {/* <div class='col-6 form-group'>
                            <label for='inputPassword'>Passord</label>
                            <input type='password' class='form-control' id='inputPassword' name='password' value={input.password} onInput={onInput} />
                        </div> */}
                    </div>
                    <div class='row'>
                        <div class='col-6 form-group'>
                            <label for='inputFirstname'>Fornavn</label>
                            <input type='text' class='form-control' id='inputFirstname' name='firstname' value={input.firstname} onInput={onInput} data-validation={FIELDS.firstname.validation} data-removechars={FIELDS.firstname.removechars} />
                            <small id='inputFirstnameHelp' class='form-text text-muted'>Ditt fornavn.</small>
                        </div>
                        <div class='col-6 form-group'>
                            <label for='inputLastname'>Etternavn</label>
                            <input type='text' class='form-control' id='inputLastname' name='lastname' value={input.lastname} onInput={onInput} data-validation={FIELDS.lastname.validation} data-removechars={FIELDS.lastname.removechars} />
                            <small id='inputLastnameHelp' class='form-text text-muted'>Ditt etternavn.</small>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-6 form-group'>
                            <label for='inputChildname'><i class='fas fa-baby' /> Barnets navn</label>
                            <input type='text' class='form-control' id='inputChildname' name='childname' value={input.childname} onInput={onInput} data-validation={FIELDS.childname.validation} data-removechars={FIELDS.childname.removechars} />
                            <small id='inputChildnameHelp' class='form-text text-muted'>Fullt navn på barnet som skal på kurs.</small>
                        </div>
                        <div class='col-6 form-group'>
                            <label for='inputChildBirth'><i class='fas fa-birthday-cake' /> Barnets fødselsdato</label>
                            <input type='date' class='form-control' id='inputChildBirth' name='childbirth' value={input.childbirth} onInput={onInput} data-validation={FIELDS.childbirth.validation} data-removechars={FIELDS.childbirth.removechars}  />
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-12 form-group'>
                            <label for='inputAddress'>Adresse</label>
                            <input type='text' class='form-control' id='inputAddress' name='address' value={input.address} onInput={onInput} data-validation={FIELDS.address.validation} data-removechars={FIELDS.address.removechars} />
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-12 form-group'>
                            <label for='inputPostalcode'>Postnr-/sted</label>
                            <div class='row'>
                                <div class='col-3'>
                                    <input type='text' class='form-control' id='inputPostalcode' name='postalcode' value={input.postalcode} onInput={onInput} cols='4' data-validation='^\d{4}$' data-removechars='[^0-9]' />
                                </div>
                                <div class='col-9'>
                                    <input type='text' class='form-control' name='postalplace' value={input.postalplace} onInput={onInput} data-validation={FIELDS.postalplace.validation} data-removechars={FIELDS.postalplace.removechars} />
                                </div>
                            </div>
                        </div>
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

                </>}
            </div>
        );
    }

    return (
        <div class={`${article['booking-class']} ${className}`} style={`${article['booking-style']} ${style}`}>
            {/* {JSON.stringify(images, null, 4)} */}
            {/* {JSON.stringify(article['booking-sheetId'])} */}
            {/* rowid: {rowid}<br /> */}

            {sheet && sheet.title ? <>
                {/* <xmp>{JSON.stringify(sheet.headers)}</xmp> */}
                <table class={`table ${article['booking-table-class']} ${tableClass}`}>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Kurs</th>
                            <th class='text-center'>Dato</th>
                            <th class='text-center'>Ledige plasser</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sheet.rows && sheet.rows.map((row) => {
                            if (!row.id) {
                                return '';
                            }
                            return (<>
                                <tr onClick={onClickRow} data-id={row.id} style='cursor: pointer;'>
                                    <td><button class='btn btn-sm btn-success'><i class='fas fa-arrow-right' /></button></td>
                                    <td>{row.name}</td>
                                    <td class='text-center'>{formatDate(row['date from'], true)} - {formatDate(row['date to'], true)}</td>
                                    <td class='text-right'>{row['free seats']}/{row['total seats']}</td>
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