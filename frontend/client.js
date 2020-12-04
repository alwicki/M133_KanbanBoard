// position of task to create
let position;

// variable to save lanes from api
let lanes;

// focus modal if shown
$('#taskModal').on('shown.bs.modal', function () {
  $('input').trigger('focus');
});

const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const task = {
    id: null,
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
  await loadTasks();
});

async function loadLanes() {
  const response = await fetch('/lanes');
  lanes = await response.json();
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
    cardSpace.className = 'h-100';
    cardSpace.setAttribute('ondragover', 'allowDrop(event)');
    cardSpace.setAttribute('ondrop', 'drop(event)');
    cardSpace.style = ':drop';

    let createBtn = document.createElement('button');
    createBtn.innerHTML = "<img src='/assets/icons/plus.svg'>";
    createBtn.className = 'btn btn-outline-dark mx-auto mb-4';
    createBtn.onclick = () => {
      position = lane.id;
    };
    createBtn.setAttribute('data-toggle', 'modal');
    createBtn.setAttribute('data-target', '#taskModal');
    let btnRow = document.createElement('row');
    btnRow.className = 'row';
    btnRow.appendChild(createBtn);

    titelRow.appendChild(titel);

    laneCol.appendChild(titelRow);
    laneCol.appendChild(btnRow);
    laneCol.appendChild(cardSpace);
    laneRow.appendChild(laneCol);
  });
  loadTasks();
}

async function loadTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  lanes.forEach((lane) => (document.getElementById(lane.id).innerHTML = ''));
  tasks.forEach((task) => {
    document.getElementById(task.position).appendChild(createTaskCard(task));
  });
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.id = task.id;
  card.className = 'card mb-2';
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  const cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.innerHTML = task.description;
  const deleteBtn = document.createElement('Button');
  deleteBtn.className = 'btn btn-outline-dark';
  deleteBtn.innerHTML = "<img src='/assets/icons/trash-fill.svg'>";
  deleteBtn.onclick = () => {
    deleteTask(task.id);
  };
  cardBody.appendChild(cardTitle);
  if (task.position >= 1) {
    cardBody.appendChild(createMoveBtn(task, -1));
  }
  cardBody.appendChild(deleteBtn);
  if (task.position < lanes.length - 1) {
    cardBody.appendChild(createMoveBtn(task, 1));
  }
  card.appendChild(cardBody);
  card.draggable = 'true';
  card.setAttribute('ondragstart', 'drag(event)');
  return card;
}

function createMoveBtn(task, direction) {
  const cardMoveBtn = document.createElement('button');
  cardMoveBtn.className = 'btn btn-outline-dark';
  if (direction == -1) {
    cardMoveBtn.innerHTML = "<img src='/assets/icons/arrow-left.svg'>";
  } else cardMoveBtn.innerHTML = "<img src='/assets/icons/arrow-right.svg'>";
  cardMoveBtn.onclick = function () {
    moveTask(task, direction);
  };
  return cardMoveBtn;
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
  await loadTasks();
}

function allowDrop(ev) {
  if (ev.target.id) ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('text');
  changePosition(data, ev.target.id);
}

async function changePosition(taskId, position) {
  var description = document.getElementById(taskId).querySelector('.card-title')
    .innerHTML;
  var task = {
    id: taskId,
    description: description,
    position: parseInt(position),
  };
  await fetch('/tasks/' + task.id, {
    method: 'PUT',
    body: JSON.stringify(task),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await loadTasks();
}

loadLanes();
