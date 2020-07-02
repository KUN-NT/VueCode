var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        index: './src/js/index.js',
        cart: './src/js/cart.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: path.join(__dirname, './src'),
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                  })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: 'cart.html',
            template: './src/cart.html',
            chunks: ['cart']
        }),
        new CleanWebpackPlugin(),
        new ExtractTextPlugin('index.css')
    ]
    //devtool:'#source-map'
}