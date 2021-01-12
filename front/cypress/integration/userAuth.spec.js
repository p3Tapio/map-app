describe('Registration', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/resetUser')
  });
  it('Register form opens', function() {
    cy.visit('http://localhost:3000/register');
    cy.contains('Register');
    cy.contains('Submit').click();
    cy.contains('Reset').click(); 
  });
  it('User can register', function() {
    cy.contains('Submit').click(); 
    cy.get('#username').type('Tester');
    cy.get('#password').type('secret');
    cy.get('#passwordconfirm').type('secret');
    cy.get('#submit').click();

    cy.contains('Account created. Welcome Tester!');
  });
  it('User with same username cannot be created and correct error message is shown', function() {
    const user = { username: 'tester', password: 'secret'}; 
    cy.request('POST', 'http://localhost:3001/api/user/register', user);
    cy.visit('http://localhost:3000/register');

    cy.contains('Submit').click();
    cy.get('#username').type('tester');
    cy.get('#password').type('secret');
    cy.get('#passwordconfirm').type('secret');
    cy.get('#submit').click();

    cy.contains('Sorry, username tester is already in use.');
  });
});

describe('Login', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/resetUser')
    const user = { username: 'tester', password: 'secret'}; 
    cy.request('POST', 'http://localhost:3001/api/user/register', user);
  })
  it('User can login with correct credentials', function(){
    cy.visit('http://localhost:3000/login');
    cy.contains('Submit').click();
    cy.get('#username').type('tester');
    cy.get('#password').type('secret');
    cy.get('#submit').click();

    cy.contains('Welcome tester!');
  })
  it('Login fails with wrong password', function() {
    cy.visit('http://localhost:3000/login');
    cy.contains('Submit').click();
    cy.get('#username').type('tester');
    cy.get('#password').type('password');
    cy.get('#submit').click();

    cy.contains('Wrong username or password');
  })
  it('Login fails with wrong username', function() {
    cy.visit('http://localhost:3000/login');
    cy.contains('Submit').click();
    cy.get('#username').type('user');
    cy.get('#password').type('secret');
    cy.get('#submit').click();

    cy.contains('Wrong username or password');
  })
});
