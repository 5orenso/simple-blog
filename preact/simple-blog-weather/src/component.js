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

function windDirection(deg) {
    if (deg>11.25 && deg<33.75){
        return "NNE";
    }else if (deg>33.75 && deg<56.25){
        return "ENE";
    }else if (deg>56.25 && deg<78.75){
        return "E";
    }else if (deg>78.75 && deg<101.25){
        return "ESE";
    }else if (deg>101.25 && deg<123.75){
        return "ESE";
    }else if (deg>123.75 && deg<146.25){
        return "SE";
    }else if (deg>146.25 && deg<168.75){
        return "SSE";
    }else if (deg>168.75 && deg<191.25){
        return "S";
    }else if (deg>191.25 && deg<213.75){
        return "SSW";
    }else if (deg>213.75 && deg<236.25){
        return "SW";
    }else if (deg>236.25 && deg<258.75){
        return "WSW";
    }else if (deg>258.75 && deg<281.25){
        return "W";
    }else if (deg>281.25 && deg<303.75){
        return "WNW";
    }else if (deg>303.75 && deg<326.25){
        return "NW";
    }else if (deg>326.25 && deg<348.75){
        return "NNW";
    }
    return "N";
}

export default function App(props) {
    const { apiServer, place, lat, lon, altitude, className = '', style = '' } = props;

    const [weather, setWeather] = useState({});
    const [showWeather, setShowWeather] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/yr/?lat=${lat}&lon=${lon}&altitude=${altitude}`,
                settings: {
                    apiServer,
                },
            });
            setWeather(result.data);
        };
        if (lat && lon) {
            fetchData();
        }
    }, [lat, lon, altitude]);

    const onClickShowWeather = useCallback((e) => {
        setShowWeather(!showWeather);
    }, [showWeather]);

    if (showWeather) {
        return (
            <div class={`${className}`} style={`${style}`}>
                {weather && weather.length > 0 && <>
                    <div class='row' onClick={onClickShowWeather}>
                        {/* <xmp>{JSON.stringify(weather, null, 4)}</xmp> */}
                        <div class='col-12 mt-4'>
                            <h5>{place}</h5>
                        </div>
                        {weather && weather.length > 0 && weather.slice(0, 8).map(w => (
                            <div class='col-3 text-center my-4'>
                                <h5 class='text-muted'>{putil.isoTime(w.time)}</h5>
                                <img src={`${apiServer}/global/assets/svg/${putil.getNestedValue(w, 'next_1_hours.summary.symbol_code')}.svg`} /><br />
                                <nobr>
                                    <small>
                                        <i class='fas fa-temperature-low text-muted ml-1' />
                                    </small> {putil.getNestedValue(w, 'instant.details.air_temperature')} <span class='text-muted font-weight-lighter'>°C</span>
                                </nobr><br />
                                <small class='text-overflow'>
                                    {/* <i class='fas fa-compass text-muted ml-1' /> {mu.windDirection(util.getNestedValue(w, 'instant.details.wind_from_direction'))}<br /> */}
                                    <i class='fas fa-wind text-muted ml-1' /> {putil.getNestedValue(w, 'instant.details.wind_speed')}<span class='text-muted font-weight-lighter'>m/s</span> <span class='text-muted font-weight-lighter'>{windDirection(putil.getNestedValue(w, 'instant.details.wind_from_direction'))}</span><br />
                                    <i class='fas fa-cloud-rain text-muted ml-1' /> {putil.getNestedValue(w, 'next_1_hours.details.precipitation_amount')} <span class='text-muted font-weight-lighter'>mm</span><br />
                                    {/* <i class='fas fa-tint text-muted ml-1' /> {putil.getNestedValue(w, 'instant.details.relative_humidity')} <span class='text-muted'>%</span><br /> */}
                                </small>
                            </div>
                        ))}
                    </div>
                </>}
            </div>
        );
    }

    return (
        <div class={`${className}`} style={`${style}`}>
            {/* <xmp>{JSON.stringify(weather, null, 4)}</xmp> */}
            {weather && weather.length > 0 && <>
                {weather && weather.length > 0 && weather.slice(0, 1).map(w => <>
                    <div onClick={onClickShowWeather}>
                        <nobr>
                            {place ? `${place}:` : ''}
                            <small class='font-weight-light text-muted'>{putil.isoTime(w.time)}</small>:
                            <img src={`${apiServer}/global/assets/svg/${putil.getNestedValue(w, 'next_1_hours.summary.symbol_code')}.svg`}
                                class='ml-2'
                                style='height: 20px;'
                            />
                            {putil.getNestedValue(w, 'next_1_hours.details.precipitation_amount') > 0 && <small class='ml-2'>
                                {putil.getNestedValue(w, 'next_1_hours.details.precipitation_amount')}<span class='text-muted font-weight-lighter'>mm</span>
                            </small>}
                            <small class='ml-2'>
                                <i class='fas fa-temperature-low text-muted' /> {putil.getNestedValue(w, 'instant.details.air_temperature')}<span class='text-muted font-weight-lighter'>°C</span>
                            </small> 
                            <small class='ml-2'>
                                <i class='fas fa-wind text-muted' /> {putil.getNestedValue(w, 'instant.details.wind_speed')}<span class='text-muted font-weight-lighter'>m/s</span> <span class='text-muted font-weight-lighter'>{windDirection(putil.getNestedValue(w, 'instant.details.wind_from_direction'))}</span>
                            </small> 
                        </nobr>
                    </div>
                </>)}
            </>}
        </div>
    );
}