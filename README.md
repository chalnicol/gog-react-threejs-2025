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
├── client/        # Frontend (React, Vite)
├── server/        # Backend (Node.js, Socket.IO)
├── package.json   # Project-level dependencies (if any)
```

---

## Getting Started

Follow these steps to set up and run both the **Socket.IO server** and the **Vite client** simultaneously.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install Dependencies

Navigate to each folder (client and server) and install dependencies:

```bash
# For the backend (server):
cd server
npm install

# For the frontend (client):
cd ../client
npm install
```

### 3. Run Both Server and Client

To run both the server and client simultaneously, you can:

#### Option 1: Use Separate Terminals

1. Open a terminal for the **server**:

   ```bash
   cd server
   npm start
   ```

2. Open another terminal for the **client**:
   ```bash
   cd client
   npm run dev
   ```

The server will run on `http://localhost:3000` by default, and the client will be accessible at `http://localhost:5173`.

#### Option 2: Use a Concurrent Script (Optional)

You can set up a script to run both servers at once using [concurrently](https://www.npmjs.com/package/concurrently):

1. Install `concurrently` at the root level:

   ```bash
   npm install -g concurrently
   ```

2. Add the following to your `package.json` at the root level:

   ```json
   "scripts": {
     "start": "concurrently \"npm run server\" \"npm run client\"",
     "server": "cd server && npm start",
     "client": "cd client && npm run dev"
   }
   ```

3. Run the command:
   ```bash
   npm run start
   ```

Both servers will run simultaneously.

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

## License

This project is licensed under the MIT License.

---

Happy coding!
