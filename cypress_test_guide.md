# Guida Completa Test Cypress - QA Practice

## 1. LOGIN / AUTENTICAZIONE

### 1.1 Happy Path - Login Valido -> === DONE ===
**Obiettivo:** Verificare che un utente con credenziali corrette possa accedere

**Prerequisiti:**
- Avere credenziali valide (email + password)
- Database con utente registrato

**Step principali:**
1. Visita la pagina di login
2. Inserisci email valida nel campo email
3. Inserisci password valida nel campo password
4. Clicca sul pulsante "Login"
5. Attendi il reindirizzamento

**Assertion chiave:**
- `cy.url().should('include', '/dashboard')` → verifica URL
- `cy.contains('Welcome')` o elemento specifico del dashboard
- Verifica che token sia salvato in localStorage/cookies

**Concetti Cypress:**
- `cy.visit()` → navigazione iniziale
- `cy.get()` → selezione elementi DOM
- `cy.type()` → inserimento testo
- `cy.click()` → interazione con bottoni
- `cy.url()` → controllo URL dopo redirect

---

### 1.2 Happy Path - Logout -> === DONE ===
**Obiettivo:** Verificare che l'utente possa uscire correttamente

**Prerequisiti:**
- Utente già loggato (usa `beforeEach` per fare login automatico)

**Step principali:**
1. Essere nel dashboard (stato loggato)
2. Trovare e cliccare il pulsante Logout
3. Verificare il redirect alla pagina login

**Assertion chiave:**
- `cy.url().should('include', '/login')`
- Verifica che token sia rimosso da localStorage
- `cy.get('[data-testid="login-form"]').should('be.visible')`

**Concetti Cypress:**
- `cy.clearLocalStorage()` → per verificare pulizia storage
- Custom command per login ripetuto: `cy.login(email, password)`

---

### 1.3 Happy Path - Persistenza Sessione -> === DONE ===
**Obiettivo:** Verificare che la sessione rimanga attiva dopo refresh

**Prerequisiti:**
- Utente loggato

**Step principali:**
1. Fai login
2. Verifica di essere nel dashboard
3. Esegui `cy.reload()`
4. Verifica di essere ancora loggato

**Assertion chiave:**
- Dopo reload, l'URL deve essere ancora `/dashboard`
- Token deve esistere ancora in localStorage
- Nessun redirect a `/login`

**Concetti Cypress:**
- `cy.reload()` → ricarica pagina
- `cy.window().then((win) => win.localStorage.getItem('token'))` → accesso storage

---

### 1.4 Edge Case - Email Vuota -> === DONE ===
**Obiettivo:** Verificare validazione quando email è mancante

**Step principali:**
1. Visita login
2. Lascia email vuoto
3. Inserisci password valida
4. Tenta login

**Assertion chiave:**
- Pulsante login disabilitato OPPURE
- Messaggio errore visibile: `cy.contains('Email is required')`
- Nessun redirect
- `cy.url().should('include', '/login')` → rimane su login

**Concetti Cypress:**
- `cy.get('button[type="submit"]').should('be.disabled')` → verifica stato bottone
- Test validazione lato client vs server

---

### 1.5 Edge Case - Password Vuota -> === DONE ===
**Obiettivo:** Come sopra, ma per password

**Step principali:**
1. Inserisci email valida
2. Lascia password vuota
3. Tenta login

**Assertion chiave:**
- Stesso comportamento del test email vuota
- `cy.get('.error-message').should('contain', 'Password is required')`

---

### 1.6 Edge Case - Credenziali Errate
**Obiettivo:** Verificare gestione errore per credenziali non valide

**Step principali:**
1. Inserisci email non registrata o password errata
2. Clicca login
3. Attendi risposta API

**Assertion chiave:**
- Messaggio errore specifico: "Invalid credentials" o simile
- Status code API = 401 (usa `cy.intercept()` per verificare)
- Utente rimane su pagina login
- Form non viene svuotato (o viene svuotato, dipende dal UX)

**Concetti Cypress:**
```javascript
cy.intercept('POST', '**/api/login').as('loginRequest')
cy.get('button').click()
cy.wait('@loginRequest').its('response.statusCode').should('eq', 401)
```

---

### 1.7 Edge Case - Limite Tentativi
**Obiettivo:** Verificare blocco dopo N tentativi falliti (se implementato)

**Step principali:**
1. Prova login errato 3-5 volte consecutivamente
2. Verifica se appare messaggio di blocco
3. Verifica se bottone login viene disabilitato

**Assertion chiave:**
- Messaggio "Too many attempts" o simile
- Account temporaneamente bloccato
- Possibile CAPTCHA che appare

**Concetti Cypress:**
- Loop con `Cypress._.times(5, () => { ... })` per ripetere tentativi
- `cy.clock()` e `cy.tick()` per simulare tempo (se blocco temporaneo)

---

## 2. REGISTRAZIONE / SIGN UP

### 2.1 Happy Path - Registrazione Valida
**Obiettivo:** Creare un nuovo utente con successo

