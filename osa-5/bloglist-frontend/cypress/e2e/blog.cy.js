describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:8080/api/testing/reset');

    const user = {
      name: 'Test User',
      username: 'test',
      password: 'test',
    };
    cy.request('POST', 'http://localhost:8080/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('log in').click();
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('test');
      cy.get('#password').type('test');
      cy.get('#login-button').click();

      cy.contains('Test User logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('test');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test', password: 'test' });

      cy.createBlog({
        title: 'Initial blog',
        author: 'Initial blog author',
        url: 'http://test.com',
        likes: 0,
      });
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('Test title');
      cy.get('#author').type('Test author');
      cy.get('#url').type('Test url');

      cy.get('#create-blog').click();
      cy.contains('Test title Test author');
    });

    it('A blog can be liked', function () {
      cy.contains('Initial blog Initial blog author').contains('view').click();

      cy.get('#likes').contains('0');
      cy.contains('like').click();

      cy.get('#likes').contains('1');
    });

    it('A blog can be deleted', function () {
      cy.contains('Initial blog Initial blog author').contains('view').click();

      cy.contains('remove').click();

      cy.get('html').should('not.contain', 'Initial blog Initial blog author');
    });

    it('Blogs are displayed sorted by likes in descending order', function () {
      cy.createBlog({
        title: 'Should be 3.',
        author: '',
        url: 'http://test.com',
        likes: 1,
      });

      cy.createBlog({
        title: 'Should be 0.',
        author: '',
        url: 'http://test.com',
        likes: 100,
      });

      cy.createBlog({
        title: 'Should be 1.',
        author: '',
        url: 'http://test.com',
        likes: 99,
      });

      cy.createBlog({
        title: 'Should be 2.',
        author: '',
        url: 'http://test.com',
        likes: 3,
      });

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).contains('Should be 0.');
        cy.wrap(blogs[1]).contains('Should be 1.');
        cy.wrap(blogs[2]).contains('Should be 2.');
        cy.wrap(blogs[3]).contains('Should be 3.');
        cy.wrap(blogs[4]).contains('Initial blog');
      });

      cy.contains('Should be 1.').contains('view').click();
      cy.contains('Should be 1.').parent().contains('like').click();
      cy.contains('Should be 1.').parent().contains('like').click();

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).contains('Should be 1.');
        cy.wrap(blogs[1]).contains('Should be 0.');
        cy.wrap(blogs[2]).contains('Should be 2.');
        cy.wrap(blogs[3]).contains('Should be 3.');
        cy.wrap(blogs[4]).contains('Initial blog');
      });
    });
  });
});
