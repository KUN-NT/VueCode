var path=require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const { NOTIMP } = require('dns');

module.exports={
    mode:'development',//打包模式 development/production
    entry:'./src/lib/index.js',
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'vue-toast-demo.js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                include:path.join(__dirname,'src'), //只解析src目录下js文件
                exclude:/node_moules/ //排除node_moules了目录下js
            },
            {
                test:/\.vue$/,
                loader:'vue-loader',
                exclude:/node_moules/,
                options:{
                    loaders:{
                        scss:'style-loader!css-loader!sass-loader'
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ['css-loader', 'sass-loader']
              }, 
        ]
    },
    plugins:[
        new VueLoaderPlugin()
    ]
}