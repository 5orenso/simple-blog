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
    const { apiServer, jwtToken, articleId, showSearch = true } = props;

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

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchApi({
                url: `/api/proxy/${encodeURIComponent(apiUrl)}`,
                settings: {
                    apiServer,
                },
            })
            setRawRaceData(result.data);
            // {
            //     "Bib": "",
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
            console.log({currentIdx, currentRaceIdx })
        if (currentIdx === currentRaceIdx) {
            setCurrentRace();
        } else {
            setCurrentRace(currentIdx);
        }
    }, [0]);

    return (
        <div class={`${article['clock-class']}`} style={`${article['clock-style']}`}>
            {/* <xmp>{JSON.stringify(rawRaceData, null, 4)}</xmp> */}

            <div class='mb-5'>
                <ul class='nav nav-pills nav-justified'>
                    {races && races.map((race, idx) => <>
                        <li class='nav-item mr-3'>
                            <button
                                class={`btn btn-lg btn-block nav-link border ${currentRace === idx ? 'active' : ''} text-center`}
                                data-idx={idx}
                                data-current={currentRace}
                                onClick={onClickTab}
                            >
                                {race}
                            </button>
                        </li>
                    </>)}
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

                return (<>
                    <h5 class='mt-5'>{racePrefix || ''} {race}</h5>
                    <div class='table-responsive-xl'>
                        <table class='table table-striped'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Bib</th>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Club/Team</th>
                                    <th scope='col'>Nation</th>
                                    <th scope='col'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((musher, idx) => {
                                    // // in a browser environment: countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
                                    // console.log(
                                    // "USA (Alpha-3) => " + countries.alpha3ToAlpha2("USA") + " (Alpha-2)"
                                    // );
                                    const countryAlpha2 = `${countries.alpha3ToAlpha2(musher.Nation)}`.toLowerCase();
                                    const musherName = searchText !== '' ? replaceAllStrings(musher.Name) : musher.Name;
                                    const musherTeam = searchText !== '' ? replaceAllStrings(musher['Club/Team']) : musher['Club/Team'];
                                
                                    return (<>
                                        <tr>
                                            <td class='font-weight-light'>{idx + 1}</td>
                                            <td>{musher.Bib}</td>
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