var path = require('path'); //Require the path module
var webpack = require('webpack'); //Require the webpack module

module.exports = { //Export these modules for node 
  entry: { //Entry points for modules
    app : [ //The app module
      './lib/index.js'], //The location of the app module
  },
  output: { //Output the module
    path: path.join(__dirname, './public/js/'), //Output it to this filename
    filename: `app.js`, //The name of the module
    publicPath: '/fiber/js/' //the public path to the module
  },
  plugins: [ //THe plugins 
    new webpack.DefinePlugin({ //Pack up the plugin 
        'process.env': {
          'NODE_ENV': JSON.stringify('production') //Turn the production dictionary ingo a json string
        }
    }),
    new webpack.optimize.UglifyJsPlugin({ //Optimize the string
    }),
  ],
  node: { 
    fs: "empty" //Start with empty filesystem
  },
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react') //Join the paths together
    },
    extensions: ['', '.js'] //Us js as the file extention
  },
  resolveLoader: {
    'fallback': path.join(__dirname, 'node_modules') //Join with the node modules
  },
  module: { //All modules for the app 
    loaders: [//Specifies 
    {
      test: /\.js$/, //Test the extention
      loaders: ['react-hot', 'babel'], //Uses these modules to load
      exclude: /node_modules/, //Module directory to no include
      include: [path.join(__dirname,'./lib')] //Pack up the lib directory
    },
    {
      test: /\.xml$/, //Xml extention
      loader: "raw" //Use the raw loader
    },
    {
      test: /\.json$/, //Json extention
      loaders: ['json-loader'] //Use the raw loader
    },
    {
      test: /\.css?$/, //Css extention
      loaders: ['style', 'raw'], //Use the raw loader
      include: __dirname //Also include the dirname directory
    }]
  }
};
