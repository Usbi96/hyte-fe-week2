import {fetchData} from './fetch.js';

const API_URL = 'http://127.0.0.1:3000/api/entries';

const entriesContainer = document.getElementById('entries-container');
const addEntryForm = document.getElementById('add-entry-form');
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
  return await fetchData(API_URL, {
    headers: getTokenHeaders(),
  });
}

export async function createEntry(entry) {
  return await fetchData(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getTokenHeaders(),
    },
    body: JSON.stringify(entry),
  });
}

export async function updateEntry(entryId, entry) {
  return await fetchData(`${API_URL}/${entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getTokenHeaders(),
    },
    body: JSON.stringify(entry),
  });
}

export async function deleteEntry(entryId) {
  const response = await fetch(`${API_URL}/${entryId}`, {
    method: 'DELETE',
    headers: {
      ...getTokenHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return true;
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

const fillEntryFormForEdit = (entry) => {
  document.getElementById('entry-id').value = entry.entry_id ?? '';
  document.getElementById('entry-date').value = entry.entry_date ?? '';
  document.getElementById('entry-mood').value = entry.mood ?? '';
  document.getElementById('entry-weight').value = entry.weight ?? '';
  document.getElementById('entry-sleep').value = entry.sleep_hours ?? '';
  document.getElementById('entry-notes').value = entry.notes ?? '';

  const submitBtn = document.getElementById('entry-submit-btn');
  const cancelBtn = document.getElementById('entry-cancel-btn');

  if (submitBtn) {
    submitBtn.textContent = 'Tallenna muutokset';
  }

  if (cancelBtn) {
    cancelBtn.classList.remove('hidden');
  }

  addEntryForm?.scrollIntoView({behavior: 'smooth', block: 'start'});
};

const resetEntryForm = () => {
  addEntryForm?.reset();
  document.getElementById('entry-id').value = '';

  const submitBtn = document.getElementById('entry-submit-btn');
  const cancelBtn = document.getElementById('entry-cancel-btn');

  if (submitBtn) {
    submitBtn.textContent = 'Tallenna merkintä';
  }

  if (cancelBtn) {
    cancelBtn.classList.add('hidden');
  }
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

const entryCancelBtn = document.getElementById('entry-cancel-btn');

if (entryCancelBtn) {
  entryCancelBtn.addEventListener('click', () => {
    resetEntryForm();
  });
}

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

      <div class="entry-actions">
        <button class="open-entry-btn" type="button">Lue lisää</button>
        <button class="edit-entry-btn" type="button">Muokkaa</button>
        <button class="delete-entry-btn" type="button">Poista</button>
      </div>
    `;

    const openBtn = card.querySelector('.open-entry-btn');
    const editBtn = card.querySelector('.edit-entry-btn');
    const deleteBtn = card.querySelector('.delete-entry-btn');

    openBtn.addEventListener('click', () => openModal(entry));
    editBtn.addEventListener('click', () => fillEntryFormForEdit(entry));

    deleteBtn.addEventListener('click', async () => {
      const confirmed = window.confirm(
        'Haluatko varmasti poistaa tämän päiväkirjamerkinnän?'
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteEntry(entry.entry_id);
        await loadAndRenderEntries();
        resetEntryForm();
        alert('Päiväkirjamerkintä poistettu');
      } catch (error) {
        console.error('Deleting entry failed:', error);
        alert(`Merkinnän poisto epäonnistui: ${error.message}`);
      }
    });

    entriesContainer.appendChild(card);
  });
}

export async function loadAndRenderEntries() {
  const entries = await getEntries();
  renderEntries(entries);
}

if (addEntryForm) {
  addEntryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const entryId = document.getElementById('entry-id').value;

    const entry = {
      entry_date: document.getElementById('entry-date').value,
      mood: document.getElementById('entry-mood').value.trim(),
      weight: document.getElementById('entry-weight').value || null,
      sleep_hours: document.getElementById('entry-sleep').value || null,
      notes: document.getElementById('entry-notes').value.trim(),
    };

    try {
      if (entryId) {
        await updateEntry(entryId, entry);
        alert('Merkintä päivitetty');
      } else {
        await createEntry(entry);
        alert('Merkintä tallennettu');
      }

      resetEntryForm();
      await loadAndRenderEntries();
    } catch (error) {
      console.error('Saving entry failed:', error);
      alert(`Merkinnän tallennus epäonnistui: ${error.message}`);
    }
  });
}