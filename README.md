# 🛠️ Freelance Marketplace - Server

This is the **server-side** of the Freelance Task Marketplace web application. It handles all backend operations such as task creation, retrieval, updates, deletions, and bid counting. The server is built using **Node.js**, **Express**, and **MongoDB**.

---

## 🌐 Live Server URL

🔗 [https://freelance-marketplace-server-seven.vercel.app/](https://freelance-marketplace-server-seven.vercel.app/)

---

## 📌 Core Features

- 🔧 **Create, Read, Update, Delete (CRUD)** task entries
- 📅 **Featured Tasks API** based on earliest deadlines
- 🔒 **User-based task ownership validation**
- 📈 **Increment bids count** per task
- ✅ **RESTful API** structure
- 🛠️ Hosted on **Vercel** for global access
- 🗂️ Uses MongoDB Atlas with proper `ObjectId` handling
- 🧪 Integrated error handling with status codes

---

## 🔌 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- dotenv
- CORS
- MongoDB Native Driver

---

## 📂 API Endpoints

### 🏠 Root

- `GET /`  
  Returns a simple welcome message.

---

### 📋 Tasks

- `GET /tasks`  
  Returns all tasks from the database.

- `GET /tasks/:id`  
  Fetch a single task by its ID.

- `POST /tasks`  
  Add a new task to the database.

- `PATCH /tasks/bid/:id`  
  Increment the `bidsCount` on a task by 1.

---

### 🌟 Featured Tasks

- `GET /featured-tasks`  
  Returns 6 tasks sorted by nearest deadlines.

---

### 🙋 My Tasks (User-Specific)

- `GET /my-tasks?userEmail=example@mail.com`  
  Returns tasks created by the specified user.

- `GET /my-tasks/:id?userEmail=example@mail.com`  
  Returns a specific task by ID **only if** it belongs to the user.

- `PUT /my-tasks/:id?userEmail=example@mail.com`  
  Update a task if it belongs to the user.

- `DELETE /my-tasks/:id`  
  Delete a task by ID. Server ensures task exists before deleting.

---

## 🛡️ Authorization

Currently, this server **does not include JWT or token-based auth**. Route access and validation is handled through user email comparison (basic protection for update/delete operations).

---

## 🗃️ MongoDB Collection

- **Database Name**: `taskDB`
- **Collection Name**: `tasks`

---

## 🧪 Sample Task Object

```json
{
  "title": "Build a Portfolio Website",
  "category": "Web Development",
  "description": "Create a responsive personal portfolio using React.",
  "deadline": "2025-06-20",
  "budget": 200,
  "userEmail": "user@example.com",
  "userName": "Jane Doe",
  "bidsCount": 0
}
```
