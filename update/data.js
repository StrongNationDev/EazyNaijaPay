const API_BASE_URL = "http://localhost:3000/Verified_Members";
const DATA_API_URL = "https://eazynaijapay-server.onrender.com/proxy/data";
// const AUTH_TOKEN = "8f00fa816b1e3b485baca8f44ae5d361ef803311";
const AUTH_TOKEN = "4e1232989bd072dc935c84de444f64025ce874f4";



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

// async function validatePin(pin)
async function validatePin(pin) {
    try {
        console.log(`Validating PIN for: ${userId}`);
        const response = await fetch(`${API_BASE_URL}/${userId}/pin`);
        
        if (!response.ok) {
            console.error("Failed to fetch PIN:", response.status);
            return false;
        }

        const data = await response.json();
        console.log("PIN from API:", data.pin);

        return data.pin === pin;
    } catch (error) {
        console.error("Error validating PIN:", error);
        return false;
    }
}

// Check user balance
async function checkBalance(amount) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}/Balance`);
        if (!response.ok) throw new Error("Failed to check balance.");

        const data = await response.json();
        const currentBalance = data.balance;

        return currentBalance >= amount
            ? { success: true, currentBalance }
            : { success: false, message: "❌ You do not have enough funds in your balance." };
    } catch (error) {
        console.error("Error checking balance:", error);
        return { success: false, message: "⚠️ Error checking balance. Please try again." };
    }
}








// Balance updater



async function updateBalance(amount) {
    try {
        const userId = localStorage.getItem("user_id"); // ✅ Fix: Correct key.
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




async function buyData(networkId, planId, phone) {
    try {
        const amount = parseFloat(localStorage.getItem("amountToPay")); // Get retrieved amount
        if (!amount || isNaN(amount) || amount <= 0) {
            showAlert("⚠️ Invalid transaction amount. Please try again.");
            return;
        }

        const balanceCheck = await checkBalance(amount);
        if (!balanceCheck.success) {
            showAlert(balanceCheck.message);
            return;
        }

        const response = await fetch(DATA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                network: networkId,
                mobile_number: phone,
                plan: planId,
                Ported_number: true
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response Error:", errorText);
            await saveDataTransaction(networkId, planId, phone, "failed");
            throw new Error("❌ Failed to process data purchase.");
        }

        const data = await response.json();
        console.log("✅ Data Purchase Response:", data);

        if (data.Status.toLowerCase() === "successful") {
            console.log(`✅ Data purchase successful. Deducting: ${amount}`);

            await updateBalance(amount); // Deduct "Retrieved amount" instead of API plan amount
            showAlert(`✅ Success! You’ve purchased ${data.plan_name} for ${phone} 🚀`);

            await saveDataTransaction(networkId, planId, phone, "success");
        } else {
            console.warn("⚠️ Data purchase was not successful. User not charged.");
        }
        
    } catch (error) {
        console.error("Error processing data purchase:", error);
        showAlert("⚠️ Data purchase failed. Please try again.");
    }
}






// async function buyData(networkId, planId, phone) {
//     try {
//         const amount = await getPlanPrice(planId);
//         const balanceCheck = await checkBalance(amount);
//         if (!balanceCheck.success) {
//             showAlert(balanceCheck.message);
//             return;
//         }

//         const response = await fetch(DATA_API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Token ${AUTH_TOKEN}`,
//             },
//             body: JSON.stringify({
//                 network: networkId,
//                 mobile_number: phone,
//                 plan: planId,
//                 Ported_number: true
//             }),
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("Response Error:", errorText);
//             await saveDataTransaction(networkId, planId, phone, "failed");
//             throw new Error("❌ Failed to process data purchase.");
//         }

//         const data = await response.json();
//         console.log("✅ Data Purchase Response:", data);

//         if (data.Status.toLowerCase() === "successful") {
//             const planAmount = parseFloat(data.plan_amount); // Ensure it's a number
            
//             if (!isNaN(planAmount)) {
//                 await updateBalance(planAmount); // Deduct the amount
//                 showAlert(`✅ Success! You’ve purchased ${data.plan_name} for ${phone} 🚀`);
//             } else {
//                 console.error("❌ Invalid plan amount received:", data.plan_amount);
//             }

//             await saveDataTransaction(networkId, planId, phone, "success");
//         } else {
//             console.warn("⚠️ Data purchase was not successful.");
//         }
        
//     } catch (error) {
//         console.error("Error processing data purchase:", error);
//         showAlert("⚠️ Data purchase failed. Please try again.");
//     }
// }












