async function loadEvents() {
    const res = await fetch("/events");
    const data = await res.json();

    const list = document.getElementById("events");
    list.innerHTML = "";

    data.forEach(e => {
        const li = document.createElement("li");
        li.innerText = `${e.title} - ${e.location}`;
        list.appendChild(li);
    });
}

async function createNewEvent() {
    const data = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        date: document.getElementById("date").value
    };

    await fetch("/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}