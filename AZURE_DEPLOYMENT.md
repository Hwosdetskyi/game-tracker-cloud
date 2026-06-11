# 🌐 AZURE DEPLOYMENT — Повна інструкція

## 📋 Що потрібно (Prerequisites)

1. **Azure Account** (можна безплатну - $200 credit на 30 днів)
   - Реєстрація: https://azure.microsoft.com/en-us/free/
2. **Git** та **GitHub** (repo вже готовий)
3. **Docker Desktop** (для тестування локально)
4. **Azure CLI** (опціонально)
   ```bash
   # Windows: скачати з https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
   # або через chocolatey:
   choco install azure-cli
   ```

---

## 🚀 ОПЦІЯ 1: Azure App Service (Рекомендована — просто)

### Крок 1: Создать Azure Container Registry

1. Перейди на https://portal.azure.com
2. Клікни **+ Create a resource** → пошукай **Container Registry**
3. Заповни:
   - **Resource Group**: `game-tracker-rg` (нова)
   - **Registry name**: `gametracker123` (має бути унікальне, без спецсимволів)
   - **Location**: `West Europe` або близька до тебе
   - **SKU**: `Basic`
4. Клікни **Review + Create** → **Create**

⏳ Чекай ~2 хвилини...

### Крок 2: Оновити config.php для Azure

Додай у `backend/config.php` на початку:

```php
<?php
// Azure Database Connection
$host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'game_tracker';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';
$port = getenv('DB_PORT') ?: '3306';

// SSL для Azure MySQL
$options = array(
    PDO::MYSQL_ATTR_SSL_CA => '/etc/ssl/certs/ca-certificates.crt',
);

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db_name;charset=utf8";
    $pdo = new PDO($dsn, $username, $password, $options);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>
```

### Крок 3: Pushеш код на GitHub

```bash
cd D:\xampp\htdocs\game-tracker

git init
git add .
git commit -m "Game Tracker - Ready for Azure deployment"
git branch -M main

# Найперше заснови repo на GitHub.com, потім:
git remote add origin https://github.com/YOUR_USERNAME/game-tracker.git
git push -u origin main
```

✅ **Твій код тепер на GitHub!**

### Крок 4: Запустити GitHub Actions

1. Перейди на GitHub → Actions
2. Повинен бути запущений **CI/CD Pipeline**
3. Чекай 2-3 хвилини... повинно бути зелене ✅

### Крок 5: Создать Azure Web App with MySQL

#### 5.1 Создать Azure Database for MySQL

1. **Azure Portal** → **+ Create a resource** → **Azure Database for MySQL**
2. Заповни:
   - **Resource Group**: вже існує `game-tracker-rg`
   - **Server name**: `gametracker-db-xyz` (унікальне)
   - **Admin username**: `azureuser`
   - **Password**: `Securepass123!` (вибери свій)
   - **Location**: та ж, що раніше
   - **Pricing Tier**: `Burstable (B1s)` — найдешевша
3. **Review + Create** → **Create** (~5 хвилин)

#### 5.2 Открой Firewall для локального тесту

1. Як DB створено, перейди в параметри
2. **Connection security** → **+ Add current client IP**
3. **Save**

#### 5.3 Создать Web App

