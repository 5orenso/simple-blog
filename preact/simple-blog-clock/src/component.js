import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import querystring from 'querystring';

function pad(number) {
    let r = String(number);
    if (r.length === 1) {
        r = `0${r}`;
    }
    return r;
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

function getDateParts({ showDateOnly, showSeconds, showTimezone, showClockOnly }) {
    const now = new Date();
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const yy = now.getFullYear();
    const hh = now.getHours();
    const mi = now.getMinutes();
    const ss = now.getSeconds();
    const tzo = -now.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';

    let ret = `${pad(yy)}-${pad(mm)}-${pad(dd)}`;
    if (showClockOnly) {
        ret = '';
    }
    if (!showDateOnly) {
        ret += ` ${pad(hh)}:${pad(mi)}`;
        if (showSeconds) {
            ret += `:${pad(ss)}`;
        }
        if (showTimezone) {
            ret += `${dif}${tzo}`;
        }
    }
    return ret;
}

function calculateTimeLeft({ countdownto }) {
    let year = new Date().getFullYear();
    const difference = +new Date(`${countdownto}`) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            d: Math.floor(difference / (1000 * 60 * 60 * 24)),
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60),
        };
    } else {
        timeLeft = {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
        };
    }
    return timeLeft;
}

export default function App(props) {
    const { apiServer, jwtToken, articleId } = props;

    const [article, setArticle] = useState({});
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
            })
            setArticle(result.article);
        };
        if (articleId) {
            fetchData();
        }
    }, [articleId]);

    const { countdownto = article['clock-countdownto'], showDateOnly = false, showSeconds = true, showTimezone = false, showClockOnly = false } = props;
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft({ countdownto }));
    const [timeNow, setTimeNow] = useState(getDateParts({ showDateOnly, showSeconds, showTimezone, showClockOnly }));

    const timerComponents = [];
    if (countdownto) {
        useEffect(() => {
            setTimeout(() => {
                setTimeLeft(calculateTimeLeft({ countdownto }));
            }, 1000);
        });

        Object.keys(timeLeft).forEach((interval) => {
            if (timerComponents.length === 0 && !timeLeft[interval]) {
                return;
            }
            timerComponents.push(<span>
                {timeLeft[interval]}<span class='text-muted font-weight-lighter'>{interval}</span>{" "}
            </span>);
        });
    } else {
        useEffect(() => {
            setTimeout(() => {
                setTimeNow(getDateParts({ showDateOnly, showSeconds, showTimezone, showClockOnly }));
            }, 1000);
        });
    }

    return (
        <div class={`${article['clock-class']}`} style={`${article['clock-style']}`}>
            {countdownto ? <>
                {timerComponents.length ? timerComponents : ''}
            </> : <>
                {timerComponents.length ? timerComponents : <span>{timeNow}</span>}
            </>}
            {/* {JSON.stringify(article)} */}
        </div>
    );
}