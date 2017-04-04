var webpack = require('webpack');

module.exports = {
  plugins: [
   new webpack.NoEmitOnErrorsPlugin(),
   new webpack.optimize.UglifyJsPlugin({ minimize: true, compress: { warnings: false, drop_console: true }}),   //uglify, minify
   new webpack.DefinePlugin({
     'process.env': {
       // This has effect on the react lib size
       NODE_ENV: JSON.stringify('production'),
     },
   }),
  ],
};
