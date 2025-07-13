import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __dirname = path.resolve();

// Detectar si es producción o desarrollo
const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

export default {
  mode: mode,
  entry: './src/js/index.js',
  output: {
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    // Importante: para GitHub Pages usar el nombre de tu repo
    publicPath: isProduction ? '/Batatabit/' : '/',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    open: true,
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
      }),
    ] : []),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        // Solo copiar CSS si no estamos en producción
        ...(isProduction ? [] : [{ from: 'src/css', to: 'css' }]),
      ],
    }),
  ],
};