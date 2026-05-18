# Tasks Manager — фінальний проект

## Опис

Це full-stack проект **Tasks Manager** на Node.js, Express.js та MongoDB Atlas.

Проект зроблений у форматі MVC і містить backend API та frontend-сторінки для роботи із задачами.

Користувач може:

- зареєструватися;
- увійти в акаунт;
- створювати задачі;
- переглядати список задач;
- фільтрувати задачі за статусом;
- редагувати задачі;
- видаляти задачі;
- змінювати тему інтерфейсу через cookies;
- переглядати статистику задач через MongoDB aggregation pipeline.

Проект також містить Dockerfile та docker-compose.yml для запуску Express-додатку і MongoDB у Docker контейнерах.

---

## Технології

- Node.js
- Express.js
- MongoDB Atlas
- MongoDB
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
- Docker
- Docker Compose

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
Dockerfile           інструкція для створення Docker-образу
docker-compose.yml   запуск Express-додатку та MongoDB через Docker Compose
```

---

## Встановлення проекту

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

Або в режимі розробки:

```bash
npm run dev
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

# ДЗ. Рефакторинг MongoDB Driver на Mongoose

## Мета

Метою цього завдання було перетворити існуючий Express-проект, який раніше міг використовувати MongoDB Node.js Driver, на використання **Mongoose**.

Mongoose дозволяє:

- створювати схеми даних;
- описувати типи полів;
- додавати валідацію;
- створювати індекси;
- описувати зв'язки між колекціями;
- зробити код роботи з базою більш структурованим та підтримуваним.

У цьому проекті робота з MongoDB організована через Mongoose.

---

## Підключення Mongoose

Для роботи з MongoDB використовується пакет:

```json
"mongoose": "^8.13.2"
```

Підключення до бази даних винесено у файл:

```txt
config/database.js
```

Приклад підключення:

```js
import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

Підключення використовує змінну середовища:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

Це дозволяє не зберігати логін, пароль і адресу MongoDB Atlas прямо в коді проекту.

---

## Запуск підключення у server.js

У файлі `server.js` використовується функція `connectDatabase()`:

```js
import { connectDatabase } from './config/database.js';

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Tasks Manager is running on http://localhost:${PORT}`);
  });
});
```

Тобто сервер запускається тільки після успішного підключення до MongoDB.

---

## Mongoose-моделі

У проекті створено Mongoose-моделі для основних колекцій:

```txt
models/UserModel.js
models/TaskModel.js
```

---

## User model

Файл:

```txt
models/UserModel.js
```

Модель користувача описує документ користувача у MongoDB.

Основні поля:

| Поле | Тип | Опис |
| --- | --- | --- |
| `name` | `String` | Ім'я користувача |
| `email` | `String` | Email користувача |
| `password` | `String` | Пароль користувача у хешованому вигляді |
| `createdAt` | `Date` | Дата створення документа |
| `updatedAt` | `Date` | Дата оновлення документа |

Для моделі користувача використовується:

- `required` для обов'язкових полів;
- `unique` для email;
- `lowercase` для email;
- `trim` для очищення пробілів;
- `index` для швидкого пошуку користувача за email;
- `timestamps` для автоматичного створення `createdAt` та `updatedAt`.

Також у схемі користувача використовується middleware `pre('save')`, який хешує пароль перед збереженням у базу даних.

Приклад логіки:

```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

Для перевірки пароля використовується метод:

