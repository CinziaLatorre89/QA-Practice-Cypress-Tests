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
});


// ==== EDGE CASES ====
describe('Login fallisce per campi input errati', () => {
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
    });

    // Login con password vuota
    it('Password vuota - Login fallisce', () => {
        cy.fixture('users').then(users => {
            LoginPage.emailInput.type(users.validUser.email)
            LoginPage.loginButton.click()
        })
    });

    // Login con email non registrata
    it('Email non registrata - Login fallisce', () => {
        cy.fixture('users').then(users => {
            LoginPage.emailInput.type('john.doe@gmail.com')
            LoginPage.pswInput.type(users.validUser.password)
        })

        LoginPage.loginButton.click()

        /* cy.intercept('POST' , '/api/login', {
            statusCode: 401,
            body: {message: 'Bad credentials! Please try again! Make sure that you ve registered.'}
        }).as('loginRequest')

        cy.wait('@loginRequest').its('response.statusCode').should('eq',401) */
    });

    // Login con email in formato non corretto
    it('Email in formato non corretto - Login fallisce', () => {
        cy.fixture('users').then(users => {
            LoginPage.emailInput.type('admin.com')
            LoginPage.pswInput.type(users.validUser.password)
        })

        LoginPage.loginButton.click()
    });

    // Login con password errata
    it('Password errata - Login fallisce', () => {
        cy.fixture('users').then(users => {
            LoginPage.emailInput.type(users.validUser.email)
            LoginPage.pswInput.type('123')
        })

        LoginPage.loginButton.click()
    });

    // Controllo messaggio di errore per ogni edge case di login fallito
    afterEach(() => {
        LoginPage.loginErrorMessage
            .should('be.visible')
            .and ('contain' , 'Bad credentials! Please try again!')
    });
});

describe('Edge Case comportamenti utente', () => {
    beforeEach(() => {
        cy.visit('/')
        LoginPage.loginLink.click()
            cy.fixture('users').then(users => {
                LoginPage.emailInput.type(users.validUser.email)
                LoginPage.pswInput.type(users.validUser.password)
            })
    });

    // Non Mantenimento sessione dopo refresh pagina
    it('Utente refresha per errore dopo il login - Deve avvenire il logout', () => {
        LoginPage.loginButton.click()
        cy.reload()
        cy.get('#logout').should('not.exist')
        LoginPage.emailInput.should('be.empty')
        LoginPage.pswInput.should('be.empty')
    });
});

// ==== RESPONSIVE ====