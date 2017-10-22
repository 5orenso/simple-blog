/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

let opts;

function MyPlugin(opt) {
    opts = opt || {
        regexp: /```flot\s+([\s\S]+?)```/g,
    };
}

MyPlugin.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

MyPlugin.prototype.get = function get(key) {
    return opts[key];
};

MyPlugin.prototype.replacer = function replacer(match, $p1) {
    let xaxis = {};
    let yaxis = {};
    let p1 = $p1.replace(/xaxis:([\S\s]+?\})/gm, (m, p) => {
        try {
            xaxis = JSON.parse(p);
        } catch (error) {
            console.error(error);
        }
        return '';
    });
    p1 = p1.replace(/yaxis:([\S\s]+?\})/gm, (m, p) => {
        // console.log(p);
        try {
            yaxis = JSON.parse(p);
        } catch (error) {
            console.error(error);
        }
        return '';
    });
    const uid = `_${(new Date()).getTime()}_${Math.floor((Math.random() * 10000) + 1)}`;

    return `<div class="row">
                <div class="flot-container 10u">
                    <div id="flotplaceholder'}${uid}" class="flot-placeholder" style="float:left;
                        width:100%; min-height:350px"></div>
                    </div>
                    <div id="flot-legend${uid}" class="flot-legend 2u"></div>
                </div>
                <div class="row">
                    <div id="flot-choices${uid}" class="flot-choices 12u"></div>
                </div>
                <script type="text/javascript">
                    $(function() {
                        var datasets${uid} = ${p1};
                        var xaxis = JSON.parse('${JSON.stringify(xaxis)}');
                        var yaxis = JSON.parse('${JSON.stringify(yaxis)}');
                        // console.log(yaxis);
                        // hard-code color indices to prevent them from shifting as
                        // countries are turned on/off
                        var i = 0;
                        // insert checkboxes
                        var choiceContainer${uid} = $("#flot-choices${uid}");
                        var keys = [];
                        for (var key in datasets${uid}) {
                            keys.push(key);
                        }
                        keys.sort();
                        for (var i=0; i < keys.length; i++) {
                            var key = keys[i];
                            var val = datasets${uid}[key];
                            choiceContainer${uid}.append("<input type='checkbox' name='" + key +
                            "' checked='checked' id='id" + key + "'></input>" +
                            "<label for='id" + key + "'>"
                            + val.label + "</label>");
                        }
                        function plot${uid}() {
                            plotAccordingToChoices(datasets${uid}, choiceContainer${uid},
                                "#flotplaceholder${uid}", "#flot-legend${uid}", xaxis, yaxis);
                        }
                        choiceContainer${uid}.find("input").click(plot${uid});
                        plotAccordingToChoices(datasets${uid}, choiceContainer${uid}, "#flotplaceholder${uid}",
                            "#flot-legend${uid}", xaxis, yaxis);
                    });
                </script>
            </div>`;
};

module.exports = MyPlugin;
