document.addEventListener('DOMContentLoaded', () => {
    const verifyPaymentButton = document.getElementById('adminDM');
    const fileInput = document.getElementById('transactionScreenshot');

    verifyPaymentButton.addEventListener('click', async () => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            alert('User ID not found. Please log in again.');
            return;
        }

        const file = fileInput.files[0];
        if (!file) {
            alert('Please upload a screenshot of your transaction.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('chat_id', '-1002418893054');
            formData.append('caption', `User ID: ${userId}\nPayment Verification Screenshot`);
            formData.append('photo', file);

            const botToken = '8136531029:AAHlArThifhrPiOQuQv5HYi_gBpt7_XZFjA';
            const telegramAPI = `https://api.telegram.org/bot${botToken}/sendPhoto`;

            const response = await fetch(telegramAPI, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.ok) {
                alert('Your account top-up is in progress, please wait while the admin confirms the transaction.');
            } else {
                alert('Failed to send verification. Please try again later.');
            }
        } catch (error) {
            console.error('Error uploading screenshot:', error);
            alert('An error occurred while sending the verification. Please try again.');
        }
    });
});
