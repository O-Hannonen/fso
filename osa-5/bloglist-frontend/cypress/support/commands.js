Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:8080/api/login', {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body));
    cy.visit('http://localhost:3000');
  });
});

Cypress.Commands.add('createBlog', (blog) => {
  cy.request({
    url: 'http://localhost:8080/api/blogs',
    method: 'POST',
    body: blog,
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem('loggedBlogappUser')).token
      }`,
    },
  });

  cy.visit('http://localhost:3000');
});
