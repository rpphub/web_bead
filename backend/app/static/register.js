async function loadEvents() {

    try {

        const response = await fetch("/events");

        const events = await response.json();

        const select =
            document.getElementById("eventSelect");

        select.innerHTML = "";

        events.forEach(event => {

            const option =
                document.createElement("option");

            option.value = event.id;

            option.textContent =
                `${event.title} - ${event.location}`;

            select.appendChild(option);
        });

    } catch (error) {

        console.error(error);

        showMessage(
            "Failed to load events",
            "text-danger"
        );
    }
}

async function registerToEvent() {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const eventId =
        parseInt(
            document.getElementById("eventSelect").value
        );

    if (!name || !email || !eventId) {

        showMessage(
            "Please fill all fields",
            "text-danger"
        );

        return;
    }

    const data = {
        event_id: eventId,
        name: name,
        email: email
    };

    try {

        const response = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {

            showMessage(
                "Registration successful!",
                "text-success"
            );

            document.getElementById("name").value = "";
            document.getElementById("email").value = "";

        } else {

            showMessage(
                result.error || "Registration failed",
                "text-danger"
            );
        }

    } catch (error) {

        console.error(error);

        showMessage(
            "Server error",
            "text-danger"
        );
    }
}

function showMessage(message, className) {

    const messageDiv =
        document.getElementById("message");

    messageDiv.textContent = message;

    messageDiv.className =
        `mt-3 text-center ${className}`;
}

loadEvents();