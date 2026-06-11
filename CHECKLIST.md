# 🎯 CHECKLIST PRZED SUBMISSION — 11 czerwca 2025

## ⚡ PILNE (30 min)

### Test 1: Lokalne sprawdzenie (XAMPP)
```bash
cd D:\xampp\htdocs\game-tracker\frontend
npm install
npm start
```
- [ ] Frontend otwiera się na http://localhost:3000
- [ ] Apache i MySQL w XAMPP działają
- [ ] Backend API jest dostępny na http://localhost/game-tracker/backend/register.php

### Test 2: Rejestracja & Logowanie
- [ ] Zarejestrować się (username: test1, password: test123)
- [ ] Zalogować się
- [ ] Zaakceptować? TAK → Kontynuuj

### Test 3: CRUD Operacje
- [ ] Dodać grę: "Portal 2", "PC", "Puzzle", "Completed", "10"
- [ ] Wyświetlić listę (powinna być gra)
- [ ] Edytować grę (zmienić ocenę na 9)
- [ ] Usunąć grę (potwierdzić w modalu)
- [ ] Zaakceptować? TAK → Przejdź do Docker

---

## 🐳 DOCKER (30 min) — OPCJONALNIE dla oceny 4+

### Test 4: Docker Compose
```bash
cd D:\xampp\htdocs\game-tracker
docker compose up --build
```
- [ ] Czekaj aż kontenery się uruchomią (~30s)
- [ ] Frontend: http://localhost:3000 (działa?)
- [ ] Backend: http://localhost:8080/register.php (dostępny?)
- [ ] MySQL: `docker ps` pokazuje 3 kontenery?

### Test 5: Funkcjonalność w Docker
- [ ] Zarejestrować się
- [ ] Zalogować się
- [ ] Dodać 2–3 gry
- [ ] Edytować grę
- [ ] Usunąć grę

### Test 6: Stop Docker
```bash
docker compose down
```
- [ ] Kontenery się wyłączyły?

---

## 📄 RAPORT (45 min)

### Test 7: Przygotowanie raportu
1. Skopiuj zawartość `REPORT_TEMPLATE.md` do Worda/Google Docs
2. Wypełnij sekcje:
   - [ ] Strona tytułowa: imię, kierunek, ocena
   - [ ] Sekcja 1: Opis projektu (10 minut)
   - [ ] Sekcja 2: Bezpieczeństwo (10 minut)
   - [ ] Sekcja 3: Docker (5 minut)
   - [ ] Sekcja 4: Architektura (5 minut)
   - [ ] Sekcja 5: Problemy (5 minut)
   - [ ] Sekcje 6–8: **ZRZUTY EKRANU** (15 minut)
     - Screenshot: Ekran logowania
     - Screenshot: Dashboard (lista gier)
     - Screenshot: Formularz dodawania gry
     - Screenshot: Modal potwierdzenia
     - Screenshot: `docker ps` (kontenery)
     - Screenshot: `docker compose up` (logi)
     - Screenshot: CURL rejestracja
     - Screenshot: DevTools Network tab
   - [ ] Sekcja 9: Podsumowanie (5 minut)

3. Eksportuj do PDF
   - [ ] Raport to plik `.pdf`?
   - [ ] Rozmiar < 50 MB?

---

## 💾 GIT & MOODLE (15 min)

### Test 8: GitHub
```bash
cd D:\xampp\htdocs\game-tracker

# Inicjuj git (jeśli jeszcze nie)
git init
git add .
git commit -m "Game Tracker - CRUD + Docker (Ocena: 4)"
git branch -M main

# Wrzuć na GitHub
git remote add origin https://github.com/YOUR_USERNAME/game-tracker.git
git push -u origin main
```

- [ ] Kod wrzucony na GitHub?
- [ ] README.md jest widoczny na GitHub?

