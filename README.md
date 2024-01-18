# Aplikacja do wypożyczania kaset wideo - Video Tape Shop

Ta aplikacja jest wykonana w technologii Next.js. Demonstruję ona system wypożyczania kaset wideo. Jest zintegrowana z systemem autentykacji użytkowników Auth0.


## Konfiguracja projektu

Użyj `npm`, aby zainstalować zależności projektu:

```bash
npm install
```

## Dla autentykacji użytkowników Auth0
```sh
AUTH0_SECRET='LOSOWA_DŁUGA_WARTOŚĆ'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://TWOJA_DOMENA_AUTH0.auth0.com'
AUTH0_CLIENT_ID='TWÓJ_CLIENT_ID_AUTH0'
AUTH0_CLIENT_SECRET='TWÓJ_SEKRET_KLIENTA_AUTH0'
AUTH0_AUDIENCE='IDENTYFIKATOR_TWOJEGO_API_AUTH0'
AUTH0_SCOPE='openid profile email read:shows'
```

## Dla korzystania z bazy danych MS SQL
```sh
DB_HOST='ADRES SERWERA SQL' //DLA POPRAWNEJ KONFIGURACJI WPISUJEMY SAM ADRES SERWERA BEZ JEGO INSTANCJI
DB_NAME='NAZWA BAZY DANYCH'
DB_USER='USER DO LOGOWANIA DO SERWERA'
DB_PASSWORD='HASŁO DO LOGOWANIA DO SERWERA'
DB_PORT='PORT DO KOMUNIKACJI Z SERWEREM'
```

**Uwaga**: Upewnij się, że zastąpisz `AUTH0_SECRET` własnym sekretem (możesz wygenerować odpowiedni ciąg używając `openssl rand -hex 32` w wierszu poleceń).\
**Uwaga**: Biblioteka `mssql` wymaga korzystania z samego adresu bez instancji po slashu oraz przekierowywania do konkretnej instancji przez port serwera. Skonfiguruj odpowiednio serwer SQL.

## Uruchomienie demonstracji

### Kompilacja i hot-reload w trybie deweloperskim

To kompiluje i serwuje aplikację Next.js oraz uruchamia serwer API na porcie 3001.

```bash
npm run dev
```

## Wdrażanie

### Kompilacja i minimalizacja dla produkcji

```bash
npm run build
```

### Budowa Docker

Aby zbudować i uruchomić obraz Dockera, uruchom `exec.sh` lub `exec.ps1` w systemie Windows.

### Uruchomienie testów jednostkowych

```bash
npm run test
```

### Uruchomienie testów integracyjnych

```bash
npm run test:integration
```

## Czym jest Auth0?

Auth0 pozwala:

* Dodawać uwierzytelnianie z [różnych źródeł](https://auth0.com/docs/identityproviders), zarówno dostawców tożsamości społecznych takich jak **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce** (między innymi), jak i systemów tożsamości przedsiębiorstwowych, takich jak **Windows Azure AD, Google Apps, Active Directory, ADFS lub dowolny dostawca tożsamości SAML**.
* Dodawać uwierzytelnianie za pomocą bardziej tradycyjnych **[baz danych z hasłami użytkowników](https://auth0.com/docs/connections/database/custom-db)**.
* Dodawać wsparcie dla **[łączenia różnych kont użytkowników](https://auth0.com/docs/users/user-account-linking)** z tym samym użytkownikiem.
* Obsługa generowania podpisanych [JSON Web Tokens](https://auth0.com/docs/tokens/json-web-t

## Założenia projektu

Projekt ma być w pełni sprawnym systemem wypożyczania kaset wideo online, który pozwala na utworzenie użytkownika, zarządzanie swoim kontem, wypożyczenie kasety wideo oraz zwrot kaset przez standardowego użytkownika. 
Admin powinien mieć możliwość rozszerzania asortymentu w aplikacji, edytowania konkretnych kaset oraz usuwania ich z asortymentu, zarządzanie zamówieniami i podgląd zamówień oraz zarządzanie statusem danego zamówienia.
Aplikacja ma być reaktywna, aktualizowana dynamicznie, stabilna oraz wydajna. Struktura aplikacji powoduje zadbanie o podstawowe bezpieczeństwo zarówno bazy danych SQL jak i danych użytkowników (bezpieczeństwo możemy również rozszerzyć o mechanizmy zabezpieczające aplikację przed SQL Injection).

## Jak uruchomić aplikację?

- Odtwórz bazę danych na swoim serwerze SQL
- Ustaw lokalny adres bazy danych w zmiennej środowiskowej projektu w pliku .env
- Wywołaj uruchomienie aplikacji w trybie developerskim. Otwórz Terminal (Ctrl+Shift+~ dla Visual Studio Code), następnie przejdź do folderu nextjs-app komendą `cd nextjs-app`. Uruchom aplikację w trybie developerskim komendą `npm run dev`.
- Przejdź do aplikacji w przeglądarce wpisując adres `localhost:3000`.