document.addEventListener('DOMContentLoaded', async () => {
  const activitiesList = document.querySelector('.activities-list');

  // Fetch the logged-in user ID from localStorage
  const userId = localStorage.getItem('user_id');
  if (!userId) {
      console.error('No user ID found. Please log in first.');
      return;
  }

  try {
      // Fetch the transaction histories for the logged-in user
      const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Members/${userId}/transaction_histories`);
      if (!response.ok) {
          throw new Error('Failed to fetch transaction histories');
      }

      const histories = await response.json();

      // Clear existing activities
      activitiesList.innerHTML = '';

      // If no transaction history, show custom message
      if (histories.length === 0) {
          activitiesList.innerHTML = `
              <h1>Hey 👋</h1>
              <p>You are new to EazyNaijaPay and you are yet to buy anything. Start by funding your account and start buying.</p>
          `;
      } else {
          histories.forEach(history => {
              const activityCard = document.createElement('div');
              activityCard.classList.add('activity-card');

              const statusClass = history.status === 'success' ? 'success' : 'failed';
              activityCard.innerHTML = `
                  <h4>${history.type === 'data' ? 'Data Purchase' : 'Top Up'} ${history.status === 'success' ? 'Successful' : 'Failed'}</h4>
                  <p>${history.type === 'data' ? `You bought ${history.amount} NGN worth of data` : `You have bought ${history.amount} NGN Airtime`}</p>
                  <span>${new Date(history.created_at).toLocaleDateString()} ${new Date(history.created_at).toLocaleTimeString()}</span>
                  <span id="ref">Transaction ID: ${history._id}</span>
              `;
              activityCard.classList.add(statusClass);

              activitiesList.appendChild(activityCard);
          });
      }
  } catch (error) {
      console.error('Error fetching transaction histories:', error);
      activitiesList.innerHTML = '<p>Unable to fetch recent activities. Please try again later.</p>';
  }
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