**Prerequisiti:**
- Avere dati univoci (email non già registrata)
- Usare `faker` library per generare dati random

**Step principali:**
1. Visita `/signup` o `/register`
2. Compila tutti i campi richiesti (nome, email, password, conferma password)
3. Clicca su "Sign Up"
4. Attendi conferma

**Assertion chiave:**
- Messaggio di successo: "Account created successfully"
- Redirect a `/dashboard` o `/login`
- Se auto-login, verifica presenza token
- Verifica API: status 201 Created

**Concetti Cypress:**
```javascript
import { faker } from '@faker-js/faker'

const user = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: 'ValidPass123!'
}

cy.intercept('POST', '**/api/register').as('registerRequest')
// ... compila form
cy.wait('@registerRequest').its('response.statusCode').should('eq', 201)
```

---

### 2.2 Happy Path - Verifica Messaggio Conferma
**Obiettivo:** Controllare che il feedback visivo sia corretto

**Assertion chiave:**
- Toast notification o alert con messaggio positivo
- Icona di successo (checkmark)
- Colore verde per indicare successo

**Concetti Cypress:**
- `cy.get('.toast-success').should('be.visible')`
- Timeout personalizzato se notifica scompare: `.should('be.visible', { timeout: 10000 })`

---

### 2.3 Happy Path - Auto-login Dopo Registrazione
**Obiettivo:** Se l'app fa login automatico, verificarlo

**Assertion chiave:**
- Dopo registrazione, utente è già nel dashboard
- Token presente in localStorage
- No necessità di login manuale

---

### 2.4 Edge Case - Email Già Esistente
**Obiettivo:** Verificare gestione duplicati

**Prerequisiti:**
- Prima registra un utente
- Poi prova a registrarlo di nuovo con stessa email

**Assertion chiave:**
- Errore API: status 409 Conflict o 400 Bad Request
- Messaggio UI: "Email already registered" o simile
- Form non viene resettato (utente può correggere)

---

### 2.5 Edge Case - Password Non Conforme
**Obiettivo:** Testare validazione password (lunghezza, complessità)

**Step principali:**
1. Prova password troppo corta (es. "123")
2. Prova password senza numeri/caratteri speciali
3. Prova password senza maiuscole

**Assertion chiave:**
- Messaggio errore specifico per ogni regola
- Pulsante submit disabilitato
- Indicatore visuale requisiti password (rosso/verde)

**Concetti Cypress:**
- Test parametrizzati con array di password invalide:
```javascript
const invalidPasswords = ['123', 'nodigits', 'NOCAPS', 'nospecial1']
invalidPasswords.forEach(pwd => {
  // testa ognuna
})
```

---

### 2.6 Edge Case - Campi Vuoti
**Obiettivo:** Verificare validazione required fields

**Assertion chiave:**
- Ogni campo obbligatorio mostra errore se vuoto
- Submit disabilitato finché tutti i campi non sono validi
- Errori mostrati solo dopo tentativo submit (validazione on-blur o on-submit)

---

### 2.7 Validazione Client vs API
**Obiettivo:** Verificare che validazione client e server siano allineate

**Cosa testare:**
- Disabilita validazione HTML5 con `cy.get('form').invoke('attr', 'novalidate', 'novalidate')`
- Invia dati invalidi direttamente
- Verifica che API risponda comunque con errore

**Concetti Cypress:**
- Importante testare entrambi i layer (client può essere bypassato)
- `cy.request()` per chiamare direttamente API senza UI

---

## 3. DASHBOARD / VISUALIZZAZIONE DATI

### 3.1 Caricamento Dati da API
**Obiettivo:** Verificare che i dati vengano recuperati e mostrati correttamente

**Step principali:**
1. Fai login
2. Intercetta chiamata API del dashboard
3. Verifica che i dati siano renderizzati

**Assertion chiave:**
```javascript
cy.intercept('GET', '**/api/dashboard').as('getDashboard')
cy.visit('/dashboard')
cy.wait('@getDashboard').then((interception) => {
  expect(interception.response.statusCode).to.eq(200)
  const data = interception.response.body
  // Verifica che ogni elemento dei dati sia mostrato nell'UI
  data.forEach(item => {
    cy.contains(item.name).should('be.visible')
  })
})
```

**Concetti Cypress:**
- `cy.intercept()` per monitorare network
- `.then()` per accedere ai dati della response
- Correlazione tra dati API e rendering UI

---

### 3.2 Rendering Liste/Tabelle
**Obiettivo:** Verificare che tabelle mostrino i dati corretti

**Assertion chiave:**
- Numero righe tabella = numero elementi da API
- Header colonne corretti
- Ogni cella contiene dato corretto
```javascript
cy.get('table tbody tr').should('have.length', expectedLength)
cy.get('table thead th').should('contain', 'Name')
```

---

### 3.3 Ordinamento
**Obiettivo:** Testare funzionalità di sort

