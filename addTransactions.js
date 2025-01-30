const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure this path matches where your User schema is defined

// MongoDB URI
const MONGO_URI = "mongodb+srv://EazyNaijaPay:Ade2003@eazynaijapay.asnqh.mongodb.net/EazyNaijaPay_Bot?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userId = 'USER_1737681239046_240';
const transactionData = [
  {
    "transaction_id": "trans123",
    "type": "data",
    "amount": 500,
    "status": "success",
    "created_at": "2024-01-26T12:34:56.789Z"
  },
  {
    "transaction_id": "trans124",
    "type": "airtime",
    "amount": 200,
    "status": "failed",
    "created_at": "2024-01-27T08:22:44.123Z"
  }
];

// Function to add transaction histories
async function addTransactionHistories() {
  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      console.log('User not found');
      return;
    }

    // Append new transactions to the transaction_histories array
    user.transaction_histories.push(...transactionData);

    // Save the updated user
    await user.save();
    console.log('Transaction histories added successfully:', user.transaction_histories);
  } catch (error) {
    console.error('Error updating transaction histories:', error);
  } finally {
    mongoose.connection.close();
  }
}

addTransactionHistories();
