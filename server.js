require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  }
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

let mongoConnected = true;
let userController = null;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Mohamed511_db:0511@cluster0.ud3jbij.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);
mongoose.connect(MONGO_URI)
  .then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
    // شغل باقي السيرفر هنا بعد الاتصال
    const userController = require('./controllers/userController');
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log("Running in local storage mode");
  });
// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Make io available in requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mongoConnected });
});

// User routes
if (mongoConnected && userController) {
  const { auth, adminAuth } = require('./middleware/auth');

  app.post('/api/register', userController.register);
  app.post('/api/login', userController.login);

  app.get('/api/users', auth, adminAuth, userController.getUsers);
  app.get('/api/all-users', auth, userController.getUsers);
  app.get('/api/pending-count', auth, adminAuth, userController.getPendingCount);

  app.put('/api/users/:userId/approve', auth, adminAuth, userController.approveUser);
  app.put('/api/users/:userId', auth, adminAuth, userController.updateUser);
  app.delete('/api/users/:userId', auth, adminAuth, userController.deleteUser);

} else {

  app.post('/api/register', (req, res) => {
    res.json({ success: false, message: 'MongoDB not connected' });
  });

  app.post('/api/login', (req, res) => {
    res.json({ success: false, message: 'MongoDB not connected' });
  });

  app.get('/api/users', (req, res) => {
    res.json({ users: [] });
  });
}

// Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});