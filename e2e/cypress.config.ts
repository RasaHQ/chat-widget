import { defineConfig } from 'cypress';
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/plugins';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333',
    includeShadowDom: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    pageLoadTimeout: 60000,
    viewportWidth: 1800,
    viewportHeight: 1200,
    watchForFileChanges: false,
    specPattern: 'cypress/tests/**/*.cy.{ts, js}',
    env: {
      pluginVisualRegressionCreateMissingImages: true,
      pluginVisualRegressionUpdateImages: false,
      pluginVisualRegressionDiffConfig: {
        treshold: 0.01,
      },
      pluginVisualRegressionImagesPath: './cypress/screenshots/base',
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
});
