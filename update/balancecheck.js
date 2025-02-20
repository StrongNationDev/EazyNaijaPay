document.addEventListener("DOMContentLoaded", () => {
    const verifyPinButton = document.getElementById("verifypin");
    const amountField = document.getElementById("amount-to-pay");

    verifyPinButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
        if (!userId) {
            showAlert("User not authenticated. Please log in.");
            return;
        }

        try {
            const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Members/${userId}/balance`);
            if (!response.ok) throw new Error("Failed to fetch balance.");

            const data = await response.json();
            const userBalance = parseFloat(data.balance) || 0; 
            

            let amountToPay = amountField.value.trim();
            console.log("Raw Amount to Pay (from input):", amountToPay);
            
            amountToPay = amountToPay.replace(/[^\d.-]/g, "");
            console.log("Cleaned Amount to Pay:", amountToPay); 
            
            if (!amountToPay || isNaN(amountToPay)) {
                showAlert("⚠️ Amount to pay is invalid. Please refresh the page.");
                return;
            }

            amountToPay = parseFloat(amountToPay);
            console.log("Parsed Amount to Pay:", amountToPay);

            // Check if the user has enough balance
            console.log(`Balance: ${userBalance}, Amount to Pay: ${amountToPay}`);

            // if (userBalance >= amountToPay) {
            //     console.log("✅ Balance is enough. Proceeding...");
            //     verifyPinButton.dispatchEvent(new CustomEvent("balanceCheckedSuccess"));

            if (userBalance >= amountToPay) {
                console.log("✅ Balance is enough. Proceeding...");
                localStorage.setItem("amountToPay", amountToPay);  // Store amount in localStorage
                verifyPinButton.dispatchEvent(new CustomEvent("balanceCheckedSuccess"));
                        
            } else {
                console.log("❌ Balance is NOT enough!");
                showAlert("❌ Insufficient balance. Please fund your account.");
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            showAlert("⚠️ Error checking balance. Try again later.");
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