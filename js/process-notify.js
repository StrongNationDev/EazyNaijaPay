document.addEventListener('DOMContentLoaded', () => {
    // Retrieve user_id from localStorage
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      showAlert('User ID is missing. Please log in again.');
      window.location.href = 'https://t.me/EazyNaijaPayBot'; // Redirect if user_id is not found
      return;
    }
  
    // Endpoint to fetch the user's transaction history
    const transactionsEndpoint = `https://eazynaijapay-server.onrender.com/Verified_Users/${user_id}/Transaction`;
  
    fetch(transactionsEndpoint)
      .then(response => response.json())
      .then(data => {
        const activitiesList = document.querySelector('.activities-list');
        if (data.success && data.transactions.length > 0) {
          // If there are transactions, loop through and display up to the 4 most recent
          const transactions = data.transactions.slice(0, 4);
          activitiesList.innerHTML = ''; // Clear the existing activities (if any)
  
          transactions.forEach(transaction => {
            const activityCard = document.createElement('div');
            activityCard.classList.add('activity-card');
            
            // Set activity details
            activityCard.innerHTML = `
              <h4>${transaction.title}</h4>
              <p>${transaction.message}</p>
              <span>${transaction.timestamp}</span>
            `;
            
            // Append the activity card to the activities list
            activitiesList.appendChild(activityCard);
          });
        } else {
          // If no transactions, show "No Notification Yet" message
          activitiesList.innerHTML = `
            <h1>No Notification Yet</h1>
            <p>You have to fund your account to start with <span style="font-size: 2rem;">😄</span></p>
          `;
        }
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        const activitiesList = document.querySelector('.activities-list');
        activitiesList.innerHTML = `
          <h1>Error fetching notifications</h1>
          <p>There was an error fetching your transaction history. Please try again later.</p>
        `;
      });
  });
  