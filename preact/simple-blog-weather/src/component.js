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

function getTemperatureColor(temp) {
    if (temp <= 0) {
        return 'text-primary';
    } else {
        return 'text-danger';
    }
}

function getWindSpeedColor(speed) {
    if (speed > 10) {
        return 'text-warning';
    } else if (speed > 20) {
        return 'text-danger';
    } else {
        return '';
    }
}

export default function App(props) {
    const { apiServer, place, lat, lon, pt, altitude, className = '', style = '' } = props;

    const [weather, setWeather] = useState([]);
    const [weatherFormatted, setWeatherFormatted] = useState({});
    const [weatherKeys, setWeatherKeys] = useState([]);
    const [showWeather, setShowWeather] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let latitude = lat;
            let longitude = lon;
            if (pt) {
                const parts = pt.split(',');
                latitude = parts[0];
                longitude = parts[1];
            }
            const result = await fetchApi({
                url: `/api/yr/?lat=${latitude}&lon=${longitude}&altitude=${altitude}`,
                settings: {
                    apiServer,
                },
            });
            setWeather(result.data);
            const formatted = {};
            if (result.data) {
                for (let i = 0, l = result.data.length; i < l; i += 1) {
                    const { time, instant, next_6_hours } = result.data[i];
                    const nightRegexp = new RegExp('T00:00');
                    const morningRegexp = new RegExp('T06:00');
                    const dayRegexp = new RegExp('T12:00');
                    const eveningRegexp = new RegExp('T18:00');
                    const date = putil.isoDate(time, false, false, true);
                    if (!formatted[date]) {
                        formatted[date] = {
                            air_temperatures: [],
                            wind_speeds: [],
                            precipitation_amount: 0,
                        };
                    }
                    if (nightRegexp.test(time)) {
                        formatted[date].air_temperatures.push(putil.getNestedValue(instant, 'details.air_temperature'));
                        formatted[date].wind_speeds.push(putil.getNestedValue(instant, 'details.wind_speed'));
                        formatted[date].precipitation_amount += putil.getNestedValue(next_6_hours, 'details.precipitation_amount');
                        formatted[date].night = {
                            time,
                            instant,
                            next_6_hours,
                        };
                    }
                    if (morningRegexp.test(time)) {
                        formatted[date].air_temperatures.push(putil.getNestedValue(instant, 'details.air_temperature'));
                        formatted[date].wind_speeds.push(putil.getNestedValue(instant, 'details.wind_speed'));
                        formatted[date].precipitation_amount += putil.getNestedValue(next_6_hours, 'details.precipitation_amount');
                        formatted[date].morning = {
                            time,
                            instant,
                            next_6_hours,
                        };
                    }
                    if (dayRegexp.test(time)) {
                        formatted[date].air_temperatures.push(putil.getNestedValue(instant, 'details.air_temperature'));
                        formatted[date].wind_speeds.push(putil.getNestedValue(instant, 'details.wind_speed'));
                        formatted[date].precipitation_amount += putil.getNestedValue(next_6_hours, 'details.precipitation_amount');
                        formatted[date].day = {
                            time,
                            instant,
                            next_6_hours,
                        };
                    }
                    if (eveningRegexp.test(time)) {
                        formatted[date].air_temperatures.push(putil.getNestedValue(instant, 'details.air_temperature'));
                        formatted[date].wind_speeds.push(putil.getNestedValue(instant, 'details.wind_speed'));
                        formatted[date].precipitation_amount += putil.getNestedValue(next_6_hours, 'details.precipitation_amount');
                        formatted[date].evening = {
                            time,
                            instant,
                            next_6_hours,
                        };
                    }
                }
                const keys = Object.keys(formatted);
                setWeatherKeys(keys);
                console.log({ formatted });
                for (let i = 0, l = keys.length; i < l; i += 1) {
                     const key = keys[i];
                     const temperatures = formatted[key].air_temperatures;
                     const wind_speeds = formatted[key].wind_speeds;
                     formatted[key].air_temperatures_min = Math.min(...temperatures);
                     formatted[key].air_temperatures_max = Math.max(...temperatures);
                     formatted[key].wind_speeds_min = Math.min(...wind_speeds);
                     formatted[key].wind_speeds_max = Math.max(...wind_speeds);
                }
                setWeatherFormatted(formatted);
            }
        };
        if ((lat && lon) || pt) {
            fetchData();
        }
    }, [lat, lon, pt, altitude]);

    const onClickShowWeather = useCallback((e) => {
        setShowWeather(!showWeather);
    }, [showWeather]);

    if (showWeather) {
        return (
            <div class={`${className}`} style={`${style}`}>
                {weather && weather.length > 0 && <>
                    <div onClick={onClickShowWeather}>
                        {/* <xmp>{JSON.stringify(weather, null, 4)}</xmp> */}
                        {place && <div class='col-12 mt-4'>
                            <h5>{place}</h5>
                        </div>}
                        <div class='table-responsive'>
                            <table class='table table-striped table-sm'>
                                <thead>
                                    <tr>
                                        <th class='text-center'>&nbsp;</th>
                                        <th class='text-center'>Natt</th>
                                        <th class='text-center'>Morgen</th>
                                        <th class='text-center'>Ettermiddag</th>
                                        <th class='text-center'>Kveld</th>
                                        <th class='text-center'>Temp</th>
                                        <th class='text-center'>Nebør</th>
                                        <th class='text-center'>Wind</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weatherKeys && weatherKeys.map(date => <>
                                        <tr>
                                            <td class='text-center'>{date}</td>
                                            <td class='text-center'>{putil.getNestedValue(weatherFormatted[date].night, 'next_6_hours.summary.symbol_code') && <img style='width: 40px;' src={`${apiServer}/global/assets/svg/${putil.getNestedValue(weatherFormatted[date].night, 'next_6_hours.summary.symbol_code')}.svg`} />}</td>
                                            <td class='text-center'>{putil.getNestedValue(weatherFormatted[date].morning, 'next_6_hours.summary.symbol_code') && <img style='width: 40px;' src={`${apiServer}/global/assets/svg/${putil.getNestedValue(weatherFormatted[date].morning, 'next_6_hours.summary.symbol_code')}.svg`} />}</td>
                                            <td class='text-center'>{putil.getNestedValue(weatherFormatted[date].day, 'next_6_hours.summary.symbol_code') && <img style='width: 40px;' src={`${apiServer}/global/assets/svg/${putil.getNestedValue(weatherFormatted[date].day, 'next_6_hours.summary.symbol_code')}.svg`} />}</td>
                                            <td class='text-center'>{putil.getNestedValue(weatherFormatted[date].evening, 'next_6_hours.summary.symbol_code') && <img style='width: 40px;' src={`${apiServer}/global/assets/svg/${putil.getNestedValue(weatherFormatted[date].evening, 'next_6_hours.summary.symbol_code')}.svg`} />}</td>
                                            <td class='text-center'>
                                                <nobr>
                                                    <i class='fas fa-temperature-low text-muted ml-1' /> <span class={getTemperatureColor(putil.getNestedValue(weatherFormatted[date], 'air_temperatures_min'))}>{putil.format(putil.getNestedValue(weatherFormatted[date], 'air_temperatures_min'), 1)}</span> <span class='text-muted font-weight-lighter'>-</span> <span class={getTemperatureColor(putil.getNestedValue(weatherFormatted[date], 'air_temperatures_max'))}>{putil.format(putil.getNestedValue(weatherFormatted[date], 'air_temperatures_max'), 1)}</span> <span class='text-muted font-weight-lighter'>°C</span>
                                                </nobr>
                                            </td>
                                            <td class='text-center'>
                                                <nobr>
                                                    {putil.format(putil.getNestedValue(weatherFormatted[date], 'precipitation_amount'), 1)} <span class='text-muted font-weight-lighter'>mm</span>
                                                </nobr>
                                            </td>
                                            <td class='text-center'>
                                                <nobr>
                                                    <i class='fas fa-wind text-muted ml-1' /> <span class={getWindSpeedColor(putil.getNestedValue(weatherFormatted[date], 'wind_speeds_min'))}>{putil.format(putil.getNestedValue(weatherFormatted[date], 'wind_speeds_min'), 1)}</span> <span class='text-muted font-weight-lighter'>-</span> <span class={getWindSpeedColor(putil.getNestedValue(weatherFormatted[date], 'wind_speeds_max'))}>{putil.format(putil.getNestedValue(weatherFormatted[date], 'wind_speeds_max'), 1)}</span> <span class='text-muted font-weight-lighter'>m/s</span>
                                                </nobr>
                                            </td>
                                        </tr>
                                    </>)}
                                </tbody>
                            </table>
                        </div>
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
                            {place ? <span class='mr-2 font-weight-bold'>{place}:</span> : ''}
                            <span class='font-weight-light text-muted'>{putil.isoTime(w.time)}</span>:
                            <img src={`${apiServer}/global/assets/svg/${putil.getNestedValue(w, 'next_1_hours.summary.symbol_code')}.svg`}
                                class='ml-2'
                                style='height: 20px;'
                            />
                            {putil.getNestedValue(w, 'next_1_hours.details.precipitation_amount') > 0 && <span class='ml-2'>
                                {putil.getNestedValue(w, 'next_1_hours.details.precipitation_amount')}<span class='text-muted font-weight-lighter'>mm</span>
                            </span>}
                            <span class='ml-2'>
                                <i class='fas fa-temperature-low text-muted' /> {putil.getNestedValue(w, 'instant.details.air_temperature')}<span class='text-muted font-weight-lighter'>°C</span>
                            </span> 
                            <span class='ml-2'>
                                <i class='fas fa-wind text-muted' /> {putil.getNestedValue(w, 'instant.details.wind_speed')}<span class='text-muted font-weight-lighter'>m/s</span> <span class='text-muted font-weight-lighter'>{windDirection(putil.getNestedValue(w, 'instant.details.wind_from_direction'))}</span>
                            </span>

                            <button type='button' class='btn btn-sm btn-outline-primary ml-3 py-0'><i class='fas fa-info-circle' /> Detaljer</button>
                        </nobr>
                    </div>
                </>)}
            </>}
        </div>
    );
}