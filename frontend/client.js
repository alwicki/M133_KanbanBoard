let position;
const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const task = {
    description: document.querySelector('input').value,
    position: position,
  };

  document.querySelector('input').value = '';

  await fetch('/tasks', {
    body: JSON.stringify(task),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  $('#taskModal').modal('hide');
  await loadtasks();
});

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'card mb-2';
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  const cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.innerHTML = task.description;
  const deleteBtn = document.createElement('Button');
  deleteBtn.innerText = 'delete';
  deleteBtn.className = 'btn btn-outline-dark';
  deleteBtn.onclick = () => {
    deleteTask(task.id);
  };
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(deleteBtn);
  card.appendChild(cardBody);
  return card;
}

async function moveTask(task, direction) {
  task.position = task.position + direction;
  await fetch('/tasks/' + task.id, {
    method: 'PUT',
    body: JSON.stringify(task),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await loadTasks();
}

async function deleteTask(id) {
  await fetch('/tasks/' + id, {
    method: 'DELETE',
  });
  await loadtasks();
}

async function loadLanes() {
  const response = await fetch('/lanes');
  const lanes = await response.json();
  const laneRow = document.getElementById('laneRow');
  lanes.forEach((lane) => {
    let laneCol = document.createElement('div');
    laneCol.className = 'col bg-light vh-80 border-right';

    let titelRow = document.createElement('div');
    titelRow.className = 'row mb-4';
    titelRow.style.backgroundColor = lane.color;

    let titel = document.createElement('h2');
    titel.className = 'text-light mx-auto';
    titel.innerText = lane.titel;

    let cardSpace = document.createElement('div');
    cardSpace.id = lane.id;

    let createBtn = document.createElement('button');
    createBtn.innerText = '+';
    createBtn.className = 'btn btn-outline-dark mb-4';
    createBtn.onclick = () => {
      position = lane.id;
    };
    createBtn.setAttribute('data-toggle', 'modal');
    createBtn.setAttribute('data-target', '#taskModal');

    titelRow.appendChild(titel);

    laneCol.appendChild(titelRow);
    laneCol.appendChild(createBtn);
    laneCol.appendChild(cardSpace);
    laneRow.appendChild(laneCol);
  });
  loadtasks();
}

async function loadtasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  const todo = document.getElementById('0');
  const inprogress = document.getElementById('1');
  const done = document.getElementById('2');
  todo.innerHTML = '';
  inprogress.innerHTML = '';
  done.innerHTML = '';
  tasks.forEach((task) => {
    switch (task.position) {
      case 0:
        todo.appendChild(createTaskCard(task));
        break;
      case 1:
        inprogress.appendChild(createTaskCard(task));
        break;
      default:
        done.appendChild(createTaskCard(task));
        break;
    }
  });
}

loadLanes();
