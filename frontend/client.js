let position;
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const task = {
        description: document.querySelector("input").value,
        position: position
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

async function loadLanes() {
    const response = await fetch("/lanes");
    const lanes = await response.json();
    console.log("lanes", lanes)
    const laneRow = document.getElementById("laneRow");
    console.log("LANEROW", laneRow)
    lanes.forEach(lane => {
        let laneCol = document.createElement("div");
        laneCol.className = "col bg-light vh-80 border-right";

        let titelRow = document.createElement("div");
        titelRow.className = "row mb-4";
        titelRow.style.backgroundColor = lane.color;

        let titel = document.createElement("h2");
        titel.className = "text-light mx-auto";
        titel.innerText = lane.titel;

        let cardSpace = document.createElement("div");
        cardSpace.id = lane.id;

        let createBtn = document.createElement("button");
        createBtn.innerText = '+'
        createBtn.className="btn btn-outline-dark mb-4"
        createBtn.onclick = ()=>{position = lane.id};
        createBtn.setAttribute("data-toggle","modal");
        createBtn.setAttribute("data-target", "#taskModal");

        titelRow.appendChild(titel);

        laneCol.appendChild(titelRow);
        laneCol.appendChild(createBtn);
        laneCol.appendChild(cardSpace);
        laneRow.appendChild(laneCol);
        }
        );
}

async function loadtasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();
    const todo = document.getElementById("0");
    const inprogress = document.getElementById("1");
    const done = document.getElementById("2");
    todo.innerHTML='';
    inprogress.innerHTML='';
    done.innerHTML='';
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
loadLanes();
loadtasks();