document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("passwordResetModal");
    const openModal = document.querySelector(".change-pin");
    const closeModal = document.querySelector(".close");
    const saveButton = document.getElementById("savePassword");
  
    // Open modal when "Change Password" is clicked
    openModal.addEventListener("click", function () {
      modal.style.display = "block";
    });
  
    // Close modal when "×" is clicked
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    // Close modal when clicking outside modal content
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  
    // Handle Save Password button click
    saveButton.addEventListener("click", async function () {
      const newPassword = document.getElementById("newPassword").value;
      const user_id = localStorage.getItem("user_id"); // Get user_id from localStorage
  
      if (!newPassword) {
        showAlert("Please enter a new password.");
        return;
      }
  
      try {
        const response = await fetch("https://eazynaijapay-server.onrender.com/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user_id, newPassword })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          showAlert("Password changed successfully!");
          modal.style.display = "none";
        } else {
          showAlert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        showAlert("Something went wrong. Please try again.");
      }
    });
  });
  















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
  const alertSound = new Audio("./alert/notification-alert.mp3");
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