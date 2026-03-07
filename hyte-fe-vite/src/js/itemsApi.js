export async function getItems() {
  const response = await fetch('http://127.0.0.1:3000/api/items');

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

export async function getItemById(id) {
  const response = await fetch(`http://127.0.0.1:3000/api/items/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

export async function deleteItem(id) {
  const response = await fetch(`http://127.0.0.1:3000/api/items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return true;
}