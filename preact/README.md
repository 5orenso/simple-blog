
# Before you start

Install preact-cli from this repo:
https://github.com/developit/preact-cli

```bash
$ npm install -g preact-cli
```


# Create a new widget

```bash
$ preact create widget simple-blog-cms
$ cd simple-blog-cms/
$ rm package-lock.json
$ npm install

# To start a development live-reload server:
$ npm run start

# To create a production build (in ./build):
$ npm run build

# To start a production HTTP/2 server:
$ npm run serve

```


1. Add to package.json:

    "build": "preact build --no-prerender --no-sw --template src/template.html",


2. Add preact.config.js:

export default {
    webpack(config, env, helpers, options) {
        // config.entry = 'index.js';
        config.output = {
            path: __dirname + '/bundle',
            filename: '[name].js'
        };
	},
};


3. Clean up src/components.js

import { h } from 'preact';

export default function App(props) {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}


4. Fix src/index.js and add correct habitat name:

_habitat.render({
  selector: '[data-widget-host="simple-blog-helloworld"]',
  clean: true
});


4. Fix src/template.html and add correct habitat:

		<div data-widget-host="simple-blog-helloworld" class="preview">

5. Add widget to simple-blog-cms/lib/components/articleEdit.js

const widgetList = ['clock', 'booking', 'poll', 'gallery', 'weather', 'rating', 'related'];


6. Add widget to template/bootstrap4/inc/_blog_v2.html

7. Add widget to template/bootstrap4/inc/_index_v2.html

8. Add widget to template/bootstrap4/inc/articleMacro.html

