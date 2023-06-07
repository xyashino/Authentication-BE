# Authentication App

The **Authentication App** is a simple application that facilitates user registration and login through multiple providers:

- **Facebook**
- **Google**
- **LinkedIn**
- **GitHub**

Moreover, users can log in using their **email** and **password**. They can also **change** their **avatar** (by uploading a new one or providing a URL) and **password**.

This is a full-stack application. The frontend is developed using **React** and the backend using **Nest.js**. Therefore, I have created two separate repositories:

- [Frontend Repository](https://github.com/xyashino/Authentication-FE.git)
- [Backend Repository](https://github.com/xyashino/Authentication-BE.git)

## You can find a live demo here: [DEMO](https://authentication.yashino.live/)

```
email: test@gmail.com
password: 12345678
```

The app is deployed on **[MyDevil.net](https://www.mydevil.net/)**.

## Authentication App - Backend

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

It is a **REST API** that provides endpoints for user registration and login. It also allows users to log in using their social media accounts

- Facebook
- Google
- LinkedIn
- GitHub
- Email and password _**(JWT authentication as HTTP cookie)**_

For this purpose, I have used **[Passport.js](http://www.passportjs.org/)**.

# API Documentation

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
|                                                                         |
|                                  **AuthController**                     |
| POST   | /auth/login             | Allows user to log in.               |
| DELETE | /auth/logout            | Allows user to log out.              |
| GET    | /auth/me                | Retrieves the logged-in user's info. |
| GET    | /auth/github            | Allows user to login via GitHub.     |
| GET    | /auth/google            | Allows user to login via Google.     |
| GET    | /auth/linkedin          | Allows user to login via LinkedIn.   |
| GET    | /auth/facebook          | Allows user to login via Facebook.   |
| GET    | /auth/provider/callback | Callback for provider login.         |
|                                                                         |
|                                  **UsersController**                    |
| POST   | /users                  | Creates a new user.                  |
| GET    | /users                  | Retrieves all the users.             |
| GET    | /users/:id              | Retrieves a user by their ID.        |
| PATCH  | /users/:id              | Updates a user by their ID.          |
| DELETE | /users/:id              | Deletes a user by their ID.          |
|                                                                         |
|                                  **UploadController**                   |
| POST   | /upload/avatar/:userId  | Uploads an avatar for a user.        |

## Installation

1. Clone the repository

```
git clone https://github.com/xyashino/Authentication-BE.git
```

2. Move into the project directory

```
cd Authentication-BE
```

3. Install dependencies

```
yarn
```

4. Create a `.env` file in the root directory and copy the contents of `.env.example` into it. Then, fill in the values.

5. Create a database 6. Run the application

```
yarn start:dev
```

## Configuration

The application use OAuth 2.0 authentication. Therefore, you need to create a new app on each provider's website and provide the credentials in the `.env` file.
