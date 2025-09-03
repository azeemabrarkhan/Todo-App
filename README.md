# Todo App

This repository contains a **full-stack Todo application** with a **microservices architecture**. The system consists of three main components: a **Todo service**, a **User service**, and a **frontend application**. Each service is containerized using its own Dockerfile, and the entire system can be managed with a single `docker-compose.yaml` file located in the root directory.

---

## 🚀 Setup and Run

Follow these steps to get the application up and running:

### 1. Clone the repository

```bash
git clone https://github.com/azeemabrarkhan/Todo-App.git
```

### 2. Navigate to the project directory

```bash
cd Todo-App
```

### 3. Configure environment variables

Place a `.env` file in the root directory alongside the `docker-compose.yaml` file. The format should match `.env.example`.

### 4. Build the Docker images

Run the following command from the root directory to build images for all services:

```bash
docker-compose build
```

### 5. Start the services

```bash
docker-compose up
```

---

## 🔗 Service Endpoints

The services can be accessed at the following URLs:

* **Todo service**: Handles HTTP requests (`GET`, `PATCH`, `POST`, `DELETE`)
  `http://localhost:5000/api/todo`

* **User service (Sign-up)**: Handles `POST` requests
  `http://localhost:4000/api/user/sign-up`

* **User service (Login)**: Handles `POST` requests
  `http://localhost:4000/api/user/login`

* **Frontend**: The web application
  `http://localhost:5173`

---

## 📚 API Documentation

The complete API documentation, including request examples and schemas, is available through this **Postman collection**:
[API Documentation](https://azeemabrarkhan-2649248.postman.co/workspace/Azeem-Abrar-Khan's-Workspace~894a52cc-947c-4b6f-88b3-7eea6ea7c693/collection/47488449-df7b0549-8686-4b24-98fa-ea33bdb3b460?action=share&creator=47488449)

---

## 🧪 Running Unit Tests

Unit tests for the services can be run from the root directory:

```bash
npm run test:user   # Tests the User service
npm run test:todo   # Tests the Todo service
npm run test:all    # Tests both User and Todo services
```
