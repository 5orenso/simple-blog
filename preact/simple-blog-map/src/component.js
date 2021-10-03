import { h } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import querystring from 'querystring';
import util from 'preact-util';

import Map from './map/';
import appState from '../lib/appstate';

import "./style.css";

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
    const { apiServer, jwtToken, articleId, fileIdx = 0, className = '', style = '', mapHeight = 600 } = props;
    const { mapColorMode, mapRangeMin, mapRangeMax, isCordova, hasShareApi } = appState;

    const [article, setArticle] = useState({});
    const [imageServer, setImageServer] = useState({});
    const [imagePath, setImagePath] = useState({});
    const [waypoints, setWaypoints] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/${articleId}`,
                settings: {
                    apiServer,
                },
            })
            setArticle(result.article);
            setImageServer(result.imageServer);
            setImagePath(result.imagePath);

            const gpx = util.asObject(result, 'article', 'img', fileIdx, 'gpx');
            if (gpx && gpx.wpt) {
                const wpts = gpx.wpt.map(wp => ({
                    lat: wp._attributes.lat,
                    lng: wp._attributes.lon,
                    title: wp.name._text,
                    body: '',
                    color: '#ff0000',
                    textColor: '#ffffff',
                    classNames: 'rounded-lg bg-success text-white text-center',
                    width: 150,
                    height: 20,
                    anchorX: -10,
                    anchorY: 10,
                }));
                setWaypoints(wpts);
            }
        };
        if (articleId) {
            fetchData();
        }
    }, [articleId]);

    return (
        <div class={`position-relative ${article['map-class']} ${className}`} style={`${article['map-style']} ${style}`}>
            {article && article.img && <>
                {/* <xmp>{JSON.stringify(article.img[fileIdx].geoJSON, null, 4)}</xmp> */}
                <div class='overflow-hidden' style={`height: ${mapHeight}px; width: 100%;`}>
                    <Map
                        waypoints={waypoints}
                        stores={{ appState }}
                        mapId={`${article.id}-${mapHeight}`}
                        geojson={article.img[fileIdx].geoJSON}
                        skipGeojson={false}
                        gpxInfo={article.img[fileIdx].gpxInfo}
                        height={mapHeight}
                        mapColorMode={mapColorMode}
                        mapRangeMin={mapRangeMin}
                        mapRangeMax={mapRangeMax}
                        key={`article-map-${article.id}-${mapHeight}`}
                    />
                </div>
            </>}

        </div>
    );
}
