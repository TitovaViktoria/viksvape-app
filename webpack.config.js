const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const devServer = isDev =>
isDev
? {
    devServer: {
        open:true,
        hot: true,
        port: 8080,
        static: path.join(__dirname, 'dest'),
    },
}
:{};
const MiniCssPlugin = require('mini-css-extract-plugin');
module.exports=(env,argv)=> ({
    plugins:[
        new HtmlWebPackPlugin ({template: 'src/index.html'}),
        new CopyPlugin ({
            patterns: [
              { from: 'src/assets', to: 'assets'},
              
            ]
        }),
        new MiniCssPlugin({filename: 'style.css'}),
    ],
 entry: './src/script.ts',
  module: 
   {
     rules: [
         {
            test: /\.tsx?$/,
            use:'ts-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.scss$/i,
            use:[MiniCssPlugin.loader,{
                loader: 'css-loader',
                options:{
                    url:false
                }},'sass-loader'],
        }
    ], 
},
resolve:{
    extensions: ['.ts','.js'],
 },
output:{
    filename:'script.js',
    path: path.resolve(__dirname, 'dest'),
    clean: true,
},
    mode: argv.mode === 'development' ? 'development':
    'production',
    devtool: argv.mode === 'development' ? 'inline-source-map':
    false,
    ...devServer(argv.mode === 'development')

});
new CopyPlugin({
    patterns: [
        { from: 'src/404.html', to: '404.html'},
    ]
})