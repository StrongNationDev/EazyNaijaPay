document.addEventListener('DOMContentLoaded', async () => {
  const termsModal = document.getElementById('termsModal');
  const pinModal = document.querySelector('.popup-overlay');
  const agreeButton = document.querySelector('.modal-buttons button:first-child');

  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('User ID not found. Please log in again.');
    window.location.href = '../index.html';
    return;
  }

  console.log("Checking PIN status for user:", userId);

  let isPinSet = false;

  try {
    // Fetch user's PIN from the server
    const response = await fetch(`http://localhost:3000/Verified_Members/${userId}/pin`);
    if (response.ok) {
      const data = await response.json();
      isPinSet = data.pin && data.pin !== ""; // If PIN exists and is not empty
    } else {
      console.error('Failed to fetch PIN status:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching PIN:', error);
  }

  console.log("isPinSet (from API):", isPinSet);

  if (!isPinSet) {
    // Show Terms Modal first
    termsModal.style.display = 'block';
  }

  // Agree to Terms - Then Show PIN Modal
  agreeButton.addEventListener('click', () => {
    termsModal.style.display = 'none'; // Close Terms Modal
    if (!isPinSet) {
      pinModal.style.display = 'block'; // Show PIN Modal
    }
  });

  // Disagree with Terms
  document.querySelector('.modal-buttons button:last-child').addEventListener('click', () => {
    termsModal.style.display = 'none';
    alert('You need to agree to the terms to use the dashboard.');
    window.location.href = '../index.html';
  });
});



// document.addEventListener('DOMContentLoaded', async () => {
//   const termsModal = document.getElementById('termsModal');
//   const pinModal = document.querySelector('.popup-overlay');
//   const pinInputs = document.querySelectorAll('.pin-input');
//   const continueButton = document.querySelector('.btn');

//   const userId = localStorage.getItem('user_id');
//   if (!userId) {
//     showAlert('User ID not found. Please log in again.');
//     window.location.href = '../index.html';
//     return;
//   }

//   console.log("isFirstLogin:", localStorage.getItem('isFirstLogin'));
//   console.log("isPinSet:", localStorage.getItem('isPinSet'));

//   const isFirstLogin = localStorage.getItem('isFirstLogin') !== 'false';
//   const isPinSet = localStorage.getItem('isPinSet') === 'true';

//   if (isPinSet) {
//     pinModal.style.display = 'none';
//     console.log("PIN is already set, hiding PIN modal.");
//   }

//   if (isFirstLogin) {
//     console.log("Showing terms modal...");
//     termsModal.style.display = 'block';
//   } else if (!isPinSet) {
//     console.log("Showing PIN modal...");
//     pinModal.style.display = 'block';
//   }

//   // Agree to Terms
//   document.querySelector('.modal-buttons button:first-child').addEventListener('click', () => {
//     termsModal.style.display = 'none';
//     localStorage.setItem('isFirstLogin', 'false');
//     pinModal.style.display = 'block';
//   });

//   // Disagree with Terms
//   document.querySelector('.modal-buttons button:last-child').addEventListener('click', () => {
//     termsModal.style.display = 'none';
//     showAlert('You need to agree to the terms to use the dashboard.');
//     window.location.href = '../index.html';
//   });

//   // Handle Set PIN
//   continueButton.addEventListener('click', async () => {
//     const pin = Array.from(pinInputs).map(input => input.value).join('');
//     if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
//       showAlert('Please enter a valid 4-digit PIN.');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3000/verified_Members/${userId}/set-pin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ pin }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         showAlert(data.message);
//         pinModal.style.display = 'none';
//         localStorage.setItem('isPinSet', 'true');

//         console.log("PIN successfully set. isPinSet:", localStorage.getItem('isPinSet'));
//       } else {
//         showAlert(data.message);
//       }
//     } catch (error) {
//       console.error('Error setting PIN:', error);
//       showAlert('Failed to set PIN. Please try again later.');
//     }
//   });
// });













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