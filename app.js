const express = require('express');
const session = require('express-session')
const path = require('path');
const fs = require('fs');
const url = require('url');
const bodyParser = require('body-parser');
const app = express();
const port = 5211;

const header = (username) => {
    return {
        default: `<header id="brand-signature">
        <!--Logo + Brand Name, repeated-->
        <div id = "logo_and_clock">
        <section id="centerpiece">
            <h1><a href="index.ejs">Paws And Fur</a></h1>
            <time id="date"></time>
        </section>
        <a href="index.ejs"><img src="../images/logo-secondary.png" alt="dog-logo-paws-and-fur"></a>
        </div>
        <div id="authentication">
        ${username ? `<b>Connected as ${username}</b>, <a href="logout.ejs">Log Out</a>` : `<a href="login.ejs">Log In</a>&sol;<a href="signup.ejs">Sign Up</a>`}
        </div>
        </header>`,
        care: `<header id="brand-signature">
        <!--Logo + Brand Name, repeated-->
        <div id = "logo_and_clock">
        <section id="centerpiece">
            <h1><a href="../index.ejs">Paws And Fur</a></h1>
            <time id="date"></time>
        </section>
        <a href="../index.ejs"><img src="../../images/logo-secondary.png" alt="dog-logo-paws-and-fur"></a>
        </div>
        <div id="authentication">
        ${username ? `<b>Connected as ${username} </b>, <a href="../logout.ejs">Log Out</a>` : `<a href="../login.ejs">Log In</a>&sol;<a href="../signup.ejs">Sign Up</a>`}
        </div>
        </header>`,
        authentication: `<header id="brand-signature">
        <!--Logo + Brand Name, repeated-->
        <div id = "logo_and_clock">
        <section id="centerpiece">
            <h1><a href="../index.ejs">Paws And Fur</a></h1>
            <time id="date"></time>
        </section>
        <a href="index.ejs"><img src="../images/logo-black.png" alt="dog-logo-paws-and-fur"></a>
        </div>
        </header>`
    }
};

const footer = () => {
    return {
        care: `<footer>
        <!-- Privacy/Disclaimer Statement, repeated -->
        <a href="../disclaimer.ejs">Privacy Disclaimer Statement</a>
        </footer>`,
        default: `<footer>
        <!-- Privacy/Disclaimer Statement, repeated -->
        <a href="disclaimer.ejs">Privacy Disclaimer Statement</a>
        </footer>`
    }
};

/**
 * Look for the animals with the specified parameters
 * @param {*} jsonSaught 
 */
function findInCatalog(jsonSought) {
    const jsonCatalog = jsonifyCatalogFile(path.join(__dirname, 'available_pets.txt'));
    let entriesToReturn = []; // Array to store matching entries

    for (let index in jsonCatalog) {
        let entry = jsonCatalog[index];
        let animalSought = jsonSought.animal;
        let dogBreedSought;
        let dogAgeSought;
        let catBreedSought;
        let catAgeSought;
        let genderSought = jsonSought.gender;
        let dogAmicableSought = jsonSought['dog-amicable'];
        let catAmicableSought = jsonSought['cat-amicable'];
        let childrenAmicableSought = jsonSought['children-amicable'];

        if (animalSought == 'dog') {
            dogBreedSought = jsonSought.dog_breed;
            dogAgeSought = jsonSought.dog_age;
            if (verifyDog(entry, dogBreedSought, dogAgeSought, genderSought, dogAmicableSought, catAmicableSought, childrenAmicableSought)) {
                entriesToReturn.push(entry); // Add the entry to the array if it matches
            }
        } else if (animalSought == 'cat') {
            catBreedSought = jsonSought.cat_breed;
            catAgeSought = jsonSought.cat_age;
            if (verifyCat(entry, catBreedSought, catAgeSought, genderSought, dogAmicableSought, catAmicableSought, childrenAmicableSought)) {
                entriesToReturn.push(entry); // Add the entry to the array if it matches
            }
        } else {
            continue;
        }
    }
    const jsonFormatStringToReturn = JSON.stringify(entriesToReturn); // Convert the array to JSON string
    return jsonFormatStringToReturn;
}

