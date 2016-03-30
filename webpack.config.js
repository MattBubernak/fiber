// Ensure we have the path module. 
var path = require('path');

// Ensure we have the webpack module. 
var webpack = require('webpack');

// Dictionary of all of the modules for webpack. Exports the config file to global state.  
module.exports = {
  
  // Developer tool for enhance debugging. Eval  means modules are executed with eval. 
  devtool: 'eval',
  // Module entry point. 
  entry: {
    // App module 
    app : [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './lib/index.js'],
  },

  // Options affecting the output of the compilation. How to write compiled files to disk. 
  output: {
    // Default directory location
    path: path.join(__dirname, './public/js/'), 
    // Name of app 
    filename: `app.js`,
    // public URL address of the output files when referenced in a browser. 
    publicPath: '/js/'
  },
  // Pugins that are injected into the app. 
  plugins: [
    // Enables hot module replacement( requires records data if not in dev-server mode), and generates hot update chunks
    // of each chunk in the records. 
    new webpack.HotModuleReplacementPlugin()
  ],
  
  // Include polyfills or mock for various node things. 
  node: {
    // FileSystem defaulted to empty for node. 
    fs: "empty"
  },

  // Options for affecting the resolving of modules. 
  resolve: {
    // Replae modules with other modules or paths. 
    alias: {
      // React is replaced with the path to react. 
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    // Extensino should be .js, indicating 'javascript'
    extensions: ['', '.js']
  },

  // Like resolve but for loaders. 
  resolveLoader: {
    // a directory ( or array of directory absolute paths), where webpack looks for modules that were not found in 
    // resolve.root or resolve.modulesDirecotories. In our case, this it he node_modules directory. 
    'fallback': path.join(__dirname, 'node_modules')
  },
  // Options affecting the normal modules. 
  module: {
    // An array of loaders as strings 
    loaders: [
    {
      test: /\.js$/, // regex for matching the file extension. 
      loaders: ['react-hot', 'babel'], // what it should use to load modules. 
      exclude: /node_modules/, // excludes exceptions
      include: [path.join(__dirname,'./lib')] // directory we want to include. 
    },
    {
      test: /\.xml$/, // regex for xml
      loader: "raw" // use raw loader
    },
    {
      test: /\.json$/, // regex for json
      loaders: ['json-loader'] // use json loader 
    },
    {
      test: /\.css?$/, // regex for css
      loaders: ['style', 'raw'], // use style and raw
      include: __dirname // go from default dir. 
    }]
  }
};
