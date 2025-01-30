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
        alert("Please enter a new password.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user_id, newPassword })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Password changed successfully!");
          modal.style.display = "none";
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    });
  });
  

















// document.addEventListener("DOMContentLoaded", function () {
//     const resetPasswordBtn = document.querySelector(".change-pin");
    
//     resetPasswordBtn.addEventListener("click", function () {
//         const email = prompt("Enter your registered email:");
//         if (!email) return;

//         fetch("http://localhost:3000/request-password-reset", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.message === "Reset token sent") {
//                 const token = prompt("Enter the reset token sent to your email:");
//                 if (!token) return;

//                 const newPassword = prompt("Enter your new password:");
//                 if (!newPassword) return;

//                 fetch("http://localhost:3000/reset-password", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ email, token, newPassword })
//                 })
//                 .then(response => response.json())
//                 .then(result => {
//                     alert(result.message);
//                 })
//                 .catch(error => console.error("Error:", error));
//             } else {
//                 alert(data.message);
//             }
//         })
//         .catch(error => console.error("Error:", error));
//     });
// });
