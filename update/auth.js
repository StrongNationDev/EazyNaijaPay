function getUserId() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.warn('User ID not found. Please log in again.');
    }
    return userId;
  }
  
  function ensureLoggedIn() {
    const userId = getUserId();
    if (!userId) {
      alert('You are not logged in. Redirecting to login page.');
      window.location.href = '../index.html'; 
    }
  }
  
  document.addEventListener('DOMContentLoaded', ensureLoggedIn);
  