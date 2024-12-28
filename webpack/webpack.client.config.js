const path = require('path')
module.exports = (env) => {
  const isProduction = env.production === true
  return {
    entry: './src/client/index.tsx',
    mode: isProduction ? 'production' : 'development',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'script.js'
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
  }
}
