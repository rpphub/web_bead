async function loadEvents() {

    const res = await fetch("/events");
    const events = await res.json();

    const container = document.getElementById("eventsContainer");

    container.innerHTML = "";

    events.forEach(event => {

        container.innerHTML += `
            <div class="col-md-6 col-lg-4">

                <div class="card h-100 shadow-sm">

                    <div class="card-body">

                        <h5 class="card-title">
                            ${event.title}
                        </h5>

                        <p class="card-text">
                            ${event.description}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${event.location}
                        </p>

                        <p>
                            <strong>Date:</strong>
                            ${event.date}
                        </p>

                    </div>

                </div>

            </div>
        `;
    });
}

loadEvents();