**Step principali:**
1. Clicca su header colonna (es. "Name")
2. Verifica che lista sia ordinata alfabeticamente
3. Clicca di nuovo → verifica ordine inverso

**Assertion chiave:**
```javascript
cy.get('th[data-column="name"]').click()
cy.get('table tbody tr td:first-child').then($cells => {
  const names = [...$cells].map(cell => cell.textContent)
  const sorted = [...names].sort()
  expect(names).to.deep.equal(sorted)
})
```

**Concetti Cypress:**
- `.then()` per ottenere elementi jQuery
- Conversione in array JavaScript per manipolazione
- `deep.equal` per confronto array

---

### 3.4 Filtri
**Obiettivo:** Verificare che i filtri riducano correttamente i risultati

**Step principali:**
1. Conta elementi totali
2. Applica filtro (es. cerca "John")
3. Verifica che solo elementi matching siano visibili

**Assertion chiave:**
```javascript
cy.get('input[name="search"]').type('John')
cy.get('table tbody tr').each($row => {
  cy.wrap($row).should('contain', 'John')
})
```

---

### 3.5 Paginazione
**Obiettivo:** Testare navigazione tra pagine

**Step principali:**
1. Verifica pulsanti Next/Previous
2. Clicca Next → verifica nuovi dati
3. Verifica numero pagina corrente
4. Testa pulsanti disabilitati su prima/ultima pagina

**Assertion chiave:**
```javascript
cy.get('[data-testid="current-page"]').should('contain', '1')
cy.get('[data-testid="prev-button"]').should('be.disabled')
cy.get('[data-testid="next-button"]').click()
cy.get('[data-testid="current-page"]').should('contain', '2')
```

---

### 3.6 Gestione Errori API
**Obiettivo:** Verificare UI quando API fallisce

**Step principali:**
1. Mock API response con errore 500
2. Visita dashboard
3. Verifica messaggio errore user-friendly

**Assertion chiave:**
```javascript
cy.intercept('GET', '**/api/dashboard', {
  statusCode: 500,
  body: { error: 'Internal Server Error' }
}).as('failedRequest')

cy.visit('/dashboard')
cy.wait('@failedRequest')
cy.get('.error-message').should('contain', 'Unable to load data')
```

**Concetti Cypress:**
- Mock response per simulare scenari di errore
- Test resilienza dell'applicazione

---

### 3.7 Gestione Dati Vuoti
**Obiettivo:** Verificare UI quando non ci sono dati

**Step principali:**
1. Mock API con array vuoto
2. Verifica messaggio "No data available" o simile
3. Verifica che non ci siano errori JavaScript

**Assertion chiave:**
```javascript
cy.intercept('GET', '**/api/dashboard', { body: [] })
cy.visit('/dashboard')
cy.contains('No items found').should('be.visible')
cy.get('table tbody tr').should('have.length', 0)
```

---

### 3.8 Test Responsive
**Obiettivo:** Verificare layout su diverse risoluzioni

**Step principali:**
1. Testa su mobile viewport
2. Verifica che menu hamburger appaia
3. Verifica che tabella diventi scrollabile o si adatti

**Assertion chiave:**
```javascript
cy.viewport('iphone-x')
cy.get('.mobile-menu-button').should('be.visible')
cy.get('.desktop-menu').should('not.be.visible')

cy.viewport(1920, 1080)
cy.get('.desktop-menu').should('be.visible')
```

**Concetti Cypress:**
- `cy.viewport()` per cambiare dimensioni finestra
- Preset: 'iphone-x', 'ipad-2', o dimensioni custom

---

## 4. CRUD SU RISORSE

### 4.1 CREATE - Creazione Record
**Obiettivo:** Creare nuova risorsa e verificare su UI + API

**Step principali:**
1. Clicca "Add New" button
2. Compila form con dati validi
3. Submit
4. Verifica che nuovo elemento appaia nella lista

**Assertion chiave:**
```javascript
cy.intercept('POST', '**/api/users').as('createUser')

const newUser = { name: 'John Doe', email: 'john@test.com' }
// compila form...
cy.get('button[type="submit"]').click()

cy.wait('@createUser').then((interception) => {
  expect(interception.response.statusCode).to.eq(201)
  const createdUser = interception.response.body
  
  // Verifica UI
  cy.contains(createdUser.name).should('be.visible')
})
```

**Concetti Cypress:**
- Verifica sia API response che aggiornamento UI
- Status code 201 = Created

---

### 4.2 CREATE - Dati Incompleti
**Obiettivo:** Tentare creazione con dati mancanti

**Assertion chiave:**
- Form validation previene submit OPPURE
- API risponde 400 Bad Request con errori specifici
- Messaggi di errore per ogni campo problematico

---

### 4.3 READ - Lista Risorse
**Obiettivo:** Recuperare e verificare lista completa

**Step principali:**
1. Fai GET alla lista
2. Verifica struttura JSON
3. Verifica che ogni elemento abbia campi obbligatori

