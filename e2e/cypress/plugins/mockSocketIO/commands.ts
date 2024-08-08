function zip(lists) {
  return lists[0].map((_, i) => lists.map((array) => array[i]));
}

function addCommands() {
  Cypress.Commands.add('resetWsMessages', () => {
    cy.request('DELETE', 'http://localhost:8081/__cypress/messages');
  });

  Cypress.Commands.add('overrideWsOptions', (options) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/__cypress/options',
      body: options,
    });
  });

  // @ts-expect-error @ts
  Cypress.Commands.add('expectWsMessages', (expected, options) => {
    const sleepTime = 250;
    const maxInvocations = ((options && options.timeout) || 2500) / sleepTime;

    function waitForMessages(invocation) {
      if (invocation > 10) {
        throw 'Giving up waiting after 2.5s';
      }

      return cy.wait(sleepTime).then(() => {
        return cy
          .request('GET', 'http://localhost:8081/__cypress/messages')
          .its('body')
          .then((body) => {
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
        expected.map(JSON.stringify)
      );
    });
  });
}

export { addCommands };
