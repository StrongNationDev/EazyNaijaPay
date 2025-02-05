document.addEventListener("DOMContentLoaded", () => {
    const verifyPinButton = document.getElementById("verifypin");
    const amountField = document.getElementById("amount-to-pay");

    verifyPinButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
        if (!userId) {
            alert("User not authenticated. Please log in.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/Verified_Members/${userId}/balance`);
            if (!response.ok) throw new Error("Failed to fetch balance.");

            const data = await response.json();
            const userBalance = parseFloat(data.balance) || 0; 
            

            let amountToPay = amountField.value.trim();
            console.log("Raw Amount to Pay (from input):", amountToPay);
            
            amountToPay = amountToPay.replace(/[^\d.-]/g, "");
            console.log("Cleaned Amount to Pay:", amountToPay); 
            
            if (!amountToPay || isNaN(amountToPay)) {
                alert("⚠️ Amount to pay is invalid. Please refresh the page.");
                return;
            }

            amountToPay = parseFloat(amountToPay);
            console.log("Parsed Amount to Pay:", amountToPay);

            // Check if the user has enough balance
            console.log(`Balance: ${userBalance}, Amount to Pay: ${amountToPay}`);

            if (userBalance >= amountToPay) {
                console.log("✅ Balance is enough. Proceeding...");
                verifyPinButton.dispatchEvent(new CustomEvent("balanceCheckedSuccess"));
            } else {
                console.log("❌ Balance is NOT enough!");
                alert("❌ Insufficient balance. Please fund your account.");
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            alert("⚠️ Error checking balance. Try again later.");
        }
    });
});
