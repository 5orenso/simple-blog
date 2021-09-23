import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

export default function App(props) {
    const { className = '', style = '' } = props;

    const [disableCookies, setDisableCookies] = useState(getCookie('disableCookies'));

    const onClickToggleCookie = useCallback((e) => {
        const newValue = disableCookies === 'yes' ? null : 'yes';
        setDisableCookies(newValue);
        createCookie('disableCookies', newValue, 30);
    }, [disableCookies]);

    return (
        <div class={`${className}`} style={`${style}`}>
            <button
                class={`btn btn-sm ${disableCookies === 'yes' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={onClickToggleCookie}
            >
                {disableCookies === 'yes' ? <>
                    <i class='fas fa-cookie-bite' /> Enable tracking cookies
                </> : <>
                    <i class='fas fa-cookie-bite' /> Disable tracking cookies
                </>}
            </button>
        </div>
    );
}