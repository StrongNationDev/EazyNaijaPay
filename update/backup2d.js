const API_BASE_URL = "http://localhost:3000/Verified_Members";
const DATA_API_URL = "http://localhost:5000/proxy/data";
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
    alert("User not authenticated. Please log in again.");
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

// Buy data function



// async function buyData(networkId, planId, phone) {
//     try {
//         // Fetch price based on plan ID (implement this function if needed)
//         const amount = await getPlanPrice(planId);
        
//         const balanceCheck = await checkBalance(amount);
//         if (!balanceCheck.success) {
//             alert(balanceCheck.message);
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
//             throw new Error("Failed to process data purchase.");
//         }

//         const data = await response.json();
//         console.log("Data Purchase Response:", data);

//         await saveDataTransaction(networkId, planId, phone, "success");
//         await updateBalance(-amount);
//         alert("✅ Success! You’ve purchased data using EazyNaijaPay Bot! 🚀");
        
//     } catch (error) {
//         console.error("Error processing data purchase:", error);
//         alert("Data purchase failed. Please try again.");
//     }
// }






// //Validate pin
// document.getElementById("paynow").addEventListener("click", async (event) => {
//     event.preventDefault(); // Prevents accidental multiple submissions

//     const network = document.getElementById("network-select").value;
//     const phone = document.getElementById("phone-number").value.trim();
//     const planId = document.getElementById("preferable-plan").value;

//     const pin = [
//         document.getElementById("pin1").value,
//         document.getElementById("pin2").value,
//         document.getElementById("pin3").value,
//         document.getElementById("pin4").value,
//     ].join("");

//     if (!network || !phone || !planId || pin.length !== 4) {
//         alert("Please fill in all fields correctly.");
//         return;
//     }

//     // Validate PIN before proceeding
//     const isPinValid = await validatePin(pin);
//     if (!isPinValid) {
//         alert("❌ Invalid PIN. Please try again.");
//         return; // Stops further execution
//     }

//     // Proceed with balance check
//     const amount = await getPlanPrice(planId);
//     const balanceCheck = await checkBalance(amount);
//     if (!balanceCheck.success) {
//         alert(balanceCheck.message);
//         return;
//     }

//     // Perform data purchase only if all validations pass
//     try {
//         const response = await fetch(DATA_API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Token ${AUTH_TOKEN}`,
//             },
//             body: JSON.stringify({
//                 network: network,
//                 mobile_number: phone,
//                 plan: planId,
//                 Ported_number: true
//             }),
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("Response Error:", errorText);

//             saveDataTransaction(transactionData); // ⛔ ERROR: Function not defined!
//             function saveDataTransaction(transactionData) {
//                 console.log("✅ Saving transaction:", transactionData);
//                 // Call API or save to local storage
//             }
            
//             await saveDataTransaction(network, planId, phone, "failed");
//             throw new Error("❌ Failed to process data purchase.");
//         }

//         const data = await response.json();
//         console.log("✅ Data Purchase Response:", data);

//         // Update transaction & balance only on success
//         await saveDataTransaction(network, planId, phone, "success");
//         await updateBalance(-amount);

//         alert("✅ Success! Data purchased successfully.");
        
//     } catch (error) {
//         console.error("Error processing data purchase:", error);
//         alert("⚠️ Data purchase failed. Please try again.");
//     }
// });

//function to fetch dataplans in the payload







async function buyData(networkId, planId, phone) {
    try {
        const amount = await getPlanPrice(planId);
        const balanceCheck = await checkBalance(amount);
        if (!balanceCheck.success) {
            alert(balanceCheck.message);
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

        await saveDataTransaction(networkId, planId, phone, "success");
        await updateBalance(-amount);
        alert("✅ Success! You’ve purchased data using EazyNaijaPay Bot! 🚀");
        
    } catch (error) {
        console.error("Error processing data purchase:", error);
        alert("⚠️ Data purchase failed. Please try again.");
    }
}






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
        alert("Please fill in all fields correctly.");
        return;
    }

    // Validate PIN before proceeding
    const isPinValid = await validatePin(pin);
    if (!isPinValid) {
        alert("❌ Invalid PIN. Please try again.");
        return;
    }

    // If PIN is valid, call buyData()
    await buyData(network, planId, phone);
});












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
            alert("Please enter a 4-digit PIN.");
            return;
        }

        const isValid = await validatePin(pin);
        if (!isValid) {
            alert("❌ Invalid PIN. Please try again.");
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
            alert("⚠️ Error processing request. Please try again.");
            console.error(error);
        }
    });

    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    payNowButton.addEventListener("click", async () => {
        alert("Processing payment...");
        modal.style.display = "none";
    
        const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
        if (!userId) {
            alert("User not authenticated. Please log in.");
            return;
        }
    
        const amount = parseFloat(localStorage.getItem("amountToPay")); // Fetch amount from localStorage
        const phone = document.getElementById("phone-number").value.trim();
        const network = document.getElementById("network-select").value;
        const planId = document.getElementById("preferable-plan").value;
        console.log("Retrieved amount:", amount);
    
        if (!amount || isNaN(amount) || amount <= 0) {
            console.error("❌ Invalid transaction amount:", amount);
            alert("⚠️ Invalid transaction amount. Please try again.");
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
    
            alert("✅ Success! Data purchased successfully.");
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
    
            alert("⚠️ Data purchase failed. Please try again.");
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

// // Function to update the user's balance after a successful data purchase
// async function updateBalance(userId, amount) {
//     try {
//       console.log("🔄 Updating balance with amount:", amount);
  
//       const response = await fetch(`http://localhost:3000/Verified_Members/${userId}/deduct_balance`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount }),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to update balance.");
//       }
  
//       const data = await response.json();
  
//       console.log("✅ Balance successfully updated:", data.balance);
//       return { success: true, balance: data.balance };
//     } catch (error) {
//       console.error("❌ Error updating balance:", error.message);
//       return { success: false, message: error.message };
//     }
//   }
  