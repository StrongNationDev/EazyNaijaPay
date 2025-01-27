const API_BASE_URL = "https://eazynaijapay-server.onrender.com/Verified_Users";
const AIRTIME_API_URL = "https://eazynaijapay-server.onrender.com/proxy/topup";
const AUTH_TOKEN = "1b4b2afd4ef0f22d082ebaf6c327de30ea1b6bcf";
//UsersTransactions.js
const UserTransaction = require("../models/UserTransaction");


const networkMap = {
    "1": "MTN",
    "2": "GLO",
    "3": "9MOBILE",
    "4": "AIRTEL",
};

const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
if (!userId) {
    showAlert("User not authenticated. Please log in again.");
    window.location.href = "/login.html";
}

async function validatePin(pin) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}`);
        if (!response.ok) throw new Error("Failed to validate PIN.");

        const data = await response.json();
        return data.success && data.user.User_pin === pin;
    } catch (error) {
        console.error("Error validating PIN:", error);
        return false;
    }
}

async function checkBalance(amount) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}/Balance`);
        if (!response.ok) throw new Error("Failed to check balance.");

        const data = await response.json();
        const currentBalance = data.balance;
        return currentBalance >= amount
            ? { success: true, currentBalance }
            : { success: false, message: "Insufficient balance." };
    } catch (error) {
        console.error("Error checking balance:", error);
        return { success: false, message: "Error checking balance." };
    }
}


async function updateBalance(amount) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}/Balance`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: -amount }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Response Error:", errorData.message);
            throw new Error(errorData.message || "Failed to update balance.");
        }

        const data = await response.json();
        if (data.success) {
            console.log("Balance updated successfully. Remaining Balance:", data.balance);
            return { success: true, balance: data.balance };
        } else {
            throw new Error(data.message || "Balance update failed.");
        }
    } catch (error) {
        console.error("Error updating balance:", error.message);
        showAlert("Failed to update balance. Please try again.");
        return { success: false, message: error.message };
    }
}



// Function to save airtime transaction (COMING BACK TO WORK HERE)
//async function saveAirtimeTransaction(networkId, amount, phone, status) {
//    try {
//        const transactionData = {
//            network: networkId,
//            amount,
//            phone,
//            status,
//            user_id: userId,
//        };
//        console.log("Saving transaction:", transactionData);
//    } catch (error) {
//        console.error("Error saving airtime transaction:", error);
//    }
//}



async function saveAirtimeTransaction(networkId, amount, phone, status, userId) {
  try {
    const transactionData = {
      networkId,
      amount,
      phone,
      status,
      type: "airtime", // Mark this as an airtime transaction
    };

    // Upsert: Add a new transaction under the user's transactions
    const result = await UserTransaction.findOneAndUpdate(
      { User_id: userId },
      { $push: { transactions: transactionData } }, // Add the transaction
      { upsert: true, new: true } // Create if doesn't exist
    );

    console.log("Airtime transaction saved:", result);
  } catch (error) {
    console.error("Error saving airtime transaction:", error);
  }
}

module.exports = { saveAirtimeTransaction };














async function buyAirtime(networkId, amount, phone) {
    try {
        const balanceCheck = await checkBalance(amount);
        if (!balanceCheck.success) {
            showAlert(balanceCheck.message);
            return;
        }

        const response = await fetch(AIRTIME_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                network: networkId,
                amount,
                mobile_number: phone,
                Ported_number: true,
                airtime_type: "VTU",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response Error:", errorText);
            await saveAirtimeTransaction(networkId, amount, phone, "failed");
            throw new Error("Failed to process airtime purchase.");
        }

        const data = await response.json();
        console.log("Airtime Purchase Response:", data);

        await saveAirtimeTransaction(networkId, amount, phone, "success");
        await updateBalance(-amount);
        showAlert(
            "🎉 Wow! 🎉\nYou’ve successfully purchased airtime using EazyNaijaPay Bot! 💚\nWe’ll be expecting you again! 😊"
        );
        
    } catch (error) {
        console.error("Error processing airtime purchase:", error);
        showAlert("Airtime purchase failed. Please try again.");
    }
}

document.getElementById("paynow").addEventListener("click", async () => {
    const network = document.getElementById("network-dropdown").value;
    const phone = document.getElementById("phone-number").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    const pin = [
        document.getElementById("pin1").value,
        document.getElementById("pin2").value,
        document.getElementById("pin3").value,
        document.getElementById("pin4").value,
    ].join("");

    if (!network || !phone || isNaN(amount) || pin.length !== 4) {
        showAlert("Please fill in all fields correctly.");
        return;
    }

    const isPinValid = await validatePin(pin);
    if (!isPinValid) {
        showAlert("Invalid PIN. Please try again.");
        return;
    }

    await buyAirtime(network, amount, phone);
});
