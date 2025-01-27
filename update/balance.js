async function updateBalance() {
    const userId = localStorage.getItem('user_id');
  
    if (!userId) {
      console.warn('User ID not found. Redirecting to login page.');
      alert('You are not logged in. Redirecting to the login page.');
      window.location.href = '../index.html'; 
      return;
    }
  
    try {
      const apiUrl = `http://localhost:3000/Verified_Members/${userId}/balance`;
  
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch balance. Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const balanceElement = document.getElementById('balance');
      balanceElement.textContent = `${data.balance} NGN`;
    } catch (error) {
      console.error('Error fetching balance:', error);
      alert('Failed to fetch balance. Please try again later.');
    }
  }
  
  document.addEventListener('DOMContentLoaded', updateBalance);
  