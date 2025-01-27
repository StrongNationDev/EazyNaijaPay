window.addEventListener('DOMContentLoaded', () => {
    const adminDMButton = document.getElementById('adminDM');
    const transactionScreenshotInput = document.getElementById('transactionScreenshot');
    const telegramBotToken = '8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA'; // Replace with your bot token
    const telegramGroupId = '-4690077675'; // Use the group chat ID with a "-" prefix for groups
  
    adminDMButton.addEventListener('click', async () => {
      const userId = localStorage.getItem('user_id') || localStorage.getItem('User_id');
      const file = transactionScreenshotInput.files[0];
  
      if (!userId) {
        showAlert('User ID is missing. Please log in again.');
        return;
      }
  
      if (!file) {
        showAlert('Please upload a transaction screenshot.');
        return;
      }
  
      // Prepare form data for the file
      const formData = new FormData();
      formData.append('chat_id', telegramGroupId);
      formData.append('caption', `Payment Verification from User ID: ${userId}`);
      formData.append('photo', file);
  
      // Send the photo to the Telegram bot
      try {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });
  
        const result = await response.json();
        if (result.ok) {
          showAlert('Payment verification sent successfully. Please wait for the admin to respond within 30 minutes.');
        } else {
          showAlert('Failed to send payment verification. Please try again.');
          console.error(result);
        }
      } catch (error) {
        console.error('Error sending payment verification:', error);
        showAlert('An error occurred while verifying payment. Please try again.');
      }
    });
  });
  