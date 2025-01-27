window.addEventListener('load', () => {
  const userId = localStorage.getItem('user_id') || localStorage.getItem('User_id');

  if (!userId) {
    showAlert('User ID is missing. Please log in again.');
      window.location.href = 'https://t.me/EazyNaijaPayBot';
  } else {
      console.log(`User ID loaded: ${userId}`);
      localStorage.setItem('user_id', userId);
  }
});
