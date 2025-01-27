import plans from './plans.js';

const API_BASE_URL = "https://eazynaijapay-server.onrender.com/Verified_Users";
const DATA_API_URL = "https://eazynaijapay-server.onrender.com/proxy/data";
const userId = localStorage.getItem('user_id');

const networkSelect = document.getElementById('network-select');
const preferablePlanSelect = document.getElementById('preferable-plan');
const amountToPay = document.getElementById('amount-to-pay');
const payNowButton = document.getElementById('paynow');

const UserTransaction = require("../models/UserTransaction");


const getPlansByNetworkId = (networkId) => {
  switch (networkId) {
    case '1': return plans.MTN;
    case '2': return plans.GLO;
    case '3': return plans["9MOBILE"];
    case '4': return plans.AIRTEL;
    default: return [];
  }
};

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




// Function to update the user's balance
async function updateBalance(amount) {
  try {
    console.log("Updating balance with amount:", amount);

    const response = await fetch(`${API_BASE_URL}/${userId}/Balance`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update balance.");
    }

    const data = await response.json();

    console.log("Balance successfully updated:", data.balance);
    return { success: true, balance: data.balance };
  } catch (error) {
    console.error("Error updating balance:", error.message);
    return { success: false, message: error.message };
  }
}









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




async function saveDataTransaction(networkId, planId, amount, phone, status, userId) {
  try {
    const transactionData = {
      networkId,
      planId,
      amount,
      phone,
      status,
      type: "data", // Mark this as a data transaction
    };

    // Upsert: Add a new transaction under the user's transactions
    const result = await UserTransaction.findOneAndUpdate(
      { User_id: userId },
      { $push: { transactions: transactionData } }, // Add the transaction
      { upsert: true, new: true } // Create if doesn't exist
    );

    console.log("Data transaction saved:", result);
  } catch (error) {
    console.error("Error saving data transaction:", error);
  }
}

module.exports = { saveDataTransaction };














networkSelect.addEventListener('change', () => {
  const selectedNetworkId = networkSelect.value;
  preferablePlanSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';

  const selectedPlans = getPlansByNetworkId(selectedNetworkId);

  selectedPlans.forEach(plan => {
    const option = document.createElement('option');
    option.value = plan.plan_id;
    option.textContent = `${plan.type} - ${plan.size} (${plan.amount})`;
    preferablePlanSelect.appendChild(option);
  });
});

preferablePlanSelect.addEventListener('change', (e) => {
  const selectedPlanId = e.target.value;
  const selectedNetworkId = networkSelect.value;

  const selectedPlans = getPlansByNetworkId(selectedNetworkId);
  const selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);

  if (selectedPlan) {
    amountToPay.value = selectedPlan.amount.replace("₦", "");
  }
});

