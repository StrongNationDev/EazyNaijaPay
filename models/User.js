const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  pin: { type: String, required: false },
  transaction_histories: [
    {
      transaction_id: { type: String, required: true },
      type: { type: String, enum: ['airtime', 'data', 'transfer'], required: true },
      amount: { type: Number, required: false },
      status: { type: String, enum: ['success', 'failed'], required: true },
      created_at: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Verified_Members', userSchema);
