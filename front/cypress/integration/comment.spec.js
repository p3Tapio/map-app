describe('Commenting a list', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
  })
  it('Comment can be added, if logged in', function () {
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.get('#addComment').click();
    cy.get('#commentField').type('this is a comment for testing');
    cy.get('#submitComment').click();
    cy.contains('Ok').click();
    cy.contains('this is a comment for testing');
  })
  it('Commenting is not possible if unauthenticated', function () {
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.get('#addComment').trigger('mouseover', { force: true })
    cy.contains('Login or register to comment!');
  })
})
describe('Comment can be edited', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
    cy.addNewComment();
  })
  it('By the user who created the comment', function () {
    cy.contains('Edit').click();
    cy.get('#commentField').clear();
    cy.get('#commentField').type('this comment has been edited');
    cy.get('#submitComment').click();
    cy.contains('Comment updated!');
    cy.contains('Ok').click();
    cy.contains('this comment has been edited');
  })
  it('Comment cant be edited if not logged in', function () {
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.contains('this is a comment for testing');
    cy.contains('Edit').should('not.exist');
  })
  it('Comment made by another user cant be edited', function () {
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.registerAndLoginAnother();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.contains('this is a comment for testing');
    cy.contains('Edit').should('not.exist');
  })
})
describe('Comment can be deleted', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
  })
  it('By the user who created it when logged in', function () {
    cy.addNewComment();
    cy.contains('this is a comment for testing');
    cy.contains('Delete').click();
    cy.get('#confirmDelete').click();
    cy.contains('Comment deleted!');
    cy.contains('Ok').click();
    cy.contains('this is a comment for testing').should('not.exist');
    cy.contains('No comments yet!');
  })
  it('User who created the list can delete comments via the userpage', function () {
    cy.get('#navigationBar').click();
    cy.contains('Logout');
    cy.registerAndLoginAnother();
    cy.addNewComment();
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.visit('http://localhost:3000/login');
    cy.get('#username').type('tester');
    cy.get('#password').type('secret');
    cy.get('#submit').click();
    cy.contains('Ok').click();
    cy.contains('test list').click();
    cy.contains('Edit').click();
    cy.contains('Delete').click();
    cy.get('#confirmDelete').click();
    cy.contains('Comment deleted!');
    cy.contains('Ok').click();
    cy.contains('this is a comment for testing').should('not.exist');
    cy.contains('No comments yet!');
  })
  it('Option to delete comment is not visible when logged out', function () {
    cy.addNewComment();
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.contains('this is a comment for testing');
    cy.contains('Delete').should('not.exist');
  })
  it('Option to delete comments is not visible in public view for another logged user', function () {
    cy.get('#navigationBar').click();
    cy.contains('Logout');
    cy.registerAndLoginAnother();
    cy.addNewComment();
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.visit('http://localhost:3000/login');
    cy.get('#username').type('tester');
    cy.get('#password').type('secret');
    cy.get('#submit').click();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.contains('this is a comment for testing');
    cy.contains('Delete').should('not.exist');
  })
})