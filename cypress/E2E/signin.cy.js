import LoginPage from "../page object model/LoginPage";

// ==== HAPPY PATH ====
describe('Login Happy Path', () => {
    beforeEach(() => {
        cy.visit('/')
    });

    // Login con credenziali valide
    it('Login con credenziali valide', () => {
        cy.login()
        cy.url().should('include', '/auth_ecommerce.html')
    });

    // Logout
    it('Logout', () => {
        cy.login()
        cy.logout()
        cy.get('#logout').should('not.exist')
        cy.clearLocalStorage()
    });
    
    // Non Mantenimento sessione dopo refresh pagina
    it('La sessione non deve rimanere attiva dopo il refresh', () => {
        cy.login()
        cy.reload()
        cy.get('#logout').should('not.exist')
    });
});


// ==== EDGE CASES ====
describe('Login Edge Cases', () => {
    beforeEach(() => {
        cy.visit('/')
        LoginPage.loginLink.click()
    });

    // Login con email vuota
    it('Email vuota - Login fallisce', () => {
        cy.fixture('users').then(users => {
            //LoginPage.emailInput.type('')
            LoginPage.pswInput.type(users.validUser.password)
        })
        
        LoginPage.loginButton.click()
        
        LoginPage.loginErrorMessage
            .should('be.visible')
            .and('contain','Bad credentials! Please try again!')
    });

    // Login con password vuota
    it('Password vuota - Login fallisce', () => {
        cy.fixture('users').then(users => {
            LoginPage.emailInput.type(users.validUser.email)
            LoginPage.loginButton.click()
            LoginPage.loginErrorMessage
                .should('be.visible')
                .and('contain','Bad credentials! Please try again!')
        })
    });

    // Login con email non registrata
    it.only('Email non registrata - Login fallisce', () => {
        cy.fixture('users').then(users => {
            LoginPage.emailInput.type('john.doe@gmail.com')
            LoginPage.pswInput.type(users.validUser.password)
        })

        LoginPage.loginButton.click()

        LoginPage.loginErrorMessage
            .should('be.visible')
            .and('contain','Bad credentials! Please try again!')

        cy.intercept('POST' , '/api/login', {
            statusCode: 401,
            body: {message: 'Bad credentials! Please try again! Make sure that you ve registered.'}
        }).as('loginRequest')

        cy.wait('@loginRequest').its('response.statusCode').should('eq',401)
    });
    // Login con password errata
    // Controllo messaggio di errore corretto
    // Controllo limite di tentativi falliti (se presente)
});

// ==== RESPONSIVE ====