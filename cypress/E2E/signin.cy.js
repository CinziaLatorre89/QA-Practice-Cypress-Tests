// ==== HAPPY PATH ====
describe('Login Happy Path', () => {
    // Login con credenziali valide
    it('Login con credenziali valide', () => {
        cy.login()
    });

    // Logout
    
    
    // Mantenimento sessione dopo refresh pagina
});


// ==== EDGE CASES ====
// Login con email vuota
// Login con password vuota
// Login con email non registrata
// Login con password errata
// Controllo messaggio di errore corretto
// Controllo limite di tentativi falliti (se presente)

// ==== RESPONSIVE ====