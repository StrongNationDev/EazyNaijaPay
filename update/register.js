document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = 'index.html';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred. Please try again.');
    }
  });
  


// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.innerHTML = '&#128065;'; // Change eye icon
    } else {
      passwordInput.type = 'password';
      eyeIcon.innerHTML = '&#128065;'; // Default eye icon
    }
    }