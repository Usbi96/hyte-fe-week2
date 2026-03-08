import '../css/style.css';
import {fetchData} from './fetch.js';

const LOGIN_URL = 'http://127.0.0.1:3000/api/auth/login';

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
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
      loginMessage.textContent = 'Kirjautuminen epäonnistui';
      console.error(error);
    }
  });
}