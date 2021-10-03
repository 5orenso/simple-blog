/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2020 Øistein Sørensen
 * Licensed under the MIT license.
 */

import util from 'preact-util';

const MARGIN_TOP_W_SUBMENU = '71px'; // -19
const MARGIN_TOP_W_SUBMENU_TABS = '120px';
const MARGIN_TOP = '41px';
const SUB_MENU_MARGIN_TOP = '40px'; // -16
const MARGIN_TOP_BACK = '34px';
const MARGIN_TOP_BACK_W_SUBMENU = '70px';
const MARGIN_TOP_BACK_W_SUBMENU_TABS = '100px';
const MARGIN_BOTTOM = '200px';

const MAX_LOADINDEX = 200;
const NORMAL_SPEED_KMT = 13;
const ELEVATION_THRESHOLD = 3;
const WINDOW_SIZE_ARRAY_SMOOTH = 20;

const RED_DAYS = [0, 6];
const DAYS = {
    no: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    de: ['Sun', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
};
const DAYS_FULL = {
    no: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
};
const MONTHS = {
    no: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    de: ['Jän', 'Feb', 'Mär', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
};

const COLOR_NAMES = {
    navy: '#001f3f',
    aqua: '#7FDBFF',
    teal: '#39CCCC',
    olive: '#3D9970',
    green: '#2ECC40',
    lime: '#01FF70',
    yellow: '#FFDC00',
    orange: '#FF851B',
    red: '#FF4136',
    maroon: '#85144b',
    fuchsia: '#F012BE',
    purple: '#B10DC9',
    gray: '#AAAAAA',
    silver: '#DDDDDD',

    alertRed: '#FF0000ff',
    alertScarlet: '#FF2000ff',
    alertRedOrange: '#FF4000ff',
    alertSafetyOrange: '#FF6000ff',
    alertOrange: '#FF8000ff',
    alertOrangePeel: '#FF9F00ff',
    alertAmber: '#FFBF00ff',
    alertGoldenYellow: '#FFDF00ff',
    alertLemonGlacier: '#FFFF00ff',

    vermilion: '#E60000ff',
    vermilion2: '#E61D00ff',
    coquelicot: '#E63A00ff',
    persimmon: '#E65600ff',
    princetonOrange: '#E67300ff',
    harvestGold: '#E59000ff',
    goldenrod: '#E5AD00ff',
    safetyYellow: '#E5C900ff',
    xanthic: '#E5E600ff',

    blue: '#0000E6ff',
    blue2: '#1C0FE5ff',
    blue3: '#391FE4ff',
    hanPurple: '#552EE3ff',
    blueViolet: '#713DE2ff',
    purpleX11: '#8E4DE2ff',
    mediumOrchid: '#AA5CE1ff',
    frenchMauve: '#C66BE0ff',
    orchid: '#E37BDFff',
    persianPink: '#FF8ADEff',

    neonGreen: '#00E600ff',
    limeGreen: '#00CD17ff',
    yellowGreen: '#00B42Eff',
    greenPigment: '#009C46ff',
    spanishViridian: '#00835Dff',
    ming: '#006A74ff',
    usafaBlue: '#00518Bff',
    egyptianBlue: '#0039A3ff',
    bluePantone: '#0020BAff',
    mediumBlue: '#0007D1ff',
};

const HISTORY_TYPE_COLOR_MAP = {
    other: 'limeGreen',
    update: 'yellowGreen',
    newStraw: 'greenPigment',
    clawClip: 'spanishViridian',
    bodyScore: 'ming',
    weight: 'usafaBlue',

    maturity: 'blue',
    mating: 'blue3',
    vaccine: 'blueViolet',
    deworming: 'mediumOrchid',
    veterinarianVisit: 'persianPink',

    fight: 'vermilion',
    injury: 'coquelicot',
    sick: 'persimmon',
    unwantedMating: 'princetonOrange',
    stoolProblem: 'harvestGold',
    diarrhea: 'goldenrod',
    foodLeftover: 'xanthic',

    massage: 'egyptianBlue',
    animalchiropractor: 'bluePantone',    
};

const HISTORY_PRIORITY_LIST_1 = [
    'fight',
    'injury',
    'sick',
    'unwantedMating',
    'stoolProblem',
    'diarrhea',
    'foodLeftover',
];

const HISTORY_PRIORITY_LIST_2 = [
    'maturity',
    'mating',
    'vaccine',
    'deworming',
    'veterinarianVisit',
];

const HISTORY_PRIORITY_LIST_3 = [
    'other',
    'update',
    'newStraw',
    'clawClip',
    'bodyScore',
    'weight',
    'massage',
    'animalchiropractor',
];

const HISTORY_TYPE_MAP = {
    no: {
        other: 'Annet',
        maturity: 'Løpetid',
        update: 'Oppdatering',
        injury: 'Skade',
        fight: 'Slåsskamp',
        sick: 'Syk',
        vaccine: 'Vaksine',
        weight: 'Veiing',
        veterinarianVisit: 'Vetrinærbesøk',
        newStraw: 'Ny halm/treull',
        clawClip: 'Kloklipp',
        mating: 'Parring',
        unwantedMating: 'Tjuvparring',
        diarrhea: 'Diarè',
        stoolProblem: 'Avføringsproblem',
        deworming: 'Ormekur',
        foodLeftover: 'Ikke spist opp maten',
        bodyScore: 'Bodyscore',
        massage: 'Massasje',
        animalchiropractor: 'Dyrekiropraktor',
    },
    en: {
        other: 'Other',
        maturity: 'On heat',
        update: 'Update',
        injury: 'Injury',
        fight: 'Fight',
        sick: 'Sick',
        vaccine: 'Vaccine',
        weight: 'Weight',
        veterinarianVisit: 'Veterinarian Visit',
        newStraw: 'New Straw',
        clawClip: 'Claw Clip',
        mating: 'Mating',
        unwantedMating: 'Unwanted Mating',
        diarrhea: 'Diarrhea',
        stoolProblem: 'Stool Problem',
        deworming: 'Deworming',
        foodLeftover: 'Food Leftover',
        bodyScore: 'BodyScore',
        massage: 'Massage',
        animalchiropractor: 'Animal chiropractor',
    },
    es: {
        other: 'Otro',
        maturity: 'En celo',
        update: 'Actualizaciones',
        injury: 'Lesión',
        fight: 'Pelea',
        sick: 'Enfermo',
        vaccine: 'Vacunas',
        weight: 'Control del peso',
        veterinarianVisit: 'Visita veterinaria',
        newStraw: 'Paja nueva',
        clawClip: 'Cortar las uñas',
        mating: 'Cruzamiento',
        unwantedMating: 'Cruza no deseada',
        diarrhea: 'Diarrea',
        stoolProblem: 'Problemas con las heces',
        deworming: 'Desparasitación',
        foodLeftover: 'No terminó de comer',
        bodyScore: 'Bodyscore',
        massage: 'Masaje',
        animalchiropractor: 'Quiropráctico',
    },
    de: {
        other: 'Andere',
        maturity: 'Läufigkeit',
        update: 'Aktualisierung',
        injury: 'Verletzung',
        fight: 'Kampf',
        sick: 'Erkrankung',
        vaccine: 'Impfung',
        weight: 'Wiegen',
        veterinarianVisit: 'Tierarztbesuch',
        newStraw: 'Frisches Stroh',
        clawClip: 'Klauen geschnitten',
        mating: 'Parung',
        unwantedMating: 'Ungewollte Parung',
        diarrhea: 'Durchfall',
        stoolProblem: 'Stuhlproblem',
        deworming: 'Entwurmung',
        foodLeftover: 'Hat nicht alles aufgefressen',
        bodyScore: 'BodyScore',
        massage: 'Massage',
        animalchiropractor: 'Tier Chiropraktiker',
    },
};

const VACCINE_TYPES = {
    rabies: {
        name: 'Rabies (3 år)',
        duration: 365 * 3,
    },
    deworming: {
        name: 'Ormekur - reise',
        duration: 28,
    },
    BbPi: {
        name: 'BbPi - Nesevaksine (1 år)',
        duration: 365 * 1,
    },
    DHP: {
        name: 'DHP (3 år)',
        duration: 365 * 3,
    },
    DHPPi: {
        name: 'DHPPi (3 år)',
        duration: 365 * 3,
    },    
};

const VACCINE_TYPES_VETERINARY = [
    {
        id: 1,
        name: 'Nobivac BbPi nasal',
        agens: [
            {
                name: 'Parainfluensa',
                durationMonths: 12,
                karensDays: 42,
            },
            {
                name: 'Bordetella',
                durationMonths: 12,
                karensDays: 42,
            },
            {
                name: 'Bronchioseptica',
                durationMonths: 12,
                karensDays: 42,
            },
        ],
        image: '/images/nobivac-BbPi.jpg',
    },
    {
        id: 3,
        name: 'Nobivac DHP',
        agens: [
            {
                name: 'Valpesyke',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Hepatitt',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Parvovirus',
                durationMonths: 36,
                karensDays: 14,
            },
        ],
        image: '/images/nobivac-DHP.jpg',
    },
    {
        id: 4,
        name: 'Nobivac DHPPi',
        agens: [
            {
                name: 'Valpesyke',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Hepatitt',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Parvovirus',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Parainfluensa',
                durationMonths: 12,
                karensDays: 14,
            },
        ],
        comment: '3 år valpesyke, hepatitt og parvovirus, 12 mnd parainfluensa',
        image: '/images/nobivac-DHPPi.jpg',
    },
    {
        id: 5,
        name: 'Nobivac Pi',
        agens: [
            {
                name: 'Parainfluensa',
                durationMonths: 12,
                karensDays: 14,
            },
        ],
        image: '/images/nobivac-Pi.jpg',
    },
    {
        id: 2,
        name: 'Versican Plus Bb oral',
        agens: [
            {
                name: 'Bordetella',
                durationMonths: 12,
                karensDays: 42,
            },
            {
                name: 'Bronchioseptica',
                durationMonths: 12,
                karensDays: 42,
            },
        ],
        image: '/images/versican-plus-Bb-oral.jpg',
    },
    {
        id: 6,
        name: 'Versican Plus DHPPi',
        agens: [
            {
                name: 'Valpesyke',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Hepatitt',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Parvovirus',
                durationMonths: 36,
                karensDays: 14,
            },
            {
                name: 'Parainfluensa',
                durationMonths: 12,
                karensDays: 14,
            },
        ],        
        comment: '3 år valpesyke, hepatitt og parvovirus 12 mnd parainfluensa',
        image: '/images/versican-plus-DHPPi.jpg',
    },
    {
        id: 7,
        name: 'Versican Plus Pi',
        agens: [
            {
                name: 'Parainfluensa',
                durationMonths: 12,
                karensDays: 14,
            },
        ],        
        image: '/images/versican-plus-Pi.jpg',
    },
];

const TROPHY_IMAGES = {
    founder: './assets/trophys/signup-founder.png',
    veryEarlyUser: './assets/trophys/signup-very-early.png',
    earlyUser: './assets/trophys/signup-early.png',
    '2020-2021-100km': './assets/trophys/2020-2021-100km.png',
    '2020-2021-250km': './assets/trophys/2020-2021-250km.png',
    '2020-2021-500km': './assets/trophys/2020-2021-500km.png',
    '2020-2021-1000km': './assets/trophys/2020-2021-1000km.png',
    '2020-2021-1500km': './assets/trophys/2020-2021-1500km.png',
    '2020-2021-2000km': './assets/trophys/2020-2021-2000km.png',
    '2020-2021-2500km': './assets/trophys/2020-2021-2500km.png',
    '2020-2021-3000km': './assets/trophys/2020-2021-3000km.png',
    '2020-2021-3500km': './assets/trophys/2020-2021-3500km.png',
    '2020-2021-4000km': './assets/trophys/2020-2021-4000km.png',

    '2020-2021-everest-x1': './assets/trophys/2020-2021-everest-x1.png',
    '2020-2021-everest-x5': './assets/trophys/2020-2021-everest-x5.png',
    '2020-2021-everest-x10': './assets/trophys/2020-2021-everest-x10.png',

    '2021-2022-100km': './assets/trophys/2021-2022-100km.png',
    '2021-2022-250km': './assets/trophys/2021-2022-250km.png',
    '2021-2022-500km': './assets/trophys/2021-2022-500km.png',
    '2021-2022-1000km': './assets/trophys/2021-2022-1000km.png',
    '2021-2022-1500km': './assets/trophys/2021-2022-1500km.png',
    '2021-2022-2000km': './assets/trophys/2021-2022-2000km.png',
    '2021-2022-2500km': './assets/trophys/2021-2022-2500km.png',
    '2021-2022-3000km': './assets/trophys/2021-2022-3000km.png',
    '2021-2022-3500km': './assets/trophys/2021-2022-3500km.png',
    '2021-2022-4000km': './assets/trophys/2021-2022-4000km.png',

    '2021-2022-everest-x1': './assets/trophys/2021-2022-everest-x1.png',
    '2021-2022-everest-x5': './assets/trophys/2021-2022-everest-x5.png',
    '2021-2022-everest-x10': './assets/trophys/2021-2022-everest-x10.png',
};

const MARKDOWN_OPTIONS = {
	pedantic: false,
	gfm: true,
	breaks: true,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: true,
};

const KCAL_KG_KM = 1.25;
const ECOR = i => KCAL_KG_KM + i / 100 * 9.81 * (45.6 + 1.16 * i) / 100;

const INTERSECTION_ELEMENTS = {};
const INTERSECTION_HISTORY = [];

class MusherUtil {
    static getDayColor(day, darkmode) {
        if (RED_DAYS.indexOf(day) > -1) {
            if (darkmode) {
                return '#501515';
            }
            return '#ffdddd';
        }
        return '';
    }

    static getTrainingColor(summary, darkmode) {
        if (summary.distanceKm > 0 || summary.distance > 0) {
            if (darkmode) {
                return '#154015';
            }
            return '#aaffaa';
        }
        return '';
    }

    static getPlanColor(summary, darkmode) {
        if (summary.distanceKm > 0 || summary.distance > 0) {
            if (darkmode) {
                return '#0052cc';
            }
            return '#b3d1ff';
        }
        return '';
    }

    static getHistoryTypeColor(historyType) {
        const colorName = HISTORY_TYPE_COLOR_MAP[historyType];
        if (typeof colorName  === 'number') {
            return colorName
        }
        return COLOR_NAMES[colorName];
    }

    static avgArr(array) {
        if (Array.isArray(array) && array.length > 0) {
            return array.reduce((a, b) => a + b) / array.length;
        }
        return 0;
    }

    static getNextMonth(month, year) {
        const result = { month, year };
        if ((month + 1) > 12) {
            result.month = 1;
            result.year += 1;
        } else {
            result.month += 1;
        }
        return result;
    }

    static getPrevMonth(month, year) {
        const result = { month, year };
        if ((month - 1) < 1) {
            result.month = 12;
            result.year -= 1;
        } else {
            result.month -= 1;
        }
        return result;
    }

    static getNextWeek(week, year) {
        const result = { week, year };
        if ((week + 1) > 53) {
            result.week = 1;
            result.year += 1;
        } else {
            result.week += 1;
        }
        return result;
    }

    static getPrevWeek(week, year) {
        const result = { week, year };
        if ((week - 1) < 1) {
            result.week = 53;
            result.year -= 1;
        } else {
            result.week -= 1;
        }
        return result;
    }

    static getHistoryMap(lang = 'no') {
        if (!HISTORY_TYPE_MAP[lang]) {
            return HISTORY_TYPE_MAP.en;
        }
        return HISTORY_TYPE_MAP[lang];
    }

    static getVaccineTypes() {
        return VACCINE_TYPES;
    }

    static getVaccineTypesVet() {
        return VACCINE_TYPES_VETERINARY;
    }

    static getHistoryPri(num) {
        switch (num) {
            case 1:
                return HISTORY_PRIORITY_LIST_1;
            case 2:
                return HISTORY_PRIORITY_LIST_2;
            case 3:
                return HISTORY_PRIORITY_LIST_3;
            default:
                return HISTORY_PRIORITY_LIST_1;
        }
    }

    static speedAvg(obj) {
        let speedAvg = 0;
        if (obj.duration > 0 && obj.distanceKm > 0) {
            const rest = obj.rest || 0;
            const duration = obj.duration - rest;
            speedAvg = obj.distanceKm / (duration / 3600);
        }
        return speedAvg;
    }

    static getDays(lang = 'no', full = false) {
        if (full) {
            if (!DAYS_FULL[lang]) {
                return DAYS_FULL.en;
            }
            return DAYS_FULL[lang];
        }
        if (!DAYS[lang]) {
            return DAYS.en;
        }
        return DAYS[lang];
    }

    static getMonths(lang = 'no') {
        if (!MONTHS[lang]) {
            return MONTHS.en;
        }
        return MONTHS[lang];
    }

    static marginTop(hasSubMenu = false, hasSubMenuTabs = false) {
        if (hasSubMenuTabs) {
            return MARGIN_TOP_W_SUBMENU_TABS;
        }
        if (hasSubMenu) {
            return MARGIN_TOP_W_SUBMENU;
        }
        return MARGIN_TOP;
    }

    static marginTopBack(hasSubMenu = false, hasSubMenuTabs = false) {
        if (hasSubMenuTabs) {
            return MARGIN_TOP_BACK_W_SUBMENU_TABS;
        }
        if (hasSubMenu) {
            return MARGIN_TOP_BACK_W_SUBMENU;
        }
        return MARGIN_TOP_BACK;
    }

    static marginBottom() {
        return MARGIN_BOTTOM;
    }

    static subMenuMarginTop() {
        return SUB_MENU_MARGIN_TOP;
    }

    static windDirection(deg) {
        if (deg>11.25 && deg<33.75) {
            return "NNE";
        } else if (deg>33.75 && deg<56.25) {
            return "ENE";
        } else if (deg>56.25 && deg<78.75) {
            return "E";
        } else if (deg>78.75 && deg<101.25) {
            return "ESE";
        } else if (deg>101.25 && deg<123.75) {
            return "ESE";
        } else if (deg>123.75 && deg<146.25) {
            return "SE";
        } else if (deg>146.25 && deg<168.75) {
            return "SSE";
        } else if (deg>168.75 && deg<191.25) {
            return "S";
        } else if (deg>191.25 && deg<213.75) {
            return "SSW";
        } else if (deg>213.75 && deg<236.25) {
            return "SW";
        } else if (deg>236.25 && deg<258.75) {
            return "WSW";
        } else if (deg>258.75 && deg<281.25) {
            return "W";
        } else if (deg>281.25 && deg<303.75) {
            return "WNW";
        } else if (deg>303.75 && deg<326.25) {
            return "NW";
        } else if (deg>326.25 && deg<348.75) {
            return "NNW";
        }
        return "N";
    }

    static getTemperatureColor(temp) {
        if (temp <= 0) {
            return 'text-primary';
        }
        if (temp <= 10) {
            return 'text-success';
        }
        return 'text-danger';
    }

    static getWindSpeedColor(speed) {
        if (speed > 10) {
            return 'text-warning';
        }
        if (speed > 20) {
            return 'text-danger';
        }
        return '';
    }

    static avg(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    static smoothOut(arr, variance) {
        const tAvg = MusherUtil.avg(arr) * variance;
        const ret = [];
        for (let i = 0; i < arr.length; i += 1) {
            const prev = i > 0 ? ret[i - 1] : arr[i];
            const next = i < arr.length ? arr[i] : arr[i - 1];
            ret[i] = MusherUtil.avg([tAvg, MusherUtil.avg([prev, arr[i], next])]);
        }
        return ret;
    }

    static smoothArray(array, smoothing) {
        const newArray = [];
        for (let i = 0, l = array.length; i < l; i += 1) {
            let sum = 0;

            for (let index = i - smoothing; index <= i + smoothing; index += 1) {
                const thisIndex = index < 0 ? index + array.length : index % array.length;
                sum += array[thisIndex];
            }
            newArray[i] = sum / ((smoothing * 2) + 1);
        }
        return newArray;
    }

    static maxLength(string, max, link = '') {
        if (typeof string === 'string') {
            const length = string.length;
            if (length > max) {
                const cutPos = string.substr(0, max).lastIndexOf(' ');
                return `${string.substr(0, cutPos)}... ${link}`;
            }
            return string;
        }
        return string;
    }

    static nl2p($str) {
        if (typeof $str === 'string') {
            return $str.split('\n\n');
        }
        return [$str];
    }

    static nl2br($str) {
        if (typeof $str === 'string') {
            return $str.split('\n');
        }
        return [$str];
    }

    static calcEcor(climbPercent, distanceKm = 1) {
        return ECOR(climbPercent) * distanceKm;
    }

    static calcKcal(distanceKm = 1) {
        return distanceKm * KCAL_KG_KM;
    }

    static getLoadIndexText(loadIndexNormalized, language = 'en') {
        if (loadIndexNormalized >= 300) {
            return 'Epic';
        }
        if (loadIndexNormalized >= 200) {
            return 'Extreme';
        }
        if (loadIndexNormalized >= 150) {
            return 'Massive';
        }
        if (loadIndexNormalized >= 100) {
            return 'Tough';
        }
        if (loadIndexNormalized >= 80) {
            return 'Very hard';
        }
        if (loadIndexNormalized >= 70) {
            return 'Hard';
        }
        if (loadIndexNormalized >= 60) {
            return 'Above normal';
        }
        if (loadIndexNormalized > 40) {
            return 'Normal';
        }
        if (loadIndexNormalized > 30) {
            return 'Easy';
        }
        return 'Very easy';
    }

    static getLoadIndexColor(loadIndexNormalized, language = 'en') {
        if (loadIndexNormalized >= 100) {
            return 'danger';
        }
        if (loadIndexNormalized >= 80) {
            return 'primary';
        }
        if (loadIndexNormalized >= 70) {
            return 'primary';
        }
        if (loadIndexNormalized >= 60) {
            return 'success';
        }
        if (loadIndexNormalized > 40) {
            return 'success';
        }
        if (loadIndexNormalized > 30) {
            return 'info';
        }
        return 'primary';
    }

    static getMaxLoadIndex() {
        return MAX_LOADINDEX;
    }

    static getNormalSpeed() {
        return NORMAL_SPEED_KMT;
    }

    static getElevationThreshold() {
        return ELEVATION_THRESHOLD;
    }

    static getWindowSize() {
        return WINDOW_SIZE_ARRAY_SMOOTH;
    }

    static displayNameShort(user = {}) {
        let displayNameShort;
        if (!user) {
            return '';
        }
        if (util.isString(user.firstname) && user.firstname !== '') {
            displayNameShort = `${util.ucfirst(user.firstname, true)}${util.ucfirst(user.lastname, true)}`;
        } else if (util.isString(user.name) && user.name !== '') {
            const parts = user.name.split(/[^A-Za-z]/);
            displayNameShort = `${util.ucfirst(parts[0] || '', true)}${util.ucfirst(parts[1] || '', true)}`;
        } else if (util.isString(user.username) && user.username !== '') {
            const parts = user.username.split(/[^A-Za-z]/);
            displayNameShort = `${util.ucfirst(parts[0] || '', true)}${util.ucfirst(parts[1] || '', true)}`;
        } else if (util.isString(user.email)) {
            const parts = user.email.split(/[^A-Za-z0-9]/);
            displayNameShort = `${util.ucfirst(parts[0] || '', true)}${util.ucfirst(parts[1] || '', true)}`;
        }
        return displayNameShort;
    }

    static displayName(user = {}, showFullname) {
        if (!user) {
            return '';
        }
        if (!showFullname && util.isString(user.username) && user.username !== '') { 
            return user.username;
        }
        if (util.isString(user.firstname) && user.firstname !== '') {
            return `${user.firstname} ${user.lastname}`;
        }
        if (util.isString(user.name) && user.name !== '') {
            return `${user.name}`;
        }
        if (util.isString(user.email)) {
            const firstPartOfEmail = user.email.replace(/^(.+?)@.+$/, '$1');
            const parts = firstPartOfEmail.split(/[^A-Za-z0-9]/);
            return `${util.ucfirst(parts[0] || '')} ${util.ucfirst(parts[1] || '')}`;
        }
        return '';
    }

    static replaceImages(line = '', images, language = 'no') {
        function imageReplacer(match, p1, p2, p3, offset, string) {
            // console.log({ match, p1, p2, p3, offset, string })
            if (util.isObject(images[p1])) {
                return `<img src=${images[p1].s3XXLargeLink} class='img-fluid float-right' style='width: ${p2 || 40}%;' />`;
            }
            return '';
        }

        function tagReplacer(match, p1, p2, p3, offset, string) {
            if (p1) {
                return `<span class='badge badge-primary'><a href='/stories/tag/${p2}' class='text-white'>${p1}</a></span>`;
            }
            return string;
        }

        if (util.isString(line)) {
            const isOnlyEmojis = MusherUtil.isOnlyEmojis(line);
            const lineLength = line.length;
            let text = line;
            const regex = new RegExp(`<${language}>(.*?)</${language}>`, 's');
            const match = regex.exec(text);
            if (match) {
                const parsedLanguageText = match[1];
                if (parsedLanguageText) {
                    text = parsedLanguageText;
                }
            }
            let textWithImages = text.replace(/\{\{img\.(\d+)\s*(\d*)\}\}/g, imageReplacer);
            if (isOnlyEmojis) {
                textWithImages = `<div style='font-size: 3.0em; line-height:1.1em;'>${textWithImages}</span>`;
            } else if (lineLength <= 25) {
                textWithImages = `<div style='font-size: 1.5em; line-height:1.5em;'>${textWithImages}</span>`;
            }
            return textWithImages.replace(/(#([0-9a-z]+))/gi, tagReplacer);
        }
        return line;
    }

    static getImage({ user, team, size = 's3SmallLink', priority }) {
        let image = {};
        if (priority === 'user') {
            if (user && user.image && user.image.s3SmallLink) {
                image = user.image;
            } else if (user && user.images && user.images[0] && user.images[0].s3SmallLink) {
                image = user.images[0];
            } else if (team && team.image && team.image.s3SmallLink) {
                image = team.image;
            } else if (team && team.images && team.images[0] && team.images[0].s3SmallLink) {
                image = team.images[0];
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (team && team.image && team.image.s3SmallLink) {
                image = team.image;
            } else if (team && team.images && team.images[0] && team.images[0].s3SmallLink) {
                image = team.images[0];
            } else if (user && user.image && user.image.s3SmallLink) {
                image = user.image;
            } else if (user && user.images && user.images[0] && user.images[0].s3SmallLink) {
                image = user.images[0];
            }
        }
        return image[size];
    }

    static getMarkdownOptions() {
        return MARKDOWN_OPTIONS;
    }

    static asUrl(input = '') {
        if (input.match(/^http/)) {
            return input;
        }
        return `https://${input}`;
    }

    static asFacebookLink(input = '') {
        if (input.match(/facebook.com/)) {
            if (input.match(/^http/)) {
                return input;
            }
            return `https://${input}`;
        }
        return `https://facebook.com/${input}`;
    }

    static asInstagramLink(input) {
        if (input.match(/instagram.com/)) {
            if (input.match(/^http/)) {
                return input;
            }
            return `https://${input}`;
        }
        return `https://instagram.com/${input}`;
    }

    static asSnapchatLink(input) {
        if (input.match(/snapchat.com/)) {
            if (input.match(/^http/)) {
                return input;
            }
            return `https://${input}`;
        }
        return `https://www.snapchat.com/add/${input}`;
    }

    static randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static resizeTextarea(el) {
		let element = el;
		if (element.target) {
			element = el.target;
		}
        if (element && element.style) {
            // Reset field height
            element.style.height = 'inherit';

            // Get the computed styles for the element
            const computed = window.getComputedStyle(element);

            // Calculate the height
            const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                + parseInt(computed.getPropertyValue('padding-top'), 10)
                + element.scrollHeight
                + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

            element.style.height = `${height}px`;
        }
	}

    static hasBirthday(date) {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();

        const currentDate = new Date(date);
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();

        if (day === currentDay && month === currentMonth) {
            return true;
        }
        return false;
    }

    static daysUntilNextBirthday(date) {
        if (!date) {
            return null;
        }
        const today = new Date();
        const year = today.getFullYear();

        const birthday = util.parseInputDate(date);
        const birthdayDay = birthday.getDate();
        const birthdayMonth = birthday.getMonth() + 1;

        const birthdayThisYear = util.parseInputDate(`${year}-${util.padDate(birthdayMonth)}-${util.padDate(birthdayDay)}`);
        const birthdayNextYear = util.parseInputDate(`${year + 1}-${util.padDate(birthdayMonth)}-${util.padDate(birthdayDay)}`);
        let nextBirthday = birthdayThisYear;
        if (today > birthdayThisYear) {
            nextBirthday = birthdayNextYear;
        }

        const daysUntilNextBirthday = (nextBirthday - today) / (24 * 60 * 60 * 1000);
        return daysUntilNextBirthday;
    }

    static getTrophyImage(name) {
        return TROPHY_IMAGES[name];
    }

    static isOnlyEmojis(text) {
        if (util.isString(text)) {
            const onlyEmojis = text.match(/\p{Extended_Pictographic}/gu) || [];
            const visibleChars = text.match(/[^\n\r\s\p{Extended_Pictographic}]/gu) || [];
            return onlyEmojis.length === visibleChars.length;
        }
        return false;
    }

    static intersectionObserverCallback(entries) {
        entries.forEach((e) => {
            const { id, type, title, user, team, sessionid } = e.target.dataset;
            const { intersectionRatio, isIntersecting, time } = e;
            const el = INTERSECTION_ELEMENTS[`${type}-${id}`];
            if (el && el.isIntersecting && !isIntersecting) {
                el.endTime = new Date().getTime();
                el.duration = el.endTime - el.startTime;
                const elToPush = { ...el };
                delete INTERSECTION_ELEMENTS[`${type}-${id}`];
                INTERSECTION_HISTORY.push(elToPush);
            } else {
                INTERSECTION_ELEMENTS[`${type}-${id}`] = {
                    startTime: new Date().getTime(),
                    elementId: parseInt(id, 10),
                    user: parseInt(user, 10),
                    team: parseInt(team, 10),
                    type,
                    intersectionRatio,
                    isIntersecting,
                    time,
                    sessionId: sessionid,
                };
            }

            // boundingClientRect: DOMRect { x: 0, y: 336.48333740234375, width: 1191, … }
            // intersectionRatio: 1
            // intersectionRect: DOMRect { x: 0, y: 336.48333740234375, width: 1191, … }
            // isIntersecting: true
            // rootBounds: DOMRect { x: 0, y: 0, width: 1206, … }
            // target: <div class="row pt-3 pb-3 bg-light" style="">
            // time: 26522.14
            // console.log({ id, title, intersectionRatio, isIntersecting, time });
        });
    }

    static getIntersectionObserverHistory() {
        const elements = INTERSECTION_HISTORY.splice(0, INTERSECTION_HISTORY.length);
        return elements; 
    }

    static getViews(statistics = {}) {
        let views = 0;
        if (util.isObject(statistics)) {
            const years = Object.keys(statistics)
            for (let i = 0, l = years.length; i < l; i += 1) {
                const year = years[i];
                if (util.isObject(statistics[year])) {
                    const weeks = Object.keys(statistics[year]);
                    for (let j = 0, m = weeks.length; j < m; j += 1) {
                        const week = weeks[j];
                        const count = statistics[year][week].count;
                        if (util.isNumber(count)) {
                            views += count;
                        }
                    }
                }
            }
        }
        return views;
    }

    static getAdminData(statistics = {}) {
        let data = {
            count: 0,
        };
        if (util.isObject(statistics)) {
            const years = Object.keys(statistics).sort();
            for (let i = 0, l = years.length; i < l; i += 1) {
                const year = years[i];
                if (util.isObject(statistics[year])) {
                    const weeks = Object.keys(statistics[year]).sort();
                    for (let j = 0, m = weeks.length; j < m; j += 1) {
                        const week = weeks[j];
                        const count = statistics[year][week].count;
                        if (util.isNumber(count)) {
                            data.count += count;
                        }
                        const ranking = statistics[year][week].ranking;
                        if (util.isNumber(ranking)) {
                            data.rankingTrend = 0;
                            if (data.ranking && data.ranking < ranking) {
                                data.rankingTrend = -1;
                            }
                            if (data.ranking && data.ranking > ranking) {
                                data.rankingTrend = 1;
                            }
                            data.ranking = ranking;
                        }
                        const durationAvg = statistics[year][week].durationAvg;
                        if (util.isNumber(durationAvg)) {
                            data.durationAvgTrend = 0;
                            if (data.durationAvg && data.durationAvg < durationAvg) {
                                data.durationAvgTrend = -1;
                            }
                            if (data.durationAvg && data.durationAvg > durationAvg) {
                                data.durationAvgTrend = 1;
                            }
                            data.durationAvg = durationAvg;
                        }
                        const timeAvg = statistics[year][week].timeAvg;
                        if (util.isNumber(timeAvg)) {
                            data.timeAvgTrend = 0;
                            if (data.timeAvg && data.timeAvg < timeAvg) {
                                data.timeAvgTrend = -1;
                            }
                            if (data.timeAvg && data.timeAvg > timeAvg) {
                                data.timeAvgTrend = 1;
                            }
                            data.timeAvg = timeAvg;
                        }
                    }
                }
            }
        }
        return data;
    }

    static getClassForTrend(trend) {
        if (trend === 1) {
            return 'fas fa-arrow-up text-success';
        }
        if (trend === -1) {
            return 'fas fa-arrow-down text-danger';
        }
        return 'fas fa-ellipsis-h text-secondary';
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static captureEvents(e) {
        e.stopPropagation();
    }

    static getGraphData(inputObject) {
        const legends = Object.keys(inputObject);
        const data = legends.map(e => util.getNestedValue(inputObject, e) || []);
        return {
            legends,
            data,
        };
    }
}

export default MusherUtil;
// module.exports = MusherUtil;
