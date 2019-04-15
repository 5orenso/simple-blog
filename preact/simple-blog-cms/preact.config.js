const WorkboxPlugin = require('workbox-webpack-plugin');

export default (config, env, helpers) => {
    config.plugins.push(
        new WorkboxPlugin.InjectManifest({
            swSrc: './service-worker.js',
            swDest: './service-worker.js',
            include: [/\.html$/, /\.js$/, /\.svg$/, /\.css$/, /\.png$/, /\.ico$/]
        })
    );
    delete config.entry.polyfills;
    config.output.filename = "[name].js";

    let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
    plugin.options.disable = true;

    if (env.production) {
        config.output.libraryTarget = "umd";
    }
};
