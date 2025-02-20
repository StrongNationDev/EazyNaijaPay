const API_BASE_URL = "https://eazynaijapay-server.onrender.com/Verified_Members";
const AIRTIME_API_URL = "http://localhost:5000/proxy/topup";

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
        const response = await fetch(`${API_BASE_URL}/${userId}/pin`);
        if (!response.ok) throw new Error("Failed to validate PIN.");
        
        const data = await response.json();
        return data.pin === pin;
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


// Balance updater
async function updateBalance(amount) {
    try {
        const userId = localStorage.getItem("user_id"); // ✅ Fix: Correct key
        if (!userId) {
            throw new Error("User ID is missing. Please log in again.");
        }

        console.log(`🔄 Deducting balance for user ${userId}, amount: ${amount}`);

        const response = await fetch(`${API_BASE_URL}/${userId}/deduct_balance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }), // Ensure correct amount
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update balance.");
        }

        const data = await response.json();
        console.log("✅ Balance updated successfully. Remaining Balance:", data.balance);
        return { success: true, balance: data.balance };

    } catch (error) {
        console.error("❌ Error updating balance:", error.message);
        return { success: false, message: error.message };
    }
}


// Payload uploader
async function buyAirtime(networkId, amount, phone) {
    try {
        const userId = localStorage.getItem("user_id"); // ✅ Fix: Correct key
        if (!userId) {
            throw new Error("User ID is missing. Please log in again.");
        }

        const balanceCheck = await checkBalance(amount);
        if (!balanceCheck.success) {
            showshowAlert(balanceCheck.message);
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

        const data = await response.json();
        console.log("Airtime Purchase Response:", data);

        // ✅ If transaction is successful, deduct balance
        if (data.Status === "successful") {
            await updateBalance(amount);  // ✅ Ensure amount is positive, deduct_balance API will handle subtraction
            await saveAirtimeTransaction(networkId, amount, phone, "success");
            showAlert(
                "🎉 Wow! 🎉\nYou’ve successfully purchased airtime using EazyNaijaPay Bot! 💚\nWe’ll be expecting you again! 😊"
            );
        } else {
            await saveAirtimeTransaction(networkId, amount, phone, "failed");
            showAlert("Airtime purchase failed. Please try again.");
        }
        
    } catch (error) {
        console.error("Error processing airtime purchase:", error);
        showAlert("Airtime purchase failed. Please try again.");
    }
}


// Saving of transaction histories
async function saveAirtimeTransaction(networkId, amount, phone, status) {
    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`; // Unique ID

    const transactionData = {
        transaction_id: transactionId, // Ensure transaction_id is included
        user_id: userId,
        type: "airtime", // ✅ Add type field
        network: networkMap[networkId],
        amount: amount,
        phone_number: phone,
        status: status,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${userId}/transaction_histories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error saving transaction:", errorData);
            throw new Error(errorData.error || "Failed to save transaction history.");
        }

        console.log("Transaction saved successfully!");
    } catch (error) {
        console.error("Failed to save transaction history:", error);
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







// Alerting users with notification function

function showAlert(message) {
    // Remove any existing alert
    const existingAlert = document.getElementById("custom-alert");
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create the alert container
    const alertBox = document.createElement("div");
    alertBox.id = "custom-alert";
    alertBox.textContent = message;

    // Append alert to body
    document.body.appendChild(alertBox);

    // Play alert sound
    const alertSound = new Audio("../pages/alert/notification-alert.mp3");
    alertSound.play();

    // Show animation
    setTimeout(() => {
        alertBox.classList.add("show");
    }, 100);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove("show");
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
}