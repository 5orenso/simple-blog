let poly = require("preact-cli/lib/lib/webpack/polyfills");

import { h } from "preact";
import habitat from "preact-habitat";

import Cms from "./components/cms";

const cms = habitat(Cms);

cms.render({
    selector: '[data-widget="simpleBlogCms"]',
    clean: true,
});
