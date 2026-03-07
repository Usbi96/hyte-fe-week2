export async function getUsers() {
  const response = await fetch('http://127.0.0.1:3000/api/users');

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Backend ei palauttanut JSONia');
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

export async function addUser(user) {
  const response = await fetch('http://127.0.0.1:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Backend ei palauttanut JSONia');
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

export const renderUsers = (users) => {
  const usersList = document.getElementById('users-list');
  usersList.innerHTML = '';

  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = `${user.user_id}: ${user.username}`;
    usersList.appendChild(li);
  });
};