```js
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

## Task model

Файл:

```txt
models/TaskModel.js
```

Модель задачі описує документ задачі у MongoDB.

Основні поля:

| Поле | Тип | Опис |
| --- | --- | --- |
| `title` | `String` | Назва задачі |
| `description` | `String` | Опис задачі |
| `status` | `String` | Статус задачі |
| `priority` | `String` | Пріоритет задачі |
| `dueDate` | `Date` | Дедлайн задачі |
| `owner` | `ObjectId` | Посилання на користувача |
| `createdAt` | `Date` | Дата створення документа |
| `updatedAt` | `Date` | Дата оновлення документа |

Для поля `status` використовуються дозволені значення:

```txt
todo
in-progress
done
```

Для поля `priority` використовуються дозволені значення:

```txt
low
medium
high
```

Поле `owner` створює зв'язок задачі з користувачем:

```js
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  index: true,
}
```

Це означає, що кожна задача належить конкретному користувачу.

---

## Валідація у Mongoose

У моделях використовуються правила валідації:

- `required` — поле обов'язкове;
- `minlength` — мінімальна довжина тексту;
- `maxlength` — максимальна довжина тексту;
- `enum` — список дозволених значень;
- `trim` — видалення пробілів на початку і в кінці;
- `default` — значення за замовчуванням.

Приклад валідації задачі:

```js
title: {
  type: String,
  required: [true, 'Task title is required'],
  trim: true,
  minlength: [2, 'Task title must be at least 2 characters'],
  maxlength: [100, 'Task title must be less than 100 characters'],
}
```

---

## Індекси у Mongoose

Для оптимізації запитів у проекті використовуються індекси.

Для користувача індексується email:

```js
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  index: true,
}
```

Для задач створені індекси за власником, статусом і пріоритетом:

```js
taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ owner: 1, priority: 1 });
```

Це дозволяє швидше отримувати задачі конкретного користувача за статусом або пріоритетом.

---

## Оновлення доступу до бази даних

Усі операції з базою даних виконуються через Mongoose-моделі.

У проекті не використовується прямий доступ через MongoDB Node.js Driver, наприклад:

```js
db.collection('tasks')
client.db()
```

Замість цього використовується:

```js
TaskModel.find()
TaskModel.create()
TaskModel.findById()
TaskModel.findByIdAndUpdate()
TaskModel.findByIdAndDelete()
TaskModel.aggregate()
```

---

## Приклади CRUD через Mongoose

### Отримання задач користувача

```js
const tasks = await TaskModel.find({ owner: req.user._id }).sort({
  createdAt: -1,
});
```

### Створення задачі

```js
const task = await TaskModel.create({
  title,
  description,
  status,
  priority,
  dueDate,
  owner: req.user._id,
});
```

### Отримання однієї задачі

```js
const task = await TaskModel.findOne({
  _id: req.params.taskId,
  owner: req.user._id,
});
```

### Оновлення задачі

```js
const task = await TaskModel.findOneAndUpdate(
  {
    _id: req.params.taskId,
    owner: req.user._id,
  },
  {
    title,
    description,
    status,
    priority,
    dueDate,
  },
  {
    new: true,
    runValidators: true,
  }
);
```

### Видалення задачі

```js
await TaskModel.findOneAndDelete({
  _id: req.params.taskId,
  owner: req.user._id,
});
```

---

## Переваги переходу на Mongoose

Перехід на Mongoose покращив проект, тому що:

- структура даних описана через схеми;
- код став зрозумілішим;
- додана валідація полів;
- додані індекси для оптимізації запитів;
- задачі пов'язані з користувачами через `owner`;
- пароль користувача хешується перед збереженням;
- CRUD-операції виконуються через моделі;
- легше підтримувати та розширювати проект.

---

# ДЗ. MongoDB cursors та aggregation pipeline

## MongoDB cursors

У проекті реалізовано маршрути, які використовують MongoDB cursor для перебору документів.

Cursor дозволяє обробляти документи поступово, а не завантажувати всі знайдені документи одразу у пам'ять сервера.

---

## GET /api/tasks/cursor

Цей маршрут використовує MongoDB cursor замість звичайного завантаження всіх задач у масив.

Приклад логіки:

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

## GET /api/tasks/cursor/stream

Цей маршрут також використовує cursor, але відповідь повертається поступово у форматі `application/x-ndjson`.

NDJSON означає, що кожен JSON-об'єкт іде з нового рядка.

Приклад логіки:

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

Перевага streaming-відповіді:

- сервер може віддавати документи частинами;
- не потрібно чекати обробки всіх документів;
- підхід краще підходить для великих обсягів даних.

---

## Aggregation pipeline

У проекті реалізовано маршрут для отримання статистики задач через MongoDB aggregation pipeline.

---

## GET /api/tasks/stats

Цей маршрут рахує статистику задач користувача.

У pipeline використовуються:

- `$match`;
- `$facet`;
- `$group`;
- `$sum`;
- `$cond`;
- `$addToSet`;
- `$project`.

Статистика включає:

- загальну кількість задач;
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

Frontend-сторінка статистики доступна за адресою:

```txt
http://localhost:3000/tasks/stats
```

---

## Чому cursor та aggregation покращують роботу сервера

Звичайний підхід:

```js
const tasks = await TaskModel.find(filter);
```

Такий код одразу завантажує всі знайдені документи у пам'ять сервера. Для невеликої кількості задач це нормально, але для великих колекцій це може збільшити використання RAM.

Оптимізований підхід:

```js
const cursor = TaskModel.find(filter).cursor();

