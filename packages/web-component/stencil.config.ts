import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'web-component',
  globalStyle: 'src/styles/index.scss',
  plugins: [
    sass({
      injectGlobalPaths: ['src/styles/colors.scss', 'src/styles/theme.scss', 'src/styles/mixins.scss'],
    }),
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'docs-json',
      file: 'doc/docs.json',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    reactOutputTarget({
      componentCorePackage: 'web-component',
      proxiesFile: '../react/lib/components/stencil-generated/index.ts',
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
  extras: {
    enableImportInjection: false,
  },

};
