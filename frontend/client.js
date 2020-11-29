const form = document.querySelector("form");
console.log(form);
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const task = {
        description: document.querySelector("input").value
    }

    document.querySelector("input").value = "";

    await fetch(
        "/tasks",
        {
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
        });
    $('#taskModal').modal('hide')
    await loadtasks();
});
function createTaskRow(task){
    const card = document.createElement("div");
    card.className = "card mb-2";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body"
    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title"
    cardTitle.innerHTML =task.description;
    cardBody.appendChild(cardTitle);
    card.appendChild(cardBody);
    return card;
}

async function loadtasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();
    const todo = document.getElementById("0");
    const inprogress = document.getElementById("1");
    const done = document.getElementById("2");
    todo.innerHTML='';
    todo.inprogress='';
    todo.done='';
    tasks.forEach(task => {
        switch (task.position) {
            case 0:
                todo.appendChild(createTaskRow(task));
                break;
            case 1:
                inprogress.appendChild(createTaskRow(task));
                break;
            default:
                done.appendChild(createTaskRow(task));
                break;
        }
    });
}
loadtasks();