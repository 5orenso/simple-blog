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
    const { apiServer, jwtToken, articleId, sheetId, tableClass, className, style } = props;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [imageIdx, setImageidx] = useState({});
    const [sheet, setSheet] = useState({});
    const [rowid, setRowId] = useState(0);
    const [input, setInput] = useState({});
    const [apiResponse, setApiResponse] = useState({});

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
        const newInput = { ...input };
        newInput[name] = value;
        setInput(newInput);
    }, [input]);

    const submitForm = useCallback(() => {
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
        if (input.email) {
            postData();
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
                <h5>{row.name}</h5>
                <div>
                    <span class='font-weight-lighter'>Dato:</span> {row['date from']} - {row['date to']}
                </div>
                <div class='mt-3'>
                    <span class='font-weight-lighter'>Beskrivelse:</span><br/>
                    {row.description}
                </div>
                {row.address && <>
                    <div class='mt-3'>
                        <span class='font-weight-lighter'>Sted:</span><br/>
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
                            Påmeldingen er mottatt.
                        </div>
                    </> : <>
                        <div class='alert alert-danger' role='alert'>
                            Noe gikk feil: {apiResponse.data}
                        </div>
                    </>}
                </> : <>
                    <h5 class='mt-5'>Påmeldingskjema</h5>
                    <div class='row'>
                        <div class='col-6 form-group'>
                            <label for='inputEmail'>E-post</label>
                            <input type='email' class='form-control' id='inputEmail' aria-describedby='emailHelp' name='email' value={input.email} onInput={onInput} />
                            {/* <small id='emailHelp' class='form-text text-muted'>We'll never share your email with anyone else.</small> */}
                        </div>
                        <div class='col-6 form-group'>
                            <label for='inputCellphone'>Mobil</label>
                            <input type='text' class='form-control' id='inputCellphone' name='cellphone' value={input.cellphone} onInput={onInput}  />
                        </div>
                        {/* <div class='col-6 form-group'>
                            <label for='inputPassword'>Passord</label>
                            <input type='password' class='form-control' id='inputPassword' name='password' value={input.password} onInput={onInput} />
                        </div> */}
                    </div>
                    <div class='row'>
                        <div class='col-6 form-group'>
                            <label for='inputFirstname'>Fornavn</label>
                            <input type='text' class='form-control' id='inputFirstname' name='firstname' value={input.firstname} onInput={onInput}  />
                        </div>
                        <div class='col-6 form-group'>
                            <label for='inputLastname'>Etternavn</label>
                            <input type='text' class='form-control' id='inputLastname' name='lastname' value={input.lastname} onInput={onInput}  />
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-12 form-group'>
                            <label for='inputAddress'>Adresse</label>
                            <input type='text' class='form-control' id='inputAddress' name='address' value={input.address} onInput={onInput}  />
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-12 form-group'>
                            <label for='inputPostalcode'>Postnr-/sted</label>
                            <div class='row'>
                                <div class='col-3'>
                                    <input type='text' class='form-control' id='inputPostalcode' name='postalcode' value={input.postalcode} onInput={onInput} cols='4' />
                                </div>
                                <div class='col-9'>
                                    <input type='text' class='form-control' name='postalplace' value={input.postalplace} onInput={onInput}  />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type='button' class='btn btn-primary float-right' onClick={submitForm}>Meld meg på</button>
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
                            <th>Kurs</th>
                            <th class='text-center'>Dato</th>
                            <th class='text-center'>Ledige plasser</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sheet.rows && sheet.rows.map(row => <>
                            <tr onClick={onClickRow} data-id={row.id} style='cursor: pointer;'>
                                <td>{row.name}</td>
                                <td class='text-center'>{row['date from']} - {row['date to']}</td>
                                <td class='text-right'>{row['free seats']}/{row['total seats']}</td>
                            </tr>
                        </>)}
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