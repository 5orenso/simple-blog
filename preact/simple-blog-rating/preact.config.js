export default {
    webpack(config, env, helpers, options) {
        // config.entry = 'index.js';
        config.output = {
            path: __dirname + '/bundle',
            filename: '[name].js'
        };
	},
};
