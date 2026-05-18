# Tasks Manager — фінальний проект

## Опис

Це full-stack проект **Tasks Manager** на Node.js, Express.js та MongoDB Atlas.
Проект зроблений у форматі MVC і містить backend API та frontend-сторінки для роботи із задачами.

Користувач може зареєструватися, увійти в акаунт, створювати задачі, переглядати список задач, фільтрувати їх за статусом, редагувати, видаляти, змінювати тему інтерфейсу через cookies, а також переглядати статистику задач через MongoDB aggregation pipeline.

Останнє оновлення проекту додає:

- маршрути з використанням MongoDB cursor;
- маршрут зі streaming-відповіддю через cursor;
- aggregation-запит для статистики задач;
- frontend-сторінку статистики `/tasks/stats`;
- оновлену документацію для тестування нових маршрутів.

---

## Технології

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Passport.js Local Strategy
- express-session
- JSON Web Token
- cookie-parser
- EJS
- CSS
- MVC architecture
- MongoDB cursors
- MongoDB aggregation pipeline

---

## Структура проекту

```txt
config/              налаштування бази даних та Passport
controllers/         логіка маршрутів
middlewares/         логування, авторизація, валідація, обробка помилок
models/              Mongoose-моделі User та Task
routes/              маршрути сайту та API
views/ejs/           frontend-сторінки
public/              стилі та favicon
server.js            точка входу
```

---

## Встановлення

1. Встановити залежності:

```bash
npm install
```

2. Створити файл `.env` на основі `.env.example`:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=change_this_session_secret
JWT_SECRET=change_this_jwt_secret
```

3. Запустити сервер:

```bash
npm start
```

Сервер буде доступний за адресою:

```txt
http://localhost:3000
```

---

## Frontend маршрути

| Метод | Маршрут | Опис |
| --- | --- | --- |
| GET | `/` | Головна сторінка |
| GET | `/auth/register` | Сторінка реєстрації |
| POST | `/auth/register` | Створення акаунта |
| GET | `/auth/login` | Сторінка входу |
| POST | `/auth/login` | Авторизація користувача |
| POST | `/auth/logout` | Вихід з акаунта |
| GET | `/tasks` | Список задач користувача |
| POST | `/tasks` | Створення задачі через форму |
| GET | `/tasks/stats` | Frontend-сторінка зі статистикою задач |
| GET | `/tasks/:taskId` | Сторінка редагування задачі |
| POST | `/tasks/:taskId/update` | Оновлення задачі через форму |
| POST | `/tasks/:taskId/delete` | Видалення задачі через форму |
| POST | `/settings/theme` | Збереження теми через cookies |

---

## API маршрути

Усі маршрути `/api/tasks` захищені сесією користувача. Спочатку потрібно увійти через `/auth/login` у браузері або передати cookie сесії у запитах.

| Метод | Маршрут | Опис |
| --- | --- | --- |
| GET | `/api/tasks` | Отримати всі задачі користувача звичайним способом через `find()` |
| GET | `/api/tasks?status=todo` | Отримати задачі за статусом |
| POST | `/api/tasks` | Створити задачу |
| GET | `/api/tasks/cursor` | Отримати задачі через MongoDB cursor |
| GET | `/api/tasks/cursor/stream` | Отримати задачі через cursor у форматі NDJSON stream |
| GET | `/api/tasks/stats` | Отримати статистику задач через MongoDB aggregation pipeline |
| GET | `/api/tasks/:taskId` | Отримати одну задачу |
| PUT | `/api/tasks/:taskId` | Оновити задачу |
| DELETE | `/api/tasks/:taskId` | Видалити задачу |
| GET | `/protected` | Перевірка захищеного маршруту |
| GET | `/settings/theme` | Отримати поточну тему |

---

## Нова функціональність: MongoDB cursors

### 1. `GET /api/tasks/cursor`

Цей маршрут використовує MongoDB cursor замість того, щоб одразу завантажувати всі документи у великий масив.

У контролері використовується:

```js
const cursor = TaskModel.find(filter)
  .sort({ createdAt: -1 })
  .limit(limit)
  .select('title description status priority dueDate createdAt updatedAt')
  .lean()
  .cursor();

