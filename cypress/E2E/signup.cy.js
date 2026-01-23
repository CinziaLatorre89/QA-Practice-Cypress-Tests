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
        cy.url().should('include','/register.html')
    });

    it('Utente non compila il campo Password obbligatorio', function () {
        SignUpPage.fillFormExcept(this.user.registrationData, ['password'])
        SignUpPage.submitRegisterForm()
        
        SignUpPage.password.should('be.focused')
        cy.get('#message').should('not.be.visible')
        cy.url().should('include','/register.html')
    });

    // Email inserita in registrazione già esistente
    // Bug 001: Il test viene skippato perché il sito non esegue questo controllo
    // Expected: Dovrebbe mostrare messaggio di errore
    // Actual: Permette registrazione con email già esistente
    it.skip('Utente cerca di registrarsi con una email già esistente', function () {
        SignUpPage.fillAllFields(this.user.defaultUser)
        SignUpPage.submitRegisterForm()

        cy.get('#message').should('be.visible')
        cy.url().should('include', '/register.html')
    });

    // Email inserita in registrazione in formato non valido
    // Bug 002: Il test viene skippato perché il sito non esegue questo controllo
    // Expected: Dovrebbe mostrare messaggio di errore
    // Actual: Permette registrazione con email in formato non valido
    it.skip('Utente cerca di registrarsi con una email che ha un formato non valido', function () {
        SignUpPage.fillAllFields(this.user.invalidEmailUser)
        SignUpPage.submitRegisterForm()

        cy.get('#message').should('be.visible')
        cy.url().should('include', '/register.html')
    });

    // Password inserita in registrazione non rispetta i requisiti
    // Bug 003: Il test viene skippato perché il sito non esegue questo controllo
    // Expected: Dovrebbe mostrare messaggio di errore
    // Actual: Permette registrazione con password che non rispetta i requisiti
    it.skip('Utente cerca di registrarsi con una email che ha un formato non valido', function () {
        SignUpPage.fillAllFields(this.user.invalidPasswordUser)
        SignUpPage.submitRegisterForm()

        cy.get('#message').should('be.visible')
        cy.url().should('include', '/register.html')
    });
});