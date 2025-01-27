document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Send login request
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      // Fetch the logged-in user's details
      const userResponse = await fetch('http://localhost:3000/Verified_Members');
      const users = await userResponse.json();

      // Find the logged-in user from the fetched data
      const loggedInUser = users.find(user => user.username === username);

      if (loggedInUser) {
        // Save the user_id to local storage
        localStorage.setItem('user_id', loggedInUser.user_id);
        console.log('Logged-in user ID saved to local storage:', loggedInUser.user_id);

        // Redirect to the dashboard
        window.location.href = 'pages/Dashboard.html';
      } else {
        console.error('User not found in verified members:', username);
        alert('User not found in verified members.');
      }
    } else {
      console.error('Login failed:', data.message);
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again.');
  }
});









// document.querySelector('form').addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;

//   try {
//     // Send login request
//     const response = await fetch('http://localhost:3000/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert(data.message);

//       // Fetch the logged-in user's details
//       const userResponse = await fetch('http://localhost:3000/Verified_Members');
//       const users = await userResponse.json();

//       // Find the logged-in user from the fetched data
//       const loggedInUser = users.find(user => user.username === username);

//       if (loggedInUser) {
//         // Save the user_id to local storage
//         localStorage.setItem('user_id', loggedInUser.user_id);
//         console.log('Logged-in user ID saved to local storage:', loggedInUser.user_id);

//         // Redirect to the dashboard
//         window.location.href = 'pages/Dashboard.html';
//       } else {
//         alert('User not found in verified members.');
//       }
//     } else {
//       alert(data.message);
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     alert('An error occurred. Please try again.');
//   }
// });
