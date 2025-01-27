window.addEventListener('DOMContentLoaded', async () => {
    const user_id = localStorage.getItem('user_id');
  
    if (!user_id) {
      showAlert('User ID not found. Please log in again.');
      window.location.href = '/login.html';
      return;
    }
  
    try {
      const profileImgElement = document.querySelector('.profile-img');
      const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${user_id}/profile_picture`);
  
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        profileImgElement.src = imageUrl;
      } else if (response.status === 404) {
        const data = await response.json();
        profileImgElement.src = data.placeholder || '../assets/default-profile-icon.png';
      } else {
        console.error('Failed to load profile picture:', response.status);
        showAlert('Unable to load profile picture. Using default image.');
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      showAlert('An error occurred while loading the profile picture. Please try again later.');
    }
  });
  