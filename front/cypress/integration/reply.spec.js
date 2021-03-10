describe('Replying to a comment', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
    cy.addNewComment();
  })
  it('Comment can be replied if logged in', function () {
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.get('#replyToCommentBtn').click();
    cy.get('#replyTextArea' ).type('Im replying to comment');
    cy.get('#submitReply').click();
    cy.contains('Replies (1)');
    cy.contains('Im replying to comment');
    cy.contains('tester');
  })
  it('Commenting is not possible if not logged in', function() {
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.get('#replyToCommentBtn').should('not.exist');
  })
})
describe('Updating reply', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
    cy.addNewComment();
    cy.addReply();
  })
it('Reply can be edited by the user who created it when logged in', function () {
  cy.get('#editReply').click();
  cy.get('#replyEditField').clear();
  cy.get('#replyEditField').type('this reply is now updated');
  cy.get('#submitReply').click();
  cy.contains('this reply is now updated');
  cy.contains('(Edited');
})
it('Option to edit reply doesnt exist when not logged in', function () {
  cy.get('#navigationBar').click();
  cy.contains('Logout').click();
  cy.visit('http://localhost:3000/public');
  cy.get('#viewListDetails').click();
  cy.contains('Replies (1)').click();
  cy.get('#editReply').should('not.exist');
})
  it('Reply cant be edited by another user', function () {
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.registerAndLoginAnother();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.contains('Replies (1)').click();
    cy.get('#editReply').should('not.exist');
  })
})
describe('Deleting reply', function () {
  beforeEach(function () {
    cy.clearDb();
    cy.registerAndLogin();
    cy.createPublicList();
    cy.addNewComment();
    cy.addReply();
  })
  it('Reply can be deleted by the user who wrote it', function () {
    cy.contains('Im replying to comment');
    cy.get('#deleteReply').click();
    cy.contains('Im replying to comment').should('not.exist');
  })
  it('Option to delete replies is not visible when logged out', function () {
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.contains('Replies (1)').click();
    cy.get('#deleteReply').should('not.exist');
  })
  it('Reply cant be deleted by another user', function() {
    cy.get('#navigationBar').click();
    cy.contains('Logout').click();
    cy.registerAndLoginAnother();
    cy.visit('http://localhost:3000/public');
    cy.get('#viewListDetails').click();
    cy.contains('Replies (1)').click();
    cy.get('#deleteReply').should('not.exist');
  })
})

