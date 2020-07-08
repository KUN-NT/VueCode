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
        publicPath: '' //引用文件前缀
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
    ],
    devServer:{ //开启服务
        contentBase:__dirname+"/dist",
        host:"localhost",
        port:8080,
        hot:true, //热更新
        open:true,//默认打开浏览器
        openPage:'index.html',//默认打开浏览器
        proxy:{ //接口代理 实现跨域
            "/api":{ 
                target:"http://lemall.futurefe.com",
                changeOrigin:true
            }
        }
    }
    //devtool:'#source-map'
}