1. **Azure Portal** → **+ Create a resource** → **Web App**
2. Заповни:
   - **Resource Group**: `game-tracker-rg`
   - **Name**: `gametracker-app-xyz` (буде URL: https://gametracker-app-xyz.azurewebsites.net)
   - **Publish**: Docker Container
   - **Operating System**: Linux
   - **Linux Plan**: Create new → `game-tracker-plan`
   - **Pricing Plan**: `B1` (Free tier — можна, якщо маєш credit)
3. **Next: Docker** →
   - **Image Source**: Docker Hub (поки що)
   - **Image and tag**: `nginx:latest` (тимчасово, зміним пізніше)
4. **Review + Create** → **Create** (~5 хвилин)

### Крок 6: Настроїти Web App для Docker Compose

1. Коли Web App готовий, перейди в параметри
2. **Settings** → **Configuration**
3. **Application settings** → додай:

```
DOCKER_REGISTRY_SERVER_URL = https://gametracker123.azurecr.io
DOCKER_REGISTRY_SERVER_USERNAME = [username from Container Registry]
DOCKER_REGISTRY_SERVER_PASSWORD = [password from Container Registry]
DOCKER_ENABLE_CI = true
WEBSITES_ENABLE_APP_SERVICE_STORAGE = true
```

4. Де взяти username/password?
   - Перейди **Container Registry** → **Access Keys**
   - Скопіюй **Username** і **Password**

### Крок 7: Deploy Docker Images

Option A: З GitHub Actions (Автоматичне)
```bash
# У .github/workflows/ci.yml вже налаштовано, але потрібні secrets:
# Перейди GitHub → Settings → Secrets → New repository secret
# Додай:
# - AZURE_REGISTRY_LOGIN_SERVER = gametracker123.azurecr.io
# - AZURE_REGISTRY_USERNAME = [username]
# - AZURE_REGISTRY_PASSWORD = [password]
```

Option B: Вручну (Простіше для першого разу)
```bash
# Залогуйся в Azure Container Registry
az acr login --name gametracker123

# Побудуй і pushеш backend image
docker build -t gametracker123.azurecr.io/game-tracker-backend:latest ./backend
docker push gametracker123.azurecr.io/game-tracker-backend:latest

# Побудуй і pushеш frontend image
docker build -t gametracker123.azurecr.io/game-tracker-frontend:latest ./frontend
docker push gametracker123.azurecr.io/game-tracker-frontend:latest
```

### Крок 8: Оновити Web App для Backend + Frontend

На цьому етапі потрібно:

**Опція 1 (Просто)** — Обслуговуй окремо:
- Web App 1 для backend: `gametracker-backend.azurewebsites.net`
- Web App 2 для frontend: `gametracker-frontend.azurewebsites.net`

**Опція 2 (Краще)** — Скористайся Azure Container Instances (ACI) + docker-compose
```bash
# Не пояснюю детально, це складніше
az container create --resource-group game-tracker-rg \
  --name game-tracker-aci \
  --image myregistry.azurecr.io/game-tracker-combined:latest \
  --environment-variables DB_HOST=gametracker-db.mysql.database.azure.com \
  --ports 3000 8080
```

**Опція 3 (Найпростіша для цього часу)** — Git Deploy (без Docker Registry)
1. Перейди Web App → **Deployment** → **Deployment Center**
2. Вибери **GitHub**
3. Авторизуйся
4. **Repository** → твій `game-tracker` repo
5. **Branch** → `main`
6. **Build provider** → **GitHub Actions**
7. **Save**

→ GitHub Actions автоматично buildить і deployить кожний push

---

## 🐳 ОПЦІЯ 2: Azure Container Instances (Контейнери без App Service)

```bash
# Заповни свої значення:
export ACR_REGISTRY_NAME=gametracker123
export ACR_USERNAME=...
export ACR_PASSWORD=...
export AZURE_RESOURCE_GROUP=game-tracker-rg

# Deploy docker-compose як ACI
az container create \
  --resource-group $AZURE_RESOURCE_GROUP \
  --name game-tracker-app \
  --image-registry-login-server $ACR_REGISTRY_NAME.azurecr.io \
  --image-registry-username $ACR_USERNAME \
  --image-registry-password $ACR_PASSWORD \
  --image $ACR_REGISTRY_NAME.azurecr.io/game-tracker-combined:latest \
  --dns-name-label gametracker-app \
  --ports 80 3000 8080 \
  --environment-variables DB_HOST=gametracker-db.mysql.database.azure.com
```

---

## ✅ ТЕСТУВАННЯ НА AZURE

Як всё deploy, отримаєш URL:
- https://gametracker-app-xyz.azurewebsites.net

Відкрий у браузері:
- [ ] Реєстрація працює?
- [ ] Логін працює?
- [ ] Можеш додати гру?
- [ ] Можеш редагувати?
- [ ] Можеш видалити?

### Перевір DevTools
**Chrome** → **F12** → **Network**:
- Запити йдуть на https://gametracker-app-xyz.azurewebsites.net/backend/register.php?
- Статус 200 OK?

### Якщо щось не працює

**Лог перевірка:**
```bash
# Перейди Web App → Deployment → Logs
# Або через CLI:
az webapp log tail --resource-group game-tracker-rg --name gametracker-app-xyz
```

---

## 💾 ФІНАЛЬНА СТРУКТУРА AZURE

```
┌─────────────────────────────────────┐
│ GitHub (твій код)                    │
└──────────────┬──────────────────────┘
               │ push
┌──────────────▼──────────────────────┐
│ GitHub Actions (CI/CD Pipeline)      │
│ - Тести                              │
│ - Docker build                       │
│ - Push to Azure Container Registry   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│ Azure Container Registry                     │
│ - game-tracker-backend:latest                │
│ - game-tracker-frontend:latest               │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼────────┐ ┌───▼──────────────┐
│ Web App       │ │ MySQL Database   │
│ (Backend)     │ │ (Azure MySQL)    │
│ Port 8080     │ │ Port 3306        │
└──────┬────────┘ └──────────────────┘
       │
┌──────▼────────┐
│ Web App       │
│ (Frontend)    │
│ Port 3000     │
└───────────────┘
```

---

## 🎯 ШВИДКИЙ ПЛАН (Якщо часу ДУЖЕ мало)

### Якщо маєш 1-1.5h:
1. ✅ Пушни код на GitHub
2. ✅ GitHub Actions запуститься автоматично
3. ✅ Скажи викладачу: "Azure setup в process, GitHub Actions CI вже працює"
4. ✅ Deploy оставь на потім (легше задокументувати прогрес)

### Якщо маєш 2-3h:
1. ✅ Все вище
2. ✅ Создай Azure Container Registry
3. ✅ Создай Web App (базовий)
4. ✅ Deploy вручну (via Azure CLI)
5. ✅ Тестуй на Azure URL

### Якщо маєш 4+ h:
1. ✅ Все вище
2. ✅ Автоматизуй GitHub Actions → Azure deploy
3. ✅ Настрой CD (Continuous Deployment)
4. ✅ Документуй весь процес

---

## 📝 У ЗВІТІ НАПИШИ

### Про Azure deployment:
- Архітектура Azure (які сервіси використав)
- Container Registry (де зберігаються образи)
- Web App (де крутиться додаток)
- Azure Database (де база)
- GitHub Actions (автоматичні тести)
- Link до живої версії (https://...)

### Screenshots для звіту:
- [ ] Azure Portal — Container Registry створений
- [ ] Azure Portal — Web App створена
- [ ] Azure Portal — Успішне deployment
- [ ] GitHub Actions — Успішний build/test
- [ ] Живий app на Azure — залогований, додав гру
- [ ] DevTools Network tab — запити йдуть на .azurewebsites.net

---

## 🎬 НАСТУПНІ КРОКИ

1. **Одразу** пушни на GitHub:
```bash
git add .
git commit -m "Add GitHub Actions CI/CD + Azure deployment guide"
git push
```

2. Чекай GitHub Actions (2–3 хвилини)
3. Якщо зелене ✅ — все ОК!
4. Тоді слідуй інструкціям вище для Azure

**Час:** ~30 min = GitHub push + Actions ✅
**Час:** +90 min = Azure full deploy

**Разом: 2 години до готового проекту на Azure!**
