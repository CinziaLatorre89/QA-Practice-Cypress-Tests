class LoginPage {
    //Selectors
    get loginLink() {
        return cy.get('#auth-shop')
    }

    get emailInput () {
        return cy.get('#email')
    }

    get pswInput () {
        return cy.get('#password')
    }

    get loginButton () {
        return cy.get('#submitLoginBtn')
    }

    get loginErrorMessage () {
        return cy.get('#message')
    }
}

export default new LoginPage