**Assertion chiave:**
```javascript
cy.request('GET', '/api/users').then((response) => {
  expect(response.status).to.eq(200)
  expect(response.body).to.be.an('array')
  
  response.body.forEach(user => {
    expect(user).to.have.property('id')
    expect(user).to.have.property('name')
    expect(user).to.have.property('email')
  })
})
```

**Concetti Cypress:**
- `cy.request()` per chiamate API dirette
- Validazione schema JSON

---

### 4.4 READ - Singolo Elemento
**Obiettivo:** Ottenere dettagli di un elemento specifico

**Step principali:**
1. GET `/api/users/:id`
2. Verifica che ID corrisponda
3. Verifica tutti i campi dettaglio

**Assertion chiave:**
```javascript
cy.request('GET', '/api/users/123').then((response) => {
  expect(response.status).to.eq(200)
  expect(response.body.id).to.eq(123)
  expect(response.body).to.have.all.keys('id', 'name', 'email', 'createdAt')
})
```

---

### 4.5 UPDATE - Modifica Record
**Obiettivo:** Aggiornare risorsa esistente

**Step principali:**
1. Clicca "Edit" su un elemento
2. Modifica alcuni campi
3. Salva
4. Verifica aggiornamento su UI e via API

**Assertion chiave:**
```javascript
cy.intercept('PUT', '**/api/users/*').as('updateUser')

cy.get('[data-testid="edit-button-1"]').click()
cy.get('input[name="name"]').clear().type('Updated Name')
cy.get('button[type="submit"]').click()

cy.wait('@updateUser').its('response.statusCode').should('eq', 200)
cy.contains('Updated Name').should('be.visible')
```

**Concetti Cypress:**
- PUT (sostituzione completa) vs PATCH (aggiornamento parziale)
- Verifica che solo campi modificati cambino

---

### 4.6 UPDATE - Dati Invalidi
**Obiettivo:** Tentare aggiornamento con dati non validi

**Assertion chiave:**
- API risponde 400
- UI mostra errori di validazione
- Record NON viene aggiornato

---

### 4.7 DELETE - Eliminazione Record
**Obiettivo:** Rimuovere una risorsa

**Step principali:**
1. Clicca "Delete" su un elemento
2. (Se presente) Conferma su modal
3. Verifica rimozione da UI
4. Verifica rimozione via API

**Assertion chiave:**
```javascript
cy.intercept('DELETE', '**/api/users/*').as('deleteUser')

cy.get('[data-testid="delete-button-1"]').click()
cy.get('.confirm-modal button.confirm').click()

cy.wait('@deleteUser').its('response.statusCode').should('eq', 204)

// Verifica che elemento non esista più
cy.get('[data-testid="user-1"]').should('not.exist')
```

**Concetti Cypress:**
- Status code 204 = No Content (delete success)
- `.should('not.exist')` vs `.should('not.be.visible')` → differenza importante!

---

### 4.8 DELETE - Conferma Prompt
**Obiettivo:** Verificare che ci sia conferma prima di delete

**Assertion chiave:**
- Modal di conferma appare
- Testo chiede conferma esplicita
- Pulsante "Cancel" annulla operazione
- Pulsante "Confirm" procede con delete

---

## 5. API TESTING DIRETTO

### 5.1 Login API - Valido/Invalido
**Obiettivo:** Testare endpoint login senza UI

**Test Valido:**
```javascript
cy.request({
  method: 'POST',
  url: '/api/login',
  body: { email: 'valid@test.com', password: 'ValidPass123!' }
}).then((response) => {
  expect(response.status).to.eq(200)
  expect(response.body).to.have.property('token')
  expect(response.body.token).to.be.a('string')
})
```

**Test Invalido:**
```javascript
cy.request({
  method: 'POST',
  url: '/api/login',
  body: { email: 'wrong@test.com', password: 'wrong' },
  failOnStatusCode: false // Non fallire il test su 4xx/5xx
}).then((response) => {
  expect(response.status).to.eq(401)
  expect(response.body).to.have.property('error')
})
```

**Concetti Cypress:**
- `failOnStatusCode: false` permette di testare errori
- Test API puri sono più veloci (no rendering UI)

---

### 5.2 GET Lista - Struttura JSON
**Obiettivo:** Validare formato response

**Assertion chiave:**
```javascript
cy.request('GET', '/api/users').then((response) => {
  expect(response.status).to.eq(200)
  expect(response.headers['content-type']).to.include('application/json')
  
  expect(response.body).to.be.an('array')
  if (response.body.length > 0) {
    const firstUser = response.body[0]
    expect(firstUser).to.have.all.keys('id', 'name', 'email', 'createdAt')
    expect(firstUser.id).to.be.a('number')
    expect(firstUser.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }
})
```

**Concetti Cypress:**
- Validazione tipi di dati
- Regex per validare formati (email, date, etc.)

---

### 5.3 POST - Nuovo Record
**Obiettivo:** Creare risorsa via API

