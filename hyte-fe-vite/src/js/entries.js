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

const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getMoodLabel = (mood) => {
  if (!mood) return 'Tuntematon';
  return mood;
};

const getMoodClass = (mood) => {
  const value = mood?.toLowerCase();

  switch (value) {
    case 'happy':
      return 'mood-happy';
    case 'relaxed':
      return 'mood-relaxed';
    case 'energetic':
      return 'mood-energetic';
    case 'satisfied':
      return 'mood-satisfied';
    case 'tired':
      return 'mood-tired';
    default:
      return 'mood-default';
  }
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
    <div class="mood-badge ${getMoodClass(entry.mood)}">${getMoodLabel(entry.mood)}</div>
    <h3>${formatDate(entry.entry_date)}</h3>

    <div class="entry-meta">
      <span>Uni: ${entry.sleep_hours ?? '-'} h</span>
      <span>Paino: ${entry.weight ?? '-'} kg</span>
    </div>

    <p><strong>Muistiinpanot:</strong></p>
    <p>${entry.notes || 'Ei muistiinpanoja'}</p>

    <p><strong>Luotu:</strong> ${formatDateTime(entry.created_at)}</p>
    <p><strong>Merkinnän tunniste:</strong> ${entry.entry_id ?? '-'}</p>
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

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

export function renderEntries(entries) {
  if (!entriesContainer) return;

  entriesContainer.innerHTML = '';

  if (!entries || entries.length === 0) {
    entriesContainer.innerHTML = '<p>Ei merkintöjä näytettäväksi.</p>';
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.classList.add('entry-card');

    card.innerHTML = `
      <div class="mood-badge ${getMoodClass(entry.mood)}">${getMoodLabel(entry.mood)}</div>
      <h3>${formatDate(entry.entry_date)}</h3>

      <div class="entry-meta">
        <span>Uni: ${entry.sleep_hours ?? '-'} h</span>
        <span>Paino: ${entry.weight ?? '-'} kg</span>
      </div>

      <p class="entry-notes">${entry.notes || 'Ei muistiinpanoja'}</p>

      <button class="open-entry-btn" type="button">Lue lisää</button>
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