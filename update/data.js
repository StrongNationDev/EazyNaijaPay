import { getLoggedInUser } from "../update/auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const payNowBtn = document.getElementById("paynow");
    const networkSelect = document.getElementById("network-select");
    const planSelect = document.getElementById("preferable-plan");
    const phoneNumberInput = document.getElementById("phone-number");
    const amountInput = document.getElementById("amount-to-pay");

    // Get logged-in user
    const user = getLoggedInUser();
    if (!user || !user.user_id) {
        alert("User not logged in. Please log in to continue.");
        return;
    }

    payNowBtn.addEventListener("click", async function () {
        const selectedNetwork = networkSelect.value;
        const selectedPlan = planSelect.value;
        const phoneNumber = phoneNumberInput.value.trim();
        const amount = amountInput.value.trim();
        const pinInputs = document.querySelectorAll(".pin-input");
        
        // Validate input fields
        if (!selectedNetwork || !selectedPlan || !phoneNumber || !amount) {
            alert("Please fill in all required fields.");
            return;
        }

        // Validate PIN
        let pin = "";
        pinInputs.forEach(input => pin += input.value);
        if (pin.length !== 4) {
            alert("Please enter a valid 4-digit PIN.");
            return;
        }

        const payload = {
            user_id: user.user_id,
            network: selectedNetwork,
            plan: selectedPlan,
            mobile_number: phoneNumber,
            amount: amount,
            pin: pin
        };

        try {
            const response = await fetch("http://localhost:5000/proxy/data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log("Data Purchase Response:", result);

            if (response.ok) {
                alert("Data purchase successful!");
            } else {
                alert("Failed to purchase data: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error processing data purchase:", error);
            alert("Error processing request. Please try again.");
        }
    });
});











// Function to save the data transaction
//async function saveDataTransaction(networkId, planId, amount, phone, status) {
//  try {
//    const transactionData = {
//      network: networkId,
//      plan: planId,
//      amount,
//      phone,
//      status,
//      user_id: userId,
//    };

//    console.log("Saving transaction:", transactionData);
//    // You can add a POST request to save the transaction on the server if needed
//  } catch (error) {
//    console.error("Error saving data transaction:", error);
//  }
//}




// async function saveDataTransaction(networkId, planId, amount, phone, status, userId) {
//   try {
//     const transactionData = {
//       networkId,
//       planId,
//       amount,
//       phone,
//       status,
//       type: "data", // Mark this as a data transaction
//     };

//     // Upsert: Add a new transaction under the user's transactions
//     const result = await UserTransaction.findOneAndUpdate(
//       { User_id: userId },
//       { $push: { transactions: transactionData } }, // Add the transaction
//       { upsert: true, new: true } // Create if doesn't exist
//     );

//     console.log("Data transaction saved:", result);
//   } catch (error) {
//     console.error("Error saving data transaction:", error);
//   }
// }

// module.exports = { saveDataTransaction };


