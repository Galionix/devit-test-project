# Devit RSS Parser
This project is a fullstack test project for devit company.

backend parses RSS feeds and stores them in the database.

The frontend divided to index page and admin page.

The index page shows by default latest 25 posts from the database and allows search by title and sort by date. The admin page is for adding, updating and deleting RSS feeds to the database. Here you can search by title and author and sort by date.

The admin page is protected by JWT authentication.

Although it is a test project, I implemented many features that I have learned in the past few years.

## Features
- [x] JWT Authentication
- [x] GraphQL
- [x] Typeorm
- [x] Task Scheduling
- [x] next-auth
- [x] NX Workspace
- [x] Caching
- [x] Debounced search

## How to run
- Clone the project
- Run `npm install` in the root directory
- Run `docker-compose up -d` in the root directory
- Run `npm run start-app` in the root directory or simply `make`

## Epilogue

I really loved to use all modern technologies I used for the first time, and been glad to remember learned time ago. I have learned a lot from this project, and I am sure that I will use all of them in the future.

Special thanks to @AnnaValman for giving me this opportunity.