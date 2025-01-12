# Library Management API

## Overview

The **Library Management API** is a backend application designed to manage library members and book borrowings. Built with **TypeScript**, **Express**, and **Prisma**, it interacts with a **PostgreSQL** database to perform CRUD operations on users and books, as well as handle borrowing and returning of books. The project utilizes **Docker** to containerize the PostgreSQL database, ensuring easy setup and portability.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
  - [Using Docker](#using-docker)
  - [Applying Database Schema](#applying-database-schema)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)
- [Project Structure](#project-structure)
- [Additional Notes](#additional-notes)

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **TypeScript**: Typed superset of JavaScript.
- **Express**: Web framework for Node.js.
- **Prisma**: ORM for database interactions.
- **PostgreSQL**: Relational database system.
- **Docker**: Containerization platform.
- **Joi**: Data validation library.
- **Nodemon**: Utility for automatically restarting the server during development.

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** (comes with Node.js)
- **Docker** (for database setup)
- **Git** (optional, for cloning the repository)

## Installation

1. **Clone the Repository**

   ````bash
   git clone https://github.com/yourusername/library-management-api.git
   cd library-management-api

    2. **Install Dependencies**

       Install the required npm packages:

       ```bash
       npm install
       ```

    3. **Set Up Environment Variables**

       Create a `.env` file in the root directory with the following content:

       ```env
       DATABASE_URL="postgresql://postgres:postgres@localhost:5433/library?schema=public"
       PORT=3000
       ```

       - **`DATABASE_URL`**: Connection string for your PostgreSQL database.
       - **`PORT`**: Port on which the Express server will run (default is `3000`).

    ## Database Setup

    The project uses **PostgreSQL** as its database, which is containerized using **Docker** for ease of setup.

    ### Using Docker

    1. **Run PostgreSQL Container**

       Execute the following Docker command to start a PostgreSQL container named `library-postgres`:

       ```bash
       docker run --name library-postgres \
         -e POSTGRES_USER=postgres \
         -e POSTGRES_PASSWORD=postgres \
         -e POSTGRES_DB=library \
         -p 5433:5432 \
         -v library-data:/var/lib/postgresql/data \
         -d postgres:15
       ```

       **Explanation of Parameters:**

       - `--name library-postgres`: Names the container for easy reference.
       - `-e POSTGRES_USER=postgres`: Sets the PostgreSQL user.
       - `-e POSTGRES_PASSWORD=postgres`: Sets the PostgreSQL password.
       - `-e POSTGRES_DB=library`: Creates a database named `library`.
       - `-p 5433:5432`: Maps port `5432` in the container to port `5433` on the host machine.
       - `-v library-data:/var/lib/postgresql/data`: Persists database data using Docker volumes.
       - `-d postgres:15`: Runs the container in detached mode using PostgreSQL version 15.

       **Verify the Container is Running:**

       ```bash
       docker ps
       ```

       You should see `library-postgres` listed among the running containers.

    ### Applying Database Schema

    After setting up the PostgreSQL container, apply the database schema using Prisma migrations or the provided DDL script.

    #### Using Prisma Migrate (Recommended)

    Prisma provides a migration system to manage your database schema. Follow these steps to apply migrations:

    1. **Generate Prisma Client**

       ```bash
       npx prisma generate
       ```

    2. **Apply Migrations**

       ```bash
       npx prisma migrate dev --name init
       ```

       This command will create and apply the initial migration based on your `schema.prisma` file.

       **Note:** Ensure that your PostgreSQL container is running before applying migrations.

    #### Manual Setup Using DDL Script

    Alternatively, you can manually apply the `migration.sql` script to set up the database schema.

    1. **Locate the DDL Script**

       The DDL script is located in the `database` directory:

       ```
       database/migration.sql
       ```

    2. **Execute the DDL Script**

       Use the `psql` command-line tool or a GUI like **pgAdmin** to run the script.

       **Using `psql`:**

       ```bash
       psql -U postgres -d library -f database/migration.sql
       ```

       **Parameters:**

       - `-U postgres`: Specifies the PostgreSQL user.
       - `-d library`: Specifies the database name.
       - `-f database/migration.sql`: Specifies the path to the DDL script.

       **Using pgAdmin:**

       - Open pgAdmin and connect to your PostgreSQL server.
       - Navigate to the `library` database.
       - Open the Query Tool.
       - Copy and paste the contents of `database/migration.sql`.
       - Execute the script.

    ## Running the Application

    1. **Start the Development Server**

       Use `nodemon` to run the server in development mode, which automatically restarts on file changes:

       ```bash
       npm run dev
       ```

       **Alternatively, for Production:**

       1. **Build the Project**

          ```bash
          npm run build
          ```

       2. **Start the Server**

          ```bash
          npm start
          ```

    2. **Access the API**

       The server listens on port `3000` by default. You can verify that the server is running by accessing the root endpoint:

       ```
       http://localhost:3000/
       ```

       **Expected Response:**

       ```
       Library Management API is working!
       ```

    ## API Endpoints

    The API provides endpoints to manage users and books, as well as handle borrowing and returning of books.

    ### Users

    - **Get All Users**

      - **Endpoint:** `GET /users`
      - **Description:** Retrieves a list of all users.
      - **Response:**
        ```json
        [
            {
                "id": 2,
                "name": "Enes Faruk Meniz"
            },
            {
                "id": 1,
                "name": "Eray Aslan"
            },
            {
                "id": 4,
                "name": "Kadir Mutlu"
            },
            {
                "id": 3,
                "name": "Sefa Eren Şahin"
            }
        ]
        ```
      - **Status Code:** `200 OK`

    - **Get User by ID**

      - **Endpoint:** `GET /users/:id`
      - **Description:** Retrieves details of a specific user, including past and present book borrows.
      - **Responses:**
        - **User with No Borrow History:**
          ```json
          {
              "id": 4,
              "name": "Kadir Mutlu",
              "books": {
                  "past": [],
                  "present": []
              }
          }
          ```
        - **User with Borrow History:**
          ```json
          {
              "id": 2,
              "name": "Enes Faruk Meniz",
              "books": {
                  "past": [
                      {
                          "name": "I, Robot",
                          "userScore": 5
                      },
                      {
                          "name": "The Hitchhiker's Guide to the Galaxy",
                          "userScore": 10
                      }
                  ],
                  "present": [
                      {
                          "name": "Brave New World"
                      }
                  ]
              }
          }
          ```
      - **Status Code:** `200 OK`

    - **Create User**

      - **Endpoint:** `POST /users`
      - **Description:** Creates a new user.
      - **Request Body:**
        ```json
        {
            "name": "Esin Öner"
        }
        ```
      - **Response:**
        - **Status Code:** `201 Created`
        - **Body:** *Empty*

    - **Borrow Book**

      - **Endpoint:** `POST /users/:userId/borrow/:bookId`
      - **Description:** Allows a user to borrow a book.
      - **Response:**
        - **Status Code:** `204 No Content`
        - **Body:** *Empty*

    - **Return Book**

      - **Endpoint:** `POST /users/:userId/return/:bookId`
      - **Description:** Allows a user to return a borrowed book and provide a score.
      - **Request Body:**
        ```json
        {
            "score": 9
        }
        ```
      - **Response:**
        - **Status Code:** `204 No Content`
        - **Body:** *Empty*

    ### Books

    - **Get All Books**

      - **Endpoint:** `GET /books`
      - **Description:** Retrieves a list of all books.
      - **Response:**
        ```json
        [
            {
                "id": 4,
                "name": "1984"
            },
            {
                "id": 5,
                "name": "Brave New World"
            },
            {
                "id": 3,
                "name": "Dune"
            },
            {
                "id": 2,
                "name": "I, Robot"
            },
            {
                "id": 1,
                "name": "The Hitchhiker's Guide to the Galaxy"
            }
        ]
        ```
      - **Status Code:** `200 OK`

    - **Get Book by ID**

      - **Endpoint:** `GET /books/:id`
      - **Description:** Retrieves details of a specific book, including its average user score.
      - **Responses:**
        - **With Average Score:**
          ```json
          {
              "id": 2,
              "name": "I, Robot",
              "score": "5.33"
          }
          ```
        - **Without Score:**
          ```json
          {
              "id": 3,
              "name": "Dune",
              "score": -1
          }
          ```
      - **Status Code:** `200 OK`

    - **Create Book**

      - **Endpoint:** `POST /books`
      - **Description:** Creates a new book.
      - **Request Body:**
        ```json
        {
            "name": "Neuromancer"
        }
        ```
      - **Response:**
        - **Status Code:** `201 Created`
        - **Body:** *Empty*

    ## Postman Collection

    To facilitate testing and interaction with the API, a **Postman Collection** is provided. It contains predefined requests and expected responses for all endpoints.

    ### Importing the Collection

    1. **Download the Collection**

       Ensure you have the `Library Case API Collection.json` file.

    2. **Import into Postman**

       - Open Postman.
       - Click on the "Import" button.
       - Select the downloaded `Library Case API Collection.json` file.
       - The collection will appear in your Postman workspace.

    3. **Run the Requests**

       Execute each request to interact with the API endpoints. Ensure that the server is running before testing.

    ## Project Structure

   ````

   library-management-api/
   ├── node_modules/
   ├── prisma/
   │ └── schema.prisma
   ├── src/
   │ ├── controllers/
   │ │ ├── bookController.ts
   │ │ └── userController.ts
   │ ├── middlewares/
   │ │ ├── errorHandler.ts
   │ │ └── validate.ts
   │ ├── prisma/
   │ │ └── client.ts
   │ ├── routes/
   │ │ ├── bookRoutes.ts
   │ │ └── userRoutes.ts
   │ ├── validators/
   │ │ ├── bookValidator.ts
   │ │ └── userValidator.ts
   │ └── index.ts
   ├── database/
   │ └── migration.sql
   ├── .env
   ├── .gitignore
   ├── nodemon.json
   ├── package.json
   ├── tsconfig.json
   └── README.md

   ````

   ### Directory Breakdown

   - **`prisma/`**
     - `schema.prisma`: Defines the database schema and Prisma models.

   - **`src/`**
     - **`controllers/`**: Contains controller files handling business logic for books and users.
       - `bookController.ts`
       - `userController.ts`
     - **`middlewares/`**: Contains middleware functions.
       - `errorHandler.ts`: Global error handling middleware.
       - `validate.ts`: Request validation middleware using Joi.
     - **`prisma/`**
       - `client.ts`: Initializes and exports the Prisma client for database interactions.
     - **`routes/`**: Defines Express routes for books and users.
       - `bookRoutes.ts`
       - `userRoutes.ts`
     - **`validators/`**: Contains Joi schemas for request validation.
       - `bookValidator.ts`
       - `userValidator.ts`
     - `index.ts`: Entry point of the application, sets up Express server and integrates routes and middleware.

   - **`database/`**
     - `migration.sql`: SQL script to manually set up the database schema.

   - **Configuration Files**
     - `.env`: Environment variables (e.g., database connection string).
     - `.gitignore`: Specifies files and directories to be ignored by Git.
     - `nodemon.json`: Configuration for Nodemon.
     - `package.json`: Project metadata and dependencies.
     - `tsconfig.json`: TypeScript configuration.

   - **`README.md`**: Project documentation.

   ## Additional Notes

   - **Environment Variables**

     Ensure that sensitive information, such as database credentials, is stored securely in the `.env` file and **not** committed to version control.

   - **Error Handling**

     The application includes comprehensive error handling to manage various error scenarios gracefully. The `errorHandler` middleware captures and formats errors before sending responses to the client.

   - **Validation**

     Request bodies are validated using **Joi** schemas to ensure data integrity and prevent malformed data from entering the system.

   - **Prisma Client**

     Prisma is used as the ORM to interact with the PostgreSQL database, providing type safety and streamlined database operations.

   - **Docker Volumes**

     The Docker command includes a volume (`library-data`) to persist PostgreSQL data, ensuring data is retained even if the container is removed or recreated.

   - **Logging**

     For better monitoring and debugging, consider integrating a logging library like **morgan** or **winston**.

   - **Testing**

     Implement unit and integration tests using frameworks like **Jest** to ensure the reliability of your application.

   - **Graceful Shutdown**

     To handle graceful shutdowns and disconnect the Prisma client properly, consider adding listeners for process termination signals in `src/index.ts`:

     ```typescript
     import prisma from './prisma/client';

     // Handle graceful shutdown
     process.on('SIGINT', async () => {
       await prisma.$disconnect();
       process.exit();
     });

     process.on('SIGTERM', async () => {
       await prisma.$disconnect();
       process.exit();
     });
   ````

   ## Conclusion

   The **Library Management API** provides a robust foundation for managing library operations, leveraging modern technologies and best practices. By following the setup instructions and utilizing the provided Postman Collection, you can efficiently interact with and extend the application as needed.

   For any questions or further assistance, feel free to reach out or consult the project documentation.
