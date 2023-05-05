// Define a function to convert a string to Title case
String.prototype.toTitleCase = function () {
    // Define a list of words not to be capitalized
    const doNotCapitalize = [
        "a",
        "an",
        "the",
        "for",
        "and",
        "nor",
        "but",
        "or",
        "yet",
        "so",
        "at",
        "around",
        "by",
        "after",
        "along",
        "for",
        "from",
        "of",
        "on",
        "to",
        "with",
        "without",
    ];
    // Split the string by spaces
    return this.replace(/\w\S*/g, function (txt) {
        if (doNotCapitalize.includes(txt)) {
            return txt;
        } else {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    });
};
// Function to turn a JSON into a CSV
function JSONtoCSV(json){
    const items = json
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    let csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n').replaceAll('\\"', '"')
    return csv
}
// Function to download a CSV
function downloadAsCSV(csv, name){
    // EXPORT THE TABLE
    var blob = new Blob([csv], { type : 'text/csv;charset=utf-8;'})
    const filename = `${name}.csv`
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
// Function to make a toast using Toastify (https://github.com/apvarun/toastify-js/blob/master/README.md)
function makeToast(content, type){
    if (type == 'success') icon = '/mikitz-ttrpg/data/icons/circle-check-solid.svg'
    if (type == 'warning') icon = '/mikitz-ttrpg/data/icons/triangle-exclamation-solid.svg'
    if (type == 'error') icon = '/mikitz-ttrpg/data/icons/circle-xmark-solid.svg'

    Toastify({
        avatar: icon,
        text: content,
        offset: {
            x: 10,
            y: 10
        },
        gravity: "bottom",
        position: "left",
        style: {
            background: getComputedStyle(document.documentElement).getPropertyValue('--text-clr'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--card-background-color'),
            zIndex: 1000
        },
        escapeMarkup: false,
    }).showToast()
}
// Function to make it easier to add a Tippy
function addTippy(id, content) {
    tippy(`#${id}`, {
        content: `${content}`,
        allowHTML: true
    });
}
function toggleNextChildDisplay(clickedElement){
    const elementToToggle = document.getElementById(`${clickedElement.id.replaceAll('toggle-', '')}`)
    elementToToggle.classList.toggle('expanded')
    elementToToggle.classList.toggle('collapsed')
    const icon = document.getElementById(clickedElement.id)
    const rotation = icon.style.rotate
    if (rotation.includes('180')) icon.style.rotate = '0deg'
    else icon.style.rotate = '180deg'
}
// Function to get a random integer
// Source: https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
    return parseInt(Math.floor(Math.random() * (max + 1 - min)) + min);
}
async function replaceMonstersWithLinks(encounter) {
    let bestiaryProcessed = await fetchLocalJson(`/encounter-generator/data/json/bestiary`)
    for (let index = 0; index < bestiaryProcessed.length; index++) {
        const element = bestiaryProcessed[index];
        let name = element.name;
        let inLinkRegEx = new RegExp(`>${name}(s|\b)`, `gmi`);
        let inLinkResult = inLinkRegEx.exec(encounter);
        if (inLinkResult) console.log("In Link:", inLinkResult);
        if (inLinkResult) continue; // Skip this one because it already has a link

        let outOfLinkRegex = new RegExp(`(\\b${name})(\\b|s)`, `gmi`);
        let outOfLinkResult = outOfLinkRegex.exec(encounter);
        if (outOfLinkResult) {
            let book = element.source;
            encounter = encounter.replaceAll(
                outOfLinkRegex,
                pepperoniPizza(name, book)
            );
        }
    }
    return encounter;
}
// Function to roll dice inside a string
function replaceDiceStringsWithRollTotals(myString) {
    // Extract dice groups from encounter
    const NewRegEx = /(?:\d+d\d*\+?\d*)/gm;
    var aDice = myString.match(NewRegEx);
    // Check to see if aDice is not empty
    if (aDice) {
        var encounterF = myString;
        // Log for debugging
        // Loop through aDice and calculate totals for each element
        for (i = 0; i < aDice.length; i++) {
            // Extract number of dice
            const RegEx = /\d+(?=d)/g;
            var num_dice = parseInt(RegEx.exec(aDice[i]));
            // Extrect Dice Sides
            const MoreRegEx = /(?<=d)(\d*)/g;
            var num_of_sides = MoreRegEx.exec(aDice[i]);
            num_of_sides = parseInt(num_of_sides[0]);
            // Extract Modifier
            const EvenMoreRegEx = /(?<=\+)(\d*)/g;
            var modifier = EvenMoreRegEx.exec(aDice[i]);
            if (modifier) {
                modifier = parseInt(modifier[0]);
            } else {
                modifier = 0;
            }
            // Total
            var total = fMultiRoll(num_dice, num_of_sides, 1);
            total = total + modifier;
            encounterF = encounterF.replace(aDice[i], total);
        }
    } else {
        encounterF = myString;
    }
    return encounterF;
}
// Function to roll a table and only check if it's equal to or less than
function rollTableLessThan(table) {
    // Get the first key
    if (table.length > 0) {
        var columnsIn = table[0];
        for (var keyFirst in columnsIn) {
            break;
        }
    } else {
        var keyFirst = "No Columns";
    }
    // Log the first key
    // console.log(`First Key: ${keyFirst}`)
    // Get the last key
    if (table.length > 0) {
        var columnsIn = table[0];
        var x = 0;
        for (var keyLast in columnsIn) {
            x = x + 1;
            if ((x = columnsIn.length - 1)) {
                break;
            }
        }
    } else {
        var keyLast = "No Columns";
    }
    // Log the last key
    // console.log(`Last Key: ${keyLast}`)
    // Get number of sides
    const NewRegEx = /\d\d*/gm;
    var sides = keyFirst.match(NewRegEx);
    sides = parseInt(sides[0]);
    // Log it
    // console.log(`Sides: ${sides}`)
    // Roll the die
    var roll = getRndInteger(1, sides);
    // console.log(`Roll Table Roll: ${roll}`)
    // Find the result
    // console.log(`FIRST ROW`)
    // console.log(Object.values(table)[0])
    // console.log(`FIRST VALUE`)
    // console.log(Object.values(table)[0][keyFirst])
    if (
        typeof Object.values(table)[0][keyFirst] == "string" ||
        Object.values(table)[0][keyFirst] instanceof String
    ) {
        // Loop through the first key values and determine if roll is in the range
        for (r = 0; r < table.length; r++) {
            var blah = Object.values(table)[r][keyFirst];
            // console.log(`BLAH: ${blah}`)
            // Parse the range
            // Get the first number
            const RegEx1 = /^(\d+)/gm;
            var firstNum = blah.match(RegEx1);
            firstNum = firstNum[0];
            // console.log(`FIRST NUMBER: ${firstNum}`)
            // Determine if the roll was within the range
            if (roll <= parseInt(firstNum)) {
                var result = Object.values(table)[r][keyLast];
                break;
            }
        }
    } else {
        // Pull the exact result
        var result;
        for (let index = 0; index < table.length; index++) {
            const element = table[index];
            const maxRoll = element[keyFirst];
            if (roll <= maxRoll) {
                result = element[keyLast];
                break;
            }
        }
        // var result = table.find(r => r[keyFirst] <= roll)[`${keyLast}`]
    }
    // Log it
    // console.log(`RESULT: ${result}`)
    // console.log(`------------`)
    return result;
}
// Declare a function to select a random value from a dictionary
// Source: https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[(keys.length * Math.random()) << 0]];
};
// Function to remove an element from an array
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
// Function to roll on a table and pull the value from the specified key
function rollTableKey(table, keyLast) {
    // Get the first key
    if (table.length > 0) {
        var columnsIn = table[0];
        for (var keyFirst in columnsIn) {
            break;
        }
    } else {
        var keyFirst = "No Columns";
    }
    // Log the first key
    console.log(`First Key: ${keyFirst}`);
    // Get the last key
    if (table.length > 0) {
        var columnsIn = table[0];
        var x = 0;
        for (var keyLast in columnsIn) {
            x = x + 1;
            if ((x = columnsIn.length - 1)) {
                break;
            }
        }
    } else {
        var keyLast = "No Columns";
    }
    // Log the last key
    console.log(`Last Key: ${keyLast}`);
    // Get number of sides
    const NewRegEx = /\d\d*/gm;
    var sides = keyFirst.match(NewRegEx);
    sides = parseInt(sides[0]);
    // Log it
    console.log(`Sides: ${sides}`);
    // Roll the die
    var roll = getRndInteger(1, sides);
    console.log(`Roll Table Roll: ${roll}`);
    // Find the result
    console.log(`FIRST ROW`);
    console.log(Object.values(table)[0]);
    console.log(`FIRST VALUE`);
    console.log(Object.values(table)[0][keyFirst]);
    if (
        typeof Object.values(table)[0][keyFirst] == "string" ||
        Object.values(table)[0][keyFirst] instanceof String
    ) {
        // Loop through the first key values and determine if roll is in the range
        for (r = 0; r < table.length; r++) {
            var blah = Object.values(table)[r][keyFirst];
            console.log(`BLAH: ${blah}`);
            // Parse the range
            // Get the first number
            const RegEx1 = /^(\d+)/gm;
            var firstNum = blah.match(RegEx1);
            firstNum = firstNum[0];
            console.log(`FIRST NUMBER: ${firstNum}`);
            // Get the second number
            const RegEx2 = /(\d+)$/gm;
            var secondNum = blah.match(RegEx2);
            secondNum = secondNum[0];
            console.log(`SECOND NUMBER: ${secondNum}`);
            // Determine if the roll was within the range
            if (roll <= parseInt(secondNum) && roll >= parseInt(firstNum)) {
                var result = Object.values(table)[r][keyLast];
                break;
            }
        }
    } else {
        // Pull the exact result
        var result = table.find((r) => r[keyFirst] == roll)[`${keyLast}`];
    }
    // Log it
    console.log(`RESULT: ${result}`);
    console.log(`------------`);
    return result;
}
// Define a function to make a pepperoni pizza
function pepperoniPizza(creature, book) {
    const elephant = localStorage.getItem('glazed-donut')
    if (elephant) {
        let link = creature.replace(/ /g, "%20").replace(",", "%2c")
        return `<a href="https://5e.tools/bestiary.html#${link}_${book}" target="_blank" rel="noreferrer noopener">${creature}</a>`
    } else {
        let link = creature.replace(/ /g, "-")
        return `<a href="https://www.dndbeyond.com/monsters/${link}" target="_blank" rel="noreferrer noopener">${creature}</a>`
    }
}
// Define a function to make a cheese pizza
function cheesePizza(spell, book){
    const elephant = localStorage.getItem('glazed-donut')
    let link
    if (elephant) {
        let linkFix = spell.replace(/ /g, "%20").replace(",", "%2c")
        link = `https://5e.tools/spells.html#${linkFix}_${book}`
    } else {
        let linkFix = spell.replace(/ /g, "-")
        link = `https://www.dndbeyond.com/spells/${linkFix}`
    }
    const aElement = `<a href="${link}" target="_blank" rel="noreferrer noopener">${spell}</a>`
    return [link, aElement]
}
// Function to pull a rolled result from a given table with max 2 columns
function rollTable(table) {
    // Get the first key
    if (table.length > 0) {
        var columnsIn = table[0];
        for (var keyFirst in columnsIn) {
            break;
        }
    } else {
        var keyFirst = "No Columns";
    }
    // Log the first key
    // console.log(`First Key: ${keyFirst}`)
    // Get the last key
    if (table.length > 0) {
        var columnsIn = table[0];
        var x = 0;
        for (var keyLast in columnsIn) {
            x = x + 1;
            if ((x = columnsIn.length - 1)) {
                break;
            }
        }
    } else {
        var keyLast = "No Columns";
    }
    // Log the last key
    // console.log(`Last Key: ${keyLast}`)
    // Get number of sides
    const NewRegEx = /\d\d*/gm;
    let sides = keyFirst.match(NewRegEx);
    if (!sides) {
        // Build the SIDES column if it's not present
        let decimalPlaces = 0
        let dieSize = 0
        for (let index = 0; index < table.length; index++) {
            const element = table[index];
            const probability = parseFloat(element.PROBABILITY)
            if (probability.countDecimals() > decimalPlaces) {
                decimalPlaces = probability.countDecimals()
                dieSize = parseInt(`1${"0".repeat(decimalPlaces)}`)
            }
        }
        for (let index = 0; index < table.length; index++) {
            const element = table[index];
            const probability = element.PROBABILITY
            let min = 0
            let max = 0
            if (index == 0) {
                min = 1
                max = probability * 100
            } 
            else {
                min = table[index - 1].MAX + 1
                max = probability * 100 + min - 1
            }
            table[index][`d${dieSize}`] = `${min}-${max}`
            table[index].MIN = min
            table[index].MAX = max

        }
        sides = dieSize
        keyFirst = `d${dieSize}`
        keyLast = `DIFFICULTY`
    } else {
        sides = parseInt(sides[0]);    
    }
    var roll = getRndInteger(1, sides); // Roll the die
    if (typeof Object.values(table)[0][keyFirst] == "string" || Object.values(table)[0][keyFirst] instanceof String) {
        // Loop through the first key values and determine if roll is in the range
        for (r = 0; r < table.length; r++) {
            var blah = Object.values(table)[r][keyFirst];
            // console.log(`BLAH: ${blah}`)
            // Parse the range
            // Get the first number
            const RegEx1 = /^(\d+)/gm;
            var firstNum = blah.match(RegEx1);
            firstNum = firstNum[0];
            // console.log(`FIRST NUMBER: ${firstNum}`)
            // Get the second number
            const RegEx2 = /(\d+)$/gm;
            var secondNum = blah.match(RegEx2);
            secondNum = secondNum[0];
            // console.log(`SECOND NUMBER: ${secondNum}`)
            // Determine if the roll was within the range
            if (roll <= parseInt(secondNum) && roll >= parseInt(firstNum)) {
                var result = Object.values(table)[r][keyLast];
                break;
            }
        }
    } else {
        // Pull the exact result
        var result = table.find((r) => r[keyFirst] == roll)[`${keyLast}`];
    }
    // Log it
    // console.log(`RESULT: ${result}`)
    // console.log(`------------`)
    return result;
}
// Function to get a selected value from a radio group
function getSelectedValueFromRadioGroup(radioGroupName) {
    return document.querySelector(`input[name="${radioGroupName}"]:checked`).value;
}
function getSelectedItemsFromCheckboxGroup(groupname){
    const checkboxElements = document.getElementsByName(groupname)
    let itemTypes = []
    for (let index = 0; index < checkboxElements.length; index++) {
        const element = checkboxElements[index]
        if (element.checked == true) itemTypes.push((element.id).replaceAll("-", " ").replaceAll(" checkbox",""))       
    }
    return itemTypes
}
// Function to sleep a set amount of time
// Source: https://stackoverflow.com/a/39914235/3725925
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Returns true if every pixel's uint32 representation is 0 (or "blank")
function isCanvasBlank(canvas) {
    const context = canvas.getContext("2d");
    let imageData;
    try {
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    } catch (error) {
        return true;
    }
    const pixelBuffer = new Uint32Array(imageData.data.buffer);

    return !pixelBuffer.some((color) => color !== 0);
}
// Function to turn a string into Camel Case
// Source: https://ourcodeworld.com/articles/read/608/how-to-camelize-and-decamelize-strings-in-javascript
function camelize(text) {
    return text.replace(
        /^([A-Z])|[\s-_]+(\w)/g,
        function (match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        }
    );
}
// Function to load a local JSON from data/JSONs/
async function fetchLocalJson(JSON) {
    const response = await fetch(`${JSON}.json`);
    const data = await response.json()
    return data 
}
// Function to count the number of decimals
// Source: https://stackoverflow.com/a/17369245
Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
};
// Function to generate a random ID
// Source: https://stackoverflow.com/a/44622300
function genId() {
    return Array.from(Array(16), () =>
        Math.floor(Math.random() * 36).toString(36)
    ).join("");
}
// Function to convert a JSON table of probabilities into a rollable table
function convertJsonToRollTable(json) {
    let rollTable = [];
    let decimalPlaces = 0;
    // Compute the die size and return the die
    for (let index = 0; index < json.length; index++) {
        const element = json[index];
        for (let [key, value] of Object.entries(element)) {
            const item = {
                key: key,
                value: value,
            };
            if (!isNaN(value)) {
                const decimalPlacesInternal = value.countDecimals();
                if (decimalPlacesInternal > decimalPlaces)
                    decimalPlaces = decimalPlacesInternal;
            }
        }
    }
    const dieSize = `1${"0".repeat(decimalPlaces)}`;
    const die = `d${dieSize}`;
    // Convert the probabilities into die numbers and assemble the rollTable
    for (let index = 0; index < json.length; index++) {
        const element = json[index];
        for (let [key, value] of Object.entries(element)) {
            if (!isNaN(value)) {
                // If it's a number
                // Set up the value
                value = value * parseInt(dieSize);
                // Append it to rollTable
                let obj = `[{"${die}": ${value},"TYPE": "${key}"}]`;
                obj = JSON.parse(obj)[0];
                rollTable.push(obj);
            }
        }
    }
    // Sort rollTable by key from smallest to largest
    rollTable = rollTable.sort(function (a, b) {
        return a[`${die}`] - b[`${die}`];
    });
    // Convert the rollTables numbers into proper rollTable numbers
    for (let index = 0; index < rollTable.length; index++) {
        const element = rollTable[index];
        if (index > 0) {
            // element[`${die}`] = element[`${die}`] - 1
            element[`${die}`] =
                element[`${die}`] + rollTable[index - 1][`${die}`];
        }
    }
    return rollTable;
}
// Source: https://stackoverflow.com/a/30800715/3725925
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
// Define a dice function to roll multiple dice
function fMultiRoll(number_of_dice, dice_sides, multiplier) {
    // Define an empty array to store the rolls
    aRolls = [];
    // Parse integers
    var number_of_dice = parseInt(number_of_dice);
    var dice_sides = parseInt(dice_sides);
    var multiplier = parseInt(multiplier);
    // Set total to zero
    //var total = 0
    // Loop through all the dice and return random integers
    if (number_of_dice > 1) {
        for (x = 0; x < number_of_dice; x++) {
            a = getRndInteger(1, dice_sides);
            aRolls.push(a);
            // total += a
        }
        // Get the sum of the array
        var total = aRolls.reduce((a, b) => a + b, 0) * multiplier;
    } else {
        var total = getRndInteger(1, dice_sides);
    }
    return parseInt(total);
}
// Function to facorialize a number
function factorialize(n) {
    if (n < 0) return -1;
    if (n == 0) return 1;
    return n * factorialize(n - 1);
}
// Function to calculate combinations
function nCr(n, r) {
    var nFact = factorialize(n); // Compute n factorial
    var rFact = factorialize(r); // Compute r factorial
    var nrFact = factorialize(n - r); // Compute n - r factorial
    var result = parseFloat(nFact / (rFact * nrFact)); // Compute nCr
    return parseFloat(result); // Return
}
function calcProbComplex(O, K, N, S) {
    // O = outcome or greater desired
    // K = number of successes needed
    // N = number of dice
    // S = number of sides on each die
    // VARIABLES
    const pS = (S - O + 1) / S; // Probability of Success
    const pF = (O - 1) / S; // Probability of Failure
    const combin = nCr(N, K); // nCr
    // CALCULATE
    let probability = pS ** K * pF ** (N - K) * combin; // Calculate the probability of O K times
    // Calculate the prob for the remaining Ks to add it to the above
    for (let k = K + 1; k < N + 1; k++) {
        const combin = nCr(N, k); // nCr
        const prob = pS ** k * pF ** (N - k) * combin; // Calculate prob.
        probability += prob; // Add the new prob to the total prob
    }
    // Return the probability
    return probability;
}
function stringExistsInArray(array, key, searchString) {
    return array.some((obj) => obj[key] === searchString);
  }
