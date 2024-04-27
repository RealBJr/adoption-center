const encodedData = document.getElementById('data').getAttribute('data');
const serverMatches = JSON.parse(decodeURIComponent(encodedData));
let catalog = JSON.parse(serverMatches);
// Initialize position
let position = 0;
let previousEl = document.getElementById("previous");
let nextEl = document.getElementById("next");


window.onload = () => {
    if (Object.keys(catalog).length !== 0) {
        document.getElementById('displayer').className = 'display';
        launchView();
    }
}

function launchView() {
    const displayable = document.getElementById('displayable');
    const displayer = document.getElementById('displayer');

    if (displayable.getAttribute('mode') === 'list' && displayer.className === 'display') {
        show(document.getElementById('list'))
        displayable.addEventListener('click', toSlideShow);
        displayable.textContent = 'Slideshow view';
    } else if (displayable.getAttribute('mode') === 'slideshow' && displayer.className === 'display') {
        displaySlideShow(position);
        show(document.getElementById('list'))
        displayable.addEventListener('click', toList);
        displayable.textContent = 'List view';
    } else {
        console.log('unexpected error');
    }
}

function toSlideShow() {
    const displayable = document.getElementById('displayable');
    displayable.setAttribute('mode', 'slideshow');
    document.getElementById('slideshow').className = 'on';
    document.getElementById('list').className = 'off';
    displaySlideShow(position);
    document.getElementById("previous").addEventListener("click", prev);
    document.getElementById("next").addEventListener("click", next);
    displayable.textContent = 'List view';

    displayable.removeEventListener('click', toSlideShow);
    displayable.addEventListener('click', toList);
}

function toList() {
    const displayable = document.getElementById('displayable');
    displayable.setAttribute('mode', 'list');
    document.getElementById('list').className = 'on';
    document.getElementById('slideshow').className = 'off';
    displayable.textContent = 'Slideshow view';

    displayable.removeEventListener('click', toList);
    displayable.addEventListener('click', toSlideShow);
}

let defaultPics = { chowchow: true, husky: true, samoyed: true, 'american bobtail': true, birman: true, 'british shorthair': true }
// Define the prev function
const prev = () => {
    position = position == 0 ? catalog.length - 1 : position - 1;
    let pet = catalog[position];
    if (defaultPics[pet.breed]) {
        document.getElementById("photo").style.backgroundImage = `url(../images/${pet.breed}.jpg)`;
    } else {
        document.getElementById("photo").style.backgroundImage = `url(../images/${pet.animal}-silouhette.png)`;
    }
    displaySlideShow(position);
}

// Define the next function
const next = () => {
    position = position == catalog.length - 1 ? 0 : position + 1;
    let pet = catalog[position];
    if (defaultPics[pet.breed]) {
        document.getElementById("photo").style.backgroundImage = `url(../images/${pet.breed}.jpg)`;
    } else {
        document.getElementById("photo").style.backgroundImage = `url(../images/${pet.animal}-silouhette.png)`;
    }
    displaySlideShow(position);
}


const displaySlideShow = index => {
    const pet = catalog[index];
    if (defaultPics[pet.breed]) {
        console.log(`${pet.breed}.jpg)`)
        document.getElementById("photo").style.backgroundImage = `url('../images/${pet.breed}.jpg')`;
    } else {
        document.getElementById("photo").style.backgroundImage = `url(../images/${pet.animal}-silouhette.png)`;
    }
    console.log(pet)
    // Update each information field with the corresponding data
    document.getElementById("slideshow-name").textContent = `Name: ${pet.owner}'s`;
    document.getElementById("slideshow-breed").textContent = `Breed: ${pet.breed}`;
    document.getElementById("slideshow-age").textContent = `Age: ${pet.age} ${pet.animal} year(s) old`;
    document.getElementById("slideshow-gender").textContent = `Gender: ${pet.gender}`;
    document.getElementById("slideshow-dog-friendly").textContent = `Dog Friendly: ${pet.dogFriendly ? "Yes" : "No"}`;
    document.getElementById("slideshow-cat-friendly").textContent = `Cat Friendly: ${pet.catFriendly ? "Yes" : "No"}`;
    document.getElementById("slideshow-child-friendly").textContent = `Child Friendly: ${pet.childFriendly ? "Yes" : "No"}`;
};

const show = element => {
    switch (element.id) {
        case "list": {
            // Get the parent container
            const parent = document.getElementById('list');

            // Loop through the catalog
            for (let i = 0; i < catalog.length; i++) {
                const pet = catalog[i];

                // Create a div for each pet
                let petDiv = document.createElement('div');
                petDiv.className = 'pet';

                // Create spans for each property and set their text content
                let infoName = document.createElement('span');
                infoName.textContent = `Name: ${pet.owner}\n`;
                let infoBreed = document.createElement('span');
                infoBreed.textContent = `Breed: ${pet.breed}\n`;
                let infoAge = document.createElement('span');
                infoAge.textContent = `Age: ${pet.age}\n`;
                let infoGender = document.createElement('span');
                infoGender.textContent = `Gender: ${pet.gender}\n`;
                let infoDogFriendly = document.createElement('span');
                infoDogFriendly.textContent = `Dog Friendly: ${pet.dogFriendly ? 'Yes' : 'No'}\n`;
                let infoCatFriendly = document.createElement('span');
                infoCatFriendly.textContent = `Cat Friendly: ${pet.catFriendly ? 'Yes' : 'No'}\n`;
                let infoChildFriendly = document.createElement('span');
                infoChildFriendly.textContent = `Child Friendly: ${pet.childFriendly ? 'Yes' : 'No'}\n`;

                // Append spans to the petDiv
                petDiv.appendChild(infoName);
                petDiv.appendChild(infoBreed);
                petDiv.appendChild(infoAge);
                petDiv.appendChild(infoGender);
                petDiv.appendChild(infoDogFriendly);
                petDiv.appendChild(infoCatFriendly);
                petDiv.appendChild(infoChildFriendly);

                // Append the petDiv to the parent container
                parent.appendChild(petDiv);
            }
            break;
        }
        default: {
            console.log("Error in display")
            return;
        }
    }
}

