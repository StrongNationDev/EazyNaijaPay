document.addEventListener('DOMContentLoaded', async () => {
  const termsModal = document.getElementById('termsModal');
  const pinModal = document.querySelector('.popup-overlay');
  const pinInputs = document.querySelectorAll('.pin-input');
  const continueButton = document.querySelector('.btn');

  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('User ID not found. Please log in again.');
    window.location.href = '../index.html';
    return;
  }

  console.log("isFirstLogin:", localStorage.getItem('isFirstLogin'));
  console.log("isPinSet:", localStorage.getItem('isPinSet'));

  const isFirstLogin = localStorage.getItem('isFirstLogin') !== 'false';
  const isPinSet = localStorage.getItem('isPinSet') === 'true';

  if (isPinSet) {
    pinModal.style.display = 'none';
    console.log("PIN is already set, hiding PIN modal.");
  }

  if (isFirstLogin) {
    console.log("Showing terms modal...");
    termsModal.style.display = 'block';
  } else if (!isPinSet) {
    console.log("Showing PIN modal...");
    pinModal.style.display = 'block';
  }

  // Agree to Terms
  document.querySelector('.modal-buttons button:first-child').addEventListener('click', () => {
    termsModal.style.display = 'none';
    localStorage.setItem('isFirstLogin', 'false');
    pinModal.style.display = 'block';
  });

  // Disagree with Terms
  document.querySelector('.modal-buttons button:last-child').addEventListener('click', () => {
    termsModal.style.display = 'none';
    alert('You need to agree to the terms to use the dashboard.');
    window.location.href = '../index.html';
  });

  // Handle Set PIN
  continueButton.addEventListener('click', async () => {
    const pin = Array.from(pinInputs).map(input => input.value).join('');
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      alert('Please enter a valid 4-digit PIN.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/Verified_Members/${userId}/set-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        pinModal.style.display = 'none';
        localStorage.setItem('isPinSet', 'true');

        console.log("PIN successfully set. isPinSet:", localStorage.getItem('isPinSet'));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      alert('Failed to set PIN. Please try again later.');
    }
  });
});


