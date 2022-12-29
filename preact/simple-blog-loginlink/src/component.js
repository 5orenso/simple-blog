import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import querystring from 'querystring';
import putil from 'preact-util';

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

const FIELDS = {
    email: {
        validation: 'email',
        help: 'E-post adressen er ikke gyldig. Sjekk at du har skrevet den riktig.',
        required: true,
    },
};

export default function App(props) {
    const { apiServer, jwtToken, articleId } = props;
    const [apiResponse, setApiResponse] = useState({});
    const [input, setInput] = useState({});
    const [viewEmail, toggleEmail] = useState(false);
    const [invalidFields, setInvalidFields] = useState({});

    const getLink = useCallback(async () => {
        const postData = async (body) => {
            console.log({ body })
            const result = await fetchApi({
                url: `/api/send-magic-link`,
                body: {
                    ...body,
                },
                settings: {
                    apiServer,
                    method: 'POST',
                },
            });
            setApiResponse(result);
        };
        await postData(input);
    }, [input]);

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

    return (<>
        {apiResponse.status ? <>
            {apiResponse.status === 200 ? <>
                <i class='fas fa-check text-success' /> {apiResponse.title}
            </> : <>
                <i class='fas fa-times text-danger' /> {apiResponse.title}
            </>}
        </> : <>
            {viewEmail ? <>
                <div class='input-group mb-0'>
                    <input type='email' class='form-control' placeholder='Your email address' id='inputEmail' aria-describedby='emailHelp' name='email' value={input.email} onInput={onInput} data-validation={FIELDS.email.validation} data-removechars={FIELDS.email.removechars} />
                </div>
                <button class='btn btn-success btn-sm' onClick={getLink}>
                    Send a magic link 🎩 to login.
                </button>
            </> : <>
                <button class='btn btn-link btn-sm' onClick={() => toggleEmail(true)}>
                    Magic link 🎩
                </button>
            </>}
        </>}
    </>);
}