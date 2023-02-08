import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require("./package.json");

const config: ForgeConfig = {
  packagerConfig: {
    icon: "assets/icon.png",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      exe: `${packageJSON.name}.exe`,
      // setupIcon: "assets/icon.png",
      // loadingGif: "assets/icon.png",
      title: `${packageJSON.name}`,
      setupExe: `${packageJSON.name} Setup - v${packageJSON.version}.exe`,
      skipUpdateIcon: true,
    }),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: "assets/icon.png",
        overwrite: true,
        format: "ULFO",
        name: `${packageJSON.name}`,
      },
    },
    new MakerDeb({
      options: {
        icon: "assets/icon.png",
      },
    }),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