**Assertion chiave:**
```javascript
cy.request({
  method: 'POST',
  url: '/api/users',
  body: { name: 'API User', email: 'api@test.com', password: 'Test123!' },
  headers: { 'Authorization': `Bearer ${token}` }
}).then((response) => {
  expect(response.status).to.eq(201)
  expect(response.body).to.have.property('id')
  
  // Salva ID per cleanup dopo test
  const userId = response.body.id
  
  // Verifica che sia recuperabile
  cy.request('GET', `/api/users/${userId}`).then((getResponse) => {
    expect(getResponse.body.name).to.eq('API User')
  })
})
```

**Concetti Cypress:**
- Header Authorization per endpoint protetti
- Cleanup: elimina dati creati nei test con `after()` hook

---

### 5.4 PUT/PATCH - Aggiornamento
**Obiettivo:** Modificare risorsa esistente

**Assertion chiave:**
```javascript
// Prima crea una risorsa
cy.request('POST', '/api/users', {...}).then((createResp) => {
  const userId = createResp.body.id
  
  // Poi aggiornala
  cy.request({
    method: 'PUT',
    url: `/api/users/${userId}`,
    body: { name: 'Updated Name', email: 'updated@test.com' }
  }).then((updateResp) => {
    expect(updateResp.status).to.eq(200)
    expect(updateResp.body.name).to.eq('Updated Name')
  })
})
```

---

### 5.5 DELETE - Rimozione
**Obiettivo:** Eliminare risorsa via API

**Assertion chiave:**
```javascript
cy.request('DELETE', `/api/users/${userId}`).then((response) => {
  expect(response.status).to.eq(204)
  
  // Verifica che non sia più recuperabile
  cy.request({
    url: `/api/users/${userId}`,
    failOnStatusCode: false
  }).then((getResp) => {
    expect(getResp.status).to.eq(404)
  })
})
```

---

### 5.6 Simulazione Errori con `cy.intercept()`
**Obiettivo:** Testare comportamento UI quando API fallisce

**Scenario 1: API Timeout**
```javascript
cy.intercept('GET', '**/api/users', (req) => {
  req.reply({
    delay: 30000, // 30 secondi
    statusCode: 408,
    body: { error: 'Request Timeout' }
  })
}).as('slowRequest')

cy.visit('/users')
// Verifica che appaia loading spinner
cy.get('.loading-spinner').should('be.visible')
// E poi messaggio di timeout
cy.contains('Request timed out').should('be.visible')
```

**Scenario 2: Server Error 500**
```javascript
cy.intercept('POST', '**/api/users', {
  statusCode: 500,
  body: { error: 'Internal Server Error' }
})

// Tenta creazione utente
cy.get('button.add-user').click()
// Compila form...
cy.get('button[type="submit"]').click()

// Verifica error message
cy.get('.error-toast').should('contain', 'Something went wrong')
```

**Scenario 3: Network Error**
```javascript
cy.intercept('GET', '**/api/dashboard', { forceNetworkError: true })

cy.visit('/dashboard')
cy.contains('Unable to connect').should('be.visible')
```

**Concetti Cypress:**
- `cy.intercept()` può modificare request/response
- `forceNetworkError` simula disconnessione
- Testa fallback UI (error boundaries, retry buttons)

---

## 6. INTERAZIONI UI

### 6.1 Pulsanti Disabilitati/Abilitati
**Obiettivo:** Verificare stato dinamico dei bottoni

**Scenario:**
- Email invalida → mostra errore "Invalid email format"
- Password troppo corta → mostra "Password must be at least 8 characters"

**Assertion chiave:**
```javascript
cy.get('input[name="email"]').type('notanemail')
cy.get('input[name="email"]').blur() // Trigger validazione on-blur

cy.get('.error-email').should('be.visible')
cy.get('.error-email').should('contain', 'Invalid email')

// Correggi input
cy.get('input[name="email"]').clear().type('valid@test.com')
cy.get('.error-email').should('not.exist')
```

---

### 6.6 Drag & Drop
**Obiettivo:** Testare funzionalità drag-and-drop (se presente)

**Assertion chiave:**
```javascript
// Esempio con plugin cypress-drag-drop
cy.get('.draggable-item').drag('.drop-zone')
cy.get('.drop-zone').should('contain', 'Draggable Item')

// O manualmente con trigger
cy.get('.draggable-item')
  .trigger('mousedown', { which: 1 })
  .trigger('mousemove', { clientX: 300, clientY: 300 })
  .trigger('mouseup', { force: true })
```

**Concetti Cypress:**
- Drag & drop può richiedere plugin o implementazione custom
- Verifica posizione finale e stato applicazione

---

## 7. EDGE CASES E STRESS TESTING

### 7.1 Form Inviato Rapidamente
**Obiettivo:** Prevenire doppi submit

**Scenario:**
```javascript
cy.get('button[type="submit"]').click().click().click()

// Verifica che solo UNA richiesta sia stata inviata
cy.get('@createRequest.all').should('have.length', 1)

// Oppure verifica che bottone sia disabilitato dopo primo click
cy.get('button[type="submit"]').should('be.disabled')
```

