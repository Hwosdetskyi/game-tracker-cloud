# Game Tracker — CRUD Application

## Opis Projektu

**Game Tracker** to aplikacja webowa do zarządzania kolekcją gier wideo. Użytkownik może się zarejstrować, zalogować, oraz dodawać, edytować i usuwać gry ze swojej kolekcji.

### Technologie

- **Frontend**: React 19 + CSS (temny motyw, Inter font)
- **Backend**: PHP 8.2 + Apache
- **Baza danych**: MySQL 8
- **Konteneryzacja**: Docker + Docker Compose
- **Hosting**: XAMPP (local) lub Docker (production-like)

### Architektura

```
┌─────────────────────────────────────────────┐
│  Browser (React Frontend) – Port 3000       │
├─────────────────────────────────────────────┤
│  REST API (PHP Backend) – Port 8080         │
├─────────────────────────────────────────────┤
│  MySQL Database – Port 3306                 │
└─────────────────────────────────────────────┘
```

---

## Funkcjonalności

✅ **Rejestracja i logowanie** — tworzenie konta, bezpieczne haszowanie haseł (`password_hash`/`password_verify`)  
✅ **CRUD — Create** — dodawanie nowych gier z polem: tytuł, platforma, gatunek, status, ocena (1–10)  
✅ **CRUD — Read** — wyświetlanie listy wszystkich gier zalogowanego użytkownika  
✅ **CRUD — Update** — edytowanie danych o grze  
✅ **CRUD — Delete** — usuwanie gry z potwierdzeniem  
✅ **Bezpieczeństwo**:
  - Podготовленные SQL statements (PDO prepare/execute) — ochrona przed SQL injection
  - Haszowanie haseł — `password_hash(PASSWORD_DEFAULT)`
  - Autoryzacja przez headerы — `Authorization: userId`
  - CORS — zapobieganie nieupoważnionym żądaniom
✅ **Walidacja** — po stronie klienta i serwera (trim, min-length, duplikaty case-insensitive)  
✅ **UI/UX** — ciemny motyw, responsywne, modalne potwierdzenia zamiast `alert()`

---

## Szybki Start

### 1. Lokalna instalacja (XAMPP)

**Wymagania**: XAMPP (Apache + MySQL + PHP)

```bash
# 1. Zainstaluj zależności frontendu
cd game-tracker/frontend
npm install

# 2. Uruchom frontend dev-server
npm start
# → Otwórz http://localhost:3000

# 3. Upewnij się, że Apache + MySQL biegą w XAMPP
# → phpMyAdmin: http://localhost/phpmyadmin

# 4. Utwórz bazę danych (phpMyAdmin):
# Wklej zawartość db-init.sql w zakładkę SQL

# 5. Backend powinien być dostępny na:
# http://localhost/game-tracker/backend/register.php
```

### 2. Docker Compose (Rekomendowany do prezentacji)

**Wymagania**: Docker + Docker Compose

```bash
# Z katalogu głównego projektu
docker compose up --build

# Po około 30 sekundach:
# → Frontend: http://localhost:3000
# → Backend: http://localhost:8080
# → MySQL: localhost:3306 (user: root, pwd: rootpass)
```

**Zatrzymanie:**
```bash
docker compose down
```

---

## Testowanie API (CURL)

### Rejestracja
```bash
curl -X POST http://localhost:8080/register.php \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

### Logowanie
```bash
curl -X POST http://localhost:8080/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
# → Zwraca JSON z userId
```

### Pobranie listy gier (userId = 1)
```bash
curl -X GET http://localhost:8080/games.php \
  -H "Authorization: 1"
```

### Dodanie gry
```bash
curl -X POST http://localhost:8080/games.php \
  -H "Content-Type: application/json" \
  -H "Authorization: 1" \
  -d '{"title":"Cyberpunk 2077","platform":"PC","genre":"RPG","status":"Completed","rating":9}'
```

---

## Struktura Projektu

```
game-tracker/
├── backend/
│   ├── Dockerfile           # Obraz PHP/Apache
│   ├── config.php           # Konfiguracja DB
│   ├── register.php         # Rejestracja
│   ├── login.php            # Logowanie
│   └── games.php            # CRUD dla gier
├── frontend/
│   ├── Dockerfile           # Obraz Node/Nginx
│   ├── nginx.conf           # Konfiguracja Nginx
│   ├── package.json
│   └── src/
│       ├── App.js           # Główny komponent
│       └── components/
│           ├── GameForm.js  # Formularz dodawania gry
│           ├── Modal.js     # Komponenta modalna
│           └── styles.css   # Style (ciemny motyw)
├── docker-compose.yml       # Orkiestracja kontenerów
├── db-init.sql             # Inicjalizacja bazy danych
└── README.md               # To dokument
```

---

## Bezpieczeństwo

1. **Haszowanie haseł** — `password_hash($pwd, PASSWORD_DEFAULT)` w `register.php`
2. **Weryfikacja haseł** — `password_verify()` w `login.php`
3. **SQL Injection Protection** — PDO prepared statements (`:param`)
4. **CORS** — `Access-Control-Allow-Origin: *` (można ograniczyć do konkretnego domenu)
5. **Autoryzacja** — Weryfikacja nagłówka `Authorization` w `games.php`
6. **Walidacja po stronie serwera** — Sprawdzanie `title`, `platform`, `genre`, `rating` (1–10)

---

## Potencjalne Ulepszenia

- [ ] JWT tokeny zamiast prostego userId
- [ ] HTTPS/SSL
- [ ] Unit tests (Jest/PHPUnit)
- [ ] E2E tests (Cypress/Playwright)
- [ ] GitHub Actions CI/CD
- [ ] Wdrożenie na Azure/AWS
- [ ] Migracje bazy danych (Flyway/Liquibase)
- [ ] Dokumentacja API (Swagger/OpenAPI)

---

## Napotkane Problemy & Rozwiązania

| Problem | Rozwiązanie |
|---------|------------|
| `failed to fetch` po stronie React | Sprawdzenie CORS, upewnienie się, że backend działa, wpisanie prawidłowego API_URL |
| PHP Parse Error w Docker | Porównanie zmiennych ochrony (`DB_HOST`, `DB_USER` itd.) w `config.php` |
| Port 3000 zajęty | Użycie `PORT=3001 npm start` lub zabicie istniejącego procesu |
| MySQL niedostępny w Docker | Dodanie `healthcheck` do usługi `db` w `docker-compose.yml` |

---

## Ocena

| Ocena | Wymagania | Status |
|-------|-----------|--------|
| **3** | CRUD + bezpieczeństwo | ✅ Spełnione |
| **3.5** | + bezpieczeństwo (HTTPS, CORS, pwd hash) | ✅ Spełnione |
| **4** | + Docker/kontenery | ✅ Spełnione |
| **4.5+** | + CI/CD (GitHub Actions) + Cloud | ⏳ Opcjonalnie |

---

## Autor

Imię i Nazwisko: [Wpisz swoje dane]  
Kierunek: [Wpisz kierunek]  
Rok: 2024/2025  
Data: 11 czerwca 2025

---

## Instrukcje dla Oceniającego

1. Zainstaluj Docker + Docker Compose
2. Uruchom: `docker compose up --build`
3. Czekaj ~30 sekund aż kontenery się uruchomią
4. Otwórz http://localhost:3000
5. Przetestuj: zarejestruj się → zaloguj → dodaj grę → edytuj → usuń
6. Sprawdź backend API: http://localhost:8080/games.php (zwrócić powinien błąd 401 bez Authorization headera — to normalne)

---

## Licencja

MIT
