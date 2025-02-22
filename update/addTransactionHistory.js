const axios = require('axios');

async function addTransactionHistory(userId, transactionData) {
  try {
    const response = await axios.post(`https://eazynaijapay-server.onrender.com/Verified_Members/${userId}/transaction_histories`, {
      transaction: transactionData
    });

    if (response.status === 200) {
      console.log("✅ Transaction history added successfully.");
    } else {
      console.error("❌ Failed to add transaction history.");
    }
  } catch (error) {
    console.error("Error adding transaction history:", error);
  }
}

module.exports = addTransactionHistory;








