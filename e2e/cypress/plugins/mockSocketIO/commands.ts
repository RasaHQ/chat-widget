function zip(lists) {
  return lists[0].map((_, i) => lists.map((array) => array[i]));
}

function addCommands() {
  Cypress.Commands.add('resetWsMessages', (mockedServerURL) => {
    cy.request('DELETE', `${mockedServerURL}/__cypress/messages`);
  });

  Cypress.Commands.add(
    'overrideWsOptions',
    (mockedServerURL: string, options: Object) => {
      cy.request({
        method: 'POST',
        url: `${mockedServerURL}/__cypress/options`,
        body: options,
      });
    }
  );

  Cypress.Commands.add(
    'expectWsMessages',
    (mockedServerURL, expected, options) => {
      const sleepTime = 250;

      function waitForMessages(invocation) {
        if (invocation > 10) {
          throw 'Giving up waiting after 2.5s';
        }

        return cy.wait(sleepTime).then(() => {
          return cy
            .request('GET', `${mockedServerURL}/__cypress/messages`)
            .its('body')
            .then((body) => {
              // @ts-ignore
              if (body.length < expected.length) {
                return waitForMessages(invocation + 1);
              } else {
                return body;
              }
            });
        });
      }

      waitForMessages(0).then((actual) => {
        // @ts-expect-error @ts
        cy.expect(actual.map(JSON.stringify)).to.include.members(
          // @ts-ignore
          expected.map(JSON.stringify)
        );
      });
    }
  );
}

export { addCommands };
