function getUserId() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.warn('User ID not found. Please log in again.');
    }
    return userId;
    
  }
  
  function ensureLoggedIn() {
    const userId = getUserId();
    if (!userId) {
      showAlert('You are not logged in. Redirecting to login page.');
      window.location.href = '../index.html'; 
    }
    console.log(`User ID loaded: ${userId}`);
  }

  document.addEventListener('DOMContentLoaded', ensureLoggedIn);
  





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