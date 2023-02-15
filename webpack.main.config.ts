import type { Configuration } from 'webpack';
import { default as CopyPlugin } from "copy-webpack-plugin";
import path from "path";

import { rules } from './webpack.rules';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dotenv = require("dotenv-webpack");

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from:  path.resolve(__dirname, ".env.json"),
        },
      ],
    }),
    new Dotenv(),
  ],
};
