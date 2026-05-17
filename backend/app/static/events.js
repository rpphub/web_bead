let currentPage = 1;
const limit = 10;

async function loadEvents(page = 1) {

    currentPage = page;

    const response = await fetch(`/events?page=${page}&limit=${limit}`);
    const data = await response.json();

    const events = data.data;
    const totalPages = Math.ceil(data.total / limit);   

    const container = document.getElementById("eventsContainer");
    container.innerHTML = "";

    events.forEach(event => {

        container.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">

                        <h5 class="card-title">${event.title}</h5>

                        <p>${event.description}</p>

                        <p><strong>Helyszín:</strong> ${event.location}</p>
                        <p><strong>Időpont:</strong> ${event.date}</p>

                        <p><strong>Regisztráltak:</strong> ${event.registration_count}</p>

                        <button class="btn btn-outline-primary btn-sm"
                            onclick="toggleRegistrations(${event.id})">
                            Kik lesznek ott
                        </button>

                        <div id="registrations-${event.id}"
                             class="mt-3"
                             style="display:none;">
                        </div>

                    </div>
                </div>
            </div>
        `;
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {

    const pagination = document.getElementById("pagination");

    let html = "";

    // prev
    html += `
        <button class="btn btn-outline-secondary mx-1"
            onclick="loadEvents(${currentPage - 1})"
            ${currentPage === 1 ? "disabled" : ""}>
            «
        </button>
    `;

    // pages
    for (let i = 1; i <= totalPages; i++) {

        html += `
            <button class="btn ${i === currentPage ? "btn-primary" : "btn-outline-primary"} mx-1"
                onclick="loadEvents(${i})">
                ${i}
            </button>
        `;
    }

    // next
    html += `
        <button class="btn btn-outline-secondary mx-1"
            onclick="loadEvents(${currentPage + 1})"
            ${currentPage === totalPages ? "disabled" : ""}>
            »
        </button>
    `;

    pagination.innerHTML = html;
}

async function toggleRegistrations(eventId) {

    const container =
        document.getElementById(
            `registrations-${eventId}`
        );

    if (container.style.display === "none") {

        const response =
            await fetch(
                `/events/${eventId}/registrations`
            );

        const registrations =
            await response.json();

        if (registrations.length === 0) {

            container.innerHTML =
                "<p>No registrations yet.</p>";

        } else {

            let html =
                "<ul class='list-group'>";

            registrations.forEach(reg => {

                html += `

                    <li class="list-group-item">

                        <strong>${reg.name}</strong>
                        <br>
                    </li>
                `;
            });

            html += "</ul>";

            container.innerHTML = html;
        }

        container.style.display = "block";

    } else {

        container.style.display = "none";
    }
}

loadEvents();