function verifyDog(entry, breedSought, ageSought, genderSought, dogAmicableSought, catAmicableSought, childrenAmicableSought) {
    return entry.animal === 'dog' &&
        (breedSought === 'dne' || entry.breed === breedSought) &&
        (checkAgeRange(entry.age, ageSought) || ageSought === 'dne') &&
        (genderSought === 'either' || entry.gender === genderSought) &&
        (dogAmicableSought === 'true' ? entry.dogFriendly : true) &&
        (catAmicableSought === 'true' ? entry.catFriendly : true) &&
        (childrenAmicableSought === 'true' ? entry.childFriendly : true);
}

function verifyCat(entry, breedSought, ageSought, genderSought, dogAmicableSought, catAmicableSought, childrenAmicableSought) {
    return entry.animal === 'cat' &&
        (breedSought === 'dne' || entry.breed === breedSought) &&
        (checkAgeRange(entry.age, ageSought) || ageSought === 'dne') &&
        (genderSought === 'either' || entry.gender === genderSought) &&
        (dogAmicableSought === 'true' ? entry.dogFriendly : true) &&
        (catAmicableSought === 'true' ? entry.catFriendly : true) &&
        (childrenAmicableSought === 'true' ? entry.childFriendly : true);
}

function checkAgeRange(entryAge, soughtAge) {
    if (soughtAge === 'dne') return true; // Doesn't matter
    const ageRange = soughtAge.split('-').map(Number);
    const entryAgeInt = parseInt(entryAge);
    return entryAgeInt >= ageRange[0] && entryAgeInt <= ageRange[1];
}

const dynamicContent = (key, sessionUsername, toFind) => {
    switch (key) {
        case "default": {
            return { header: header(sessionUsername).default, footer: footer().default };
        }

        case "care": {
            return { header: header(sessionUsername).care, footer: footer().care };
        }

        case "authentication": {
            return { header: header(sessionUsername).authentication, footer: footer().default };
        }

        case "signup": {
            return { header: header().authentication, footer: footer().default, username: "<p></p>" };
        }

        case "login": {
            return { header: header().authentication, footer: footer().default, credentials: "<p></p>" };
        }

        case "logout": {
            return { header: header().authentication, footer: footer().default, goodbye: "<p></p>" };
        }

        case "find": {
            return { header: header(sessionUsername).authentication, footer: footer().default, matches: findInCatalog(toFind) };
        }

        default: {
            return null;
        }
    }
}

// Serve static files from the public directory; all my static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false, // Don't save session if not modified
    saveUninitialized: false // Don't want the session to be reinitialized everytime 
}));

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set the ejs view
app.set('views', path.join(__dirname, 'public', 'views'));
app.set("view engine", "ejs");

// Route to serve the index file
app.get('/', (req, res) => {
    res.render("index", dynamicContent("default", req.session.username));
});

// Route to serve the index file
app.get('/index.ejs', (req, res) => {
    res.render("index", dynamicContent("default", req.session.username));
});

// Route to serve the give away file
app.get('/give_away.ejs', (req, res) => {
    if (req.session.username) {
        res.render("give_away", dynamicContent("default", req.session.username));
    } else {
        res.redirect('/login.ejs');
    }
});
// Route to serve the give away file
app.post('/giveaway', (req, res) => {
    if (req.session.username) {
        inputInCatalog(req.body);
        res.render("validGiveAway", dynamicContent("default", req.session.username));
    } else {
        res.redirect('/login.ejs');
    }
});

// Route to serve the find file
app.get('/find.ejs', (req, res) => {
    res.render("find", dynamicContent("find", req.session.username, url.parse(req.url, true).query));
});