for await (const task of cursor) {
  processedCount += 1;
  tasks.push(task);
}
```

Технічна логіка:

- сервер створює запит до MongoDB;
- MongoDB повертає cursor;
- документи обробляються поступово через `for await...of`;
- сервер не тримає всі документи в памʼяті під час перебору;
- для безпеки використовується параметр `limit`, максимум 100 документів за один запит.

Приклад запиту:

```http
GET /api/tasks/cursor?limit=10
```

Приклад відповіді:

```json
{
  "message": "Tasks were processed with MongoDB cursor.",
  "processedCount": 2,
  "limit": 10,
  "tasks": [
    {
      "_id": "665f1a000000000000000001",
      "title": "Закінчити проект",
      "description": "Додати cursor та aggregation",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-05-30T00:00:00.000Z",
      "createdAt": "2026-05-18T10:00:00.000Z",
      "updatedAt": "2026-05-18T10:00:00.000Z"
    }
  ]
}
```

Додаткові query-параметри:

```txt
/api/tasks/cursor?status=todo
/api/tasks/cursor?priority=high
/api/tasks/cursor?status=done&limit=50
```

---

### 2. `GET /api/tasks/cursor/stream`

Цей маршрут також використовує cursor, але відповідь повертається поступово у форматі `application/x-ndjson`.

NDJSON означає, що кожен JSON-обʼєкт іде з нового рядка. Такий формат зручний для великих даних, бо сервер може віддавати документи частинами.

У контролері використовується:

```js
res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');

for await (const task of cursor) {
  processedCount += 1;
  res.write(`${JSON.stringify(task)}\n`);
}

res.write(JSON.stringify({ message: 'Cursor stream completed.', processedCount }));
res.end();
```

Приклад запиту:

```http
GET /api/tasks/cursor/stream?limit=5
```

Приклад відповіді:

```json
{"_id":"665f1a000000000000000001","title":"Task 1","status":"todo","priority":"high"}
{"_id":"665f1a000000000000000002","title":"Task 2","status":"done","priority":"medium"}
{"message":"Cursor stream completed.","processedCount":2}
```

Технічна перевага:

- звичайний `find()` з великим списком може створити велике навантаження на RAM;
- cursor дозволяє перебирати документи поступово;
- streaming дозволяє почати віддавати відповідь клієнту ще до завершення обробки всіх документів.

---

## Нова функціональність: aggregation pipeline

### `GET /api/tasks/stats`

Цей маршрут рахує статистику задач користувача через MongoDB aggregation pipeline.

У контролері використовується pipeline з `$match`, `$facet`, `$group`, `$sum`, `$cond`, `$addToSet`, `$project`.

Що рахується:

- загальна кількість задач;
- кількість виконаних задач;
- кількість активних задач;
- кількість прострочених задач;
- кількість унікальних статусів;
- кількість унікальних пріоритетів;
- групування задач за статусом;
- групування задач за пріоритетом.

Приклад запиту:

```http
GET /api/tasks/stats
```

Приклад відповіді:

```json
{
  "message": "Task statistics were calculated with MongoDB aggregation pipeline.",
  "stats": {
    "totalTasks": 5,
    "completedTasks": 2,
    "activeTasks": 3,
    "overdueTasks": 1,
    "uniqueStatusesCount": 3,
    "uniquePrioritiesCount": 3,
    "byStatus": [
      { "_id": "done", "count": 2 },
      { "_id": "in-progress", "count": 1 },
      { "_id": "todo", "count": 2 }
    ],
    "byPriority": [
      { "_id": "high", "count": 2 },
      { "_id": "low", "count": 1 },
      { "_id": "medium", "count": 2 }
    ]
  }
}
```

Frontend-версія цієї статистики доступна за адресою:

```txt
http://localhost:3000/tasks/stats
```

---

## Приклади API запитів

### Створення задачі

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Закінчити фінальний проект",
  "description": "Переробити users/articles на tasks manager",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-05-30"
}
```