for await (const task of cursor) {
  // обробка одного документа за раз
}
```

Cursor дозволяє серверу отримувати та обробляти документи поступово.

Aggregation pipeline дозволяє рахувати статистику на стороні MongoDB, а не вручну в Node.js. Це ефективніше, тому що база даних оптимізована для таких операцій.

---

# ДЗ 68.1. Docker, Express та MongoDB

## Мета

Метою цього завдання було навчитися створювати, конфігурувати та запускати Express-додатки у Docker контейнерах, інтегруючи їх з базою даних MongoDB за допомогою Docker Compose.

У цьому проекті Docker використовується для запуску:

- Express-додатку;
- MongoDB контейнера.

---

## Dockerfile

У проекті створено файл:

```txt
Dockerfile
```

Dockerfile:

```dockerfile
FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Цей файл:

- використовує образ `node:lts`;
- встановлює робочу директорію контейнера `/app`;
- копіює файли `package.json` та `package-lock.json`;
- встановлює залежності через `npm install`;
- копіює код проекту;
- відкриває порт `3000`;
- запускає додаток командою `npm start`.

---

## Docker Compose

У проекті створено файл:

```txt
docker-compose.yml
```

Приклад конфігурації:

```yaml
services:
  app:
    build: .
    container_name: tasks-manager-app
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      MONGODB_URI: mongodb://mongo:27017/tasks_manager
      SESSION_SECRET: docker_session_secret
      JWT_SECRET: docker_jwt_secret
    depends_on:
      - mongo
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  mongo:
    image: mongo
    container_name: tasks-manager-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## MongoDB у Docker

У Docker Compose використовується офіційний образ MongoDB:

```yaml
mongo:
  image: mongo
```

Express-додаток підключається до MongoDB через змінну середовища:

```env
MONGODB_URI=mongodb://mongo:27017/tasks_manager
```

Тут:

```txt
mongo          назва сервісу MongoDB у docker-compose.yml
27017          стандартний порт MongoDB
tasks_manager  назва бази даних
```

---

## Volumes

У `docker-compose.yml` використовуються volumes:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

Це дозволяє змінювати код локально, а контейнер автоматично бачить ці зміни.

Для автоматичного перезапуску сервера використовується `nodemon`:

```json
"dev": "nodemon server.js"
```

Також для MongoDB використовується volume:

```yaml
mongo_data:/data/db
```

Це дозволяє зберігати дані MongoDB після перезапуску контейнерів.

---

## Запуск через Docker Compose

Запуск контейнерів:

```bash
docker compose up --build
```

Або:

```bash
docker-compose up --build
```

Після запуску сайт буде доступний за адресою:

```txt
http://localhost:3000
```

---

## Перевірка Docker

Перевірити запущені контейнери:

```bash
docker ps
```

Очікуваний результат:

```txt
tasks-manager-app
tasks-manager-mongo
```

Зупинити контейнери:

```bash
docker compose down
```

Зупинити контейнери і видалити volume з базою:

```bash
docker compose down -v
```

---

## Тестування Docker-запуску

1. Запустити Docker Desktop.

2. Відкрити PowerShell у папці проекту.

3. Виконати команду:

```bash
docker compose up --build
```

4. Відкрити сайт:

```txt
http://localhost:3000
```

5. Перевірити роботу:

- головна сторінка відкривається;
- реєстрація працює;
- вхід у систему працює;
- задачі створюються;
- задачі редагуються;
- задачі видаляються;
- дані зберігаються у MongoDB контейнері.

---

# ДЗ 69.1. Операції з базами даних і документами в Mongo Shell

## Мета

Метою цього завдання було закріпити навички базового використання Mongo Shell для управління документами в MongoDB.

Для виконання завдання використовується Mongo Shell `mongosh`.

Якщо MongoDB запущена через Docker, увійти в Mongo Shell можна командою:

```bash
docker exec -it tasks-manager-mongo mongosh
```

---

## Створення бази даних

```js
use studentDB
```

---

## Створення колекції

```js
db.createCollection("assignments")
```

---

## Додавання документів

```js
db.assignments.insertMany([
  { name: "Oleg", subject: "Backend", score: 92 },
  { name: "Anna", subject: "Frontend", score: 78 },
  { name: "Andrii", subject: "Backend", score: 84 },
  { name: "Maria", subject: "Database", score: 88 },
  { name: "Ivan", subject: "Frontend", score: 65 }
])
```

---

## Пошук документів, де score більше 80

```js
db.assignments.find({ score: { $gt: 80 } }).pretty()
```

---

## Оновлення score на 5 балів для студента, який має менше 85

```js
db.assignments.updateOne(
  { score: { $lt: 85 } },
  { $inc: { score: 5 } }
)
```

Перевірка:

```js
db.assignments.find().pretty()
```

---

## Видалення студента з найнижчим балом

```js
const lowestStudent = db.assignments.find().sort({ score: 1 }).limit(1).toArray()[0]

