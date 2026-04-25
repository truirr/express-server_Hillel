# Express Server Homework (Node.js + MongoDB Atlas)

## Опис проекту

Цей проект є серверним додатком, розробленим з використанням **Node.js** та **Express.js**.
Він реалізує RESTful API, систему авторизації (JWT та Passport), роботу з cookies, шаблонізатори (PUG, EJS) та інтеграцію з базою даних **MongoDB Atlas**.

Проект побудований за архітектурою **MVC (Model-View-Controller)**.

---

## Встановлення та запуск

1. Клонувати репозиторій:

```bash
git clone <your-repo-link>
cd express-server-oleg
```

2. Встановити залежності:

```bash
npm install
```

3. Створити файл `.env` та додати:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. Запустити сервер:

```bash
npm start
```

Сервер буде доступний за адресою:

```txt
http://localhost:3000
```

---

## Використані технології

* Node.js
* Express.js
* MongoDB Atlas (Mongoose)
* Passport.js (локальна стратегія)
* JSON Web Token (JWT)
* express-session
* cookie-parser
* PUG
* EJS

---

## Маршрути сервера

### Головний маршрут

| Метод | Маршрут | Опис             |
| ----- | ------- | ---------------- |
| GET   | `/`     | Головна сторінка |

---

### Користувачі (PUG)

| Метод  | Маршрут          | Опис                         |
| ------ | ---------------- | ---------------------------- |
| GET    | `/users`         | Отримати список користувачів |
| POST   | `/users`         | Створити користувача         |
| GET    | `/users/:userId` | Отримати користувача         |
| PUT    | `/users/:userId` | Оновити користувача          |
| DELETE | `/users/:userId` | Видалити користувача         |

---

### Статті (EJS)

| Метод  | Маршрут                | Опис                    |
| ------ | ---------------------- | ----------------------- |
| GET    | `/articles`            | Отримати список статей  |
| POST   | `/articles`            | Створити статтю (admin) |
| GET    | `/articles/:articleId` | Отримати статтю         |
| PUT    | `/articles/:articleId` | Оновити статтю (admin)  |
| DELETE | `/articles/:articleId` | Видалити статтю (admin) |

---

### Авторизація (JWT + Passport)

| Метод | Маршрут          | Опис       |
| ----- | ---------------- | ---------- |
| POST  | `/auth/register` | Реєстрація |
| POST  | `/auth/login`    | Вхід       |
| POST  | `/auth/logout`   | Вихід      |

---

### Захищений маршрут

| Метод | Маршрут      | Опис                            |
| ----- | ------------ | ------------------------------- |
| GET   | `/protected` | Доступ тільки для авторизованих |

---

### Налаштування (Cookies)

| Метод | Маршрут           | Опис          |
| ----- | ----------------- | ------------- |
| GET   | `/settings/theme` | Отримати тему |
| POST  | `/settings/theme` | Зберегти тему |

---

### MongoDB Atlas (CRUD)

| Метод  | Маршрут                       | Опис                  |
| ------ | ----------------------------- | --------------------- |
| GET    | `/database/users`             | Отримати користувачів |
| POST   | `/database/users/insert-one`  | Додати одного         |
| POST   | `/database/users/insert-many` | Додати кілька         |
| PUT    | `/database/users/update-one`  | Оновити одного        |
| PUT    | `/database/users/update-many` | Оновити кілька        |
| PUT    | `/database/users/replace-one` | Замінити              |
| DELETE | `/database/users/delete-one`  | Видалити одного       |
| DELETE | `/database/users/delete-many` | Видалити кілька       |

---

## Приклади запитів

### Створення користувача

```bash
POST /database/users/insert-one
```

```json
{
  "name": "Oleg",
  "email": "oleg@mail.com",
  "age": 20
}
```

---

### Оновлення користувача

```bash
PUT /database/users/update-one
```

```json
{
  "email": "oleg@mail.com",
  "update": { "age": 25 }
}
```

---

### Видалення користувача

```bash
DELETE /database/users/delete-one
```

```json
{
  "email": "oleg@mail.com"
}
```

---

## Особливості

* Використання MVC архітектури
* Middleware для логування, валідації та авторизації
* Робота з cookies та JWT
* Авторизація через Passport
* Інтеграція з MongoDB Atlas
* Повний CRUD для бази даних

---

## Висновок

У рамках проекту було реалізовано повноцінний серверний додаток з підтримкою авторизації, бази даних та шаблонізації, що демонструє основні принципи розробки сучасних веб-серверів.
