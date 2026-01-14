import LoginPage from "../page object model/LoginPage"

Cypress.Commands.add("login" , () => {
    cy.visit('/')
    LoginPage.loginLink.click()
    cy.fixture('users').then(users => {
        LoginPage.emailInput.type(users.validUser.email)
        LoginPage.pswInput.type(users.validUser.password)
    })
    LoginPage.loginButton.click()
    cy.url().should('include', '/auth_ecommerce.html')
})