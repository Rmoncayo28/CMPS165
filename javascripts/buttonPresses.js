function activeEduButton() {
    if (document.getElementById("button_education").value == "true") {
        document.getElementById("button_education").value = "false";
        document.getElementById("button_education").className = '';
    } else {
        document.getElementById("button_education").value = "true";
        document.getElementById("button_education").className = "active";
    }
}

function activeHealthButton() {
    if (document.getElementById("button_health").value == "true") {
        document.getElementById("button_health").value = "false";
        document.getElementById("button_health").className = '';
    } else {
        document.getElementById("button_health").value = "true";
        document.getElementById("button_health").className = "active";
    }
}

function activePovertyButton() {
    if (document.getElementById("button_poverty").value == "true") {
        document.getElementById("button_poverty").value = "false";
        document.getElementById("button_poverty").className = '';
    } else {
        document.getElementById("button_poverty").value = "true";
        document.getElementById("button_poverty").className = "active";
    }
}