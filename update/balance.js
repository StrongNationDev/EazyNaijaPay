async function updateBalance() {
    const userId = localStorage.getItem('user_id');
  
    if (!userId) {
      console.warn('User ID not found. Redirecting to login page.');
      showAlert('You are not logged in. Redirecting to the login page.');
      window.location.href = '../index.html'; 
      return;
    }
  
    try {
      const apiUrl = `https://eazynaijapay-server.onrender.com/Verified_Members/${userId}/balance`;
  
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch balance. Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const balanceElement = document.getElementById('balance');
      balanceElement.textContent = `${data.balance} NGN`;
    } catch (error) {
      console.error('Error fetching balance:', error);
      showAlert('Failed to fetch balance. Please try again later.');
    }
  }
  
  document.addEventListener('DOMContentLoaded', updateBalance);
  




  

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