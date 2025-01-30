document.addEventListener('DOMContentLoaded', () => {
    ensureLoggedIn();

    const userId = getUserId();
    if (userId) {
        const userIdElement = document.getElementById('User_id');
        if (userIdElement) {
            userIdElement.textContent = `Permit ID: ${userId}`;
        }
    }
});