function getSelectedOptionText(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    const selectedIndex = selectElement.selectedIndex;
    try {
        const selectedOptionText = selectElement.options[selectedIndex].text;
        if (selectedOptionText) return selectedOptionText
    } catch {
        return null
    }
  }
// Function to round to certain number of decimal places
function roundToSpecifiedDecimalPlaces(number, decimalPlaces) {
    const factorOfTen = Math.pow(10, decimalPlaces);
    const modulus = Math.round(number) % 100;
    if (modulus > 0) return modulus;
    return Math.round(number * factorOfTen) / factorOfTen;
}
// Functiont to toggle a modal's state
function toggleModal(modalId, ) {
    const modal = document.getElementById(modalId);
    const display = modal.style.display;
    if (display == "none") {
        modal.style.display = "block";
        document
            .getElementById("modal-close")
            .addEventListener("click", function () {
                modal.style.display = "none";
            });
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    } else modal.style.display = "none";
}
// Define a function to replace a string by index range
// Source: https://stackoverflow.com/a/12568270/3725925
function replaceRange(str, start, end, substitute) {
    return str.substring(0, start) + substitute + str.substring(end);
}
function downloadAsTXT(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `${filename}.txt`);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
// Function to copy text to clipboard
async function copyToClipboard(textToCopy, toast) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand("copy") ? res() : rej();
            textArea.remove();
            if (toast == true) makeToast('Text copied to the clipboard!', 'success')
        });
    }
}
// Function to paste text from clipbard
async function pasteTextFromClipboard() {
    navigator.clipboard.readText().then(
        (cliptext) => {
            return cliptext;
        },
        (err) => console.log(err)
    );
}
// -----------------------------
//            Theme
// -----------------------------
// Function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem("theme", themeName);
    document.documentElement.className = themeName;
}
// Function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem("theme") === "theme-dark") {
        setTheme("theme-light");
    } else {
        setTheme("theme-dark");
    }
}
// Function to read the theme from Local Storage and set the toggle appropriately
async function readThemeAndSetToggle() {
    await sleep(300)
    let slider = document.getElementById("slider")
    const theme = localStorage.getItem("theme");
    if (theme === "theme-light" || !theme) {
        slider.checked = true;
        setTheme("theme-light");
    } else {
        slider.checked = false;
        setTheme("theme-dark");
    }
}

async function readThemeAndSetTheme(){
    const theme = localStorage.getItem('theme')
    setTheme(theme)
}