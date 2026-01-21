import SignUpPage from "../page object model/SignUpPage";

// ==== HAPPY PATH ====
// Registrazione avviene con successo
describe('Sign Up Happy Path', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('#forms').click()
        SignUpPage.signUpLink.click()
        cy.url().should('include','/register.html')
        cy.fixture('users').as('user')
    });

    it('Utente compila tutti i campi e si registra correttamente', function () {
       SignUpPage.fillAllFields(this.user.registrationData)
                 .requiredFieldsFilled(this.user.registrationData)
                 .submitRegisterForm()
                 .verifyRegistrationMessage()
    });

    it('Utente compila solo i campi obbligatori e si registra correttamente', function () {
        SignUpPage.fillRequiredFields(this.user.registrationData)
                  .requiredFieldsFilled(this.user.registrationData)
                  .submitRegisterForm()
                  .verifyRegistrationMessage()
    });
});

// ==== EDGE CASES ====
// Registrazione fallisce
describe('Sign Up Edge cases', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('#forms').click()
        SignUpPage.signUpLink.click()
        cy.url().should('include','/register.html')
        cy.fixture('users').as('user')
    });

    // Campi obbligatori vuoti - Registrazione non avviene
    it('', function () {
        
    });
});