// Route to serve the find form
app.get('/find', (req, res) => {
    res.render("find", dynamicContent("find", req.session.username, req.query));
});

// Route to serve the disclaimer file
app.get('/disclaimer.ejs', (req, res) => {
    res.render("disclaimer", dynamicContent("default", req.session.username));
});

// Route to serve the contact us file
app.get('/contact_us.ejs', (req, res) => {
    res.render("contact_us", dynamicContent("default", req.session.username));
});

// Route to serve the login file, unless already logged in
app.get('/login.ejs', (req, res) => {
    if (req.session.username) {
        res.render('index', dynamicContent("default", req.session.username));
    } else {
        res.render("login", dynamicContent("login", null));
    }
});

// Route to serve the signup file, unless already logged in
app.get('/signup.ejs', (req, res) => {
    if (req.session.username) {
        res.render("signup", dynamicContent("default", req.session.username));
    } else {
        res.render("signup", dynamicContent("signup", null));
    }
});

// Route to serve the logout file, unless already logged in
app.get('/logout.ejs', (req, res) => {
    const tempUsername = req.session.username;
    req.session.destroy();
    const content = dynamicContent("logout", null);
    content.goodbye = `<p> See you soon ${tempUsername}!`
    res.render("logout", content);
});

// Route to serve the cat care file
app.get('/care/cat.ejs', (req, res) => {
    res.render("care/cat", dynamicContent("care", req.session.username));
});

// Route to serve the dog care file
app.get('/care/dog.ejs', (req, res) => {
    res.render("care/dog", dynamicContent("care", req.session.username));
});

// Route to serve login
app.post('/login', (req, res) => {
    const content = dynamicContent('login');
    try {
        if (authenticate(req.body)) {
            content.credentials = `<p>Welcome ${req.body.username}, please look at our dog catalog</p>`;
            req.session.username = req.body.username;
            res.render('validLogIn', content);
        } else {
            content.credentials = `<p>Please enter a valid username or valid password</p>`
            res.render('login', content);
        }
    } catch (error) {
        console.log('Error when logging in' + error);
    }
});

// Route to serve signup
app.post('/signup', (req, res) => {
    const content = dynamicContent('signup');
    try {
        if (createAccount(req.body)) {
            content.username = `<p> Welcome ${req.body.username}! We are pleased that you have decided to join us on this marvellous journey.</p>
            <br>
            <p>Log in using the previously entered credentials!</p>`;
            res.render('validSignUp', content);
        } else {
            content.username = `<p id="taken">${req.body.username} have been taken. Please enter another username.</p>`;
            res.render('signup', content);
        }
    } catch (error) {
        console.log('Error when signing up' + error);
    }
});

app.listen(port, () => { console.log(`server.js running at ${port}`) });

/**
 * Check if the username and passwords are within the credentials map
 * @param {} login 
 */
function authenticate(login) {
    let username = login.username;
    let password = login.password;
    let filePath = path.join(__dirname, 'credentials.txt');

    try {
        let jsonCreds = jsonifyCredentialsFile(filePath);
        // if username does not exist, it will evaluate as undefined and the equation will be false
        return jsonCreds[username] === password;
    } catch (error) {
        console.log('Error when athenticating: ' + error);
        throw error;
    }
}

/**
 * Turn content of file into json object
 * @param {} filePath 
 * @returns 
 */