**Concetti Cypress:**
- `.all` ottiene tutte le chiamate intercettate
- Test debouncing/throttling

---

### 7.2 Input Caratteri Speciali
**Obiettivo:** Verificare sanitizzazione e gestione edge cases

**Test Cases:**
```javascript
const edgeCases = [
  "O'Brien", // Apostrofo
  '<script>alert("XSS")</script>', // XSS attempt
  '../../etc/passwd', // Path traversal
  'àèéìòù', // Caratteri accentati
  '🎉🚀💻', // Emoji
  'Robert"); DROP TABLE users;--', // SQL Injection
  'user@domain..com', // Email malformata
  '   spaces   ', // Spazi multipli
]

edgeCases.forEach(input => {
  cy.get('input[name="name"]').clear().type(input)
  cy.get('button[type="submit"]').click()
  
  // Verifica che l'app non crashe e gestisca correttamente
  cy.get('.error-message').should('exist')
  // O verifica che input sia sanitizzato
})
```

**Concetti Cypress:**
- Test sicurezza (XSS, SQL injection)
- Gestione Unicode e caratteri speciali
- Importante per robustezza applicazione

---

### 7.3 Rete Lenta con Intercept
**Obiettivo:** Simulare connessione lenta

**Scenario:**
```javascript
cy.intercept('GET', '**/api/users', (req) => {
  req.reply({
    delay: 5000, // 5 secondi delay
    statusCode: 200,
    body: mockUsers
  })
}).as('slowRequest')

cy.visit('/users')

// Verifica che loading indicator sia mostrato
cy.get('.loading-spinner').should('be.visible')

cy.wait('@slowRequest')

// Dopo caricamento, spinner scompare
cy.get('.loading-spinner').should('not.exist')
cy.get('.user-list').should('be.visible')
```

**Concetti Cypress:**
- `delay` in millisecondi
- Test UX con connessioni lente
- Verifica timeout handling

---

### 7.4 API Down (Mock 500)
**Obiettivo:** Testare resilienza quando backend è irraggiungibile

**Scenario:**
```javascript
cy.intercept('GET', '**/api/dashboard', {
  statusCode: 500,
  body: { error: 'Database connection failed' }
})

cy.visit('/dashboard')

// Verifica error boundary o fallback UI
cy.get('.error-page').should('be.visible')
cy.contains('Something went wrong').should('be.visible')

// Verifica pulsante retry
cy.get('button.retry').should('be.visible')
```

---

### 7.5 Test Multi-Browser
**Obiettivo:** Verificare compatibilità cross-browser

**Configurazione cypress.config.js:**
```javascript
module.exports = {
  e2e: {
    // ...
  },
  // Definisci browser da testare
}
```

**Esecuzione:**
```bash
# Chrome
npx cypress run --browser chrome

# Firefox
npx cypress run --browser firefox

# Edge
npx cypress run --browser edge

# Electron (default)
npx cypress run
```

**Cosa verificare:**
- Rendering identico
- Funzionalità JavaScript
- Event handling
- CSS compatibility

---

## 8. VISUAL / ACCESSIBILITÀ

### 8.1 Layout Responsivo
**Obiettivo:** Verificare adattamento a diverse risoluzioni

**Test Desktop:**
```javascript
cy.viewport(1920, 1080)
cy.visit('/dashboard')
cy.get('.sidebar').should('be.visible')
cy.get('.mobile-menu').should('not.exist')
```

**Test Tablet:**
```javascript
cy.viewport('ipad-2')
cy.visit('/dashboard')
// Verifica layout intermedio
```

**Test Mobile:**
```javascript
cy.viewport('iphone-x')
cy.visit('/dashboard')
cy.get('.mobile-menu-button').should('be.visible')
cy.get('.sidebar').should('not.be.visible')

// Apri menu mobile
cy.get('.mobile-menu-button').click()
cy.get('.mobile-sidebar').should('be.visible')
```

**Concetti Cypress:**
- Preset viewports: 'iphone-x', 'ipad-2', 'samsung-s10'
- Custom: `cy.viewport(375, 667)`
- Testa breakpoints critici (320px, 768px, 1024px, 1920px)

---

### 8.2 Contrasto Colori
**Obiettivo:** Verificare accessibilità visiva

**Approccio Manuale:**
```javascript
cy.get('button.primary').then($btn => {
  const bgColor = $btn.css('background-color')
  const textColor = $btn.css('color')
  
  // Usa libreria come contrast-ratio per calcolare
  // Ratio minimo WCAG AA: 4.5:1 per testo normale
  // Ratio minimo WCAG AA: 3:1 per testo grande
})
```

**Con Plugin (cypress-axe):**
```bash
npm install --save-dev cypress-axe axe-core
```

```javascript
import 'cypress-axe'

cy.visit('/dashboard')
cy.injectAxe() // Inietta axe-core
cy.checkA11y() // Verifica tutte le regole accessibilità

// O controlla elemento specifico
cy.checkA11y('.login-form')

// O escludi certe regole
cy.checkA11y(null, {
  rules: {
    'color-contrast': { enabled: true }
  }
})
```

