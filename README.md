# Currency Backend
Простой backend для получения курсов валют через API ЦБ РФ и хранения истории запросов.

##  Стек технологий
- Node.js
- Express.js
- MongoDB + Mongoose
- Axios (для запросов к ЦБ РФ)
- fast-xml-parser (для парсинга XML)
- dotenv
- CORS

## Установка и запуск
1. Клонируем репозиторий:

`git clone https://github.com/MiLee777/currency-backend.git`

`cd currency-backend`


2. Устанавливаем зависимости:

`npm install`


3. Переменные окружения:
Создайте файл .env в корне проекта и добавьте в него:

`PORT=3000`

`MONGO_URI=mongodb://localhost:27017/currency-db`

> Файл .env добавлен в .gitignore и не хранится в репозитории.

4. Запуск сервера:

`node src\index.js`


Сервер будет доступен по адресу: http://localhost:3000