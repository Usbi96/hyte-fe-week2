import {fetchData} from './fetch.js';

const API_URL = 'http://127.0.0.1:3000/api/entries';
const FALLBACK_URL = '/diary.json';

const entriesContainer = document.getElementById('entries-container');
const modal = document.getElementById('entry-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal-btn');

const getTokenHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function getEntries() {
  try {
    return await fetchData(API_URL, {
      headers: getTokenHeaders(),
    });
  } catch (error) {
    console.warn('API entries failed, using diary.json fallback:', error);
    return await fetchData(FALLBACK_URL);
  }
}

const openModal = (entry) => {
  modalBody.innerHTML = `
    <h3>Merkintä #${entry.entry_id}</h3>
    <p><strong>Päivä:</strong> ${entry.entry_date}</p>
    <p><strong>Mieliala:</strong> ${entry.mood}</p>
    <p><strong>Paino:</strong> ${entry.weight} kg</p>
    <p><strong>Uni:</strong> ${entry.sleep_hours} h</p>
    <p><strong>Muistiinpanot:</strong> ${entry.notes}</p>
    <p><strong>Luotu:</strong> ${entry.created_at}</p>
  `;

  modal.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
};

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

export function renderEntries(entries) {
  if (!entriesContainer) return;

  entriesContainer.innerHTML = '';

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.classList.add('entry-card');

    card.innerHTML = `
      <h3>${entry.mood}</h3>
      <p><strong>Päivä:</strong> ${entry.entry_date}</p>
      <p><strong>Uni:</strong> ${entry.sleep_hours} h</p>
      <p><strong>Paino:</strong> ${entry.weight} kg</p>
      <p>${entry.notes}</p>
      <button class="open-entry-btn" type="button">Avaa</button>
    `;

    const openBtn = card.querySelector('.open-entry-btn');
    openBtn.addEventListener('click', () => openModal(entry));

    entriesContainer.appendChild(card);
  });
}

export async function loadAndRenderEntries() {
  const entries = await getEntries();
  renderEntries(entries);
}