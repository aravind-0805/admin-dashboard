fetch('/api/entries')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('entryTableBody');
    tbody.innerHTML = '';
    data.forEach(entry => {
      const row = document.createElement('tr');
      row.setAttribute('data-id', entry._id);

      row.innerHTML = `
        <td><span class="name">${entry.name}</span><input class="form-control form-control-sm d-none name-input" value="${entry.name}"></td>
        <td><span class="email">${entry.email}</span><input class="form-control form-control-sm d-none email-input" value="${entry.email}"></td>
        <td>
          <button class="btn btn-primary btn-sm me-2 edit-btn">Edit</button>
          <button class="btn btn-success btn-sm me-2 save-btn d-none">Save</button>
          <button onclick="deleteEntry('${entry._id}')" class="btn btn-danger btn-sm">Delete</button>
        </td>
      `;

      tbody.appendChild(row);
    });

    // Attach edit and save listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        row.querySelector('.name').classList.add('d-none');
        row.querySelector('.email').classList.add('d-none');
        row.querySelector('.name-input').classList.remove('d-none');
        row.querySelector('.email-input').classList.remove('d-none');

        row.querySelector('.edit-btn').classList.add('d-none');
        row.querySelector('.save-btn').classList.remove('d-none');
      });
    });

    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const id = row.getAttribute('data-id');
        const updatedName = row.querySelector('.name-input').value;
        const updatedEmail = row.querySelector('.email-input').value;

        fetch(`/api/entries/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: updatedName, email: updatedEmail })
        }).then(() => location.reload());
      });
    });

  });

function deleteEntry(id) {
  fetch(`/api/entries/${id}`, { method: 'DELETE' })
    .then(() => location.reload());
}
