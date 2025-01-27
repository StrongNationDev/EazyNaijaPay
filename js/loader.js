// loader.js

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
  
    if (!user_id) {
      showAlert('User ID is missing. Please click the correct link.');
      window.location.href = 'https://t.me/EazyNaijaPayBot'; // Redirect to Telegram bot if no user_id is provided
    } else {
      console.log(`User ID detected: ${user_id}`);
  
      // Save the user_id in localStorage
      localStorage.setItem('user_id', user_id);
  
      // Display the user_id in the index.html section
      const userIdDiv = document.getElementById('User_id');
      if (userIdDiv) {
        userIdDiv.textContent = user_id;
      }
    }
  });
  