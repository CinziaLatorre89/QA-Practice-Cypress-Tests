class SignUpPage {

    //Selectors
    get signUpLink () {
        return cy.get('#register')
    }

    get signUpPageTitle () {
        return cy.get('h2')
    }

    get registrationForm () {
        return cy.get('#registerForm')
    }

    get firstName () {
        return cy.get('#firstName')
    }

    get lastName () {
        return cy.get('#lastName')
    }

    get phoneNumber () {
        return cy.get('#phone')
    }

    get country () {
        return cy.get('#countries_dropdown_menu')
    }

    get emailAddress () {
        return cy.get('#emailAddress')
    }

    get emailTip () {
        return cy.get('#emailHelp')
    }

    get password () {
        return cy.get('#password')
    }

    get termsCheckbox () {
        return cy.get('#exampleCheck1')
    }

    get termsLabel () {
        return cy.get('.form-check-label')
    }

    get registerButton () {
        return cy.get('#registerBtn')
    }

    // Atomic Methods
    fillFirstName (firstName) {
        this.firstName.type(firstName)
        return this
    }

    fillLastName (lastName) {
        this.lastName.type(lastName)
        return this
    }

    fillPhoneNumber (phoneNumber) {
        this.phoneNumber.type(phoneNumber)
        return this
    }

    fillCountry (country) {
        this.country.select(country)
        return this
    }

    fillEmailAddress (emailAddress) {
        this.emailAddress.type(emailAddress)
        return this
    }

    fillPassword (password) {
        this.password.type(password)
        return this
    }

    acceptTerms () {
        this.termsCheckbox.check()
        return this
    }

    submitRegisterForm (registerButton) {
        this.registerButton.click()
        return this
    }

    // Advanced Methods
    fillRequiredFields (data) {
        this.fillEmailAddress(data.emailAddress)
            .fillPassword(data.password)
        return this
    }

    fillAllFields (data) {
        this.fillFirstName(data.firstName)
            .fillLastName(data.lastName)
            .fillPhoneNumber(data.phoneNumber)
            .fillCountry(data.country)
            .fillEmailAddress(data.emailAddress)
            .fillPassword(data.password)
            .acceptTerms()
        return this
    }

    fillFormExcept (data , excludedFields=[]) {
        if (!excludedFields.includes('firstName')) {
            this.fillFirstName(data.firstName)
        }

        if (!excludedFields.includes('lastName')) {
            this.fillLastName(data.lastName)
        }

        if (!excludedFields.includes('phoneNumber')) {
            this.fillPhoneNumber(data.phoneNumber)
        }

        if (!excludedFields.includes('country')) {
            this.fillCountry(data.country)
        }

        if (!excludedFields.includes('emailAddress')) {
            this.fillEmailAddress(data.emailAddress)
        }

        if (!excludedFields.includes('password')) {
            this.fillPassword(data.password)
        }

        if (!excludedFields.includes('termsCheckbox')) {
            this.acceptTerms()
        }

        return this
    }

    // Assertions
    registerFormIsVisible () {
        this.registrationForm.should('be.visible')
    }

    requiredFieldsFilled (data) {
        this.emailAddress.should('have.value', data.emailAddress)
        this.password.should('have.value', data.password)
        return this
    }

    verifyRegistrationMessage () {
        cy.get('#message').should('be.visible').and('contain', 'The account has been successfully created!')
    }
    
}

export default new SignUpPage