document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        showAlert(data.message);
        window.location.href = 'index.html';
      } else {
        showAlert(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      showAlert('An error occurred. Please try again.');
    }
  });
  


// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.innerHTML = '&#128065;'; // Change eye icon
    } else {
      passwordInput.type = 'password';
      eyeIcon.innerHTML = '&#128065;'; // Default eye icon
    }
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