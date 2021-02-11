Cypress.Commands.add('clearDb', () => {
  cy.request('POST', 'http://localhost:3001/api/testing/resetUser')
  cy.request('POST', 'http://localhost:3001/api/testing/resetLocations')
  cy.request('POST', 'http://localhost:3001/api/testing/resetLists')

})
Cypress.Commands.add('registerAndLogin', () => {
  const user = { username: 'tester', password: 'secret' };
  cy.request('POST', 'http://localhost:3001/api/user/register', user);
  cy.visit('http://localhost:3000/login');
  cy.get('#username').type('tester');
  cy.get('#password').type('secret');
  cy.get('#submit').click();
  cy.contains('Ok').click();
})
Cypress.Commands.add('registerAndLoginAnother', () => {
  const another = { username: 'another', password: 'terces' };
  cy.request('POST', 'http://localhost:3001/api/user/register', another);
  cy.visit('http://localhost:3000/login');
  cy.get('#username').type('another');
  cy.get('#password').type('terces');
  cy.get('#submit').click();
  cy.contains('Ok').click();
})

Cypress.Commands.add('createPublicList', () => {
  cy.get('#createList').click();
  cy.contains('+').click().click();
  cy.get('#name').type('test list');
  cy.get('#description').type('description for testing');
  cy.get('#visibility').check({force: true});
  cy.contains('Save').click();
  cy.contains('Ok').click();
})
Cypress.Commands.add('createPrivateList', () => {
  cy.get('#createList').click();
  cy.contains('+').click().click();
  cy.get('#name').type('Private list');
  cy.get('#description').type('description for private list');
  cy.contains('Save').click();
  cy.contains('Ok').click();
})
Cypress.Commands.add('createLocation', () => {
  cy.visit('http://localhost:3000/userpage');
  cy.contains('test list').click();
  cy.contains('Edit').click();
  cy.contains('Add location').click();
  cy.get('#name').type('test location');
  cy.get('#address').type('Turbiinitie').blur().wait(500);
  cy.get('#description').type('this is a location for testing');
  cy.get('#category').select('Sights');
  cy.contains('Save').click();
  cy.contains('New location added!');
  cy.contains('Ok').click();
})