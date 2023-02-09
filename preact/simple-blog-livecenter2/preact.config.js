export default {
    webpack(config, env, helpers, options) {
        // config.entry = 'index.js';
        // console.log({ env });
        if (!env.isWatch) {
            config.output = {
                path: __dirname + '/bundle',
                filename: '[name].js',
                publicPath: '/preact/simple-blog-livecenter/',
            };
        }
	},
};
