async function handleCreateEvent() {

    const title =
        document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const location =
        document.getElementById("location").value.trim();

    const rawDate =
        document.getElementById("date").value;

    if (!title || !description || !location || !rawDate) {

        showMessage(
            "Please fill all fields",
            "text-danger"
        );

        return;
    }

    const formattedDate = rawDate + ":00";

    const data = {
        title: title,
        description: description,
        location: location,
        date: formattedDate
    };

    try {

        const response = await fetch("/events", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {

            showMessage(
                "Event created successfully!",
                "text-success"
            );

            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            document.getElementById("location").value = "";
            document.getElementById("date").value = "";

        } else {

            showMessage(
                result.error || "Failed to create event",
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