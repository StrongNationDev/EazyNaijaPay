document.addEventListener('DOMContentLoaded', () => {
    const terminateButton = document.querySelector('.terminate');
  
    terminateButton.addEventListener('click', () => {
      const userId = localStorage.getItem('user_id');
  
      if (!userId) {
        showAlert('User ID is missing. Please log in again.');
        window.location.href = 'https://t.me/EazyNaijaPayBot';
        return;
      }
  
      // Show a confirmation popup
      const confirmation = confirm('Are you sure you want to terminate your account? This action cannot be undone.');
  
      if (confirmation) {
        // Send a DELETE request to the server
        fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              showAlert('Your account has been terminated successfully.');
              // Clear localStorage and redirect the user
              localStorage.clear();
              window.location.href = 'https://t.me/EazyNaijaPayBot';
            } else {
              showAlert(`Failed to terminate account: ${data.message}`);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred while terminating your account. Please try again later.');
          });
      }
    });
  });















  document.addEventListener('DOMContentLoaded', () => {
    // Create the popup dynamically
    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('popup-overlay');

    popupOverlay.innerHTML = `
        <div class="popup-content">
            <button class="close-popup">×</button>
            <p>For you to change your pin, you have to reach out to the Administrator.</p>
            <button onclick="window.open('https://t.me/Enochs_world', '_blank')">Chat Admin</button>
        </div>
    `;

    document.body.appendChild(popupOverlay);

    // Get the "Change Pin" button
    const changePinButton = document.querySelector('.change-pin');

    // Show the popup when "Change Pin" is clicked
    changePinButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        popupOverlay.style.display = 'flex'; // Show the popup
    });

    // Close the popup
    const closePopupButton = popupOverlay.querySelector('.close-popup');
    closePopupButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none'; // Hide the popup
    });

    // Hide popup when clicking outside the popup content
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });
});