---

### 8.3 Navigazione Tastiera
**Obiettivo:** Verificare usabilità senza mouse

**Tab Order:**
```javascript
cy.visit('/login')

// Tab attraverso i campi
cy.get('body').tab()
cy.focused().should('have.attr', 'name', 'email')

cy.get('body').tab()
cy.focused().should('have.attr', 'name', 'password')

cy.get('body').tab()
cy.focused().should('have.attr', 'type', 'submit')
```

**Submit con Enter:**
```javascript
cy.get('input[name="email"]').type('test@test.com{enter}')
// Verifica che form sia stato inviato
```

**Navigazione Modal:**
```javascript
cy.get('button.open-modal').click()
cy.focused().should('have.class', 'modal') // Focus trap

// Tenta uscire con ESC
cy.get('body').type('{esc}')
cy.get('.modal').should('not.exist')
```

**Concetti Cypress:**
- `.tab()` richiede plugin cypress-plugin-tab
- Focus management è cruciale per accessibilità
- Testa focus trap nei modal

---

### 8.4 Screen Reader (ARIA Labels)
**Obiettivo:** Verificare attributi ARIA corretti

**Assertion chiave:**
```javascript
// Pulsanti hanno label descrittive
cy.get('button[aria-label="Close modal"]').should('exist')

// Immagini hanno alt text
cy.get('img').should('have.attr', 'alt')

// Form controls hanno label associate
cy.get('input#email').should('have.attr', 'aria-describedby', 'email-help')

// Landmarks ARIA
cy.get('[role="navigation"]').should('exist')
cy.get('[role="main"]').should('exist')

// Live regions per notifiche
cy.get('[aria-live="polite"]').should('contain', 'Success message')
```

---

## BEST PRACTICES GENERALI

### Organizzazione File
```
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.cy.js
│   │   └── signup.cy.js
│   ├── dashboard/
│   │   └── dashboard.cy.js
│   ├── crud/
│   │   ├── users.cy.js
│   │   └── posts.cy.js
│   └── api/
│       └── api-tests.cy.js
├── fixtures/
│   ├── users.json
│   └── mockData.json
├── support/
│   ├── commands.js
│   ├── e2e.js
│   └── pages/
│       ├── LoginPage.js
│       └── DashboardPage.js
└── cypress.config.js
```

### Custom Commands
**File: cypress/support/commands.js**
```javascript
// Login reusabile
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Login via API (più veloce)
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request('POST', '/api/login', { email, password })
    .then((response) => {
      window.localStorage.setItem('token', response.body.token)
    })
})

// Cleanup database
Cypress.Commands.add('resetDB', () => {
  cy.request('POST', '/api/test/reset-db')
})
```

### Page Object Pattern
**File: cypress/support/pages/LoginPage.js**
```javascript
class LoginPage {
  visit() {
    cy.visit('/login')
  }

  fillEmail(email) {
    cy.get('input[name="email"]').type(email)
    return this
  }

  fillPassword(password) {
    cy.get('input[name="password"]').type(password)
    return this
  }

  submit() {
    cy.get('button[type="submit"]').click()
    return this
  }

  getErrorMessage() {
    return cy.get('.error-message')
  }
}

export default new LoginPage()
```

**Uso:**
```javascript
import LoginPage from '../support/pages/LoginPage'

it('should login successfully', () => {
  LoginPage.visit()
    .fillEmail('test@test.com')
    .fillPassword('Pass123!')
    .submit()
    
  cy.url().should('include', '/dashboard')
})
```

### Fixtures per Dati
**File: cypress/fixtures/users.json**
```json
{
  "validUser": {
    "email": "test@test.com",
    "password": "ValidPass123!"
  },
  "invalidUser": {
    "email": "wrong@test.com",
    "password": "wrong"
  }
}
```

**Uso:**
```javascript
cy.fixture('users').then((users) => {
  cy.get('input[name="email"]').type(users.validUser.email)
  cy.get('input[name="password"]').type(users.validUser.password)
})
```

### Hooks per Setup/Cleanup
```javascript
describe('User Management', () => {
  beforeEach(() => {
    // Reset DB prima di ogni test
    cy.resetDB()
    // Login
    cy.loginViaAPI('admin@test.com', 'Admin123!')
    // Visita pagina
    cy.visit('/users')
  })

  afterEach(() => {
    // Cleanup dati creati
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it('should create user', () => {
    // Test qui...
  })
})
```

### Data-testid per Selezione Stabile
**HTML:**
```html
<button data-testid="submit-button">Submit</button>
<div data-testid="user-card-123">...</div>
```

**Cypress:**
```javascript
cy.get('[data-testid="submit-button"]').click()
cy.get('[data-testid="user-card-123"]').should('be.visible')
```

**Vantaggi:**
- Non dipende da classi CSS (che possono cambiare)
- Chiaro intento di testing
- Più robusto nel tempo

---

## COMANDI UTILI

