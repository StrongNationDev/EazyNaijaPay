const API_BASE_URL = "http://localhost:3000/Verified_Members";
const AIRTIME_API_URL = "http://localhost:5000/proxy/topup";
const AUTH_TOKEN = "1b4b2afd4ef0f22d082ebaf6c327de30ea1b6bcf";

const networkMap = {
    "1": "MTN",
    "2": "GLO",
    "3": "9MOBILE",
    "4": "AIRTEL",
};

const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
if (!userId) {
    alert("User not authenticated. Please log in again.");
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


// async function updateBalance(amount) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/${userId}/Balance`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ amount: -amount }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error("Response Error:", errorData.message);
//             throw new Error(errorData.message || "Failed to update balance.");
//         }

//         const data = await response.json();
//         if (data.success) {
//             console.log("Balance updated successfully. Remaining Balance:", data.balance);
//             return { success: true, balance: data.balance };
//         } else {
//             throw new Error(data.message || "Balance update failed.");
//         }
//     } catch (error) {
//         console.error("Error updating balance:", error.message);
//         alert("Failed to update balance. Please try again.");
//         return { success: false, message: error.message };
//     }
// }



// buy airtime function

// async function buyAirtime(networkId, amount, phone) {
//     try {
//         const balanceCheck = await checkBalance(amount);
//         if (!balanceCheck.success) {
//             alert(balanceCheck.message);
//             return;
//         }

//         const response = await fetch(AIRTIME_API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Token ${AUTH_TOKEN}`,
//             },
//             body: JSON.stringify({
//                 network: networkId,
//                 amount,
//                 mobile_number: phone,
//                 Ported_number: true,
//                 airtime_type: "VTU",
//             }),
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("Response Error:", errorText);
//             await saveAirtimeTransaction(networkId, amount, phone, "failed");
//             throw new Error("Failed to process airtime purchase.");
//         }

//         const data = await response.json();
//         console.log("Airtime Purchase Response:", data);

//         await saveAirtimeTransaction(networkId, amount, phone, "success");
//         await updateBalance(-amount);
//         alert(
//             "🎉 Wow! 🎉\nYou’ve successfully purchased airtime using EazyNaijaPay Bot! 💚\nWe’ll be expecting you again! 😊"
//         );
        
//     } catch (error) {
//         console.error("Error processing airtime purchase:", error);
//         alert("Airtime purchase failed. Please try again.");
//     }
// }



async function buyAirtime(networkId, amount, phone) {
    try {
        const balanceCheck = await checkBalance(amount);
        if (!balanceCheck.success) {
            alert(balanceCheck.message);
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
            await saveAirtimeTransaction(networkId, amount, phone, "failed"); // Log failed transaction
            throw new Error("Failed to process airtime purchase.");
        }

        const data = await response.json();
        console.log("Airtime Purchase Response:", data);

        await saveAirtimeTransaction(networkId, amount, phone, "success"); // Log successful transaction
        await updateBalance(-amount);
        alert(
            "🎉 Wow! 🎉\nYou’ve successfully purchased airtime using EazyNaijaPay Bot! 💚\nWe’ll be expecting you again! 😊"
        );
        
    } catch (error) {
        console.error("Error processing airtime purchase:", error);
        alert("Airtime purchase failed. Please try again.");
    }
}

// Function to save airtime transaction history
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
        alert("Please fill in all fields correctly.");
        return;
    }

    const isPinValid = await validatePin(pin);
    if (!isPinValid) {
        alert("Invalid PIN. Please try again.");
        return;
    }

    await buyAirtime(network, amount, phone);
});



//Adding transaction histories




// Function to update balance after a successful airtime purchase
async function updateBalance(userId, amount) {
    try {
        console.log("🔄 Deducting balance for airtime purchase:", amount);

        const response = await fetch(`${API_BASE_URL}/${userId}/deduct_balance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }), // Amount is already negative
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