function jsonifyCredentialsFile(filePath) {
    let jsonFormattedString = "";
    // Read the file synchronously
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Process each line
    const lines = fileContent.split('\n');
    lines.forEach((line, index) => {
        if (line.length != 0) {
            let jsonAttributes = line.split(':');
            let jsonFormattedKey = '"' + jsonAttributes[0] + '"';
            let jsonFormattedValue = '"' + jsonAttributes[1] + '"';
            jsonFormattedString += (jsonFormattedString.length > 0 ? ", " : "") + jsonFormattedKey + ":" + jsonFormattedValue;
        }
    });
    // Wrap the content in JSON format
    const wrappedContent = `{${jsonFormattedString}}`;
    return JSON.parse(wrappedContent);
}
/**
 * Turn content of file into json object
 * 
 * Format of lines:
 * catalogIndex + ":" + owner + ":" + animal + ":" + breed + ":" + age + ":" + gender + ":" + dogFriendly + ":" + catFriendly + ":" + childFriendly + '\n';
 * @param {} filePath 
 * @returns 
 */
function jsonifyCatalogFile(filePath) {
    // Read the file synchronously
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const lines = fileContent.split('\n');
    let jsonObject = {};

    lines.forEach(line => {
        if (line.length !== 0) {
            const jsonAttributes = line.split(':');
            const id = jsonAttributes[0].trim(); // Assuming the first attribute is the ID
            const owner = jsonAttributes[1].trim(); // Assuming the second attribute is the owner
            const attributes = jsonAttributes.slice(2).map(attr => attr.trim());

            jsonObject[id] = {
                "owner": owner,
                "animal": attributes[0],
                "breed": attributes[1],
                "age": attributes[2],
                "gender": attributes[3],
                "dogFriendly": attributes[4],
                "catFriendly": attributes[5],
                "childFriendly": attributes[6]
            };
        }
    });

    const jsonString = JSON.stringify(jsonObject);
    return JSON.parse(jsonString);
}

/**
 * Add the account information as JSON style formats into the credentials.txt file
 * @param {} credentials 
 * @returns 
*/
function createAccount(credentials) {
    let username = credentials.username;
    let password = credentials.password;
    let filePath = path.join(__dirname, 'credentials.txt');

    // If there are previous data, make sure to comma-separate them to keep the json style
    let entry = username + ":" + password + '\n';

    try {
        let jsonCreds = jsonifyCredentialsFile(filePath);
        // Check if username already exists
        if (jsonCreds[credentials.username]) {
            return false;
        }
        fs.appendFileSync(filePath, entry);
    } catch (error) {
        console.log('error here')
        throw error;
    }
    return true;
}

/**
 * Log a given pet into available_pets.txt file
 * @param {*} pet 
 * @returns 
 */
function inputInCatalog(pet) {
    let owner = pet.lname;
    let animal = pet.animal;
    let breed; let age;
    let gender = pet.gender;
    let dogFriendly = pet['dog-amicable'];
    let catFriendly = pet['cat-amicable'];
    let childFriendly = pet['children-amicable'];
    let filePath = path.join(__dirname, 'available_pets.txt');
    if (animal == 'dog') {
        breed = pet.dog_breed;
        age = pet.dog_age;
    } else if (animal == 'cat') {
        breed = pet.cat_breed;
        age = pet.cat_age;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    let currentCatalogLength = 0;

    lines.forEach(line => {
        currentCatalogLength++;
    });

    // If there are previous data, make sure to comma-separate them to keep the json style
    let entry = currentCatalogLength + ":" + owner + ":" + animal + ":" + breed + ":" + age + ":" + gender + ":" + dogFriendly + ":" + catFriendly + ":" + childFriendly + '\n';

    try {
        if (catalogContains(entry, filePath)) {
            console.log("Catalog already contains that entry = " + entry)
            return false;
        }
        fs.appendFileSync(filePath, entry);
    } catch (error) {
        console.log('error here')
        throw error;
    }
    return true;
}

/**
 * Loop through the file and check if it contains  he given entry
 * @param {*} entry 
 * @param {*} filePath 
 */
function catalogContains(entry, filePath) {
    // Read the file synchronously
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Check whether or not the exact line is found
    const lines = fileContent.split('\n');
    lines.forEach((line, index) => {
        if (line.length != 0 && entry == line) {
            return true;
        }
    });
    return false;
}