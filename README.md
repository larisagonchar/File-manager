# CRUD API

Implemented simple CRUD API using in-memory database underneath.

## Installation

1. Clone repository to your computer using this command: 

    $ git clone https://github.com/larisagonchar/Node-js-course.git

2. Switch to task branch:

    $ git branch crud-api

3. Install dependencies:

    $ npm i
4. Rename *.env.file* to *.env*

## Scripts

    $ npm run start:dev - run app in development move
    $ npm run start:prod - run app in prod mode
    $ npm run test - run tests
    $ npm run lint - run eslint

## Implemented endpoints
**GET**  `api/users`  - get all users

**GET**  `api/users/{userId}` - get user by id

**POST**  `api/users`  - create record about new user and store it in database

***Body request for creation:***

    {
      "username": string,
      "age": number,
      "hobbies": []
    }

**PUT**  `api/users/{userId}`  - update existing user

**DELETE**  `api/users/{userId}`  - delete existing user from database