import '../css/style.css';
import {fetchData} from './fetch.js';

const LOGIN_URL = 'http://127.0.0.1:3000/api/auth/login';
const REGISTER_URL = 'http://127.0.0.1:3000/api/users';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetchData(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });

      localStorage.setItem('token', response.token);
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
      loginMessage.textContent = 'Kirjautuminen epäonnistui';
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = {
      username: document.getElementById('register-username').value.trim(),
      password: document.getElementById('register-password').value,
      email: document.getElementById('register-email').value.trim(),
    };

    try {
      await fetchData(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      registerMessage.textContent =
        'Rekisteröityminen onnistui. Voit nyt kirjautua sisään.';
      registerForm.reset();
    } catch (error) {
      console.error('Registration failed:', error);
      registerMessage.textContent =
        error.message || 'Rekisteröityminen epäonnistui';
    }
  });
}