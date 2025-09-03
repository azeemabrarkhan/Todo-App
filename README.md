Todo App
This repository contains a full-stack Todo application with a microservices architecture. The system consists of three main components: a Todo service, a User service, and a frontend application. Each service is containerized using its own Dockerfile, and the entire system can be managed with a single docker-compose.yaml file located in the root directory.

Setup and Run
To get the application up and running, follow these steps:

Clone the repository:

git clone [https://github.com/azeemabrarkhan/Todo-App.git](https://github.com/azeemabrarkhan/Todo-App.git)

Navigate to the project directory:

cd Todo-App

Configure environment variables:
Place a .env file in the root directory, alongside the docker-compose.yaml file. The format should be the same as the .env.example file.

Build the Docker images:
Run the following command from the root directory to build the images for all services.

docker-compose build

Start the services:
Start the services with the following command:

docker-compose up

Service Endpoints
The services can be accessed at the following endpoints:

Todo service: Accepts HTTP requests (GET, PATCH, POST, DELETE) at http://localhost:5000/api/todo

User service (Sign-up): Listens for POST requests at http://localhost:4000/api/user/sign-up

User service (Login): Listens for POST requests at http://localhost:4000/api/user/login

Frontend: The web application can be accessed at http://localhost:5173

API Documentation
The complete API documentation, including request examples and schemas, can be accessed through the following Postman collection:

API Documentation

Running Unit Tests
Unit tests for the services can be run from the root directory using these commands:

npm run test:user — Tests the user service.

npm run test:todo — Tests the todo service.

npm run test:all — Tests both the user and todo services.
