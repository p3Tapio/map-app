describe('Adding a location to a list', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
  })
  it('location can be added', function () {
    cy.createLocation();
    cy.contains('View locations').click();
    cy.contains('test location');
    cy.contains('this is a location for testing');
    cy.contains('Turbiinitie, 01530, Lentokenttä, FIN');
  })
  it('If values are missing, correct validation messages are shown', function() {
    cy.contains('test list').click();
    cy.contains('Add location').click();
    cy.contains('Save').click();
    cy.contains('Please add location to map.');
    cy.contains('Name is required.');
    cy.contains('Address is required.');
    cy.contains('Description is required.');
    cy.contains('Category is required.');
  })
  it('Location is shown on the list in public view', function() {
    cy.createLocation();
    cy.contains('Location lists').click();
    cy.contains('test location'); 
    cy.get('#viewListDetails').click();
    cy.contains('View as list').click();
    cy.contains('test location');
    cy.contains('this is a location for testing');
    cy.contains('Turbiinitie, 01530, Lentokenttä, FIN');
  })
  it('Clicking cancel closes modal, no changes are saved and the form is empty when reopened', function() {
    cy.visit('http://localhost:3000/userpage')
    cy.contains('test list').click();
    cy.contains('Edit').click();
    cy.contains('Add location').click();
    cy.get('#name').type('test location');
    cy.get('#address').type('Turbiinitie').blur().wait(500);
    cy.get('#description').type('this is a location for testing');
    cy.get('#category').select('Sights');
    cy.contains('Cancel').click();
    cy.contains('Add location').click();
    cy.get('#name').should('have.value', '');
    cy.get('#description').should('have.value', '');
    cy.get('#address').should('have.value', '');
    cy.contains('Cancel').click();
    cy.contains('View locations').click();
    cy.contains('test location').should('not.exist');
  })
})
describe('Editing location details', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
    cy.createLocation();
  })
  it('Location can be edited', function() {
    cy.contains('View locations').click();
    cy.get('#edit').click();
    cy.get('#name').clear();
    cy.get('#name').type('Edited location');
    cy.get('#address').clear();
    cy.get('#address').type('Ilmailutie, vantaa').blur().wait(500);;
    cy.get('#description').clear();
    cy.get('#description').type('this is an edited location');
    cy.get('#category').select('Shopping');
    cy.contains('Save').click();
    cy.contains('Ok').click();
    cy.contains('Edited location');
    cy.contains('Ilmailutie');
    cy.contains('this is an edited location');
  })
  it('Clicking cancel closes modal, no changes are saved and old values are shown in edit modal.', function () {
    cy.contains('View locations').click();
    cy.get('#edit').click();
    cy.get('#name').clear();
    cy.get('#name').type('Edited location');
    cy.get('#address').clear();
    cy.get('#address').type('Ilmailutie, vantaa').blur().wait(500);
    cy.get('#description').clear();
    cy.get('#description').type('this is an edited location');
    cy.get('#category').select('Shopping');
    cy.contains('Cancel').click();
    cy.contains('test location');
    cy.contains('this is a location for testing');
    cy.contains('Turbiinitie, 01530, Lentokenttä, FIN');
    cy.get('#edit').click();
    cy.get('#name').should('have.value', 'test location');
    cy.get('#description').should('have.value', 'this is a location for testing');
    cy.get('#address').should('have.value', 'Turbiinitie, 01530, Lentokenttä, FIN');
  })
  it('If values are missing, validation messages are shown', function() {
    cy.contains('View locations').click();
    cy.get('#edit').click();
    cy.get('#name').clear();
    cy.get('#address').clear().blur().wait(500);
    cy.get('#description').clear();
    cy.contains('Save').click();
    cy.contains('Name is required.');
    cy.contains('Address is required.');
    cy.contains('Description is required.');
  })
})
describe('Deleting location', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
    cy.createLocation();
  })
  it('Location can be deleted', function() {
    cy.contains('View locations').click();
    cy.get('#delete').click();
    cy.contains('Are you sure you want to delete test location?');
    cy.get('#confirmDelete').click();
    cy.contains('Location test location deleted!');
    cy.contains('Ok').click();
    cy.contains('Seems like you have not added any locations to your list yet.');
  })
  it('User can click cancel and the location is not deleted', function() {
    cy.contains('View locations').click();
    cy.get('#delete').click();
    cy.contains('Are you sure you want to delete test location?');
    cy.contains('Cancel').click();
    cy.contains('test location');
    cy.contains('this is a location for testing');
    cy.contains('Turbiinitie');
  })
})