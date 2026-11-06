
const API = "/api/vehicles";

// ADD VEHICLE
const vehicleForm = document.getElementById("vehicleForm");

if (vehicleForm) {
    vehicleForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.getElementById("formMessage");
        message.textContent = "Saving vehicle...";

        const vehicle = {
            vehicle_num: document.getElementById("vehicle_num").value,
            vehicle_time: document.getElementById("vehicle_time").value,
            model: document.getElementById("model").value,
            rent_per_day: document.getElementById("rent_per_day").value,
            status: document.getElementById("status").value
        };

        try {
            const response = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehicle)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            message.textContent = "Vehicle added successfully!";
            vehicleForm.reset();
        } catch (error) {
            message.textContent = error.message || "Unable to save vehicle.";
        }
    });
}

// DISPLAY VEHICLES
const vehicleTable = document.getElementById("vehicleTable");

if (vehicleTable) {
    loadVehicles();
}

async function loadVehicles() {
    try {
        const response = await fetch(API);
        const vehicles = await response.json();

        if (!response.ok) throw new Error("Unable to load vehicles.");

        vehicleTable.replaceChildren();

        if (vehicles.length === 0) {
            vehicleTable.innerHTML =
                '<tr><td colspan="7">No vehicles found.</td></tr>';
            return;
        }

        vehicles.forEach(vehicle => {
            const row = document.createElement("tr");

            const values = [
                vehicle.vehicle_id,
                vehicle.vehicle_num,
                vehicle.vehicle_time,
                vehicle.model,
                "₹" + vehicle.rent_per_day,
                vehicle.status
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            const actions = document.createElement("td");

            const updateLink = document.createElement("a");
            updateLink.textContent = "Update";
            updateLink.href =
                "update-vehicle.html?id=" +
                encodeURIComponent(vehicle.vehicle_id);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = "10px";

            deleteButton.addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete this vehicle?")) {
                    return;
                }

                const message = document.getElementById("listMessage");
                message.textContent = "Deleting vehicle...";

                try {
                    const result = await fetch(
                        `${API}/${vehicle.vehicle_id}`,
                        { method: "DELETE" }
                    );

                    const data = await result.json();

                    if (!result.ok) throw new Error(data.message);

                    message.textContent = "Vehicle deleted successfully!";
                    loadVehicles();
                } catch (error) {
                    message.textContent =
                        error.message || "Unable to delete vehicle.";
                }
            });

            actions.append(updateLink, deleteButton);
            row.appendChild(actions);
            vehicleTable.appendChild(row);
        });
    } catch (error) {
        vehicleTable.innerHTML =
            '<tr><td colspan="7">Unable to load vehicles.</td></tr>';
    }
}

// LOAD SELECTED VEHICLE FOR UPDATE
const updateForm = document.getElementById("updateVehicleForm");

if (updateForm) {
    const id = new URLSearchParams(window.location.search).get("id");
    const message = document.getElementById("updateMessage");

    if (!id) {
        message.textContent = "Vehicle ID is missing.";
        updateForm.querySelector('button[type="submit"]').disabled = true;
    } else {
        loadSelectedVehicle(id);
    }

    async function loadSelectedVehicle(vehicleId) {
        try {
            const response = await fetch(`${API}/${vehicleId}`);
            const vehicle = await response.json();

            if (!response.ok) throw new Error(vehicle.message);

            Object.keys(vehicle).forEach(key => {
                const field = updateForm.elements.namedItem(key);
                if (field) field.value = vehicle[key];
            });
        } catch (error) {
            message.textContent = "Unable to load vehicle details.";
        }
    }

    updateForm.addEventListener("submit", async event => {
        event.preventDefault();
        message.textContent = "Updating vehicle...";

        const vehicle = {
            vehicle_num: updateForm.elements.vehicle_num.value,
            vehicle_time: updateForm.elements.vehicle_time.value,
            model: updateForm.elements.model.value,
            rent_per_day: updateForm.elements.rent_per_day.value,
            status: updateForm.elements.status.value
        };

        try {
            const response = await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehicle)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            message.textContent = "Vehicle updated successfully!";
        } catch (error) {
            message.textContent = error.message || "Unable to update vehicle.";
        }
    });
}
