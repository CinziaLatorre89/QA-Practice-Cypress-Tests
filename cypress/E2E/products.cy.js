import ProductsPage from "../page object model/ProductsPage";

describe('Test Lista Prodotti', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.login()
        cy.url().should('include','/auth_ecommerce.html')
    });
    // ==== VERIFICA CARICAMENTO LISTA PRODOTTI ====
    it('La lista prodotti è presente e non è vuota', () => {
        ProductsPage.verifyProductsLoaded()
    });

    it('Ogni prodotto in lista possiede le info necessarie', () => {
        ProductsPage.verifyProductsInfo()
    });

});

describe('Test Carrello', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.login()
        cy.url().should('include','/auth_ecommerce.html')
    });
    // Aggiunta di un prodotto al carrello
    it('Aggiunta di un prodotto al carrello', () => {
        ProductsPage.addToCart(1)
        ProductsPage.verifyProductInCart()
    });

    // Verifica che il prezzo del totale sia la somma del prezzo dei singoli prodotti

    // Modifica della quantità del prodotto aggiunto al carrello

    // Rimozione di un prodotto dal carrello e verifica del totale

    // 

});
