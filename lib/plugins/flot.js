/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var opts;

function MyPlugin(opt, mockServices) {
    opts = opt || {
        regexp: /```flot\s+([\s\S]+?)```/g
    };
    mockServices = mockServices || {};
}

MyPlugin.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

MyPlugin.prototype.get = function get(key) {
    return opts[key];
};

MyPlugin.prototype.replacer = function replacer(match, p1) {
    var xaxis = {};
    var yaxis = {};
    p1 = p1.replace(/xaxis:([\S\s]+?\})/gm, function (m, p) {
        try {
            xaxis = JSON.parse(p);
        } catch (error) {
            console.error(error);
        }
        return '';
    });
    p1 = p1.replace(/yaxis:([\S\s]+?\})/gm, function (m, p) {
        // console.log(p);
        try {
            yaxis = JSON.parse(p);
        } catch (error) {
            console.error(error);
        }
        return '';
    });
    var uid = '_' + (new Date()).getTime() + '_' + (Math.floor((Math.random() * 10000) + 1));
    return '<div class="row">' + "\n" +
        '    <div class="flot-container 10u">' +
        '        <div id="flotplaceholder' + uid + '" class="flot-placeholder" style="float:left; width:100%; min-height:350px"></div>' + "\n" +
        '    </div>' + "\n" +
        '    <div id="flot-legend' + uid + '" class="flot-legend 2u"></div>' + "\n" +
        '</div>' + "\n" +
        '<div class="row">' + "\n" +
        '    <div id="flot-choices' + uid + '" class="flot-choices 12u"></div>' + "\n" +
        '</div>' + "\n" +
        '<script type="text/javascript">' + "\n" +
        ' $(function() { ' + "\n" +
        '     var datasets' + uid + ' = ' + p1 + '; ' + "\n" +
        '     var xaxis = JSON.parse(\'' + JSON.stringify(xaxis) + '\');' + "\n" +
        '     var yaxis = JSON.parse(\'' + JSON.stringify(yaxis) + '\');' + "\n" +
        //'     console.log(yaxis);' + "\n" +
        '     // hard-code color indices to prevent them from shifting as ' + "\n" +
        '     // countries are turned on/off ' + "\n" +
        '     var i = 0; ' + "\n" +
        //'     $.each(datasets' + uid + ', function(key, val) { ' + "\n" +
        //'         val.color = i; ' + "\n" +
        //'         ++i; ' + "\n" +
        //'     }); ' + "\n" +
        '     // insert checkboxes ' + "\n" +
        '     var choiceContainer' + uid + ' = $("#flot-choices' + uid + '"); ' + "\n" +
        '     var keys = [];' + "\n" +
        '     for (var key in datasets' + uid + ') {' + "\n" +
        '         keys.push(key);' + "\n" +
        '     }' + "\n" +
        '     keys.sort();' + "\n" +
        '     for (var i=0; i < keys.length; i++) {' + "\n" +
        '         var key = keys[i];' + "\n" +
        '         var val = datasets' + uid + '[key];' + "\n" +
        '         choiceContainer' + uid + '.append("<input type=\'checkbox\' name=\'" + key + ' + "\n" +
        '         "\' checked=\'checked\' id=\'id" + key + "\'></input>" + ' + "\n" +
        '        "<label for=\'id" + key + "\'>" ' + "\n" +
        '         + val.label + "</label>"); ' + "\n" +
        '     } ' + "\n" +
        '     function plot' + uid + '() {' + "\n" +
        '         plotAccordingToChoices(datasets' + uid + ', choiceContainer' + uid + ', "#flotplaceholder' + uid + '", "#flot-legend' + uid + '", xaxis, yaxis); ' + "\n" +
        '     ' + "\n" +
        '     ' + "\n" +
        '     }' + "\n" +
        '     choiceContainer' + uid + '.find("input").click(plot' + uid + '); ' + "\n" +
        '     plotAccordingToChoices(datasets' + uid + ', choiceContainer' + uid + ', "#flotplaceholder' + uid + '", "#flot-legend' + uid + '", xaxis, yaxis); ' + "\n" +
        ' }); ' + "\n" +
        '</script>';
};

module.exports = MyPlugin;
