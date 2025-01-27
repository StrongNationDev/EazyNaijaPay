window.addEventListener('DOMContentLoaded', async () => {
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    showAlert('User ID not found. Please log in again.');
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${user_id}/Balance`);
    console.log('API Response Status:', response.status); // Debug log for response status

    if (!response.ok) {
      console.error('Error fetching balance:', response.statusText); // Debug log for error message
      showAlert('Error retrieving balance. Please try again later.');
      return;
    }

    const data = await response.json();
    console.log('API Response Data:', data); // Debug log for response data

    const { success, balance } = data;

    if (success && typeof balance === 'number') {
      const balanceElement = document.getElementById('balance');
      if (balanceElement) {
        balanceElement.textContent = `${balance} NGN`;
      }
    } else {
      showAlert('Unable to retrieve balance. Please contact support.');
    }
  } catch (error) {
    console.error('Fetch Error:', error.message); // Debug log for fetch error
    showAlert('An error occurred while retrieving balance. Please try again later.');
  }
});
