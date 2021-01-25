const init = () => {
  cy.request('POST', 'http://localhost:3001/api/testing/resetUser')
  cy.request('POST', 'http://localhost:3001/api/testing/resetLocations')
  const user = { username: 'tester', password: 'secret' };
  cy.request('POST', 'http://localhost:3001/api/user/register', user);
  cy.visit('http://localhost:3000/login');
  cy.get('#username').type('tester');
  cy.get('#password').type('secret');
  cy.get('#submit').click();
  cy.contains('Ok').click();
}
const create = () => {
  cy.contains('Create New').click();
  cy.get('#name').type('test location');
  cy.get('#address').type('Turbiinitie');
  cy.get('#description').type('this is a location for testing');
  cy.get('#category').select('Sights');
  cy.contains('Save').click();
  cy.contains('New location added!');
  cy.contains('Ok').click();
}
describe('Creating new location', function () {
  beforeEach(function () {
    init();
  })
  it('User can create a new Location', function () {
    create();
    cy.contains('test location');
    cy.contains('this is a location for testing');
    cy.contains('Turbiinitie');
  })
  it('When values are missing, validation messages are shown', function () {
    cy.contains('Create New').click();
    cy.contains('Save').click();
    cy.contains('Please add location to map.');
    cy.contains('Name is required.');
    cy.contains('Address is required.');
    cy.contains('Description is required.');
    cy.contains('Category is required.');
  })
  it('Created location is not visible in another user\'s userpage', function(){
    create();
    cy.contains('Logout').click();
    const another = { username: 'another', password: 'terces' };
    cy.request('POST', 'http://localhost:3001/api/user/register', another);
    cy.visit('http://localhost:3000/login');
    cy.get('#username').type('another');
    cy.get('#password').type('terces');
    cy.get('#submit').click();
    cy.contains('Ok').click();
    cy.contains('Seems like you have not yet added any locations. You can start by adding one by clicking the create new button!')
  })
})
// describe('Editing location', function() {
//   beforeEach(function () {
//     init();
//     create();
//   })
//   it('Location can be edited', function() {
//     cy.get('#edit').click();
//   })
// })

describe('Deleting location', function () {
  beforeEach(function() {
    init();
    create(); 
  })
  it('User can delete location', function() {
    cy.get('#delete').click();
    cy.contains('Are you sure you want to delete location test location?');
    cy.get('#confirmDelete').click();
    cy.contains('Location test location deleted!');
    cy.contains('Ok').click();
    cy.contains('Seems like you have not yet added any locations. You can start by adding one by clicking the create new button!')
  })
  it('User can click cancel and the location is not deleted', function() {
    cy.get('#delete').click();
    cy.contains('Are you sure you want to delete location test location?');
    cy.contains('Cancel').click();
    cy.contains('test location');
    cy.contains('this is a location for testing');
    cy.contains('Turbiinitie');
  })
})