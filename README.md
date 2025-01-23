# Games of the Generals - Online Game

Welcome to the **Games of the Generals Online Game** project! This README provides instructions on how to set up and run the project locally. The app uses **Socket.IO** for real-time communication and **Vite** for the client-side development.

## Prerequisites

Make sure you have the following installed on your system:

1. [Node.js](https://nodejs.org/) (version 16.x or later recommended)
2. npm (comes with Node.js) or [yarn](https://yarnpkg.com/)
3. A code editor, preferably [VS Code](https://code.visualstudio.com/)

---

## Project Structure

```
root/
├── public/        # Public assets
├── server/        # Backend (Node.js, Socket.IO)
├── src/           # Frontend (React, Vite)
├── package.json   # Project-level dependencies
```

---

## Getting Started

Follow these steps to set up and run both the **Socket.IO server** and the **Vite client**.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install Dependencies

At the root level of the project, run:

```bash
npm install
```

This will install dependencies for both the frontend and backend.

### 3. Run the Server and Client

To start the project, use the following commands in separate terminals:

1. Start the **server**:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` by default.

2. Start the **Vite client**:

   ```bash
   npm run dev
   ```

   The client will be accessible at `http://localhost:5173`.

---

## Usage

1. Open your browser and navigate to the client:

   -  `http://localhost:5173`

2. Ensure the backend server is running. It should automatically handle real-time connections using Socket.IO.

---

## Troubleshooting

-  **Port Conflicts:**
   If the default ports (`3000` for the server, `5173` for the client) are in use, update the ports:

   -  For the server, modify the port in `server/index.js`.
   -  For the client, update `vite.config.js`.

-  **Installation Errors:**
   Ensure you have the correct Node.js version installed.

---

Happy coding!