db.assignments.deleteOne({ _id: lowestStudent._id })
```

Перевірка:

```js
db.assignments.find().pretty()
```

---

## Projection: вивести тільки ім'я та бал

```js
db.assignments.find(
  {},
  {
    _id: 0,
    name: 1,
    score: 1
  }
)
```

---

## Агрегація: середній бал за предметом

```js
db.assignments.aggregate([
  {
    $group: {
      _id: "$subject",
      averageScore: { $avg: "$score" }
    }
  }
])
```

---

## Агрегація з фільтрацією averageScore більше 75

```js
db.assignments.aggregate([
  {
    $group: {
      _id: "$subject",
      averageScore: { $avg: "$score" }
    }
  },
  {
    $match: {
      averageScore: { $gt: 75 }
    }
  }
])
```

---

## Унікальний індекс для поля name

```js
db.assignments.createIndex(
  { name: 1 },
  { unique: true }
)
```

Перевірка індексів:

```js
db.assignments.getIndexes()
```

---

## Пошук студентів, ім'я яких починається на A

```js
db.assignments.find({
  name: /^A/
})
```

---

## Аналіз запиту через explain()

```js
db.assignments.find({
  name: /^A/
}).explain("executionStats")
```

Якщо в результаті є `IXSCAN`, значить MongoDB використовує індекс.

Якщо в результаті є `COLLSCAN`, значить MongoDB переглядає всю колекцію.

---

# Тестування основного проекту

## Перевірка через браузер

1. Запустити сервер:

```bash
npm start
```

2. Відкрити:

```txt
http://localhost:3000
```

3. Зареєструвати користувача.

4. Увійти в акаунт.

5. Створити декілька задач.

6. Перевірити список задач:

```txt
http://localhost:3000/tasks
```

7. Перевірити статистику:

```txt
http://localhost:3000/tasks/stats
```

8. Перевірити API:

```txt
http://localhost:3000/api/tasks
http://localhost:3000/api/tasks/cursor?limit=10
http://localhost:3000/api/tasks/stats
```

---

## Очікуваний результат

Після запуску проекту:

- відкривається головна сторінка Tasks Manager;
- працює реєстрація користувача;
- працює авторизація;
- пароль зберігається у хешованому вигляді;
- задачі створюються у MongoDB;
- кожна задача прив'язана до конкретного користувача;
- задачі можна переглядати;
- задачі можна редагувати;
- задачі можна видаляти;
- API маршрути працюють;
- cursor-маршрути повертають задачі;
- aggregation-маршрут повертає статистику;
- Docker запускає Express-додаток і MongoDB;
- Mongo Shell команди працюють з базою `studentDB`.

---

# GitHub

Проект опубліковано у GitHub репозиторії:

```txt
https://github.com/truirr/express-server_Hillel
```

---

# Висновок

Проект **Tasks Manager** можна використовувати як фінальний проект для курсу та додати в портфоліо.

У проекті реалізовано:

- backend API;
- frontend-інтерфейс;
- MongoDB Atlas;
- Mongoose;
- схеми даних;
- валідацію;
- індексацію;
- авторизацію;
- сесії;
- JWT cookie;
- CRUD задач;
- прив'язку задач до користувача;
- cookies для теми;
- оптимізовану обробку даних через cursor;
- статистику через aggregation pipeline;
- Dockerfile;
- Docker Compose;
- MongoDB контейнер;
- Mongo Shell операції.

Завдяки Mongoose структура даних стала більш зрозумілою, код роботи з базою став чистішим, а проект став більш підтримуваним і готовим для подальшого розвитку.