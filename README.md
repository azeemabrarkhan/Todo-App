The repository has three subdirectories: the todo service, the user service, and the frontend app. Each directory contains its own Dockerfile. The docker-compose.yaml file is located in the root directory.

Setup and Run
Clone the repository: 

bash
Copy
Edit
https://github.com/azeemabrarkhan/Todo-App
Place .env file in the root directory (same format as .env.example). It should be placed alongside the docker-compose.yaml file.

Run the terminal as an administrator and build the Docker images:

bash
Copy
Edit
docker-compose build
Start the services:

bash
Copy
Edit
docker-compose up
Service Endpoints
Todo service accepts HTTP requests (GET, PATCH, POST, DELETE) at:
http://localhost:5000/api/todo

User service listens for sign-up POST requests at:
http://localhost:4000/api/user/sign-up

User service listens for login POST requests at:
http://localhost:4000/api/user/login

Frontend can be accessed at:
http://localhost:5173

API Documentation
The API documentation can be accessed at:
https://azeemabrarkhan-2649248.postman.co/workspace/Azeem-Abrar-Khan's-Workspace~894a52cc-947c-4b6f-88b3-7eea6ea7c693/collection/47488449-df7b0549-8686-4b24-98fa-ea33bdb3b460?action=share&creator=47488449

Running Unit Tests
Unit test cases can be run from the root directory:

npm run test:user — test user service

npm run test:todo — test todo service

npm run test:all — test both the user and todo services
