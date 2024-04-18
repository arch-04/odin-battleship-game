import path from 'path';

export default {
    entry: './src/game.js',
    output: {
        filename: 'main.js',
        path: path.resolve('dist')
    },
    devServer: {
        static: {
            directory: path.join('dist'),
            publicPath: '/',
            serveIndex: true, // This enables directory listing, which can be set to false if you always want to serve `game.html`
            watch: true,
        },
        compress: true,
        port: 8080,
        open: '/game.html', // Automatically open `game.html` in the browser
        hot: true,
        historyApiFallback: {
            index: '/game.html' // Serve `game.html` on 404 errors, useful for Single Page Applications
        }
    },
    module: {
        rules: [
          {
            test: /\.css$/, // Target .css files
            use: ['style-loader', 'css-loader'] // Apply both loaders
          },
          {
            test: /\.scss$/, // Target .scss files
            use: ['style-loader', 'css-loader', 'sass-loader'] // Apply loaders for Sass
          }
        ]
    },
    mode: 'development',
    devtool: 'inline-source-map'
};
