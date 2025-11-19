

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Create Database / User](#create-database--user)
- [Run Migrations](#run-migrations)
- [Seed Data](#seed-data)
- [Start the Server](#start-the-server)
- [Start Using the App](#start-using-the-app)
- [Troubleshooting](#troubleshooting)


# Database Setup
# Database Setup (for Local Development with XAMPP)


This repository expects a relational database. Use XAMPP (MySQL / MariaDB + phpMyAdmin) for local development.

## Prerequisites
- XAMPP installed and running (start Apache and MySQL/MariaDB in XAMPP Control Panel)
- phpMyAdmin (included with XAMPP) or mysql client
- Check repo for migration/ORM tool (Prisma, Sequelize, Alembic, Rails, EF Core, etc.)

## Environment variables
Create or update `.env`:
```
# MySQL / MariaDB connection
DATABASE_URL=mysql://myuser:mypassword@127.0.0.1:3306/mydb
# or individual parts
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=myuser
DB_PASS=mypassword
DB_NAME=mydb
```
Use 127.0.0.1 instead of localhost if you need TCP (avoids socket issues).

## Create database / user
Using phpMyAdmin: open http://localhost/phpmyadmin, create database and user, grant privileges.

Using mysql client:
```sql
-- connect as root (XAMPP default root often has no password)
mysql -u root -p

-- inside mysql shell:
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'localhost';
FLUSH PRIVILEGES;
```
If root has no password, omit `-p` when connecting. Consider setting a root password for security.

## Run migrations
Run the migration command your project uses, e.g.:
- Prisma (MySQL): `npx prisma migrate deploy`
- Sequelize: `npx sequelize db:migrate` or `npm run migrate`
- Rails (MySQL adapter): `rails db:migrate`
- Alembic (use MySQL URL): `alembic upgrade head`
- EF Core: `dotnet ef database update`

Ensure DATABASE_URL or DB_* vars point to your XAMPP MySQL instance.

## Seed data
If repo includes seeds:
- Node: `npm run seed`
- SQL file: `mysql -u myuser -p -h 127.0.0.1 mydb < scripts/seed.sql`
- Or use phpMyAdmin import

## Verify
- Connect with mysql client: `mysql -u myuser -p -h 127.0.0.1 -P 3306 mydb`
- Open phpMyAdmin: http://localhost/phpmyadmin
- Run app and check health endpoint.

## Troubleshooting
- "Connection refused": ensure MySQL is running in XAMPP and port 3306 is correct.
- Auth errors: XAMPP root may have no password; ensure user exists and has privileges.
- Socket vs TCP: use 127.0.0.1 and port 3306 if localhost fails.
- Port conflict: change MySQL port in XAMPP config if needed.

Notes
- Use strong passwords for production; XAMPP is for local/dev only.
- Apply a single SQL file (db.sql) directly:
```sh
mysql -u myuser -p -h 127.0.0.1 mydb < db.sql
```
- Alternatively import db.sql via phpMyAdmin (Import → choose db.sql → Go).

## Start the server

1. Install dependencies and prepare env:
```sh
cp .env.example .env   # or create .env as shown above
# edit .env to point to your DB and set APP_PORT if needed
# install deps (example per stack)
npm install            # Node
pip install -r requirements.txt  # Python
bundle install         # Rails
dotnet restore         # .NET
```

2. Run migrations/seeds if not done:
```sh
# examples
npx prisma migrate deploy
npm run migrate
python manage.py migrate
alembic upgrade head
dotnet ef database update

# seed if available
npm run seed
mysql -u myuser -p -h 127.0.0.1 mydb < db.sql
```

3. Start the app (common commands—use the one for your project):
```sh
# Node
npm run dev        # watch mode (nodemon)
npm start          # production

# Rails
bin/rails server -p 3306

# Django
python manage.py runserver 0.0.0.0:3306

# Flask
FLASK_APP=app.py flask run --host=0.0.0.0 --port=3306

# .NET
dotnet run

# Spring Boot (Maven)
./mvnw spring-boot:run
```
Note: ensure the app port does not conflict with your database port.

## Start using the app

- Open the app in a browser: http://localhost:3306 (replace port if configured).
- Check health/heartbeat endpoint (example):
```sh
curl -i http://localhost:3306/health
```
- Use Postman or curl to exercise API endpoints:
```sh
curl -X POST http://localhost:3306/api/login -H "Content-Type: application/json" \
    -d '{"username":"user","password":"pass"}'
```
- Tail logs for runtime errors:
```sh
# Node
npm run dev    # shows logs in console

# Rails / Django / .NET
# view console output where server was started
```

Troubleshooting:
- If connection to DB fails, confirm .env DB_* / DATABASE_URL and DB host/port are correct and MySQL is running.
- If port conflict occurs, change APP_PORT in .env or pass -p to the server command.
- If CORS issues appear when testing from the browser, enable CORS in your app or use Postman/curl.
- For production, build the app as documented in the repo before starting.