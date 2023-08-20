


function validateSignIn() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
  
    if (username.length < 3) {
      usernameError.textContent = 'Username must be at least 3 characters long';
      return false;
    } else {
      usernameError.textContent = '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      emailError.textContent = 'Invalid email format';
      return false;
    } else {
      emailError.textContent = '';
    }

    if (password.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters long';
      return false;
    } else {
      passwordError.textContent = '';
    }
    return true; 
  }
  