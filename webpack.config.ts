import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { config } from 'dotenv';

config();

const { NODE_ENV, PORT } = process.env;
const outDir = path.resolve('build');
const isProd = NODE_ENV === 'production';
const isDevelopment = NODE_ENV === 'development';

function checkNodeEnv(
  nodeEnv: string | undefined,
): nodeEnv is 'development' | 'production' {
  return !!nodeEnv && ['development', 'production'].includes(nodeEnv);
}

if (!checkNodeEnv(NODE_ENV)) {
  // eslint-disable-next-line no-console
  console.error('NODE_ENV must be set to development or production');
  process.exit(1);
}

const webpackConfig: webpack.Configuration = {
  mode: NODE_ENV,
  output: {
    filename:
      isDevelopment
        ? '[name].[fullhash].js'
        : '[name].[contenthash].js',
    path: outDir,
    publicPath: '/',
  },
  entry: ['babel-polyfill', './src/index.tsx'],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: isDevelopment ? ['react-refresh/babel'] : undefined,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@containers': '/src/containers',
      '@assets': '/src/assets',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/public/index.html',
      minify:
        isProd
          ? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
          }
          : false,
    }),
    new CopyWebpackPlugin({ patterns: [{ from: 'src/assets', to: 'assets', noErrorOnMissing: true }] }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: './tsconfig.json',
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ],
  devtool: isDevelopment ? 'source-map' : 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    disableHostCheck: true,
    port: +(PORT ?? 3333),
    open: true,
    hot: true,
  },
};

export default webpackConfig;