### Esecuzione Test
```bash
# Apri Cypress UI
npx cypress open

# Run headless (tutti i test)
npx cypress run

# Run singolo file
npx cypress run --spec "cypress/e2e/auth/login.cy.js"

# Run con browser specifico
npx cypress run --browser chrome

# Run con video disabled (più veloce)
npx cypress run --config video=false

# Run in parallelo (Cypress Cloud)
npx cypress run --record --parallel
```

### Debug
```javascript
// Pausa esecuzione
cy.pause()

// Log in console
cy.log('Questo è un messaggio di debug')

// Debug specifico elemento
cy.get('.element').debug()

// Screenshot
cy.screenshot('nome-screenshot')

// Accesso a console browser
cy.window().then((win) => {
  console.log(win.someGlobalVariable)
})
```

---

## SUGGERIMENTI FINALI

1. **Inizia con Happy Paths**: Prima testa che le funzionalità base funzionino
2. **Poi Edge Cases**: Aggiungi test per casi limite
3. **Evita Test Fragili**: Usa `data-testid`, evita selettori CSS complessi
4. **Mantieni Test Indipendenti**: Ogni test deve poter essere eseguito da solo
5. **Usa before/after con Saggezza**: Setup comune va in `beforeEach`, cleanup in `afterEach`
6. **Mock Quando Serve**: Usa `cy.intercept()` per test veloci e deterministici
7. **Test Realisti**: Ma testa anche contro API vere periodicamente
8. **CI/CD Integration**: Configura test automatici su ogni push
9. **Documentazione**: Commenta test complessi, spiega il "perché"
10. **Refactoring**: Se vedi codice duplicato, crea custom commands o page objects Submit disabilitato se form invalido
- Button abilitato quando tutti i campi sono compilati

**Assertion chiave:**
```javascript
cy.get('button[type="submit"]').should('be.disabled')

cy.get('input[name="email"]').type('test@test.com')
cy.get('input[name="password"]').type('Pass123!')

cy.get('button[type="submit"]').should('be.enabled')
```

**Concetti Cypress:**
- `.should('be.disabled')` / `.should('be.enabled')`
- Test reattività UI in base a input

---

### 6.2 Checkbox / Radio / Select
**Obiettivo:** Verificare comportamento form controls

**Checkbox:**
```javascript
cy.get('input[type="checkbox"]').check().should('be.checked')
cy.get('input[type="checkbox"]').uncheck().should('not.be.checked')

// Verifica che dato sia inviato correttamente
cy.intercept('POST', '**/api/settings').as('saveSettings')
cy.get('input#notifications').check()
cy.get('button.save').click()
cy.wait('@saveSettings').its('request.body').should('include', { notifications: true })
```

**Radio Buttons:**
```javascript
cy.get('input[type="radio"][value="option1"]').check().should('be.checked')
cy.get('input[type="radio"][value="option2"]').should('not.be.checked')
```

**Select Menu:**
```javascript
cy.get('select[name="country"]').select('Italy')
cy.get('select[name="country"]').should('have.value', 'IT')

// O per testo visibile
cy.get('select').select('Italia').should('contain', 'Italia')
```

**Concetti Cypress:**
- `.check()` / `.uncheck()` per checkbox/radio
- `.select()` per dropdown
- Verifica correlazione tra UI state e dati inviati

---

### 6.3 Modali - Apertura/Chiusura
**Obiettivo:** Testare dialog/modal behavior

**Apertura:**
```javascript
cy.get('.modal').should('not.exist')
cy.get('button.open-modal').click()
cy.get('.modal').should('be.visible')
cy.get('.modal-title').should('contain', 'Confirm Action')
```

**Chiusura con X:**
```javascript
cy.get('.modal .close-button').click()
cy.get('.modal').should('not.exist')
```

**Chiusura con ESC:**
```javascript
cy.get('body').type('{esc}')
cy.get('.modal').should('not.exist')
```

**Chiusura con Backdrop:**
```javascript
cy.get('.modal-backdrop').click({ force: true })
cy.get('.modal').should('not.exist')
```

**Concetti Cypress:**
- `.type('{esc}')` simula tastiera
- `{ force: true }` per click su elementi overlay
- Testa tutte le modalità di chiusura

---

### 6.4 Tooltip
**Obiettivo:** Verificare presenza e contenuto tooltip

**Assertion chiave:**
```javascript
cy.get('.tooltip').should('not.be.visible')

cy.get('button.info-icon').trigger('mouseenter')
cy.get('.tooltip').should('be.visible')
cy.get('.tooltip').should('contain', 'Additional information here')

cy.get('button.info-icon').trigger('mouseleave')
cy.get('.tooltip').should('not.be.visible')
```

**Concetti Cypress:**
- `.trigger('mouseenter')` / `.trigger('mouseleave')` per hover
- Alcuni tooltip richiedono delay: `cy.wait(300)`

---

### 6.5 Messaggi di Validazione
**Obiettivo:** Verificare feedback in tempo reale

**Scenario:**
-