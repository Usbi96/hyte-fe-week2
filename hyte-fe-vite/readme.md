/// Projektin tekemisessä on käytetty Ai:ta. ///

# Hyvinvointipäiväkirja – Frontend (Vite)

Tämä projekti on osa HYTE-web -kurssia. Sovellus toimii käyttöliittymänä hyvinvointipäiväkirjalle ja kommunikoi Node/Express REST API -taustapalvelun kanssa.

Projektissa käytetään **Viteä**, **Fetch API:a**, **JWT-autentikaatiota** ja **Flexbox-layoutia**.

## Ominaisuudet

* Käyttäjän kirjautuminen (login)
* JWT-tokenin tallentaminen selaimen localStorageen
* Autentikoidut API-kutsut
* Päiväkirjamerkintöjen hakeminen backendistä
* Flexbox-kortit merkintöjen näyttämiseen
* Modaali yksittäisen merkinnän tarkasteluun
* Uloskirjautuminen

## Teknologiat

* HTML
* CSS
* JavaScript (ES Modules)
* Vite
* Fetch API
* JWT (JSON Web Token)

## Projektirakenne

```
hyte-fe-vite
│
├─ index.html
├─ login.html
│
├─ public
│   └─ diary.json
│
└─ src
    ├─ css
    │   └─ style.css
    │
    └─ js
        ├─ main.js
        ├─ login.js
        ├─ entries.js
        ├─ users.js
        ├─ items.js
        └─ fetch.js
```

## Asennus

1. Kloonaa repository:

```
git clone https://github.com/USERNAME/hyte-fe-vite.git
```

2. Siirry projektikansioon:

```
cd hyte-fe-vite
```

3. Asenna riippuvuudet:

```
npm install
```

4. Käynnistä kehityspalvelin:

```
npm run dev
```

Sovellus käynnistyy osoitteessa:

```
http://localhost:5173
```

## Kirjautuminen

Käyttäjä kirjautuu sisään login-sivulla. Onnistuneen kirjautumisen jälkeen backend palauttaa JWT-tokenin, joka tallennetaan selaimen localStorageen.

Token lisätään kaikkiin suojattuihin API-kutsuihin:

```
Authorization: Bearer <token>
```

## Päiväkirjamerkinnät

Päiväkirjamerkinnät haetaan backendin rajapinnasta:

```
GET /api/entries
```

Jos backend ei ole käytettävissä, sovellus voi käyttää väliaikaista testidataa:

```
public/diary.json
```

Merkinnät renderöidään dynaamisesti **Flexbox-korteiksi**, joista voidaan avata tarkemmat tiedot **modaalissa**.

## Uloskirjautuminen

Uloskirjautuminen poistaa tokenin localStoragesta:

```
localStorage.removeItem("token")
```

ja ohjaa käyttäjän takaisin login-sivulle.

## Kurssitehtävän tavoitteet

Projektissa toteutettiin:

* Flexbox-layout
* Modaali-ikkuna
* Fetch API -kutsut
* JWT-autentikaatio
* Tokenin tallennus localStorageen
* REST API -integraatio

## Tekijä

Usama
Metropolia University of Applied Sciences
HYTE Web Development
