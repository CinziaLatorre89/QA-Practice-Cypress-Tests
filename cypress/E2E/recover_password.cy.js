import RecoverPassword from "../page object model/RecoverPassword";

// ==== HAPPY PATH ==== //
// Inserimento email registrata - Viene inviata email per recuperare la password
describe('Successo della richiesta di recupero password', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('#forms').click()
        RecoverPassword.recoverPswLink.click()
        cy.url().should('include','/recover-password.html')
        cy.fixture('users').as('user')
    });

    it('Utente inserisce email registrata e la richiesta di recupero password avviene', function () {
        RecoverPassword.fillEmail(this.user.registeredEmail.email)
        RecoverPassword.recoverPswBtn.click()

        RecoverPassword.verifySuccessMessage(this.user.registeredEmail.email)
    });
});

// ==== EDGE CASES ==== //
describe('Fallimento della richiesta di recupero password', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('#forms').click()
        RecoverPassword.recoverPswLink.click()
        cy.url().should('include','/recover-password.html')
        cy.fixture('users').as('user')
    });

    // Inserimento email non registrata - Non viene inviata email per recuperare la password
    // * Bug 004: Il test viene skippato perché il sito non esegue questo controllo
    // * Expected: Dovrebbe non mostrare il messaggio di successo e, anzi, mostrare un messaggio di errore
    // * Actual: Permette inserimento anche di email non registrata
    it.skip('Utente inserisce email non registrata e la richiesta di recupero password fallisce', function () {
        RecoverPassword.fillEmail(this.user.unregisteredEmail.email)
        RecoverPassword.recoverPswBtn.click()

        RecoverPassword.verifyError()
    });

    // Inserimento email in formato non valido - Messaggio di errore
    // * Bug 005: Il test viene skippato perché il sito non esegue questo controllo
    // * Expected: Dovrebbe mostrare riportare il focus sul campo email e non mostrare il messaggio di successo
    // * Actual: Permette inserimento anche di email in formato non valido
    it.skip('Utente inserisce email in formato non corretto e la richiesta di recupero password fallisce', function () {
        RecoverPassword.fillEmail(this.user.incorrectEmail.email)
        RecoverPassword.recoverPswBtn.click()

        RecoverPassword.emailForRecoverInput.should('be.focused')
        RecoverPassword.verifyError()
    });

});
