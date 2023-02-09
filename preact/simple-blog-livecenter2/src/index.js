import habitat from "preact-habitat";

import Widget from "./app";

let _habitat = habitat(Widget);

_habitat.render({
    selector: '[data-widget-host="simple-blog-livecenter2"]',
    clean: true
});