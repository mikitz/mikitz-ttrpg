// ====================================
//           Page Setup
// ====================================
// Function to set up listeners
async function setupNpcGenerator() {
    // Race Dropdown
    const raceSelect = document.getElementById("race-select");
    raceSelect.addEventListener("change", function () {
        const race = this.value;
        setRaceDependentInputs(race);
    });
    // Weight: Should this be tied to height?
    // Height: Should this be tied to weight?
    // Background Select
    const backgroundSelect = document.getElementById("background-select");
    for (let index = 0; index < tableBackgrounds.length; index++) {
        const element = tableBackgrounds[index];
        const option = document.createElement('option')
        option.id = element.NAME
        option.innerText = element.NAME
        backgroundSelect.appendChild(option)
    }
    backgroundSelect.addEventListener("change", async function () {
        const background = this.value.replaceAll("-", " ").toTitleCase();
        await setBackgroundDependentInputs(background);
    });
    // Personality
    const personalitySelect = document.getElementById("personality-select");
    personalitySelect.addEventListener("change", function () {
        const personality = this.value;
        setPersonalityDependents(personality);
    });
    // Sex
    const sexSelect = document.getElementById("sex-select");
    sexSelect.addEventListener("change", function () {
        const sex = this.value;
        console.log(
            "🚀 ~ file: index.js ~ line 100 ~ sexSelect.addEventListener ~ sex",
            sex
        );
        setSexDependents(sex);
    });
    // Relationship Orientataion
    const relOrientSelect = document.getElementById(
        "relationship-orientation-select"
    );
    relOrientSelect.addEventListener("change", function () {
        const relOrient = this.value;
        setRelationshipOrientationDependents(relOrient);
    });

    // Generate NPC
    const buttonGenerateNPC = document.getElementById("button-generate-npc");
    buttonGenerateNPC.addEventListener("click", async function () {
        await generateOrDisplayNPC();
    });

    // Reroll Icons
    const allTheIcons = document.querySelectorAll(".fa-dice-d20");
    for (let index = 0; index < allTheIcons.length; index++) {
        const element = allTheIcons[index];
        element.addEventListener("click", async function () {
            const parent = this.parentElement.parentElement;
            const parentChildren = parent.children;
            const select = parentChildren[3].id;
            const selectedOption = select.value;
            if (select == "languages-text-output") {
                // Just for Languages
                const background = document.getElementById("background-select").value;
                const race = document.getElementById("race-select").value;
                const langs = await getLanguages(race, background);
                document.getElementById("languages-text-output").innerText =
                    langs.join(", ");
            } else if (select == "name-select") {
                // Just for Names
                const race = document.getElementById("race-select").value;
                const names = await generateNames(race);
                console.log("🚀 ~ file: setupDOM.js:72 ~ names:", names)
                if (names) populateSelectFromArray("name-select", names);
                selectRandomOptionFromSelectElement("name-select");
            } else {
                let newlySelected = selectRandomOptionFromSelectElement(select);
                while (newlySelected == selectedOption)
                    newlySelected = selectRandomOptionFromSelectElement(select);
            }
            setupBlurbs();
        });
    }    
    // Copy Blurb
    const copyIcons = document.getElementsByName('copy-icon')
    copyIcons.forEach(element => {
        element.addEventListener('click', function(){
            const parent = this.parentNode.parentNode
            const blurbElement = document.getElementById(`${parent.id}-blurb`)
            copyToClipboard(blurbElement.innerText)
            console.log("🚀 ~ file: index.js:89 ~ element.addEventListener ~ blurbElement:", blurbElement)
            makeToast(`<b>${parent.id.toTitleCase()}</b> copied to clipboard!`, 'success')
        })
    });

    const copyCollatedBlurb = document.getElementById('copy-collated-blurb')
    copyCollatedBlurb.addEventListener('click', function(){
        const text = document.getElementById('blurb-condensed-text')
        copyToClipboard(text.innerText)
        makeToast(`<b>NPC blurb</b> copied to clipboard!`, 'success')
    })

    const majorQuestPrompt = document.getElementById('major-quest-prompt')
    majorQuestPrompt.addEventListener('click', function(){
        const personalityBlurb = document.getElementById('personality-blurb').innerText
        const questType = 'minor'
        const primePrompt = `Below is an NPC for 5e DnD. Please create a unique ${questType} plot hook for each of the following parts: Trait, Bond, Flaw, and Ideal. Take care to include aspects of the NPC's personality: ${personalityBlurb} Includes other aspects of the NPC from the description, too.`
        const text = document.getElementById('blurb-condensed-text')
        copyToClipboard(`${primePrompt} \n\n ${text.innerText}`)
        makeToast(`<b>Major Quest 'Proompt'</b> copied to clipboard!`, 'success')
    })

    const minorQuestPrompt = document.getElementById('minor-quest-prompt')
    minorQuestPrompt.addEventListener('click', function(){
        const personalityBlurb = document.getElementById('personality-blurb').innerText
        const questType = 'minor'
        const primePrompt = `Below is an NPC for 5e DnD. Please create a unique ${questType} plot hook for each of the following parts: Trait, Bond, Flaw, and Ideal. Take care to include aspects of the NPC's personality: ${personalityBlurb} Includes other aspects of the NPC from the description, too.`
        const text = document.getElementById('blurb-condensed-text')
        copyToClipboard(`${primePrompt} \n\n ${text.innerText}`)
        makeToast(`<b>Minor Quest 'Proompt'</b> copied to clipboard!`, 'success')
    })

    const toggleHistory = document.getElementById('toggle-history')
    toggleHistory.addEventListener('click', function(){
        toggleNextChildDisplay(this)
    })

    const selects = document.getElementsByClassName('aspect-property-select')
    for (let index = 0; index < selects.length; index++) {
        const element = selects[index];
        
        const ID = element.id;
        const value = element.value;
        if (value.length >= 20) {
            tippy(`#${ID}`, {
                content: value.replaceAll("-", " "),
            });
        }
        element.addEventListener("change", function () {
            setupBlurbs();
        });

        element.addEventListener('change', async function(){
            const npcId = localStorage.getItem('npc-id')
            const npc = await createNpcDataFromDom()
            await db.npcg_npcs.put(npc, npcId)
                .then(function(){
                    console.log(`Cell updated successfully!`)
                }).catch(error => {
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                }) 
        })
    }

    const nicknameInput = document.getElementById('nickname-input')
    nicknameInput.addEventListener('input', async function(){
        const npcId = localStorage.getItem('npc-id')
        const npc = await createNpcDataFromDom()
        await db.npcg_npcs.put(npc, npcId)
            .then(function(){
                console.log(`Cell updated successfully!`)
            }).catch(error => {
                console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
            }) 
    })

    tippy(".aspect-property-checkbox", {
        content: "Check to stop reroll.",
    });
    tippy(".fa-dice-d20", {
        content: "Click to reroll.",
    });
    tippy("#major-quest-prompt", {
        content: "Major Quest 'Proompt'",
    })
    tippy("#minor-quest-prompt", {
        content: "Minor Quest 'Proompt'",
    })
    tippy("#copy-collated-blurb", {
        content: "Copy NPC Blurb",
    })

    for (let index = 0; index < copyIcons.length; index++) {
        const element = copyIcons[index];
        const parent = element.parentElement
        const blurbName = parent.innerText
        tippy(`#${element.id}`, {
            content: `Copy ${blurbName} Blurb`
        })
    }
}
// ====================================
//      Adjust HTML Based on Data
// ====================================
// Adjustments based on Race
async function setRaceDependentInputs(race) {
    // Race Data
    const raceData = tableRaces.find((i) => i.RACE == race);
    const heightMod = droll.roll(raceData.HEIGHT_MOD).total || parseInt(raceData.HEIGHT_MOD);
    const weightMod = droll.roll(raceData.WEIGHT_MOD).total || parseInt(raceData.WEIGHT_MOD);
    const baseHeightInches = raceData.BASE_HEIGHT_IN;
    const baseWeightPounds = raceData.BASE_WEIGHT_LBS;
    const ageLEB = raceData.AGE_LEB;
    const adultAge = raceData.AGE_ADULT;
    // Height
    const heightSelect = document.getElementById("height-select");
    heightSelect.innerHTML = "";
    const heightRollStats = droll.parse(raceData.HEIGHT_MOD);
    const heightMaxInches = heightRollStats.maxResult + baseHeightInches;
    const heightMinInches = heightRollStats.minResult + baseHeightInches;
    const randomHeightInches = baseHeightInches + heightMod;
    for (let index = heightMinInches; index <= heightMaxInches; index++) {
        const option = document.createElement("option");
        option.value = index; // Height in Inches
        height = index
        option.innerText = `${formatInchesToFeetInches(index)} (${Math.round(
            inchesToCentimeters(index)
        )} cm)`;
        heightSelect.appendChild(option);
        if (index == randomHeightInches) option.selected = true;
    }
    // Weight
    const weightSelect = document.getElementById("weight-select");
    weightSelect.innerHTML = "";
    const weightRollStats = droll.parse(raceData.WEIGHT_MOD);
    const weightMaxPounds = baseWeightPounds + weightRollStats.maxResult * heightRollStats.maxResult || baseWeightPounds + weightMod * heightRollStats.maxResult;
    const weightMinPounds = baseWeightPounds + weightRollStats.minResult * heightRollStats.minResult || baseWeightPounds + weightMod * heightRollStats.minResult;
    const randomWeightPounds = baseWeightPounds + heightMod * weightMod;
    for (let index = weightMinPounds; index <= weightMaxPounds; index++) {
        const option = document.createElement("option");
        option.value = index; // Weight in Pounds
        weight = index
        option.innerText = `${index} lbs (${Math.round(poundsToKilograms(index))} kgs)`;
        if (index == randomWeightPounds) option.selected = true;
        weightSelect.appendChild(option);
    }
    // Age
    const ageSelect = document.getElementById("age-select");
    ageSelect.innerHTML = "";
    const randomAge = getRndInteger(adultAge, ageLEB);
    for (let index = adultAge; index <= ageLEB; index++) {
        const option = document.createElement("option");
        option.value = index;
        option.innerText = `${index} years`;
        if (index == randomAge) option.selected = true;
        ageSelect.appendChild(option);
    }
    // Name
    const names = await generateNames(race);
    if (names) populateSelectFromArray("name-select", names);
    const name = selectRandomOptionFromSelectElement("name-select");

    // Languages
    const background = document.getElementById("background-select").value;
    const langs = await getLanguages(race, background);
    document.getElementById("languages-text-output").innerText = langs.join(", ");
    return {name: name, age: randomAge, weight: randomWeightPounds, height: randomHeightInches}
}
async function setBackgroundDependentInputs(background) {
    const backgroundDependents = ["trait", "bond", "flaw", "ideal"];
    const dependents = []
    for (let index = 0; index < backgroundDependents.length; index++) {
        const element = backgroundDependents[index];
        const items = tableBackgrounds.find((i) => i.NAME === background)[`${element.toUpperCase()}`];
        const itemsList = items.split("-----");
        const item = randomProperty(itemsList);
        dependents.push(item)
        const elementDOM = document.getElementById(`${element}-select`);
        for (let index = 0; index < itemsList.length; index++) {
            const element = itemsList[index];
            const option = document.createElement("option");
            option.value = element;
            option.innerHTML = element;
            elementDOM.appendChild(option);
            if (item == element) option.selected = true;
        }
    }
    const race = document.getElementById("race-select").value;
    const langs = await getLanguages(race, background);
    document.getElementById("languages-text-output").innerText = langs.join(", ");
    return {trait: dependents[0], bond: dependents[1], flaw: dependents[2], ideal: dependents[3]}
}
function setPersonalityDependents(personality) {
    personality = personality.split(":")[0].toTitleCase();
    const personalityType = tableNPCPersonality.find((i) => i.NAME == personality).TYPE;
    const descriptionElement = document.getElementById("personality-description-select");
    const description = tableNPCPersonality.find((i) => i.NAME == personality).DESCRIPTION;
    descriptionElement.value = description.replaceAll(" ", "-").toLowerCase();
    return {type: personalityType, description: description, name: personality}
}
function setRelationshipOrientationDependents(relationshipOrientation) {
    const status = populateSelectFromArray("relationship-status-select", `tableNPCRelationshipStatus${relationshipOrientation.toTitleCase()}`,`relationship_status_${relationshipOrientation}`);
    return status
}
function setSexDependents(sex) {
    if (sex == "female" || sex == "male")
        return populateSelectFromArray("body-shape-select",`arrayNPCBodyShape${sex.toTitleCase()}`);
    let random = randomProperty(["male", "female"]);
    return populateSelectFromArray("body-shape-select",`arrayNPCBodyShape${random.toTitleCase()}`);
}
function setupBlurbs() {
    // Data
    const name = document.getElementById("name-select").value;
    const race = document.getElementById("race-select").value;
    const age = document.getElementById("age-select").value;
    const height = document.getElementById("height-select").value;
    const weight = document.getElementById("weight-select").value;
    const gender = document.getElementById("gender-select").value;
    const sex = document.getElementById("sex-select").value;
    const relationshipOrientation = document.getElementById("relationship-orientation-select").value;
    const sexualOrientation = document.getElementById("sexual-orientation-select").value;
    const relationshipStatus = document.getElementById("relationship-status-select").value;
    const bodyType = document.getElementById("body-type-select").value;
    const bodyShape = document.getElementById("body-shape-select").value;
    const hairColor = document.getElementById("hair-color-select").value;
    const hairLength = document.getElementById("hair-length-select").value;
    const hairType = document.getElementById("hair-type-select").value;
    const faceShape = document.getElementById("face-shape-select").value;
    const eyeColor = document.getElementById("eye-color-select").value;
    const background = document.getElementById("background-select").value;
    const MBTI = document.getElementById("personality-select").value.split(":");
    const personalityDescription = document.getElementById("personality-description-select").value.replaceAll("-", " ");
    const pronouns = document.getElementById("pronouns-select").value.split("/");
    const alignment = document.getElementById("alignment-select").value;
    let languages = document.getElementById("languages-text-output").innerHTML.split(", ")
    languages = arrayToGrammatiaclSeparatedList(languages, ",")
    const trait = document.getElementById("trait-select").value;
    const bond = document.getElementById("bond-select").value;
    const flaw = document.getElementById("flaw-select").value;
    const ideal = document.getElementById("ideal-select").value;

    // Blurbs
    const textBiology = `<b>${name}</b> is a ${age}-year-old ${gender} ${sex} ${race} standing ${formatInchesToFeetInches(height)} (${Math.round(inchesToCentimeters(height))} cm) and weighing ${weight} lbs (${Math.round(poundsToKilograms(weight))} kgs).`;
    const textIdentity = `<b>${name}</b> is/are a ${relationshipOrientation} ${sexualOrientation} who is ${relationshipStatus}. <b>${name}</b> uses the <i>${arrayToGrammatiaclSeparatedList(pronouns, ",")}</i> pronouns.`;
    const textAppearance = `<b>${name}</b> has a ${bodyType}, ${bodyShape} body with ${hairColor}, ${hairLength}, ${hairType} hair. <b>${name}</b> has a ${faceShape} face with ${eyeColor} eyes.`;
    const textPersonality = `<b>${name}</b> has a ${alignment}, ${MBTI[0]}-type personanlity: ${personalityDescription}`;
    const textCharacter = `<b>${name}</b> is a(n) ${background}. As such, <i>${pronouns[0].toLowerCase()}</i> speak(s) ${languages}. </p>
      <u>Trait:</u> ${trait}</p>
      <u>Bond:</u> ${bond}</p>
      <u>Flaw:</u> ${flaw}</p>
      <u>Ideal:</u> ${ideal}</p>`;
    // Split
    const divBiologyBlurb = document.getElementById("biology-blurb");
    const divIdentityBlurb = document.getElementById("identity-blurb");
    const divPersonalityBlurb = document.getElementById("personality-blurb");
    const divCharacterBlurb = document.getElementById("character-blurb");
    const divAppearanceBlurb = document.getElementById("appearance-blurb");

    divBiologyBlurb.innerHTML = textBiology;
    divIdentityBlurb.innerHTML = textIdentity;
    divPersonalityBlurb.innerHTML = textPersonality;
    divCharacterBlurb.innerHTML = textCharacter;
    divAppearanceBlurb.innerHTML = textAppearance;
    
    // Condensed
    const blurbCondensed = document.getElementById("blurb-condensed-text");
    blurbCondensed.innerHTML = `${textBiology} ${textIdentity} ${textAppearance} ${textPersonality} ${textCharacter}`;
}
// =========== NPC Generator ==============
async function generateOrDisplayNPC(npcData){    
    async function generateNpcData(npcData){
        const datetime = new Date()
        if (npcData) return npcData // Return the loaded NPC
        // Otherwise, generate a new NPC
        const race = selectRandomOptionFromSelectElement("race-select");
        const background = selectRandomOptionFromSelectElement("background-select");
        const nickname = document.getElementById('nickname-input').value
        const personality = selectRandomOptionFromSelectElement("personality-select");
        const sex = selectRandomOptionFromSelectElement("sex-select");
        const alignment = selectRandomOptionFromSelectElement("alignment-select");
        const gender = selectRandomOptionFromSelectElement("gender-select");
        const pronouns = selectRandomOptionFromSelectElement("pronouns-select");
        const sexualOrientation = selectRandomOptionFromSelectElement("sexual-orientation-select");
        const relationshipOrientation = selectRandomOptionFromSelectElement("relationship-orientation-select");
        const voiceQuirk = selectRandomOptionFromSelectElement("voice-quirk-select");
        const pregnant = selectRandomOptionFromSelectElement("pregnant-select");
        const langs = await getLanguages(race, background.replaceAll('-', ' ').toTitleCase()) // Transform Background to allow searching its table
        const sexDependents = setSexDependents(sex)
        const bodyShape = selectRandomOptionFromSelectElement("body-shape-select")
        const bodyType = selectRandomOptionFromSelectElement("body-type-select")
        const hairLength = selectRandomOptionFromSelectElement("hair-length-select")
        const hairType = selectRandomOptionFromSelectElement("hair-type-select")
        const hairColor = selectRandomOptionFromSelectElement("hair-color-select")
        const faceShape = selectRandomOptionFromSelectElement("face-shape-select")
        const eyeColor = selectRandomOptionFromSelectElement("eye-color-select")
        const personalityDependents =  setPersonalityDependents(personality);
        const raceDependents = await setRaceDependentInputs(race);
        const backgroundDependents = await setBackgroundDependentInputs(background);
        const relationshipStatus = setRelationshipOrientationDependents(relationshipOrientation);
        return {
                id: genId(),
                datetime: datetime,
                race: race,
                height_inches: raceDependents.height, 
                weight_pounds: raceDependents.weight,
                age: raceDependents.age,
                sex: sex,
                pregnant: pregnant,
                name: raceDependents.name,
                nickname: nickname,
                gender: gender,
                pronouns: pronouns,
                sexual_orientation: sexualOrientation,
                relationship_orientation: relationshipOrientation,
                alignment: alignment,
                voice: voiceQuirk,
                mbti_name: personalityDependents.name,
                mbti: personalityDependents.type,
                mbti_description: personalityDependents.description,
                languages: langs,
                relationship_status: relationshipStatus,
                background: background,
                trait: backgroundDependents.trait,
                bond: backgroundDependents.bond,
                flaw: backgroundDependents.flaw,
                ideal: backgroundDependents.ideal,
                body_shape: bodyShape,
                body_type: bodyType,
                hair_length: hairLength,
                hair_type: hairType,
                hair_color: hairColor,
                face_shape: faceShape,
                eye_color: eyeColor, 
            }
    }
    const data = await generateNpcData(npcData)
    localStorage.setItem('npc-id', data.id)
    // Select the appropriate options
    if (npcData) {
        // Remove all checkmarks
        const checkboxes = document.getElementsByClassName('checkbox')
        for (let index = 0; index < checkboxes.length; index++) {
            const element = checkboxes[index];
            element.checked = false
        }
        document.getElementById("race-select").value = npcData.race
        document.getElementById("background-select").value = npcData.background
        document.getElementById('nickname-input').value = npcData.nickname
        document.getElementById("sex-select").value = npcData.sex
        document.getElementById("alignment-select").value = npcData.alignment
        document.getElementById("gender-select").value = npcData.gender
        document.getElementById("pronouns-select").value = npcData.pronouns
        document.getElementById("sexual-orientation-select").value = npcData.sexual_orientation
        document.getElementById("relationship-orientation-select").value = npcData.relationship_orientation
        document.getElementById("voice-quirk-select").value = npcData.voice
        document.getElementById("pregnant-select").value = npcData.pregnant
        document.getElementById('languages-text-output').innerText = npcData.languages
        document.getElementById("body-type-select").value = npcData.body_type
        document.getElementById("hair-length-select").value = npcData.hair_length
        document.getElementById("hair-type-select").value = npcData.hair_type
        document.getElementById("hair-color-select").value = npcData.hair_color
        document.getElementById("face-shape-select").value = npcData.face_shape
        document.getElementById("eye-color-select").value = npcData.eye_color

        const sexDependents = setSexDependents(npcData.sex)
        document.getElementById("body-shape-select").value = npcData.body_shape

        const personalityDependents =  setPersonalityDependents(npcData.mbti_name);
        document.getElementById('personality-description-select').value = npcData.mbti_description.replaceAll(" ", "-").toLowerCase()

        const raceDependents = setRaceDependentInputs(npcData.race);
        document.getElementById('height-select').value = npcData.height_inches
        document.getElementById('weight-select').value = npcData.weight_pounds
        document.getElementById('age-select').value = npcData.age
        document.getElementById('name-select').value = npcData.name

        const relationshipStatus = setRelationshipOrientationDependents(npcData.relationship_orientation);
        document.getElementById('relationship-status-select').value = npcData.relationship_status

        const relationshipStatusSelect = document.getElementById('relationship-status-select')
        const optionOne = document.createElement('option')
        optionOne.value = npcData.relationship_status
        optionOne.innerText = npcData.relationship_status
        optionOne.selected = true
        relationshipStatusSelect.appendChild(optionOne)

        const backgroundDependents = setBackgroundDependentInputs(npcData.background);
        document.getElementById('trait-select').value = npcData.trait
        document.getElementById('bond-select').value = npcData.bond
        document.getElementById('flaw-select').value = npcData.flaw
        document.getElementById('ideal-select').value = npcData.ideal

        const nameSelect = document.getElementById('name-select')
        const option = document.createElement('option')
        option.value = npcData.name
        option.innerText = npcData.name
        option.selected = true
        nameSelect.appendChild(option)
    }
    // ============ Blurbs =================
    // Handle options that are too long
    const selects = document.querySelectorAll(".aspect-property-select");
    selects.forEach((element) => {
        const ID = element.id;
        const value = element.value;
        if (value.length >= 20) {
            tippy(`#${ID}`, {
                content: value.replaceAll("-", " "),
            });
        }
    });
    setupBlurbs();
    // ============== Append to DB =================
    if (npcData && npcData != undefined) return // Only append if this is a new NPC
    await sleep(1000)
    await db.npcg_npcs.put(data)
        .then(function(){
            console.log(`✅ NPC added successfully! --`, data.id)
            populateNpcHistory()
        }).catch(async function(error) {
            if ((error.name === 'QuotaExceededError') || (error.inner && error.inner.name === 'QuotaExceededError')) {
                const con = confirm("In order to save the NPC that was just generated, three (3) old NPCs must be deleted. This is irreversible.")
                if (con) {
                    let npcs = await db.npcg_npcs.orderBy('datetime').reverse().toArray()
                    npcs = npcs.slice(-3)
                    for (let index = 0; index < npcs.length; index++) {
                        const element = npcs[index];    
                        await db.npcg_npcs.delete(element.id)
                    }
                }
            } else {
                console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
            }
        })
}
// Function to pull languages for the given race and background
async function getLanguages(race, background) {
    const languageTypes = [
        "Common",
        "Common",
        "Common",
        "Common",
        "Common",
        "Exotic",
    ];
    // ----------
    //    Race
    // ----------
    const raceData = tableRaces.find((i) => i.RACE == race);
    let languages = raceData.LANGUAGES;
    if (languages) languages = languages.split(", ");
    if (languages) languages.unshift("Common");
    else languages = ["Common"];
    const extraLanguagesRace = raceData.LANGUAGES_EXTRA;
    if (extraLanguagesRace) {
        for (let index = 0; index < extraLanguagesRace; index++) {
            const languageType = randomProperty(languageTypes);
            let newLanguage = randomProperty(
                eval(`tableLanguages${languageType}`)
            ).LANGUAGE;
            while (languages.includes(newLanguage))
                newLanguage = randomProperty(
                    eval(`tableLanguages${languageType}`)
                ).LANGUAGE;
            if (newLanguage) languages.push(newLanguage);
        }
    }
    // ----------------
    //    Background
    // ----------------
    const backgroundData = tableBackgrounds.find((i) => i.NAME == background);
    // const backgroundLanguages = backgroundData.LANGUAGES; // TODO: Disregard for now
    const backgroundLangCount = backgroundData.LANGUAGES_COUNT;
    if (backgroundLangCount) {
        for (let index = 0; index < backgroundLangCount; index++) {
            const languageType = randomProperty(languageTypes);
            let newLanguage = randomProperty(
                eval(`tableLanguages${languageType}`)
            ).LANGUAGE;
            while (languages.includes(newLanguage))
                newLanguage = randomProperty(
                    eval(`tableLanguages${languageType}`)
                ).LANGUAGE;
            if (newLanguage) languages.push(newLanguage);
        }
    }
    return languages;
}
// Function to generate a name
async function generateNames(race) {
    race = race.replaceAll(" ", "_").replaceAll("'", "").toUpperCase();
    var markov = new Markov();
    let sex = document.getElementById("sex-select").value;
    sex = normalizeSex(sex);
    let tableName = tableNamebases[`${race}_${sex.toUpperCase()}`]
    if (race.includes("HALF_ELF")) {
        const elfBase = tableNamebases[`ELF_(HIGH)_${sex.toUpperCase()}`]
        const humanBase = tableNamebases[`HUMAN_${sex.toUpperCase()}`]  
        tableName = Object.assign({}, elfBase, humanBase)
    }
    if (!tableName) {
        console.log("NO NAMES IN THE NAME BASE FOR", `${race}_${sex.toUpperCase()}`)
        const raceSplit = race.split("_")
        console.log("🚀 ~ file: generateNpc.js:237 ~ generateNames ~ raceSplit:", raceSplit)
        const raceTrimmed = raceSplit[1]
        console.log("🚀 ~ file: generateNpc.js:239 ~ generateNames ~ raceTrimmed:", raceTrimmed)
        tableName = tableNamebases[`${raceTrimmed}_${sex.toUpperCase()}`]
        console.log("🚀 ~ file: generateNpc.js:238 ~ generateNames ~ tableName:", tableName)
    }
    let namebase = Object.values(tableName);
    namebase = namebase.filter(function (val) { return val !== null });
    markov.addStates(namebase); // Add the namebase to the algo
    markov.train(); // Train the model on the namebase
    let names = [];
    const namesToGenCount = 15;
    let namesInNameBaseeCount = 0;
    let namesInNameBaseList = [];
    for (let index = 0; index < namesToGenCount; index++) {
        const nameLength = getRndInteger(3, 15);
        let name = markov.generateRandom(nameLength);
        while (names.includes(name)) name = markov.generateRandom(nameLength);
        // while (names.includes(name) || namebase.includes(name)) name = markov.generateRandom(nameLength)
        if (namebase.includes(name)) {
            namesInNameBaseeCount += 1;
            namesInNameBaseList.push(name);
        }
        names.push(name.toTitleCase());
    }
    // return markov.generateRandom(10) // Generate some names
    return names;
}
// Function to get the sex
function normalizeSex(sex) {
    if (sex == "male" || sex == "female") return sex.toTitleCase();
    else return randomProperty(["male", "female"]).toTitleCase();
}
// Function to get NPC Data from DOM
async function createNpcDataFromDom(){
    const npcId = localStorage.getItem('npc-id')
    let npcData =  await db.npcg_npcs.get(npcId)
    dt = npcData.datetime

    const mbtiName = document.getElementById('personality-select').value.split(":")[0]
    const mbti = document.getElementById('personality-select').value.split(":")[1].replaceAll("-/-", " / ").toUpperCase().replace("-","")

    const data = {
        id: npcId,
        datetime: dt,
        race: document.getElementById('race-select').value,
        height_inches: document.getElementById('height-select').value, 
        weight_pounds: document.getElementById('weight-select').value,
        age: document.getElementById('age-select').value,
        sex: document.getElementById('sex-select').value,
        pregnant: document.getElementById('pregnant-select').value,
        name: document.getElementById('name-select').value,
        nickname: document.getElementById('nickname-input').value,
        gender: document.getElementById('gender-select').value,
        pronouns: document.getElementById('pronouns-select').value,
        sexual_orientation: document.getElementById('sexual-orientation-select').value,
        relationship_orientation: document.getElementById('relationship-orientation-select').value,
        alignment: document.getElementById('alignment-select').value,
        voice: document.getElementById('voice-quirk-select').value,
        mbti_name: mbtiName,
        mbti: mbti,
        mbti_description: document.getElementById('personality-description-select').value,
        languages: document.getElementById('languages-text-output').innerText.split(", "),
        relationship_status: document.getElementById('relationship-status-select').value,
        background: document.getElementById('background-select').value,
        trait: document.getElementById('trait-select').value,
        bond: document.getElementById('bond-select').value,
        flaw: document.getElementById('flaw-select').value,
        ideal: document.getElementById('ideal-select').value,
        body_shape: document.getElementById('body-shape-select').value,
        body_type: document.getElementById('body-type-select').value,
        hair_length: document.getElementById('hair-length-select').value,
        hair_type: document.getElementById('hair-type-select').value,
        hair_color: document.getElementById('hair-color-select').value,
        face_shape: document.getElementById('face-shape-select').value,
        eye_color: document.getElementById('eye-color-select').value, 
    }

    return data
}
async function populateNpcHistory(){
    const listDiv = document.getElementById('history-table-body')
    listDiv.innerHTML = ``
    let npcs = await db.npcg_npcs.orderBy('datetime').reverse().toArray()
    for (let index = 0; index < npcs.length; index++) {
        const element = npcs[index];
        const tr = document.createElement('tr')
        tr.id = element.id

        const tdID = document.createElement('td')
        const tdView = document.createElement('td')
        const tdDelete = document.createElement('td')
        const tdName = document.createElement('td')
        const tdRace = document.createElement('td')
        const tdAge = document.createElement('td')
        const tdSex = document.createElement('td')
        const tdGender = document.createElement('td')
        const tdPronouns = document.createElement('td')
        const tdLanguages = document.createElement('td')
        const tdAlignment = document.createElement('td')
        const tdBackground = document.createElement('td')

        tdID.innerText = npcs.length - (index)
        tdView.innerHTML = `<i class="fa-solid fa-eye view-row" id="${element.id}-view"></i>`
        tdDelete.innerHTML = `<i class="fa-solid fa-trash delete-row" id="${element.id}-delete"></i>`
        tdName.innerText = element.name
        tdRace.innerText = element.race
        tdAge.innerText = element.age
        tdSex.innerText = element.sex
        tdGender.innerText = element.gender
        tdPronouns.innerText = element.pronouns
        tdLanguages.innerText = element.languages
        tdAlignment.innerText = element.alignment
        tdBackground.innerText = element.background

        tr.appendChild(tdID)
        tr.appendChild(tdView)
        tr.appendChild(tdDelete)
        tr.appendChild(tdName)
        tr.appendChild(tdRace)
        tr.appendChild(tdAge)
        tr.appendChild(tdSex)
        tr.appendChild(tdGender)
        tr.appendChild(tdPronouns)
        tr.appendChild(tdLanguages)
        tr.appendChild(tdAlignment)
        tr.appendChild(tdBackground)
        
        listDiv.appendChild(tr)

        const viewIcon = document.getElementById(`${element.id}-view`)
        viewIcon.addEventListener('click', function(){ populateNpcDataFromDb(this.id.replaceAll('-view','')) })
        const deleteIcon = document.getElementById(`${element.id}-delete`)
        deleteIcon.addEventListener('click', function(){ deleteRowByPrimaryKey(this.id.replaceAll('-delete','')) })
    }
}
async function populateNpcDataFromDb(npcId){
    const npc = await db.npcg_npcs.get(npcId)
    generateOrDisplayNPC(npc)
} 