import habitat from "preact-habitat";

import Widget from "./component";

let _habitat = habitat(Widget);

_habitat.render({
  selector: '[data-widget-host="simple-blog-logo-grid"]',
  clean: true
});
