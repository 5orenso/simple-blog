import { injectManifest } from 'preact-cli-workbox-plugin';
import path from 'path';

export default function (config, env, helpers) {
    if (!env.dev) {
        config.output.publicPath = '/global/themusher/';
    }

    const manifestPlugin = helpers.getPluginsByName(config, 'InjectManifest')[0];
    if (manifestPlugin) {
        manifestPlugin.plugin.config.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024; // or however much you need. This is 5mb.
        // manifestPlugin.plugin.config.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024; // or however much you need. This is 5mb.
    } 

    const swPath = path.join('../src', 'sw.js');
    console.log({ swPath });
    // return injectManifest(config, env, helpers, {
    //     maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    //     swSrc: swPath,
    // });
};

// export default (config, env, helpers) => {
//     if (!env.dev) {
//         config.output.publicPath = '/global/themusher/';
//     }
//     const manifestPlugin = helpers.getPluginsByName(config, 'InjectManifest')[0];
//     if (manifestPlugin) {
// console.log({ manifestPlugin, config: manifestPlugin.plugin.config, webpackCompilationPlugins: manifestPlugin.plugin.config.webpackCompilationPlugins });
//         manifestPlugin.plugin.config.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024; // or however much you need. This is 10mb.
// console.log({ manifestPlugin, config: manifestPlugin.plugin.config, webpackCompilationPlugins: manifestPlugin.plugin.config.webpackCompilationPlugins });
//     }

    // const critters = helpers.getPluginsByName(config, 'Critters')[0];
    // if (critters) {
    //     // The default strategy in Preact CLI is "media",
    //     // but there are 6 different loading techniques:
    //     // https://github.com/GoogleChromeLabs/critters#preloadstrategy
    //     critters.plugin.options.preload = 'body';
    // }
// };


// env {
//   _: [],
//   src: '/Users/sorenso/Projects/test-preact-x/src',
//   cwd: '/Users/sorenso/Projects/test-preact-x',
//   esm: false,
//   clear: true,
//   sw: undefined,
//   rhl: false,
//   json: undefined,
//   https: undefined,
//   key: undefined,
//   cert: undefined,
//   cacert: undefined,
//   prerender: undefined,
//   template: undefined,
//   config: 'preact.config.js',
//   host: '0.0.0.0',
//   port: 8080,
//   prerenderUrls: 'prerender-urls.json',
//   c: 'preact.config.js',
//   H: '0.0.0.0',
//   p: 8080,
//   production: false,
//   isProd: false,
//   isWatch: true,
//   source: [Function],
//   dest: '/Users/sorenso/Projects/test-preact-x/build',
//   manifest: {
//     name: 'test-preact-x',
//     short_name: 'test-preact-x',
//     start_url: '/',
//     display: 'standalone',
//     orientation: 'portrait',
//     background_color: '#fff',
//     theme_color: '#673ab8',
//     icons: [ [Object], [Object] ]
//   },
//   pkg: {
//     private: true,
//     name: 'test-preact-x',
//     version: '0.0.0',
//     license: 'MIT',
//     scripts: {
//       start: 'per-env',
//       'start:production': 'npm run -s serve',
//       'start:development': 'npm run -s dev',
//       build: 'preact build --no-prerender --no-service-worker',
//       serve: 'preact build && sirv build --cors --single',
//       dev: 'preact watch',
//       lint: 'eslint src',
//       test: 'jest'
//     },
//     eslintConfig: { extends: 'preact', ignorePatterns: [Array] },
//     devDependencies: {
//       enzyme: '^3.10.0',
//       'enzyme-adapter-preact-pure': '^2.0.0',
//       eslint: '^6.0.1',
//       'eslint-config-preact': '^1.1.0',
//       'identity-obj-proxy': '^3.0.0',
//       jest: '^24.9.0',
//       'jest-preset-preact': '^1.0.0',
//       'per-env': '^1.0.2',
//       'preact-cli': '^3.0.0-rc.6',
//       'preact-render-spy': '^1.2.1',
//       'sirv-cli': '^0.4.5'
//     },
//     dependencies: {
//       history: '^4.10.1',
//       leaflet: '^1.6.0',
//       'mapbox-gl-leaflet': '0.0.12',
//       preact: '^10.3.2',
//       'preact-render-to-string': '^5.1.4',
//       'preact-router': '^3.2.1',
//       'react-leaflet': '^2.6.3'
//     },
//     jest: { preset: 'jest-preset-preact', setupFiles: [Array] }
//   },
//   isServer: false,
//   dev: true,
//   ssr: false
// }

