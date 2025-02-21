document.addEventListener('DOMContentLoaded', async () => {
    ensureLoggedIn();

    const userId = getUserId();
    if (userId) {
        const userIdElement = document.getElementById('User_id');
        const usernameElement = document.getElementById('Username');

        if (userIdElement) {
            userIdElement.textContent = `Permit ID: ${userId}`;
        }

        // Fetch username from API
        try {
            const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Members/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user data");

            const data = await response.json();
            if (data.username) {
                usernameElement.textContent = data.username;
            } else {
                usernameElement.textContent = "Unknown User";
            }
        } catch (error) {
            console.error("Error fetching username:", error);
            usernameElement.textContent = "Error fetching name";
        }
    }
});












// terminating account function still working on it;

document.addEventListener("DOMContentLoaded", () => {
    const terminateBtn = document.getElementById("terminateBtn");
    const terminateModal = document.getElementById("terminateModal");
    const confirmTerminate = document.getElementById("confirmTerminate");
    const cancelTerminate = document.getElementById("cancelTerminate");

    // Ensure all elements exist before running
    if (!terminateBtn || !terminateModal || !confirmTerminate || !cancelTerminate) {
        console.error("One or more elements not found.");
        return;
    }

    // Show modal when clicking "Terminate Account"
    terminateBtn.addEventListener("click", (e) => {
        e.preventDefault();
        terminateModal.classList.remove("hidden");
    });

    // Hide modal when clicking "Cancel"
    cancelTerminate.addEventListener("click", () => {
        terminateModal.classList.add("hidden");
    });

    // Close modal when clicking outside modal content
    terminateModal.addEventListener("click", (e) => {
        if (e.target === terminateModal) {
            terminateModal.classList.add("hidden");
        }
    });

    // Handle account deletion
    confirmTerminate.addEventListener("click", async () => {
        const userId = getUserId(); // Ensure this function is defined and working
        if (!userId) {
            alert("User not found. Please log in again.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/Verified_Members/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Failed to delete account");

            alert("Your account has been permanently deleted.");
            localStorage.clear(); // Clear user session
            window.location.href = "/login.html"; // Redirect to login page
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Error deleting account. Please try again.");
        }
    });
});
