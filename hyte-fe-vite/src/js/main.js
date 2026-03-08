import '../css/style.css';
import {loadAndRenderItems} from './items.js';
import {loadAndRenderEntries} from './entries.js';
import {loadAndRenderTrainingEntries} from './training.js';

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/login.html';
}

const loadItemsBtn = document.getElementById('load-items-btn');
const loadEntriesBtn = document.getElementById('load-entries-btn');
const loadTrainingBtn = document.getElementById('load-training-btn');
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

if (loadTrainingBtn) {
  loadTrainingBtn.addEventListener('click', async () => {
    try {
      await loadAndRenderTrainingEntries();
      showSnackbar('Treenimerkinnät ladattu');
    } catch (error) {
      console.error('Fetching training failed:', error);
      showSnackbar('Treenien haku epäonnistui');
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });
}