document.getElementById("paynow").addEventListener("click", async (event) => {
    event.preventDefault(); 

    const network = document.getElementById("network-select").value;
    const phone = document.getElementById("phone-number").value.trim();
    const planId = document.getElementById("preferable-plan").value;

    const pin = [
        document.getElementById("pin1").value,
        document.getElementById("pin2").value,
        document.getElementById("pin3").value,
        document.getElementById("pin4").value,
    ].join("");

    if (!network || !phone || !planId || pin.length !== 4) {
        showAlert("Please fill in all fields correctly.");
        return;
    }

    // Validate PIN before proceeding
    const isPinValid = await validatePin(pin);
    if (!isPinValid) {
        showAlert("❌ Invalid PIN. Please try again.");
        return;
    }

    // If PIN is valid, call buyData()
    await buyData(network, planId, phone);
});


// working with fetchplan codes
async function getPlanPrice(planId) {
    const planDropdown = document.getElementById("preferable-plan");
    const selectedOption = planDropdown.options[planDropdown.selectedIndex];

    if (!selectedOption) {
        console.error("No plan selected.");
        return 0;
    }
    return parseFloat(selectedOption.getAttribute("data-price")) || 0;
}

//Updating of transaction histories
document.addEventListener("DOMContentLoaded", () => {
    const verifyPinButton = document.getElementById("verifypin");
    const payNowButton = document.getElementById("paynow");
    const closeModalButton = document.getElementById("closeModal");
    const modal = document.getElementById("paymentModal");

    verifyPinButton.addEventListener("balanceCheckedSuccess", async () => {
        const pin = [...document.querySelectorAll(".pin-input")].map(input => input.value).join("");

        if (pin.length !== 4) {
            showAlert("Please enter a 4-digit PIN.");
            return;
        }

        const isValid = await validatePin(pin);
        if (!isValid) {
            showAlert("❌ Invalid PIN. Please try again.");
            return;
        }

        try {
            document.getElementById("selected-network").innerText =
                networkMap[document.getElementById("network-select").value];
            document.getElementById("selected-plan").innerText =
                document.getElementById("preferable-plan").selectedOptions[0].text;
            document.getElementById("selected-phone").innerText =
                document.getElementById("phone-number").value;

            modal.style.display = "block";
        } catch (error) {
            showAlert("⚠️ Error processing request. Please try again.");
            console.error(error);
        }
    });

    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    payNowButton.addEventListener("click", async () => {
        showAlert("Processing payment...");
        modal.style.display = "none";
    
        const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
        if (!userId) {
            showAlert("User not authenticated. Please log in.");
            return;
        }
    
        const amount = parseFloat(localStorage.getItem("amountToPay")); // Fetch amount from localStorage
        const phone = document.getElementById("phone-number").value.trim();
        const network = document.getElementById("network-select").value;
        const planId = document.getElementById("preferable-plan").value;
        console.log("Retrieved amount:", amount);
    
        if (!amount || isNaN(amount) || amount <= 0) {
            console.error("❌ Invalid transaction amount:", amount);
            showAlert("⚠️ Invalid transaction amount. Please try again.");
            return;
        }
    
        try {
            const response = await processPayment(network, planId, phone, amount);
            console.log("✅ Payment Response:", response);
    
            const transactionData = {
                transaction_id: `trans_${Date.now()}`,
                type: "data",
                amount: amount,  // Ensure the correct amount is stored
                status: "success",
                created_at: new Date().toISOString()
            };
            await addTransactionHistory(userId, transactionData);
    
            showAlert("✅ Success! Data purchased successfully.");
        } catch (error) {
            console.error("Error processing data purchase:", error);
    
            const transactionData = {
                transaction_id: `trans_${Date.now()}`,
                type: "data",
                amount: amount,  // Ensure the correct amount is stored
                status: "failed",
                created_at: new Date().toISOString()
            };
            await addTransactionHistory(userId, transactionData);
    
            showAlert("⚠️ Data purchase failed. Please try again.");
        }
    }); 

});

// Function to save transaction histories
async function addTransactionHistory(userId, transactionData) {
    try {
        console.log("📤 Sending Transaction:", transactionData);
        console.log("🔍 User ID for request:", userId);

        const response = await fetch(`http://localhost:3000/Verified_Members/${userId}/transaction_histories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionData),
        });

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            console.error(`❌ Server responded with status: ${response.status}`);
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // Check if response is JSON
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            console.log("📌 Transaction saved:", result);
        } else {
            const textResponse = await response.text();
            console.error("❌ Unexpected Response (Not JSON):", textResponse);
        }
    } catch (error) {
        console.error("❌ Error saving transaction:", error);
    }
}

async function processPayment(network, planId, phone, amount) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve({ success: true });
            } else {
                reject(new Error("Payment failed"));
            }
        }, 2000);
    });
}








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