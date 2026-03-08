import {fetchData} from './fetch.js';

const API_URL = 'http://127.0.0.1:3000/api/training';

const trainingContainer = document.getElementById('training-container');
const addTrainingForm = document.getElementById('add-training-form');

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

const getTrainingBadgeClass = (trainingType) => {
  const value = trainingType?.toLowerCase();

  switch (value) {
    case 'running':
    case 'juoksu':
      return 'training-running';
    case 'gym':
    case 'kuntosali':
      return 'training-gym';
    case 'cycling':
    case 'pyöräily':
      return 'training-cycling';
    case 'walking':
    case 'kävely':
      return 'training-walking';
    default:
      return 'training-default';
  }
};

export async function getTrainingEntries() {
  return await fetchData(API_URL, {
    headers: getTokenHeaders(),
  });
}

export async function createTrainingEntry(training) {
  return await fetchData(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getTokenHeaders(),
    },
    body: JSON.stringify(training),
  });
}

export async function updateTrainingEntry(trainingId, training) {
  return await fetchData(`${API_URL}/${trainingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getTokenHeaders(),
    },
    body: JSON.stringify(training),
  });
}

export async function deleteTrainingEntry(trainingId) {
  const response = await fetch(`${API_URL}/${trainingId}`, {
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

const fillTrainingFormForEdit = (entry) => {
  document.getElementById('training-id').value = entry.training_id ?? '';
  document.getElementById('training-date').value = entry.training_date ?? '';
  document.getElementById('training-type').value = entry.training_type ?? '';
  document.getElementById('training-duration').value =
    entry.duration_minutes ?? '';
  document.getElementById('training-calories').value = entry.calories ?? '';

  const submitBtn = document.getElementById('training-submit-btn');
  const cancelBtn = document.getElementById('training-cancel-btn');

  if (submitBtn) {
    submitBtn.textContent = 'Tallenna muutokset';
  }

  if (cancelBtn) {
    cancelBtn.classList.remove('hidden');
  }

  addTrainingForm?.scrollIntoView({behavior: 'smooth', block: 'start'});
};

const resetTrainingForm = () => {
  addTrainingForm?.reset();
  document.getElementById('training-id').value = '';

  const submitBtn = document.getElementById('training-submit-btn');
  const cancelBtn = document.getElementById('training-cancel-btn');

  if (submitBtn) {
    submitBtn.textContent = 'Tallenna treeni';
  }

  if (cancelBtn) {
    cancelBtn.classList.add('hidden');
  }
};

const trainingCancelBtn = document.getElementById('training-cancel-btn');

if (trainingCancelBtn) {
  trainingCancelBtn.addEventListener('click', () => {
    resetTrainingForm();
  });
}

export function renderTrainingEntries(entries) {
  if (!trainingContainer) return;

  trainingContainer.innerHTML = '';

  if (!entries || entries.length === 0) {
    trainingContainer.innerHTML = '<p>Ei treenimerkintöjä näytettäväksi.</p>';
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.classList.add('training-card');

    card.innerHTML = `
      <div class="training-badge ${getTrainingBadgeClass(entry.training_type)}">
        ${entry.training_type || 'Treeni'}
      </div>
      <h3>${formatDate(entry.training_date)}</h3>

      <div class="training-meta">
        <span>Kesto: ${entry.duration_minutes ?? '-'} min</span>
        <span>Kulutus: ${entry.calories ?? '-'} kcal</span>
      </div>

      <div class="training-actions">
        <button class="edit-training-btn" type="button">Muokkaa</button>
        <button class="delete-training-btn" type="button">Poista</button>
      </div>
    `;

    const editBtn = card.querySelector('.edit-training-btn');
    const deleteBtn = card.querySelector('.delete-training-btn');

    editBtn.addEventListener('click', () => fillTrainingFormForEdit(entry));

    deleteBtn.addEventListener('click', async () => {
      const confirmed = window.confirm(
        'Haluatko varmasti poistaa tämän treenin?'
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteTrainingEntry(entry.training_id);
        await loadAndRenderTrainingEntries();
        resetTrainingForm();
        alert('Treenimerkintä poistettu');
      } catch (error) {
        console.error('Deleting training entry failed:', error);
        alert(`Treenimerkinnän poisto epäonnistui: ${error.message}`);
      }
    });

    trainingContainer.appendChild(card);
  });
}

export async function loadAndRenderTrainingEntries() {
  try {
    const entries = await getTrainingEntries();
    renderTrainingEntries(entries);
  } catch (error) {
    console.error('loadAndRenderTrainingEntries error:', error);
    alert(`Treenien haku epäonnistui: ${error.message}`);
  }
}

if (addTrainingForm) {
  addTrainingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const trainingId = document.getElementById('training-id').value;

    const training = {
      training_date: document.getElementById('training-date').value,
      training_type: document.getElementById('training-type').value.trim(),
      duration_minutes:
        document.getElementById('training-duration').value || null,
      calories: document.getElementById('training-calories').value || null,
    };

    try {
      if (trainingId) {
        await updateTrainingEntry(trainingId, training);
        alert('Treenimerkintä päivitetty');
      } else {
        await createTrainingEntry(training);
        alert('Treenimerkintä tallennettu');
      }

      resetTrainingForm();
      await loadAndRenderTrainingEntries();
    } catch (error) {
      console.error('Saving training entry failed:', error);
      alert(`Treenimerkinnän tallennus epäonnistui: ${error.message}`);
    }
  });
}