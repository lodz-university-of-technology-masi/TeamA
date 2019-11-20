const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        home: './src/js/home.js',
        index: './src/js/script.js'
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/dist/js`
    },
    watch: false,
    mode: 'development',
    plugins: [
        new MiniCssExtractPlugin({ filename: '../css/[name].css' })
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    }
}
