const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const User = require('./models/User');

const app = express();
const PORT = 3000;

// MongoDB URI
const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";

// Middleware
const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Utility function: Generate unique user ID
const generateUserId = () => `USER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      user_id: generateUserId(),
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Verified Members
app.get('/Verified_Members', async (req, res) => {
  try {
    const members = await User.find({}, {
      user_id: 1,
      username: 1,
      email: 1,
      phone: 1,
      balance: 1,
      transaction_histories: 1,
      pin: 1
    });

    return res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching verified members:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



// Fetch User by ID
app.get('/Verified_Members/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ user_id }, { user_id: 1, username: 1, email: 1, phone: 1 });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Set PIN for a specific user
app.post('/Verified_Members/:user_id/set-pin', async (req, res) => {
  const { user_id } = req.params;
  const { pin } = req.body;

  if (!/^\d{4}$/.test(pin)) {
    return res.status(400).json({ message: 'PIN must be a 4-digit number' });
  }

  try {
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.pin = pin;
    await user.save();
    return res.status(200).json({ message: 'PIN set successfully' });
  } catch (error) {
    console.error('Error setting PIN:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Fetch User Balance by user_id
app.get('/Verified_Members/:user_id/balance', async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOne({ user_id: user_id }, { balance: 1 });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user_id, balance: user.balance });
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
