document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://eazynaijapay-server.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(data.message);

      const userResponse = await fetch('https://eazynaijapay-server.onrender.com/Verified_Members');
      const users = await userResponse.json();

      const loggedInUser = users.find(user => user.username === username);

      if (loggedInUser) {
        localStorage.setItem('user_id', loggedInUser.user_id);
        console.log('Logged-in user ID saved to local storage:', loggedInUser.user_id);

        window.location.href = 'pages/Dashboard.html';
      } else {
        console.error('User not found in verified members:', username);
        showAlert('User not found in verified members.');
      }
    } else {
      console.error('Login failed:', data.message);
      showAlert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    showAlert('An error occurred. Please try again.');
  }
});


// Toggle Password Visibility
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.querySelector('.eye-icon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.innerHTML = '&#128065;';
  } else {
    passwordInput.type = 'password';
    eyeIcon.innerHTML = '&#128065;';
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
