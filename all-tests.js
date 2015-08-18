'use strict';

require('./test/lib/article-test.js');
require('./test/lib/category-test.js');
require('./test/lib/logger-test.js');
require('./test/lib/search-test.js');

require('./test/lib/article-util-test.js');
require('./test/lib/category-util-test.js');
require('./test/lib/local-util-test.js');

require('./test/lib/adapter/markdown-test.js');
require('./test/lib/adapter/postgresql-test.js');
require('./test/lib/adapter/elasticsearch-test.js');

require('./test/lib/plugins/flot-test.js');
require('./test/lib/plugins/wsd-test.js');
require('./test/lib/plugins/googleMaps-test.js');

require('./test/lib/replacers/codeStyle-test.js');
require('./test/lib/replacers/hashTags-test.js');
require('./test/lib/replacers/twitterUsers-test.js');

require('./test/app/routes/api-test.js');
require('./test/app/routes/web-test.js');
require('./test/app/routes/image-test.js');
require('./test/app/routes/stats-test.js');
require('./test/app/routes/search-test.js');
require('./test/app/routes/rss-test.js');