### Оновлення задачі

```http
PUT /api/tasks/:taskId
Content-Type: application/json
```

```json
{
  "title": "Закінчити фінальний проект",
  "description": "Backend + frontend + MongoDB",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-05-30"
}
```

### Видалення задачі

```http
DELETE /api/tasks/:taskId
```

---

## Тестування нових маршрутів

### Варіант 1: тестування через браузер

1. Запустити сервер:

```bash
npm start
```

2. Відкрити сайт:

```txt
http://localhost:3000
```

3. Зареєструватися або увійти.

4. Створити декілька задач з різними статусами та пріоритетами.

5. Відкрити cursor-маршрути:

```txt
http://localhost:3000/api/tasks/cursor?limit=10
http://localhost:3000/api/tasks/cursor/stream?limit=10
```

6. Відкрити aggregation-маршрути:

```txt
http://localhost:3000/api/tasks/stats
http://localhost:3000/tasks/stats
```

Очікуваний результат:

- `/api/tasks/cursor` повертає JSON з `processedCount`, `limit` та масивом задач;
- `/api/tasks/cursor/stream` повертає задачі рядками у форматі NDJSON;
- `/api/tasks/stats` повертає статистику задач;
- `/tasks/stats` показує статистику у вигляді сторінки.

---

### Варіант 2: тестування через PowerShell

Спочатку краще увійти через браузер, тому що API захищене сесією. Після входу маршрути можна швидко перевірити у браузері.

Для створення задач через PowerShell можна використовувати `Invoke-WebRequest`, але потрібно передавати cookie сесії. Найпростіший варіант для цієї домашки — перевірити нові GET-маршрути у браузері після login.

Приклад створення задачі через форму:

```txt
http://localhost:3000/tasks
```

Після створення задач перевірити:

```txt
http://localhost:3000/api/tasks/cursor?limit=20
http://localhost:3000/api/tasks/stats
```

---

## Як оптимізація покращує роботу сервера

Звичайний підхід:

```js
const tasks = await TaskModel.find(filter);
```

Такий код одразу завантажує всі знайдені документи у памʼять сервера. Для невеликої кількості задач це нормально, але для великих колекцій це може збільшити використання RAM.

Оптимізований підхід:

```js
const cursor = TaskModel.find(filter).cursor();

for await (const task of cursor) {
  // обробка одного документа за раз
}
```

Cursor дозволяє серверу отримувати та обробляти документи поступово. Це краще для великих обсягів даних, тому що сервер не повинен одночасно тримати всю колекцію в памʼяті.

Aggregation pipeline дозволяє рахувати статистику на стороні MongoDB, а не вручну в Node.js. Це теж ефективніше, бо база даних оптимізована для таких операцій.

---

## Модель задачі

```js
{
  title: String,
  description: String,
  status: 'todo' | 'in-progress' | 'done',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  owner: UserId
}
```

---

## Що реалізовано

- Повноцінний Tasks Manager замість users/articles
- Реєстрація та вхід користувача
- Passport Local Strategy
- Сесії через express-session
- JWT token у cookie після входу
- MongoDB Atlas + Mongoose
- CRUD для задач
- Привʼязка задач до конкретного користувача
- Валідація даних задач
- Захищені маршрути
- Cookies для теми сайту
- Frontend на EJS
- Адаптивний CSS
- MVC структура
- Cursor-маршрути для ефективного перебору задач
- Streaming cursor-маршрут у форматі NDJSON
- Aggregation pipeline для статистики задач
- Frontend-сторінка статистики задач

---

## Висновок

Проект можна використовувати як фінальний проект для курсу та додати в портфоліо, тому що він має backend API, frontend-інтерфейс, MongoDB Atlas, авторизацію, CRUD задач, оптимізовану обробку даних через cursor та статистику через aggregation pipeline.
