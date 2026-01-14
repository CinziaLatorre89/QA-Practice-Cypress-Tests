import LoginPage from "../page object model/LoginPage"

Cypress.Commands.add("login" , () => {
    LoginPage.loginLink.click()
    cy.fixture('users').then(users => {
        LoginPage.emailInput.type(users.validUser.email)
        LoginPage.pswInput.type(users.validUser.password)
    })
    LoginPage.loginButton.click()
})

Cypress.Commands.add("logout" , () => {
    cy.get('#logout').click()
})