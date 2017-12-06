const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    watch: false,
    module: {
        rules: [
            /*{
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                }],
            },*/
            //Load js
            {
                test: /\.js?$/,
                exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                loader: 'babel-loader',
                query: {
                    presets: ['env'],
                    plugins: ['angularjs-annotate']
                }
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?url=false'
                })
            },
        ],
    },
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 200
    },
    entry: {
        './frontend/build/app': './frontend/src/AirportApp.js'
    },
    //devtool: 'inline-source-map',
    devServer: {
        contentBase: './demo',
        //hot:true
    },
    output: {
        path: __dirname,
        filename: '[name].bundle.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('[name].css').replace('css/js', 'css');
            },
            allChunks: true
        }),
        /*new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "Hammer": "hammerjs/hammer",
            createDayLabel: "jquery",
            createWeekdayLabel: "jquery"
        })*/
    ]
};