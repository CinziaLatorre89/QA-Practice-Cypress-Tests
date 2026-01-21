import LoginPage from "../page object model/LoginPage"
import SignUpPage from "../page object model/SignUpPage"

// Login
Cypress.Commands.add("login" , () => {
    LoginPage.loginLink.click()
    cy.fixture('users').then(users => {
        LoginPage.emailInput.type(users.validUser.email)
        LoginPage.pswInput.type(users.validUser.password)
    })
    LoginPage.loginButton.click()
})

// Logout
Cypress.Commands.add("logout" , () => {
    cy.get('#logout').click()
})
