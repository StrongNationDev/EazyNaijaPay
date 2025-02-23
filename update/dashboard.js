document.addEventListener('DOMContentLoaded', async () => {
  const termsModal = document.getElementById('termsModal');
  const pinModal = document.querySelector('.popup-overlay');
  const agreeButton = document.querySelector('.modal-buttons button:first-child');
  const disagreeButton = document.querySelector('.modal-buttons button:last-child');
  const continueButton = document.querySelector('.btn');
  const pinInputs = document.querySelectorAll('.pin-input');

  const userId = localStorage.getItem('user_id');
  if (!userId) {
    showAlert('User ID not found. Please log in again.');
    window.location.href = '../index.html';
    return;
  }

  console.log("Checking PIN status for user:", userId);

  let isPinSet = false;

  try {
    const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Members/${userId}/pin`);
    if (response.ok) {
      const data = await response.json();
      isPinSet = data.pin && data.pin !== "";
    } else {
      console.error('Failed to fetch PIN status:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching PIN:', error);
  }

  console.log("isPinSet (from API):", isPinSet);

  if (!isPinSet) {
    termsModal.style.display = 'block';
  }

  agreeButton.addEventListener('click', () => {
    termsModal.style.display = 'none';
    if (!isPinSet) {
      pinModal.style.display = 'block';
    }
  });

  disagreeButton.addEventListener('click', () => {
    termsModal.style.display = 'none';
    showAlert('You need to agree to the terms to use the dashboard.');
    window.location.href = '../index.html';
  });

  // Handle PIN Submission
  continueButton.addEventListener('click', async () => {
    const pin = Array.from(pinInputs).map(input => input.value).join('');

    if (pin.length !== 4 || isNaN(pin)) {
      showAlert('Please enter a valid 4-digit PIN.');
      return;
    }

    try {
      const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Members/${userId}/set-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      if (response.ok) {
        showAlert('PIN set successfully!');
        pinModal.style.display = 'none';
      } else {
        showAlert('Failed to set PIN. Please try again.');
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      showAlert('An error occurred. Please try again.');
    }
  });
});

// Function to show alert
function showAlert(message) {
  alert(message);
}













// Alerting users with notification function

function showAlert(message) {
  const existingAlert = document.getElementById("custom-alert");
  if (existingAlert) {
      existingAlert.remove();
  }

  const alertBox = document.createElement("div");
  alertBox.id = "custom-alert";
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

    const alertSound = new Audio("../pages/alert/notification-alert.mp3");
    alertSound.play();

  setTimeout(() => {
      alertBox.classList.add("show");
  }, 100);

  setTimeout(() => {
      alertBox.classList.remove("show");
      setTimeout(() => alertBox.remove(), 500);
  }, 3000);
}