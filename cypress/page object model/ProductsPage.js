class ProductsPage {
    // Selectors
    get productItems () {
        return cy.get('#prooood .shop-item')
    }

    get productName () {
        return cy.get('.shop-item-title')
    }

    get productImg () {
        return cy.get('.shop-item-image')
    }

    get productPrice () {
        return cy.get('.shop-item-price')
    }

    get cartItems() {
        return cy.get ('.cart-items .cart-row')
    }

    get cartItemName () {
        return cy.get('.cart-item')
    }

    get cartItemImg () {
        return cy.get('.cart-item-image')
    }

    get cartItemPrice () {
        return cy.get('.cart-price')
    }

    get cartItemQuantity () {
        return cy.get('.cart-quantity')
    }

    get cartTotal () {
        return cy.get('.cart-total-price')
    }

    get itemQuantity () {
        return cy.get('.cart-quantity-input')
    }

    //Methods
    verifyProductsLoaded () {
        this.productItems
            .should('exist')
            .and('have.length.greaterThan',0)
    }

    verifyProductsInfo () {
        this.productItems
            .each(($product) => {
                cy.wrap($product).within(() => {
                    this.productName.should('exist').and('not.be.empty')
                    this.productImg.should('exist').and('have.attr','src')
                    this.productPrice.should('exist').and('not.be.empty')
                })
        })
    }

    addToCart(index) {
        this.productItems.eq(index).within(() => {
            cy.get('.btn-primary').click()
        })
    }


    // Assertions
    verifyProductInCart () {
       this.cartItems.should('exist').and('have.length.greaterThan',0)
       this.cartItemName.should('exist')
       this.cartItemImg.should('exist')
       this.cartItemPrice.should('exist')
    }

}

export default new ProductsPage