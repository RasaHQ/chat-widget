import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    pageLoadTimeout: 60000,
    viewportWidth: 1800,
    viewportHeight: 1200,
    watchForFileChanges: false,
    specPattern: 'cypress/tests/**/*.cy.{ts, js}',
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Open DevTools on Cypress runner start
      //@ts-ignore
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--auto-open-devtools-for-tabs');
          return launchOptions;
        }
      });
    },
  },
});