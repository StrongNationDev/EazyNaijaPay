document.addEventListener('DOMContentLoaded', () => {
    // Get the modal and its elements
    const referModal = document.getElementById('refer-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const copyButton = document.getElementById('copy-link');
    const referralInput = document.getElementById('referral-link');

    // Fetch user_id from localStorage
    const userId = localStorage.getItem('user_id') || localStorage.getItem('User_id');
    if (userId) {
        // Dynamically update the referral link with user_id
        const referralLink = `https://t.me/EazyNaijaPayBot?start=${userId}`;
        referralInput.value = referralLink;
    } else {
        console.error('User ID not found in localStorage.');
        referralInput.value = 'User ID missing. Please log in to generate your referral link.';
        copyButton.disabled = true; // Disable the copy button if no user_id
    }

    // Open the modal when "Refer a Friend" is clicked
    const referButton = document.querySelector('.refer');
    referButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        referModal.style.display = 'flex'; // Show the modal
    });

    // Close the modal
    closeModalButton.addEventListener('click', () => {
        referModal.style.display = 'none'; // Hide the modal
    });

    // Hide modal when clicking outside the content
    referModal.addEventListener('click', (event) => {
        if (event.target === referModal) {
            referModal.style.display = 'none';
        }
    });

    // Copy referral link to clipboard
    copyButton.addEventListener('click', () => {
        referralInput.select(); // Select the text
        referralInput.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(referralInput.value).then(() => {
            showAlert('Referral link copied to clipboard!');
        }).catch((error) => {
            console.error('Failed to copy text: ', error);
        });
    });
});



// document.addEventListener('DOMContentLoaded', () => {
//     // Get the modal and its elements
//     const referModal = document.getElementById('refer-modal');
//     const closeModalButton = document.querySelector('.close-modal');
//     const copyButton = document.getElementById('copy-link');
//     const referralInput = document.getElementById('referral-link');

//     // Open the modal when "Refer a Friend" is clicked
//     const referButton = document.querySelector('.refer');
//     referButton.addEventListener('click', (event) => {
//         event.preventDefault(); // Prevent default link behavior
//         referModal.style.display = 'flex'; // Show the modal
//     });

//     // Close the modal
//     closeModalButton.addEventListener('click', () => {
//         referModal.style.display = 'none'; // Hide the modal
//     });

//     // Hide modal when clicking outside the content
//     referModal.addEventListener('click', (event) => {
//         if (event.target === referModal) {
//             referModal.style.display = 'none';
//         }
//     });

//     // Copy referral link to clipboard
//     copyButton.addEventListener('click', () => {
//         referralInput.select(); // Select the text
//         referralInput.setSelectionRange(0, 99999); // For mobile devices
//         navigator.clipboard.writeText(referralInput.value).then(() => {
//             alert('Referral link copied to clipboard!');
//         }).catch((error) => {
//             console.error('Failed to copy text: ', error);
//         });
//     });
// });
