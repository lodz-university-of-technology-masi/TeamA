const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        home: './src/js/home.js',
        login: './src/js/login.js'
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/dist/js`
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /js(\/|\\).*\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /vendor(\/|\\).*\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../vendor/'
                    }
                }
            },
            {
                test: /icons(\/|\\).*\.(svg|png|jpg|gif|jpeg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                        publicPath: './icons/',
                        outputPath: '../icons/'
                    }
                }
            }
        ]
    }
}
