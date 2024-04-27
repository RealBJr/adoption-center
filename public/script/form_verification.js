let animals = document.getElementById("animal");
let genInputs = document.getElementById("general-info");
let ownerFields = document.getElementById("owner-info");

//Display the clicked checked animal
function display() {
    for (let i = 0; i < animals.getElementsByTagName("input").length; i++) {
        if (animals.getElementsByTagName("input")[i].checked) {
            document.getElementById(animals.getElementsByTagName("input")[i].value).style.display = "block";
        } else {
            document.getElementById(animals.getElementsByTagName("input")[i].value).style.display = "none";
        }
    }
}

for (let i = 0; i < animals.getElementsByTagName("input").length; i++) {
    animals.getElementsByTagName("input")[i].addEventListener("change", display)
}

const validateForm = () => {
    let form = document.getElementById('find') || document.getElementById('surface-info'); // Get the form

    // Check if form exists
    if (!form) {
        console.error("Form not found!");
        return false; // Return false if form is not found
    }

    // Check animal selected
    let animals = form.querySelector('#animal');
    let checkedAnimals = animals.querySelectorAll('input[name="animal"]:checked');
    if (checkedAnimals.length === 0) {
        alert("Please select either a cat or a dog.");
        return false;
    }

    // Check general information
    let genInfo = form.querySelector('#general-info');
    let checkedGenInfo = genInfo.querySelectorAll('input[type="radio"]:checked');
    if (checkedGenInfo.length !== 4) {
        alert("Please fill out all general information fields.");
        return false;
    }

    // Check specific animal info
    let specificAnimalInfo = checkedAnimals[0].value;
    let animalSpecificInfo = form.querySelector('#' + specificAnimalInfo);
    let selects = animalSpecificInfo.querySelectorAll('select');
    for (let select of selects) {
        if (select.value === "none") {
            alert("Please fill the animal's information correctly.");
            return false;
        }
    }

    // Check owner information
    let ownerInfo = form.querySelector('#owner-info');
    let ownerInputs = ownerInfo.querySelectorAll('input[type="text"]');
    for (let input of ownerInputs) {
        if (!input.value) {
            alert("Please enter all owner information.");
            return false;
        }
    }

    // Check additional comment
    let additionalComment = form.querySelector('#additional');
    if (!additionalComment.value || additionalComment.value === "Sell your pet! What are his best traits?") {
        alert("Please comment on your pet.");
        return false;
    }

    // Validate email
    let emailInput = form.querySelector('input[name="email"]');
    if (!validateEmail(emailInput.value)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // All validation passed, return true
    return true;
}

let form1 = document.getElementById('find');
let form2 = document.getElementById('surface-info');
if (form1) {

    form1.addEventListener('submit', (e) => {
        // Perform client-side verifications
        if (validateForm()) {
            // If verifications pass, submit the form
        } else {
            // Prevent the default form submission behavior
            console.log("INVALID FORM");
            e.preventDefault();
            console.log('Submitted form');
        }
    })
}

if (form2) {
    form2.addEventListener('submit', (e) => {
        // Perform client-side verifications
        if (validateForm()) {
            // If verifications pass, submit the form
        } else {
            // Prevent the default form submission behavior
            console.log("INVALID FORM");
            e.preventDefault();
            console.log('Submitted form');
        }
    })
}

//for the clear button, make sure that the specific form is not displayed
function reset() {
    for (let i = 0; i < animals.getElementsByTagName("input").length; i++) {
        document.getElementById(animals.getElementsByTagName("input")[i].value).style.display = "none";
    }
}

function validateEmail(email) {
    let str = String(email);
    return str.match(/\b\w+@\w+\.(com|ca|org|edu|gov|net)\b/);
}

document.getElementById("clear").addEventListener("click", reset);