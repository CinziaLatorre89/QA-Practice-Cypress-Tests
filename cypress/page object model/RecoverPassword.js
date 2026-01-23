class RecoverPassword {
    // Selectors
    get recoverPswLink () {
        return cy.get('#recover-password')
    }

    get emailForRecoverInput () {
        return cy.get('#email')
    }

    get recoverPswBtn () {
        return cy.get('.btn-primary')
    }

    get successMessage () {
        return cy.get('#message')
    }

    // Methods
    fillEmail (userEmail) {
        this.emailForRecoverInput.type(userEmail)
    }

    // Assertions
    verifySuccessMessage (userEmail) {
        this.successMessage
            .should('be.visible')
            .and ('contain','An email with the new password has been sent to')
            .and('contain',userEmail)
            .and ('contain','. Please verify your inbox!')
    }

    verifyError (userEmail) {
        this.successMessage.should('not.be.visible')
    }
}

export default new RecoverPassword