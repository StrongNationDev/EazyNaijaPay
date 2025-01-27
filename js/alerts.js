function showAlert(message) {
    let alertBox = document.getElementById("alertBox");
    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "alertBox";
        alertBox.classList.add("alert-box");

        const alertMessage = document.createElement("div");
        alertMessage.id = "alertMessage";
        alertMessage.classList.add("alert-message");

        const closeButton = document.createElement("button");
        closeButton.id = "closeButton";
        closeButton.classList.add("alert-button");
        closeButton.innerHTML = "Okay";

        alertBox.appendChild(alertMessage);
        alertBox.appendChild(closeButton);

        document.body.appendChild(alertBox);

        closeButton.addEventListener("click", closeAlert);
    }
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;

    alertBox.classList.add("active");
}

function closeAlert() {
    const alertBox = document.getElementById("alertBox");
    alertBox.classList.remove("active");
}
