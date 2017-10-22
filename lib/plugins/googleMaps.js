/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

let opts;
const _ = require('underscore');
const url = require('url');
const qs = require('querystring');

function MyPlugin(opt) {
    opts = opt || {
        regexp: /[\s\t\n]+@([a-z0-9.+]+,[a-z0-9.+]+[^;\s]*)(;[^\n\t\s]+)*/gi,
        // regexp: /[\s]+@([a-z0-9\.]+,[a-z0-9\.]+[^;]*)(;\d+)*(;[^\n\t\s]+)*/gi

    };
}

MyPlugin.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

MyPlugin.prototype.get = function get(key) {
    return opts[key];
};

MyPlugin.prototype.replacer = function replacer($match, p1, p2) {
    let match = $match;
    let mapMode = 'search'; // place, directions, search, view, or streetview.
    let help = false;
    const error = [];
    const usedOptions = [];
    const optionalOptions = [];
    const excessiveOptions = [];
    let opt = {
        key: 'AIzaSyCBFmQdXgrkFbuVjvP7o-d_zqYCgxkMq_Y',
        zoom: 10,
        q: p1,
    };
    const modeKeys = {
        place: {
            key: { required: true, type: 'string' },
            q: { required: true, type: 'string', example: 'Oslo,Norway or 69.9396,22.9232' },
            zoom: {
                required: false, type: 'string', values: '1-20', example: '10',
            },
            attribution_source: { required: false, type: 'string', example: 'Google+Maps+Embed+API' },
            attribution_web_url: { required: false, type: 'string', example: 'http://www.butchartgardens.com/' },
            attribution_ios_deep_link_id: {
                required: false,
                type: 'string',
                example: 'comgooglemaps://?daddr=Butchart+Gardens+Victoria+BC',
            },
        },
        directions: {
            key: { required: true, type: 'string' },
            origin: { required: true, type: 'string', example: 'Oslo,Norway' },
            destination: { required: true, type: 'string', example: 'Skien,Norway' },
            waypoints: { required: false, type: 'string', example: 'Drammen,Norway|Tonsberg,Norway' },
            mode: {
                required: false,
                type: 'string',
                values: 'driving, walking, bicycling, transit, flying',
                example: 'walking',
            },
            avoid: {
                required: false,
                type: 'string',
                values: 'tolls, ferries, highways',
                example: 'tolls|highways',
            },
            units: {
                required: false, type: 'string', values: 'metric, imperial', example: 'metric',
            },
        },
        search: {
            key: { required: true, type: 'string' },
            q: { required: true, type: 'string', example: 'Oslo,Norway or 69.9396,22.9232' },
            zoom: {
                required: false, type: 'string', values: '1-20', example: '10',
            },
        },
        view: {
            key: { required: true, type: 'string' },
            center: { required: true, type: 'string', example: 'Oslo,Norway or 69.9396,22.9232' },
            zoom: {
                required: false, type: 'string', values: '1-20', example: '10',
            },
            maptype: {
                required: false, type: 'string', values: 'roadmap, satellite', example: 'satellite',
            },
            language: { required: false, type: 'string' },
            region: { required: false, type: 'string' },
        },
        streetview: {
            key: { required: true, type: 'string' },
            location: { required: true, type: 'string', example: 'Oslo,Norway or 69.9396,22.9232' },
            heading: {
                required: false, type: 'string', values: '-180&deg; - 360&deg;', example: '270',
            },
            pitch: {
                required: false, type: 'string', values: '-90&deg; - 90&deg;', example: '-10',
            },
            fov: {
                required: false, type: 'string', values: '10&deg; - 100&deg;', example: '90',
            },
            language: { required: false, type: 'string' },
            region: { required: false, type: 'string' },
        },
    };
    if (_.isString(p2)) {
        let queryString = `?${p2.replace(/^;/, '')}`;
        queryString = queryString.replace(/;/, '&');
        const parsed = url.parse(queryString, true);
        if (_.isObject(parsed.query)) {
            opt = _.extend(opt, parsed.query);
        }
        //        console.log(opt, qs.stringify(opt.query));
    }
    if (_.isString(opt.mode) && !_.isEmpty(opt.mode)) {
        mapMode = opt.mode;
        delete opt.mode;
    }
    // place
    //           q : query
    // attribution_source  : attributes the save to your site or app. You must include a custom attribution_source
    //                       before setting either attribution_web_url or attribution_ios_deep_link_id. Defaults to
    //                       the URL path of the page on which the map appeared, for example: https://example.com/path/
    // attribution_web_url : specifies a link back to your website. If attribution_source is not specified,
    //                       attribution_web_url will default to the URL on which the embedded map appears, for
    //                       example: https://example.com/path/page.html
    // attribution_ios_deep_link_id : specifies a URL Scheme that provides a deep link into an iOS application. When
    //                                viewed on Google Maps for iOS, the attribution_ios_deep_link_id will be shown
    //                                in place of the attribution_web_url.
    //
    // directions
    //      origin :
    // destination :
    // [waypoints] : specifies one or more intermediary places to route directions through between the origin and
    //               destination. Multiple waypoints can be specified by using the pipe character (|) to separate
    //               places (e.g. Berlin,Germany|Paris,France). You can specify up to 20 waypoints.
    //      [mode] : defines the method of travel. Options are driving, walking (which prefers pedestrian paths and
    //               sidewalks, where available), bicycling (which routes via bike paths and preferred streets where
    //               available), transit, or flying. If no mode is specified, the Embed API will show one or more of
    //               the most relevant modes for the specified route.
    //     [avoid] : tells Google Maps to avoid tolls, ferries and/or highways. Separate multiple values with the
    //               pipe character (e.g. avoid=tolls|highways). Note that this doesn't preclude routes that include
    //               the restricted feature(s); it simply biases the result to more favorable routes.
    //     [units] : specifies either metric or imperial units when displaying distances in the results. If units
    //               are not specified, the origin country of the query determines the units to use.
    //
    // search
    //           q : query
    //
    // view
    //      center : center of map
    //      [zoom] : sets the initial zoom level of the map. Accepted values range from 0 (the whole world) to 21
    //               (individual buildings). The upper limit can vary depending on the map data available at the
    //               selected location.
    //   [maptype] : can be either roadmap (the default) or satellite, and defines the type of map tiles to load.
    //  [language] : defines the language to use for UI elements and for the display of labels on map tiles. Note that
    //               this parameter is only supported for some country tiles; if the specific language requested is not
    //               supported for the tile set, then the default language for that tileset will be used. By default,
    //               visitors will see a map in their own language.
    //    [region] : defines the appropriate borders and labels to display, based on geo-political sensitivities.
    //               Accepts a region code specified as a two-character ccTLD (top-level domain) value.
    //
    // streetview
    //    location :
    //   [heading] : indicates the compass heading of the camera in degrees clockwise from North. Accepted values are
    //               from -180° to 360&deg.
    //     [pitch] : specifies the angle, up or down, of the camera. The pitch is specified in degrees from -90° to 90°.
    //               Positive values will angle the camera up, while negative values will angle the camera down. The
    //               default pitch of 0° is set based on on the position of the camera when the image was captured.
    //               Because of this, a pitch of 0° is often, but not always, horizontal. For example, an image taken
    //               on a hill will likely exhibit a default pitch that is not horizontal.
    //       [fov] : determines the horizontal field of view of the image. The field of view is expressed in degrees,
    //               with a range of 10° - 100°. It defaults to 90°. When dealing with a fixed-size viewport the field
    //               of view is can be considered the zoom level, with smaller numbers indicating a higher level of
    //               zoom.
    //  [language] : defines the language to use for UI elements and labels. By default, visitors will see UI elements
    //               in their own language.
    //    [region] : defines the appropriate borders and labels to display, based on geo-political sensitivities.
    //               Accepts a region code specified as a two-character ccTLD (top-level domain) value.
    //

    //    https://www.google.com/maps/embed/v1/streetview
    //        ?key=API_KEY
    //            &location=46.414382,10.013988
    //            &heading=210
    //            &pitch=10
    //            &fov=35
    //    https://www.google.com/maps/embed/v1/view
    //        ?key=API_KEY
    //            &center=-33.8569,151.2152
    //            &zoom=18
    //            &maptype=satellite
    //    https://www.google.com/maps/embed/v1/search
    //        ?key=API_KEY
    //            &q=record+stores+in+Seattle
    //    https://www.google.com/maps/embed/v1/directions
    //        ?key=API_KEY
    //            &origin=Oslo+Norway
    //            &destination=Telemark+Norway
    //            &avoid=tolls|highways
    //    https://www.google.com/maps/embed/v1/place
    //        ?key=API_KEY
    //            &q=Fisht+Olympic+Stadium,Sochi+Russia
    //            &attribution_source=Google+Maps+Embed+API
    //            &attribution_web_url=http://www.butchartgardens.com/
    //            &attribution_ios_deep_link_id=comgooglemaps://?daddr=Butchart+Gardens+Victoria+BC
    // console.log(match, '"' + mapMode + '"');
    if (mapMode.match(/^(view)/)) {
        opt.center = opt.q;
    } else if (mapMode.match(/^(streetview)/)) {
        opt.location = opt.q;
    } else if (mapMode.match(/^(directions)/)) {
        opt.origin = opt.q;
    }
    if (_.isObject(modeKeys[mapMode])) {
        // Check for excessive options.
        const optKeys = Object.keys(opt);
        for (let i = 0; i < optKeys; i += 1) {
            const key = optKeys[i];
            if (opt[key]) {
                if (key === 'help') {
                    help = true;
                }
                if (_.isUndefined(modeKeys[mapMode][key])) {
                    excessiveOptions.push(`${key} <pre>
                            <code class="hljs">${JSON.stringify(opt[key], undefined, 2)}</code>
                        </pre>`);
                    delete opt[key];
                }
            }
        }
        // Check for missing options.
        const mKeys = Object.keys(modeKeys[mapMode]);
        for (let j = 0; j < mKeys.length; j += 1) {
            const key = mKeys[j];
            if (_.isObject(modeKeys[mapMode][key])) {
                if (!modeKeys[mapMode][key].required && _.isUndefined(opt[key])) {
                    optionalOptions.push(`${key}: <pre>
                            <code class="hljs">${JSON.stringify(modeKeys[mapMode][key], undefined, 2)}</code>
                        </pre>`);
                } else if (!_.isUndefined(opt[key])) {
                    usedOptions.push(`${key}: <pre>
                            <code class="hljs">${JSON.stringify(modeKeys[mapMode][key], undefined, 2)}</code>
                        </pre>`);
                } else if (modeKeys[mapMode][key].required && _.isUndefined(opt[key])) {
                    error.push(`${key}: <pre>
                            <code class="hljs">${JSON.stringify(modeKeys[mapMode][key], undefined, 2)}</code>
                        </pre>`);
                    // console.log(j, modeKeys[mapMode][j]);
                }
            }
        }
    }

    function writeHelpOptions() {
        const optOptions = optionalOptions.map((el) => {
            if (!el.required) {
                return `<li>${el}</li>`;
            }
            return null;
        }).join('');
        const usedOpts = usedOptions.map((el) => {
            if (!el.required) {
                return `<li>${el}</li>`;
            }
            return null;
        }).join('');
        return `<div>${match}<br>_Other optional options_:
            <ul>${optOptions}</ul></div>
            <div>${match}<br>_Used options_:
            <ul>${usedOpts}</ul>
            </div>`;
    }

    match = match.replace(/[\n\t]/g, '');

    if (error.length > 0) {
        const missingParams = error.map(el => `<li>${el}</li>`).join('');
        const excessOptions = excessiveOptions.map(el => `<li>${el}</li>`).join('');
        const optOptions = optionalOptions.map((el) => {
            if (!el.required) {
                return `<li>${el}</li>`;
            }
            return null;
        }).join('');
        return `<div><strong>ERROR with googleMaps plugin! ${match} <br>Error: Missing parameters:</strong>
            <ul>${missingParams}</ul>
            Warn: Excessive options:
            <ul>${excessOptions}</ul>
            _Other optional options_:<ul>
                ${optOptions}
            </ul></div>`;
    }
    return `<iframe src="https://www.google.com/maps/embed/v1/${mapMode}?${(qs.stringify(opt))}"
        width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>
        ${(help ? writeHelpOptions() : '')}`;
};

module.exports = MyPlugin;
