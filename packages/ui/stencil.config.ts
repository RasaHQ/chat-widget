import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'rasa-chatwidget',
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
      type: 'docs-readme',
    },
    {
      type: 'docs-json',
      file: 'doc/docs.json',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [{ src: 'assets/fonts', dest: 'build/assets/fonts' }],
    },
    reactOutputTarget({
      stencilPackageName: '@vortexwest/chat-widget-ui',
      outDir: '../react/lib/components/stencil-generated/',
      esModules: true,
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
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
  extras: {
    enableImportInjection: true,
  },
};