// config {
//   context: '/Users/sorenso/Projects/RM515/src',
//   resolve: {
//     modules: [
//       '/Users/sorenso/Projects/RM515/node_modules',
//       '/Users/sorenso/Projects/node_modules',
//       '/Users/sorenso/Projects/RM515/node_modules/preact-cli/node_modules',
//       'node_modules'
//     ],
//     extensions: [
//       '.mjs',  '.js',
//       '.jsx',  '.ts',
//       '.tsx',  '.json',
//       '.less', '.pcss',
//       '.scss', '.sass',
//       '.styl', '.css',
//       '.wasm'
//     ],
//     alias: {
//       style: '/Users/sorenso/Projects/RM515/src/style',
//       'preact-cli-entrypoint': '/Users/sorenso/Projects/RM515/src/index',
//       react: 'preact/compat',
//       'react-dom': 'preact/compat',
//       'react-addons-css-transition-group': 'preact-css-transition-group',
//       'preact-cli/async-component': '/Users/sorenso/Projects/RM515/node_modules/@preact/async-loader/async.js',
//       'preact-compat': 'preact/compat'
//     }
//   },
//   resolveLoader: {
//     modules: [
//       '/Users/sorenso/Projects/RM515/node_modules',
//       '/Users/sorenso/Projects/node_modules',
//       '/Users/sorenso/Projects/RM515/node_modules/preact-cli/node_modules'
//     ],
//     alias: {
//       'proxy-loader': '/Users/sorenso/Projects/RM515/node_modules/preact-cli/lib/lib/webpack/proxy-loader.js',
//       async: '/Users/sorenso/Projects/RM515/node_modules/@preact/async-loader/index.js'
//     }
//   },
//   module: {
//     rules: [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object]
//     ]
//   },
//   plugins: [
//     NoEmitOnErrorsPlugin {},
//     DefinePlugin { definitions: [Object] },
//     ProvidePlugin { definitions: [Object] },
//     WebpackFixStyleOnlyEntriesPlugin {
//       apply: [Function: bound apply],
//       options: [Object]
//     },
//     MiniCssExtractPlugin { options: [Object] },
//     ProgressPlugin {
//       profile: false,
//       handler: [Function],
//       modulesCount: 500,
//       showEntries: false,
//       showModules: true,
//       showActiveModules: true
//     },
//     SizePlugin {
//       options: [Object],
//       pattern: '**/*.{mjs,js,css,html}',
//       exclude: undefined,
//       filename: '/Users/sorenso/Projects/RM515/size-plugin.json'
//     },
//     PushManifestPlugin { isESMBuild_: false },
//     HtmlWebpackPlugin { options: [Object] },
//     HtmlWebpackExcludeAssetsPlugin {
//       PluginName: 'HtmlWebpackExcludeAssetsPlugin'
//     },
//     PrerenderDataExtractPlugin { location_: '/', data_: '{"url":"/"}' },
//     CopyPlugin { patterns: [Array], options: {} },
//     NamedModulesPlugin { options: {} },
//     HotModuleReplacementPlugin {
//       options: {},
//       multiStep: undefined,
//       fullBuildTimeout: 200,
//       requestTimeout: 10000
//     },
//     DefinePlugin { definitions: [Object] }
//   ],
//   optimization: { splitChunks: { minChunks: 3 } },
//   mode: 'development',
//   devtool: 'cheap-module-eval-source-map',
//   node: {
//     console: false,
//     process: false,
//     Buffer: false,
//     __filename: false,
//     __dirname: false,
//     setImmediate: false
//   },
//   entry: {
//     bundle: [
//       '/Users/sorenso/Projects/RM515/node_modules/preact-cli/lib/lib/entry',
//       'webpack-dev-server/client',
//       'webpack/hot/dev-server'
//     ],
//     polyfills: '/Users/sorenso/Projects/RM515/node_modules/preact-cli/lib/lib/webpack/polyfills'
//   },
//   output: {
//     path: '/Users/sorenso/Projects/RM515/build',
//     publicPath: '/',
//     filename: '[name].js',
//     chunkFilename: '[name].chunk.[chunkhash:5].js'
//   },
//   devServer: {
//     inline: true,
//     hot: true,
//     compress: true,
//     publicPath: '/',
//     contentBase: '/Users/sorenso/Projects/RM515/src',
//     https: undefined,
//     port: '60000',
//     host: '0.0.0.0',
//     disableHostCheck: true,
//     historyApiFallback: true,
//     quiet: true,
//     clientLogLevel: 'none',
//     overlay: false,
//     stats: 'minimal',
//     watchOptions: { ignored: [Array] }
//   }
// }