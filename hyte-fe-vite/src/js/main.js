import '../css/style.css';
import {loadAndRenderItems} from './items.js';
import {getUsers, addUser, renderUsers} from './users.js';
import {loadAndRenderEntries} from './entries.js';

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/login.html';
}

const loadItemsBtn = document.getElementById('load-items-btn');
const addUserForm = document.getElementById('add-user-form');
const loadEntriesBtn = document.getElementById('load-entries-btn');
const logoutBtn = document.getElementById('logout-btn');
const snackbar = document.getElementById('snackbar');

const showSnackbar = (message) => {
  if (!snackbar) return;

  snackbar.textContent = message;
  snackbar.className = 'show';

  setTimeout(() => {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
};

const initUsers = async () => {
  try {
    const users = await getUsers();
    renderUsers(users);
  } catch (error) {
    console.error('Users loading failed:', error);
  }
};

if (loadItemsBtn) {
  loadItemsBtn.addEventListener('click', async () => {
    try {
      await loadAndRenderItems();
      showSnackbar('Itemit ladattu');
    } catch (error) {
      console.error('Fetching items failed:', error);
      showSnackbar('Itemien haku epäonnistui');
    }
  });
}

if (loadEntriesBtn) {
  loadEntriesBtn.addEventListener('click', async () => {
    try {
      await loadAndRenderEntries();
      showSnackbar('Päiväkirjamerkinnät ladattu');
    } catch (error) {
      console.error('Fetching entries failed:', error);
      showSnackbar('Merkintöjen haku epäonnistui');
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });
}

if (addUserForm) {
  addUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      email: document.getElementById('email').value,
    };

    try {
      await addUser(user);
      showSnackbar('Käyttäjä lisätty onnistuneesti');

      const users = await getUsers();
      renderUsers(users);

      addUserForm.reset();
    } catch (error) {
      console.error('Adding user failed:', error);
      showSnackbar(error.message);
    }
  });
}

initUsers();