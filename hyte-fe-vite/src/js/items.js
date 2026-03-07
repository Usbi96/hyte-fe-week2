import {getItems, getItemById, deleteItem} from './itemsApi.js';

const addButtonEventListeners = () => {
  document.querySelectorAll('.check').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const itemId = event.target.dataset.id;

      try {
        const item = await getItemById(itemId);
        alert(`Item info:\nID: ${item.id}\nName: ${item.name}`);
      } catch (error) {
        console.error('Info fetch failed:', error);
        alert('Tietojen haku epäonnistui');
      }
    });
  });

  document.querySelectorAll('.del').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const itemId = event.target.dataset.id;

      try {
        await deleteItem(itemId);
        await loadAndRenderItems();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Poistaminen epäonnistui');
      }
    });
  });
};

export const loadAndRenderItems = async () => {
  const items = await getItems();
  console.log('Items from backend:', items);

  const tableBody = document.getElementById('items-table-body');
  tableBody.innerHTML = '';

  items.forEach((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.name}</td>
      <td><button class="check" data-id="${item.id}">Info</button></td>
      <td><button class="del" data-id="${item.id}">Delete</button></td>
      <td>${item.id}</td>
    `;

    tableBody.appendChild(row);
  });

  addButtonEventListeners();
};