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
      const response = await fetch(`http://localhost:3000/Verified_Members/${userId}/transaction_histories`);
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
                  <p>${history.type === 'data' ? `You bought ${history.amount} NGN worth of data` : `You funded your account with ${history.amount} NGN`}</p>
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
