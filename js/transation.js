document.addEventListener("DOMContentLoaded", async () => {
    const userId = "1446675700"; // Replace with the actual User_id dynamically if needed
    const transactionsContainer = document.querySelector(".activities-list");
  
    try {
      // Fetch transactions from the server
      const response = await fetch(`https://eazynaijapay-server.onrender.com/Verified_Users/${userId}/Transaction`);
      const data = await response.json();
  
      if (!data.success || !data.transactions.length) {
        // No transactions found, display the message
        transactionsContainer.innerHTML = `
          <h1>No Notification Yet</h1>
          <p>You have to fund your account to start with <span style="font-size: 2rem;">😄</span></p>
        `;
        return;
      }
  
      // Clear any existing content
      transactionsContainer.innerHTML = "";
  
      // Populate transactions
      data.transactions.forEach((transaction) => {
        const transactionCard = document.createElement("div");
        transactionCard.className = `activity-card ${transaction.status === "failed" ? "failed" : ""}`;
        
        transactionCard.innerHTML = `
          <h4>${transaction.title}</h4>
          <p>${transaction.description}</p>
          <span>${transaction.date}</span>
        `;
  
        transactionsContainer.appendChild(transactionCard);
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
  
      // Display an error message
      transactionsContainer.innerHTML = `
        <h1>Error Loading Notifications</h1>
        <p>Something went wrong. Please try again later <span style="font-size: 2rem;">😔</span></p>
      `;
    }
  });
  