payNowButton.addEventListener('click', async () => {
  const selectedNetworkId = networkSelect.value;
  const selectedPlanId = preferablePlanSelect.value;
  const phoneNumber = document.getElementById('phone-number').value;
  const pin = `${document.getElementById('pin1').value}${document.getElementById('pin2').value}${document.getElementById('pin3').value}${document.getElementById('pin4').value}`;

  if (!selectedNetworkId || !selectedPlanId || !phoneNumber || !pin) {
    showAlert('Please complete all the fields and select a plan');
    return;
  }

  if (pin.length !== 4) {
    showAlert('Pin must be a 4-digit number.');
    return;
  }

  try {
    const pinResponse = await fetch(`${API_BASE_URL}/${userId}`);
    if (!pinResponse.ok) throw new Error("Error validating user information.");

    const pinData = await pinResponse.json();
    if (pinData.user.User_pin.trim() !== pin.trim()) {
      showAlert('Invalid Pin');
      return;
    }

    const selectedPlans = getPlansByNetworkId(selectedNetworkId);
    const selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);

    if (!selectedPlan) {
      showAlert('Selected plan not found.');
      return;
    }

    const amount = parseFloat(selectedPlan.amount.replace('₦', '').trim());

    const balanceCheck = await checkBalance(amount);
    if (!balanceCheck.success) {
      showAlert(balanceCheck.message);
      return;
    }

    const requestBody = {
      network: selectedNetworkId,
      mobile_number: phoneNumber,
      plan: selectedPlanId,
      Ported_number: true,
    };

    const response = await fetch(DATA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (responseData.Status && responseData.Status.toLowerCase() === 'successful') {
      await updateBalance(amount);
      await saveDataTransaction(selectedNetworkId, selectedPlanId, amount, phoneNumber, 'successful');
      showAlert('Data purchase successful: ' + responseData.api_response);
    } else {
      await saveDataTransaction(selectedNetworkId, selectedPlanId, amount, phoneNumber, 'failed');
      showAlert('Failed to purchase data: ' + (responseData.api_response || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error processing data purchase:', error);
    showAlert('Error occurred. Please try again later.');
  }
});













// import plans from './plans.js';

// const networkSelect = document.getElementById('network-select');
// const preferablePlanSelect = document.getElementById('preferable-plan');
// const amountToPay = document.getElementById('amount-to-pay');
// const payNowButton = document.getElementById('paynow');

// let userId = localStorage.getItem('user_id');

// const getPlansByNetworkId = (networkId) => {
//   switch (networkId) {
//     case '1': return plans.MTN;
//     case '2': return plans.GLO;
//     case '3': return plans["9MOBILE"];
//     case '4': return plans.AIRTEL;
//     default: return [];
//   }
// };

// // Populate plan options based on selected network
// networkSelect.addEventListener('change', () => {
//   const selectedNetworkId = networkSelect.value;
//   preferablePlanSelect.innerHTML = '<option value="" disabled selected>Choose your desired plan</option>';

//   const selectedPlans = getPlansByNetworkId(selectedNetworkId);

//   selectedPlans.forEach(plan => {
//     const option = document.createElement('option');
//     option.value = plan.plan_id;
//     option.textContent = `${plan.type} - ${plan.size} (${plan.amount})`;
//     preferablePlanSelect.appendChild(option);
//   });
// });

// // Update amount field when a plan is selected
// preferablePlanSelect.addEventListener('change', (e) => {
//   const selectedPlanId = e.target.value;
//   const selectedNetworkId = networkSelect.value;

//   const selectedPlans = getPlansByNetworkId(selectedNetworkId);
//   const selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);

//   if (selectedPlan) {
//     amountToPay.value = selectedPlan.amount.replace("₦", "");
//   }
// });

// // Handle the "Pay Now" button click event
// payNowButton.addEventListener('click', () => {
//   const selectedNetworkId = networkSelect.value;
//   const selectedPlanId = preferablePlanSelect.value;
//   const phoneNumber = document.getElementById('phone-number').value;
//   const pin = `${document.getElementById('pin1').value}${document.getElementById('pin2').value}${document.getElementById('pin3').value}${document.getElementById('pin4').value}`;

//   if (!selectedNetworkId || !selectedPlanId || !phoneNumber || !pin) {
//     alert('Please complete all the fields and select a plan');
//     return;
//   }

//   if (pin.length !== 4) {
//     alert('Pin must be a 4-digit number.');
//     return;
//   }

//   fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`)
//     .then(response => response.json())
//     .then(data => {
//       if (!data.success) {
//         alert('Error validating user information.');
//         return;
//       }

//       if (data.user.User_pin.trim() !== pin.trim()) {
//         alert('Invalid Pin');
//         return;
//       }

//       fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}/Balance`)
//         .then(response => response.json())
//         .then(balanceData => {
//           if (!balanceData.success) {
//             console.error('Error fetching balance:', balanceData.message);
//             alert('Error fetching balance. Please try again later.');
//             return;
//           }

//           const userBalance = balanceData.balance;
//           const selectedPlans = getPlansByNetworkId(selectedNetworkId);
//           const selectedPlan = selectedPlans.find(plan => plan.plan_id == selectedPlanId);

//           if (!selectedPlan) {
//             alert('Selected plan not found.');
//             return;
//           }

//           const amount = parseFloat(selectedPlan.amount.replace('₦', '').trim());

//           if (userBalance < amount) {
//             alert('Insufficient balance');
//             return;
//           }

//           const requestBody = {
//             network: selectedNetworkId,
//             mobile_number: phoneNumber,
//             plan: selectedPlanId,
//             Ported_number: true
//           };

//           console.log('Payload:', requestBody);

//           fetch('https://eazynaijapay-server.onrender.com/proxy/data', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(requestBody)
//           })
//             .then(response => response.json())
//             .then(responseData => {
//               console.log('API Response:', responseData);

//               if (responseData.Status && responseData.Status.toLowerCase() === 'successful') {
//                 alert('Data purchase successful: ' + responseData.api_response);
//               } else {
//                 alert('Failed to purchase data: ' + (responseData.api_response || 'Unknown error'));
//               }
//             })
//             .catch(error => {
//               console.error('Error processing data purchase:', error);
//               alert('Error occurred. Please try again later.');
//             });
//         })
//         .catch(error => {
//           console.error('Error fetching balance:', error);
//           alert('Error fetching balance. Please try again later.');
//         });
//     })
//     .catch(error => {
//       console.error('Error validating pin:', error);
//       alert('Error validating pin. Please try again later.');
//     });
// });
