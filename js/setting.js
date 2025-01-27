// Wait for the DOM to fully load
window.addEventListener('DOMContentLoaded', async () => {
    // Retrieve the User ID from local storage
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      showAlert('User ID not found. Please log in again.');
      window.location.href = '/login.html';
      return;
    }
  
    console.log(`User ID loaded: ${user_id}`); // Debugging log
  
    try {
      // Fetch the username from the server
      const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${user_id}/Username`);
  
      if (!response.ok) {
        console.error('Error fetching username:', response.status);
        showAlert('Error retrieving username. Please try again later.');
        return;
      }
  
      // Parse the response as JSON
      const { success, username } = await response.json();
  
      if (success && username) {
        // Update the Username and User ID in the HTML
        const usernameElement = document.getElementById('Username');
        const userIdElement = document.getElementById('User_id');
  
        if (usernameElement) {
          usernameElement.textContent = username;
        }
  
        if (userIdElement) {
          userIdElement.textContent = `User Permit ID: ${user_id}`;
        }
      } else {
        showAlert('Unable to retrieve username. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      showAlert('An error occurred while retrieving the username. Please try again later.');
    }
  });
  