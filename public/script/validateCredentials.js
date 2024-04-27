
function validateUsername() {
    let enteredUsername = document.getElementById("username").value;
    return enteredUsername.match(/\b[a-zA-Z0-9]+\b/);
}
function validatePassword() {
    let enteredPassword = document.getElementById("password").value;
    console.log("Validating passwoord" + enteredPassword);
    return enteredPassword.match(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,}$/);
}

function validateForm() {
    let toReturn = true;
    if (!validateUsername()) {
        document.getElementById('username_issue').style.display = 'block';
        toReturn = false;
    } else {
        document.getElementById('username_issue').style.display = 'none';
    }

    if (!validatePassword()) {
        document.getElementById('password_issue').style.display = 'block';
        toReturn = false;
    } else {
        document.getElementById('password_issue').style.display = 'none';
    }

    return toReturn;
}

document.getElementById('signup').addEventListener('submit', (event) => {
    // Perform client-side verifications
    if (!validateForm()) {
        // Prevent the default form submission behavior
        event.preventDefault();
        // If verifications pass, submit the form
    }
});