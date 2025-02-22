document.addEventListener('DOMContentLoaded', () => {
    const verifyPaymentButton = document.getElementById('adminDM');
    const fileInput = document.getElementById('transactionScreenshot');

    verifyPaymentButton.addEventListener('click', async () => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            showAlert('User ID not found. Please log in again.');
            return;
        }


        const file = fileInput.files[0];
        if (!file) {
            showAlert('Please upload a screenshot of your transaction.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('chat_id', '-1002418893054');
            formData.append('caption', `User ID: ${userId}\nPayment Verification Screenshot`);
            formData.append('photo', file);

            const botToken = '8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA';
            const telegramAPI = `https://api.telegram.org/bot${botToken}/sendPhoto`;

            const response = await fetch(telegramAPI, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.ok) {
                showAlert('Your account top-up is in progress, please wait while the admin confirms the transaction.');
            } else {
                showAlert('Failed to send verification. Please try again later.');
            }
        } catch (error) {
            console.error('Error uploading screenshot:', error);
            showAlert('An error occurred while sending the verification. Please try again.');
        }
    });
});




document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("transactionModal").style.display = "flex";
  });
  
  function closeModal() {
    document.getElementById("transactionModal").style.display = "none";
  }
  

function copyAccountNumber() {
    const accountNumber = document.getElementById("Account_number").innerText;

    const tempInput = document.createElement("textarea");
    tempInput.value = accountNumber;
    document.body.appendChild(tempInput);

    tempInput.select();
    document.execCommand("copy");

    document.body.removeChild(tempInput);

    showAlert("Account number copied: " + accountNumber);
  }





// Alert
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