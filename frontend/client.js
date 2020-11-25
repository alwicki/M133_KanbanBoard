const form = document.querySelector("form");
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
    await loadtasks();
});

async function loadtasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    const ul = document.querySelector("ul");
    ul.innerHTML = "";

    for (const task of tasks) {
        ul.innerHTML += `<li>${task.description}</li>`;
    }
}
loadtasks();