const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'app.css'
      })
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
  }
}