### Test 9: Moodle Submission
1. Przejdź na Moodle → Technologie Chmurowe
2. Wklej link do GitHub
3. Wrzuć plik PDF raportu
4. Zaznacz: "Jestem autorem tego projektu" (lub podobnie)
5. Submit

- [ ] Link do GitHub zasubmitted?
- [ ] PDF zasubmitted?
- [ ] Potwierdzenie submission widoczne?

---

## 📋 CO ZAWIERA SUBMISSION

### GitHub repo powinno zawierać:
```
game-tracker/
├── backend/
│   ├── Dockerfile ✅
│   ├── config.php ✅
│   ├── register.php ✅
│   ├── login.php ✅
│   └── games.php ✅
├── frontend/
│   ├── Dockerfile ✅
│   ├── nginx.conf ✅
│   ├── package.json ✅
│   ├── src/
│   │   ├── App.js ✅
│   │   └── components/ ✅
├── docker-compose.yml ✅
├── db-init.sql ✅
├── README.md ✅
└── .gitignore ✅
```

### Moodle submission powinno zawierać:
- [ ] Link do GitHub
- [ ] PDF sprawozdania (11–15 stron, ze zrzutami)

---

## 🎓 OCENA — DO JAKIEJ KLASY SIĘ UBIEGASZ?

### Ocena 3 (CRUD)
- Aplikacja CRUD — **masz już** ✅

### Ocena 3.5 (CRUD + Bezpieczeństwo)
- + Haszowanie haseł — **masz już** ✅
- + SQL Injection protection — **masz już** ✅
- + Autoryzacja — **masz już** ✅

### Ocena 4 (+ Docker/Kontenery)
- + Dockerfile — **właśnie zrobiłem** ✅
- + Docker Compose — **właśnie zrobiłem** ✅
- + Przetestować lokalnie — **to ostatni krok** ⏳

### Ocena 4.5+ (+ CI/CD / Cloud)
- + GitHub Actions (testy) — **OPCJONALNIE**
- + Deploy na Azure/Heroku — **OPCJONALNIE**
- Rekomendacja: Focus na 4 dzisiaj, później 4.5+ jeśli będziesz miał czas

---

## ⏰ TIMELINE

| Zadanie | Czas | Status |
|---------|------|--------|
| Lokalne testy (XAMPP) | 15 min | ⏳ DO ZROBIENIA |
| Docker testy | 20 min | ⏳ DO ZROBIENIA |
| Raport PDF | 45 min | ⏳ DO ZROBIENIA |
| GitHub push | 5 min | ⏳ DO ZROBIENIA |
| Moodle submission | 5 min | ⏳ DO ZROBIENIA |
| **RAZEM** | **~1.5h** | - |

---

## 🚨 OSTATECZNE REMINDERY

1. **Deadline: dzisiaj 11 czerwca** — nie ma czasu do stracenia
2. **Screenshots są WAŻNE** — bez nich raport może mieć -1 punkt
3. **Zrzuty muszą być opisane** — przypisz każdy zrzut do sekcji
4. **README.md to część submission** — oceniający go przeczyta
5. **Kod musi być czytelny** — dodaj komentarze jeśli trzeba
6. **PDF musi być czytelny** — użyj czcionki 11–12pt, rozsądne marginesy

---

## ❓ POMOC W RAZIE PROBLEMÓW

| Problem | Rozwiązanie |
|---------|------------|
| `failed to fetch` | Sprawdź API_URL w App.js + DevTools Network |
| Port 3000 zajęty | `PORT=3001 npm start` lub `taskkill /F /IM node.exe` |
| Docker nie startuje | `docker logs game-tracker-db-1` (sprawdź MySQL logs) |
| MySQL connection error | Sprawdź `docker compose logs db` |
| Raport za długi | Skróć sekcje, zwiększ czcionkę dla zrzutów |
| Brakuje time | Zrób ocenę 3.5 zamiast 4 (Docker opcjonalny) |

---

**Powodzenia! 🚀**

Obliczyć sobie, że masz ~12 godzin. Zacznij OD RAZU.
