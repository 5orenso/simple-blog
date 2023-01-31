import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import querystring from 'querystring';
import countries from 'i18n-iso-countries';
import util from 'preact-util';
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

function pad(number) {
    let r = String(number);
    if (r.length === 1) {
        r = `0${r}`;
    }
    return r;
}

function byBib(a, b) {
    if (a.Bib === b.Bib) {
        return 0;
    }
    if (!a.Bib) {
        return 1;
    }
    if (!b.Bib) {
        return -1;
    }
    // if (!a.bib) {
    //     return -1;
    // }
    if (a.Bib < b.Bib) {
        return -1;
    }
    if (a.Bib > b.Bib) {
        return 1;
    }
    return 0;
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

function ensureUrl(url) {
    if (!url) {
        return '';
    }
    if (url.indexOf('http') === 0) {
        return url;
    }
    return `https://${url}`;
}

export default function App(props) {
    const { apiServer, jwtToken, articleId, showSearch = true, language = 'EN', sheetId } = props;

    const [article, setArticle] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/article/${articleId}`,
                settings: {
                    apiServer,
                },
            })
            setArticle(result.article);
        };
        if (articleId) {
            fetchData();
        }
    }, [articleId]);

    const { apiUrl = article['racetracker-apiUrl'], racePrefix = article['racetracker-racePrefix'] } = props;

    const [rawRaceData, setRawRaceData] = useState({});
    const [raceData, setRaceData] = useState({});
    const [races, setRaces] = useState([]);
    const [currentRace, setCurrentRace] = useState();
    const [currentBib, setCurrentBib] = useState();

    const [sheet, setSheet] = useState({});
    const googleSheetId = sheetId || article['booking-sheetId'];

    const currentUrl = new URL(window.location.href);
    const showInfo = currentUrl.searchParams.get('showInfo') === '1';

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/proxy/${encodeURIComponent(apiUrl)}`,
                settings: {
                    apiServer,
                },
            })
            setRawRaceData(result.data);
            // console.log('result.data', result.data);
            // {
            //     "Bib": 1,
            //     "Name": "Simen BÆKKEN @FJELL_FANTEN",
            //     "Club/Team": "Jotunheimen hundekjørerlag",
            //     "Nation": "NOR",
            //     "RookieVeteran": "Rookie",
            //     "CONTEST.NAME": "650km"
            // },
            if (Array.isArray(result.data)) {
                const raceDataObj = {};
                result.data.forEach(line => {
                    const raceName = line['CONTEST.NAME'];
                    if (!raceDataObj[raceName]){
                        raceDataObj[raceName] = {
                            name: raceName,
                            contestants: [],
                        }
                    }
                    raceDataObj[raceName].contestants.push(line);
                });
                setRaceData(raceDataObj);
                const races = Object.keys(raceDataObj);
                setRaces(races);
            }

        };
        if (apiUrl) {
            fetchData();
        }
    }, [apiUrl]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/bookings/sheet/${googleSheetId}`,
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


    const [searchText, setSearchText] = useState('');
    const onInputSearch = useCallback((e) => {
        const { value } = e.target;
        setSearchText(value);
    }, [0]);

    const bgClasses = ['bg-success', 'bg-warning', 'bg-danger', 'bg-primary', 'bg-secondary'];
    const searchWords = searchText.trim().split(' ');
    const regexpList = searchWords.filter(w => w.length > 1).map(word => new RegExp(`(${word})`, 'i'));
    const replacer = (match, p1, offset, string) => {
        const stringWithoutHtml = string.replace(/<.+?>/g, '');
        const bgClass = searchWords.findIndex(e => e.toLowerCase() === p1.toLowerCase());
        if (stringWithoutHtml.match(new RegExp(p1, 'i'))) {
            return `<span class='${bgClasses[bgClass] || 'bg-secondary'} text-white'>${p1}</span>`;
        }
        return `${p1}`;
    }
    const replaceAllStrings = (string) => {
        let result = string;
        for (let i = 0, l = regexpList.length; i < l; i += 1) {
            const regexp = regexpList[i];
            result = result.replace(regexp, replacer);
        }
        return result;
    }

    const fields = ['bib', 'Name', 'Club/Team', 'Nation', 'RookieVeteran'];

    const searchFilter = searchText !== '' ? (row) => {
        const results = regexpList.map((regexp) => {
            for (let i = 0, l = fields.length; i < l; i += 1) {
                const col = fields[i];
                if (regexp.test(`${row[col]}`)) {
                    return true;
                }
            }
            return false;
        });
        if (results.includes(false)) {
            return false;
        }
        return true;
    } : () => { return true };


    const onClickTab = useCallback((e) => {
        const { idx, current } = e.target.closest('button').dataset;
        const currentIdx = parseInt(idx, 10);
        const currentRaceIdx = parseInt(current, 10);
        if (currentIdx === currentRaceIdx) {
            setCurrentRace();
        } else {
            setCurrentRace(currentIdx);
        }
    }, [0]);


    const toggleMusher = useCallback((e) => {
        const { bib, currentbib } = e.target.closest('tr').dataset;
        const newBib = parseInt(bib, 10);
        if (currentbib === bib) {
            setCurrentBib();
        } else {
            setCurrentBib(newBib);
        }
    }, [0]);


    return (
        <div class={`${article['clock-class']}`} style={`${article['clock-style']}`}>
            {/* <xmp>{JSON.stringify(rawRaceData, null, 4)}</xmp> */}

            <div class='mb-5'>
                <ul class='nav nav-pills nav-justified'>
                    {races && races.map((race, idx) =>  {
                        const regexp = new RegExp('^{(.+?)}$');
                        let raceName = race;
                        if (regexp.test(race)) {
                            const raceLang = {};
                            const raceString = race.replace(/^\{(.+?)\}$/, '$1');
                            const raceParts = raceString.split('|');
                            raceParts.forEach(lang => {
                                const parts = lang.split(':');
                                raceLang[parts[0]] = parts[1];
                            });
                            if (raceLang[language]) {
                                raceName = raceLang[language];
                            }
                        }
                        return (<>
                            <li class='nav-item mr-3'>
                                <button
                                    class={`btn btn-lg btn-block nav-link border ${currentRace === idx ? 'active' : ''} text-center`}
                                    data-idx={idx}
                                    data-current={currentRace}
                                    onClick={onClickTab}
                                >
                                    {raceName}
                                </button>
                            </li>
                        </>);
                    })}
                </ul>
            </div>

            {showSearch && <div class='mb-2'>
                <div class='form-group row'>
                    <div class='col-6 offset-3'>
                        <input type='text' class='form-control form-control-lg' placeholder={`Search for mushers`} onInput={onInputSearch} value={searchText} />
                    </div>
                </div>
            </div>}

            {races && races.filter((e, idx) => util.isDefined(currentRace) ?  currentRace === idx : true).map(race => {
                const rows = raceData[race] && raceData[race].contestants ? raceData[race].contestants.filter(searchFilter) : [];
                if (!rows || rows.length === 0) {
                    return '';
                }
                const regexp = new RegExp('^{(.+?)}$');
                let raceName = race;
                if (regexp.test(race)) {
                    const raceLang = {};
                    const raceString = race.replace(/^\{(.+?)\}$/, '$1');
                    const raceParts = raceString.split('|');
                    raceParts.forEach(lang => {
                        const parts = lang.split(':');
                        raceLang[parts[0]] = parts[1];
                    });
                    if (raceLang[language]) {
                        raceName = raceLang[language];
                    }
                }

                const hasBib = !!rows[0].Bib;

                return (<>
                    <h5 class='mt-5'>{racePrefix || ''} {raceName}</h5>
                    <div class='table-responsive-xl'>
                        <table class='table table-striped'>
                            <thead>
                                <tr>
                                    {hasBib ? <>
                                        <th scope='col'>Bib</th>
                                    </> : <>
                                        <th scope='col'>#</th>
                                    </>}
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Club/Team</th>
                                    <th scope='col'>Nation</th>
                                    <th scope='col'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.sort(byBib).map((musher, idx) => {
                                    // // in a browser environment: countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
                                    // console.log(
                                    // "USA (Alpha-3) => " + countries.alpha3ToAlpha2("USA") + " (Alpha-2)"
                                    // );
                                    const countryAlpha2 = `${countries.alpha3ToAlpha2(musher.Nation)}`.toLowerCase();
                                    const musherName = searchText !== '' ? replaceAllStrings(musher.Name) : musher.Name;
                                    const musherTeam = searchText !== '' ? replaceAllStrings(musher['Club/Team']) : musher['Club/Team'];

                                    const headers = sheet && sheet.headers ? sheet.headers : [];
                                    const rowData = sheet && sheet.rows ? sheet.rows.find(e => e.Startnummer == musher.Bib) : [];

                                    return (<>
                                        <tr
                                            onClick={toggleMusher}
                                            data-bib={musher.Bib}
                                            data-currentbib={currentBib}
                                            class={currentBib === musher.Bib ? 'bg-info text-white' : ''}
                                        >
                                            {hasBib ? <>
                                                <td>{musher.Bib}</td>
                                            </> : <>
                                                <td class='font-weight-light'>{idx + 1}</td>
                                            </>}
                                            <td>
                                                <nobr>
                                                    <Markdown markdown={`${musherName}`} markdownOpts={MARKDOWN_OPTIONS} />
                                                </nobr>
                                            </td>
                                            <td>
                                                <Markdown markdown={`${musherTeam}`} markdownOpts={MARKDOWN_OPTIONS} />
                                            </td>
                                            <td class='text-center'>
                                                <nobr>
                                                    {musher.Nation} <span class={`flag-icon flag-icon-${countryAlpha2}`} />
                                                </nobr>
                                            </td>
                                            <td>{musher.RookieVeteran}</td>
                                        </tr>
                                        {currentBib === musher.Bib && <>
                                            <tr>
                                                <td colspan='5'>
                                                    <div class='d-flex'>
                                                        <div class='d-flex flex-column mb-3 w-50'>
                                                            <div class='d-flex flew-row flex-nowrap mb-2'>
                                                                <div class='flex-grow-1' style='font-size: 2.0em;'>
                                                                    <span class="badge badge-pill badge-secondary">{musher.Bib}</span> {musher.Name}
                                                                </div>
                                                                <div class='' style='font-size: 2.0em;'>
                                                                    <span class={`flag-icon flag-icon-${countryAlpha2}`} />
                                                                </div>
                                                            </div>
                                                            <div class='d-flex flew-row flex-nowrap'>
                                                                <div class='text-muted' style='width: 100px;'>Alder:</div>
                                                                <div class='flex-grow-1'>{util.age(musher.DateOfBirth)}</div>
                                                            </div>
                                                            <div class='d-flex flew-row flex-nowrap'>
                                                                <div class='text-muted' style='width: 100px;'>Status:</div>
                                                                <div class='flex-grow-1'>{musher.RookieVeteran}</div>
                                                            </div>
                                                            <div class='d-flex flew-row flex-nowrap'>
                                                                <div class='text-muted' style='width: 100px;'>Klubb:</div>
                                                                <div class='flex-grow-1'>{musher['Club/Team']}</div>
                                                            </div>
                                                            <div class='d-flex flew-row flex-nowrap'>
                                                                <div class='text-muted' style='width: 100px;'>Kennel:</div>
                                                                <div class='flex-grow-1'>{musher.Kennel}</div>
                                                            </div>
                                                            <div class='d-flex flew-row flex-nowrap'>
                                                                <div class='text-muted' style='width: 100px;'>Yrke:</div>
                                                                <div class='flex-grow-1'>{musher.Occupation}</div>
                                                            </div>
                                                            <div class='d-flex flew-row flex-nowrap'>
                                                                <div class='text-muted' style='width: 100px;'>Nettside:</div>
                                                                <div class='flex-grow-1'>{musher.Web ? <a href={ensureUrl(musher.Web)} native target='_blank'>{musher.Web}</a> : <>n/a</>}</div>
                                                            </div>
                                                            <div class='d-flex flew-row flex-nowrap'>
                                                                <div class='text-muted' style='width: 100px;'>Sponsorer:</div>
                                                                <div class='flex-grow-1'><Markdown markdown={`${musher.Comment}`} markdownOpts={MARKDOWN_OPTIONS} /></div>
                                                            </div>
                                                        </div>
                                                        {/* <xmp>{JSON.stringify(musher, null, 4)}</xmp> */}

                                                        {showInfo && <>
                                                            {rowData && <div class='d-flex flex-column mb-3 w-50 pl-3'>
                                                                {headers.map((key, idx) => {
                                                                    const value = rowData[key];
                                                                    return (<>
                                                                        <div class='d-flex flex-column mb-3'>
                                                                            <div class='w-100 text-muted' style='width: 100px;'>{key}:</div>
                                                                            <div class='w-100 '>{value}</div>
                                                                        </div>
                                                                    </>);
                                                                })}
                                                            </div>}
                                                        </>}
                                                    </div>
{/* <xmp>{JSON.stringify(rowData, null, 4)}</xmp>
<xmp>{JSON.stringify(sheet, null, 4)}</xmp> */}


                                                </td>
                                            </tr>
                                        </>}
                                    </>);
                                })}
                            </tbody>
                        </table>
                    </div>
                </>);
            })}

            {/* <xmp>{JSON.stringify(races, null, 4)}</xmp>
            <xmp>{JSON.stringify(raceData, null, 4)}</xmp> */}
            {/* {JSON.stringify(article)} */}
        </div>
    );
}