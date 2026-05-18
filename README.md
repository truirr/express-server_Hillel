## ДЗ 68.1. Docker, Express та MongoDB

У цьому завданні проєкт Tasks Manager був запущений у Docker контейнерах за допомогою Docker Compose.

Проєкт складається з двох сервісів:

- `app` — Express-додаток на Node.js;
- `mongo` — база даних MongoDB на офіційному Docker-образі `mongo`.

### Dockerfile

У проєкті створено файл `Dockerfile`, який:

- використовує образ `node:lts`;
- встановлює робочу директорію `/app`;
- копіює файли `package.json` та `package-lock.json`;
- встановлює залежності через `npm install`;
- копіює весь код проєкту;
- відкриває порт `3000`;
- запускає додаток командою `npm start`.

### Docker Compose

У проєкті створено файл `docker-compose.yml`, який запускає два контейнери:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/tasks_manager
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - "27017:27017"