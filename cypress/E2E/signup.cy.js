import SignUpPage from "../page object model/SignUpPage";

// ==== HAPPY PATH ====
// Registrazione avviene con successo
describe('Sign Up Happy Path', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('#forms').click()
        SignUpPage.signUpLink.click()
        cy.url().should('include','/register.html')
        SignUpPage.registerFormIsVisible()
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
        SignUpPage.registerFormIsVisible()
        cy.fixture('users').as('user')
    });

    // Campi obbligatori vuoti - Registrazione non avviene
    it('Utente non compila il campo Email obbligatorio', function () {
        SignUpPage.fillFormExcept(this.user.registrationData, ['emailAddress'])
        SignUpPage.submitRegisterForm()
        
        SignUpPage.emailAddress.should('be.focused')
        cy.get('#message').should('not.be.visible')
        cy.url().should('include','register.html')
    });

    it.only('Utente non compila il campo Password obbligatorio', function () {
        SignUpPage.fillFormExcept(this.user.registrationData, ['password'])
        SignUpPage.submitRegisterForm()
        
        SignUpPage.password.should('be.focused')
        cy.get('#message').should('not.be.visible')
        cy.url().should('include','register.html')
    });
});