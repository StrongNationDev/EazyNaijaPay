const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = 3000;

const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";

// Middleware
const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));
app.use(express.json());

// new updating
app.use(cors());
app.use(bodyParser.json());



// Husmodataapi endpoint
const AIRTIME_API_URL = "https://www.husmodata.com/api/topup/";
const DATA_API_URL = "https://www.husmodata.com/api/data/";
// const AUTH_TOKEN = "8f00fa816b1e3b485baca8f44ae5d361ef803311";
const AUTH_TOKEN = "4e1232989bd072dc935c84de444f64025ce874f4";

app.post("/proxy/topup", async (req, res) => {
    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(AIRTIME_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log("Husmodata API Response (Top-Up):", data);
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error in Top-Up Proxy:", error);
        res.status(500).json({ error: "Failed to fetch data from API." });
    }
});

app.post("/proxy/data", async (req, res) => {
    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(DATA_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log("Husmodata API Response (Data Purchase):", data);
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error in Data Purchase Proxy:", error);
        res.status(500).json({ error: "Failed to fetch data from API." });
    }
});



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


// Fetch User by ID (with pin and transaction_histories)
app.get('/Verified_Members/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne(
      { user_id },
      { user_id: 1, username: 1, email: 1, phone: 1, pin: 1, transaction_histories: 1 }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch only the user's PIN
app.get('/Verified_Members/:user_id/pin', async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ user_id }, { pin: 1 });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ pin: user.pin });
  } catch (error) {
    console.error('Error fetching user PIN:', error);
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


// Endpoint to deduct amount from user's balance
app.post("/Verified_Members/:user_id/deduct_balance", async (req, res) => {
  const { user_id } = req.params;
  const { amount } = req.body;

  console.log(`📥 Deduct Balance Request - User ID: ${user_id}, Amount: ${amount}`);
  
  try {
      const user = await User.findOne({ user_id });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      if (!amount || isNaN(amount) || amount <= 0) {
          return res.status(400).json({ error: "Invalid amount" });
      }

      if (user.balance < amount) {
          return res.status(400).json({ error: "Insufficient balance" });
      }

      user.balance -= amount;
      await user.save();

      res.json({ success: true, message: "Balance deducted successfully", balance: user.balance });

  } catch (error) {
      console.error("Error deducting balance:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



// Fetch Transaction Histories by user_id
app.get('/Verified_Members/:user_id/transaction_histories', async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ user_id }, { transaction_histories: 1 });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user.transaction_histories);
  } catch (error) {
    console.error('Error fetching transaction histories:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// API to add transaction history for data and airtime
app.post("/Verified_Members/:user_id/transaction_histories", async (req, res) => {
  const { user_id } = req.params;
  const transactionData = req.body;

  try {
      const user = await User.findOne({ user_id });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      user.transaction_histories.push(transactionData);

      await user.save();
      res.json({ success: true, message: "Transaction history added successfully" });

  } catch (error) {
      console.error("Error saving transaction:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API to clear all transaction history for a user
app.delete("/Verified_Members/:user_id/transaction_histories", async (req, res) => {
  const { user_id } = req.params;

  try {
      const user = await User.findOne({ user_id });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      user.transaction_histories = []; // Clear all history
      await user.save();

      res.json({ success: true, message: "Transaction history cleared successfully" });

  } catch (error) {
      console.error("Error clearing transaction history:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});







// DELETE User Route (Modified for your API structure)
app.delete("/Verified_Members/:user_id", async (req, res) => {
  try {
      const { user_id } = req.params;
      const result = await VerifiedMember.findOneAndDelete({ user_id });

      if (!result) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
