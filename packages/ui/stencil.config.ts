import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'rasa-chatwigdet',
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
      copy: [{ src: 'assets/fonts', dest: 'assets/fonts' }],
    },
    {
      type: 'dist-custom-elements',
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
      copy: [{ src: 'assets/fonts', dest: 'assets/fonts' }],
    },
    reactOutputTarget({
      componentCorePackage: '@vortexwest/chat-widget-ui',
      proxiesFile: '../react/lib/components/stencil-generated/index.ts',
      includeDefineCustomElements: true,
      excludeComponents: [
        'chat-message',
        'error-toast',
        'global-error-handler',
        'rasa-accordion',
        'rasa-button',
        'rasa-carousel',
        'rasa-chat-input',
        'rasa-file-download-message',
        'rasa-image',
        'rasa-image-message',
        'rasa-quick-reply',
        'rasa-session-divider',
        'rasa-text',
        'rasa-text-message',
        'rasa-typing-indicator',
        'rasa-video',
      ],
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
  extras: {
    enableImportInjection: false,
  },
};
