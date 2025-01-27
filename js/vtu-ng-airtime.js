// Define constants for admin credentials and VTU.ng API endpoint
const ADMIN_USERNAME = "Strongnationdev";
const ADMIN_PASSWORD = "Adeboye200312";
const EBILLS_BASE_URL = "https://vtu.ng/wp-json/api/v1";

document.querySelector("#paynow").addEventListener("click", async () => {
  try {
    const networkDropdown = document.getElementById("network-dropdown");
    const network = networkDropdown.value;
    const phone = document.getElementById("phone-number").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const pinInputs = document.querySelectorAll(".pin-input");
    const userPin = Array.from(pinInputs).map(input => input.value).join("");

    if (!network || !phone || isNaN(amount) || userPin.length !== 4) {
      alert("Please fill all fields correctly.");
      return;
    }

    const userId = localStorage.getItem("user_id") || localStorage.getItem("User_id");
    if (!userId) {
      alert("User ID not found in local storage.");
      return;
    }

    const userResponse = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`);
    const userData = await userResponse.json();

    if (!userData.success) {
      alert("Failed to fetch user details.");
      return;
    }

    const userBalance = userData.user.Balance;
    const storedPin = userData.user.User_pin;

    if (userBalance < amount) {
      alert("Insufficient balance. Please top up your wallet.");
      return;
    }

    if (userPin !== storedPin) {
      alert("Invalid PIN. Please try again.");
      return;
    }

    const apiUrl = `${EBILLS_BASE_URL}/airtime?username=${ADMIN_USERNAME}&password=${ADMIN_PASSWORD}&phone=${phone}&network_id=${network}&amount=${amount}`;

    const airtimeResponse = await fetch(apiUrl, { method: "GET" });
    const airtimeData = await airtimeResponse.json();

    if (airtimeData.code === "success") {
      alert(`Airtime purchase successful: ₦${amount} for ${phone}`);
    } else {
      alert(`Failed to process airtime: ${airtimeData.message}`);
    }
  } catch (error) {
    console.error("Error processing airtime purchase:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
});

function setAmount(value) {
  const amountInput = document.getElementById("amount");
  amountInput.value = value.toFixed(2);
  enableInput(amountInput);
}

function enableInput(input) {
  input.readOnly = false;
}

function disableInput(input) {
  if (!input.value.trim()) {
    input.readOnly = true;
  }
}

function validateAmount(input) {
  const value = parseFloat(input.value);
  if (isNaN(value) || value < 0) {
    input.value = "0.00";
  } else {
    input.value = value.toFixed(2);
  }
}

function moveToNext(current, nextId) {
  if (current.value.length === 1) {
    document.getElementById(nextId).focus();
  }
}
