async function populateEncounterHistory(partyId){
    if (!partyId) partyId = parseInt(document.getElementById('select-party-input').value)
    const listDiv = document.getElementById('history-table-body')
    listDiv.innerHTML = ``

    let encountersData = await db.eg_encounters.reverse().toArray()
    encountersData = encountersData.filter(e => e.PARTY_ID == partyId)
    for (let index = 0; index < encountersData.length; index++) {
        const element = encountersData[index]
        const tr = document.createElement('tr')

        const tdIndex = document.createElement('td')
        const tdName = document.createElement('td')
        const tdQuantity = document.createElement('td')
        const tdDate = document.createElement('td')
        const tdTime = document.createElement('td')
        const tdView = document.createElement('td')
        const tdDelete = document.createElement('td')

        let dt = (typeof element.DATETIME == 'string')? new Date(element.DATETIME) : element.DATETIME

        tdIndex.innerText = encountersData.length - index
        tdName.innerText = element.NAME
        tdQuantity.innerText = element.QUANTITY
        tdDate.innerText = dt.toLocaleDateString()
        tdTime.innerText = dt.toLocaleTimeString()
        tdView.innerHTML = `<i class="fa-solid fa-eye" id="${element.id}-view"></i>`
        tdDelete.innerHTML = `<i class="fa-solid fa-trash" id="${element.id}-delete"></i>`

        tr.appendChild(tdIndex)
        tr.appendChild(tdName)
        tr.appendChild(tdQuantity)
        tr.appendChild(tdDate)
        tr.appendChild(tdTime)
        tr.appendChild(tdView)
        tr.appendChild(tdDelete)

        listDiv.appendChild(tr)

        document.getElementById(`${element.id}-view`).addEventListener('click', async function(){
            const id = parseInt(this.id.replaceAll('-view', ''))
            let encountersData = await db.eg_encounters.get(id)
            buildEncounterModal(encountersData)
        })

        document.getElementById(`${element.id}-delete`).addEventListener('click', async function(){
            const id = parseInt(this.id.replaceAll('-delete', ''))
            await deleteRowByPrimaryKey(id, 'table_encounters')
        })
    }
}
// Function for the random encounter
function genWeatherEnc(rowId, index){
    const timeOfDay = getSelectedValueFromRadioGroup(`time-${rowId}`).toLowerCase()
    const climate = getSelectedValueFromRadioGroup(`climate-${rowId}`)
    const season = getSelectedValueFromRadioGroup(`season-${rowId}`)
    var avgTemp = weather.find(i => i.Type == climate)[`${season}_Average_Temp_F`] // Pull average temperature
    var precProb = weather.find(i => i.Type == climate)[`${season}_Precipitation_Prob`] // Pull precipitation probability
    var precProbHeavy = weather.find(i => i.Type == climate)[`${season}_Heavy_Precipitation_Prob`] // Pull heavy precipitaion probability
    // Rolls
    var rWind = getRndInteger(1, 20)
    var rWindDir = getRndInteger(1, 8)
    var rTemp = getRndInteger(1, 20)
    var rPrec = getRndInteger(1, 1000)
    var rPrecType = getRndInteger(1, 20)
    // Temperature
    const tempMod = temperature.find(i => i.roll == rTemp).result // Extract Temperature Modifier
    const num_of_sides = parseInt(/(?<=d)(\d*)/g.exec(tempMod)[0]) // Extrect Dice Sides
    var rTempRoll = getRndInteger(1, num_of_sides) // Roll the die
    const tempSymbol = /\W/gm.exec(tempMod)[0] // Get the modifier
    // Get the multiplier
    var tempMultiplier = /\*(\d+)/gm.exec(tempMod)
    if (!tempMultiplier) tempMultiplier = 1
    else tempMultiplier = parseInt(tempMultiplier[1])
    tempModFinal = rTempRoll * tempMultiplier // Calculate temperature modifier
    // Calculate the temperature in fahrenheit
    if (tempSymbol == '-') var TempF = avgTemp - tempModFinal
    else var TempF = avgTemp + tempModFinal
    var TempC = (TempF-32) * (5/9) // Calculate temperature in celsius
    // Effect Message
    let mTempEffect
    if (TempF < 0) mTempEffect = "Whenever the temperature is at or below 0 degrees Fahrenheit, a creature exposed to the cold must succeed on a DC 10 Constitution saving throw at the end of each hour or gain one level of exhaustion. <br>Creatures with resistance or immunity to cold damage automatically succeed on the saving throw, as do creatures wearing cold weather gear (thick coats, gloves, and the like) and creatures naturally adapted to cold climates."
    else if (TempF > 100) mTempEffect = "When the temperature is at or above 100 degrees Fahrenheit, a creature exposed to the heat and without access to drinkable water must succeed on a Constitution saving throw at the end of each hour or gain one level of exhaustion. <br> The DC is 5 for the first hour and increases by 1 for each additional hour. Creatures wearing medium or heavy armor, or who are clad in heavy clothing, have disadvantage on the saving throw. <br> Creatures with resistance or immunity to fire damage automatically succeed on the saving throw, as do creatures naturally adapted to hot climates."
    else mTempEffect = 'N/A'
    // Temperature Message
    var mTemp = `<h4>Temperature</h4> Temperature: ${Math.round(TempF)}°F (${Math.round(TempC)}°C)<br> Mechanical Effect: ${mTempEffect}`
        // PRECIPITATION
            // Precipitation Class (Light/Medium/Heavy)
            let precClass
            if (rPrec < precProbHeavy) precClass = `Heavy`
            else if (rPrec < precProbHeavy*2) precClass = 'Light'
            else if (rPrec < precProb) precClass = 'Medium'
            else precClass = 'No precipitation'
            // Precipitation Type (Rain/Freezing Rain/Sleet/Snow/Hail)
            if (precClass == 'No precipitation') {
                var precType = ""
            } else {
                if (TempF <= 34) {
                    if (rPrecType <= 2) {
                        var precType = 'hail (storm)'
                    } else {
                        var precType = 'snowfall'
                    }
                } else {
                    if (rPrecType <= 1) {
                        var precType = 'hail (storm)'
                    } else if (rPrecType <= 3) {
                        var precType = 'sleet'
                    } else if (rPrecType <= 5) {
                        var precType = 'freezing rain'
                    } else {
                        var precType = 'rain'
                    }
                }
            }
            // Precipitation Effect
            if (precClass == 'Heavy') {
                var mPrecEffect = "Everything within an area of heavy rain or heavy snowfall is heavily obscured: creatures in the area are blinded. <br> Heavy rain also extinguishes open flames and imposes disadvantage on Wisdom (Perception) checks that rely on hearing."
            } else if (precClass == 'Medium') {
                var mPrecEffect = "Everything within an area of medium rain or medium snowfall is lightly obscured: <br> creatures in the area have disadvantage on Wisdom (Perception) checks that rely on sight."
            } else if (precClass == 'Light') {
                var mPrecEffect = 'N/A'
            } else {
                var mPrecEffect = 'N/A'
            }
            // Precipitation Message
            var mPrec = `<h4>Precipitation</h4> Precipitation: ${precClass} ${precType}<br>Mechanical Effect: ${mPrecEffect}`
        // WIND
            // Wind Speed 
            if (precType == 'hail (storm)') {
                windSpeed = 'heavy wind'
            } else {
            var windSpeed = wind.find(i => i.roll == rWind).result
            }
            // Wind Direction
            if (windSpeed == 'no wind') {
                var windDir = 'N/A'
            } else {
                var windDir = direction.find(i => i.roll == rWindDir).result
            }
            // Wind Effect
            if (windSpeed == 'heavy wind') {
                var mWindEffect = "A strong wind imposes disadvantage on ranged weapon attack rolls and Wisdom (Perception) checks that rely on hearing. <br> A strong wind also extinguishes open flames, disperses fog, and makes flying by nonmagical means nearly impossible. <br>A flying creature in a strong wind must land at the end of its turn or fall. <br>A strong wind in a desert can create a sandstorm that imposes disadvantage on Wisdom (Perception) checks that rely on sight."
            } else {
                var mWindEffect = 'N/A'
            }
            // Wind Message
            var mWind = `<h4>Wind</h4>Wind Speed: ${windSpeed}<br>Wind Direction: ${windDir}<br> Mechanical Effect: ${mWindEffect}`
    // POPULATE OUTCOME
    // Define the message
    var mResult = `${mWind} ${mTemp} ${mPrec}`
    // Populate the webpage with the result
    var p = document.createElement('p')
    p.innerHTML = mResult
    document.getElementById(`weather-${index}`).appendChild(p)
    // Return
    return [mWind, mTemp, mPrec]
}
// Define the function to generate a random encounter
async function randomEncounter(){
    document.getElementById('table-encounter-output').innerHTML = ''
    let sources = await db._sources.toArray()
    sources = sources.filter(e => e.SELECTED == true)
    const sourceAbbrs = sources.map(e => e.ABBREVIATION)
    let bestiaryProcessed = await fetchLocalJson(`/mikitz-ttrpg/data/json/bestiary`)
    bestiaryProcessed = bestiaryProcessed.filter(e => sourceAbbrs.includes(e.source))
    // -----------------------
    //        Functions
    // -----------------------
    async function getPartyInfo(){
        const partyId = parseInt(document.getElementById('select-party-input').value)
        if (!partyId || isNaN(partyId)) return null
        const data = await db._parties.get(partyId)
        return data 
    }
    function getRawLevel(level){
        if (level <= 4) return '1-4'
        else if (level > 4 && level <= 10) return '5-10'
        else if (level > 10 && level <= 16) return '11-16'
        else return '17-20'
    }
    function getEncounterRowIds(){
        let encounterRowIds = []
        for (let index = 0; index < tableBodyChildren.length; index++) {
            const element = tableBodyChildren[index];
            const elementID = (element.id).replace(`encounters-table-row-`, "")
            const quantity = parseInt(document.getElementById(`quantity-${elementID}`).value)    
            for (let index = 0; index < quantity; index++) {
                encounterRowIds.push(elementID)            
            } 
        }
        return encounterRowIds
    }
    function createNewRowInTable(index, elementID){
        // ROW
            // Create it
            const row = document.createElement('tr')
            // Set ID
            row.id = `roll-${index}`
            // console.log("ROLL-INDEX:", `roll-${index}`)
        // Encounter and Weather TD
            // Create it 
            const encWeatherTD = document.createElement('td')
            // Encounter
                const encounterDiv = document.createElement('p')
                // Set ID
                encounterDiv.id = `output-${index}`
                // Append to parent
                encWeatherTD.appendChild(encounterDiv)
            // Hazard Table
                const hazardDiv = document.createElement('div')
                // Set ID
                hazardDiv.id = `hazard-${index}`
                // Set Class
                hazardDiv.class = 'styled-table'
                // Append to parent
                encWeatherTD.appendChild(hazardDiv)
        // Battle Map TD
            // Create it 
            const battleMapTD = document.createElement('td')
                // Set width
                // battleMapTD.style.width = '100%'
                // Canvas
                    const battleMapCanvas = document.createElement('span')
                    // Set ID
                    battleMapCanvas.id = `weather-${index}`
                    // Set width
                    battleMapCanvas.style.width = '25%'
                    // Append to parent
                    battleMapTD.appendChild(battleMapCanvas)
        // ID TD
            // Create it
            const IDTD = document.createElement('td')
                // Create H2 element
                const IDh2 = document.createElement('h2')
                    // Inner HTML
                    IDh2.innerHTML = `<i style="cursor: pointer;" id="copy-${elementID}${index + 1}" class="fa-regular fa-copy"></i> ${index + 1}`
                    // APpend to parent
                    IDTD.appendChild(IDh2)
        // Time TD
            // Create it 
            const timeTD = document.createElement('td')
                // Create p element
                const timeP = document.createElement('p')
                // Set ID
                timeP.id = `biome-${index}`
                // Append to the parent
                timeTD.appendChild(timeP)
            // Append to the parent
            row.appendChild(IDTD)
            // Append to the parent
            row.appendChild(timeTD)
            // Append to the parent
            row.appendChild(encWeatherTD)
            // Append to the parent
            // row.appendChild(keyTD)
            // Append to the parent
            row.appendChild(battleMapTD)
        // Append to the table
        tableBody.appendChild(row)
    }
    async function copyEncounterDataFromRow(rowID, index){
        // TODO: Update for Dexie.js
        const history = JSON.parse(localStorage.getItem('encounter-history'))
        if (!history) return
        const encounterData = history.find(i => i._ID === `${rowID}${index}`)
        console.log("🚀 ~ file: encounterGenerator.js ~ line 713 ~ copyEncounterDataFromRow ~ encounterData", encounterData)
        await copyToClipboard(JSON.stringify(encounterData))
    }
    const encName = document.getElementById('name').value
    const today = new Date(); // Instantiate a new Date object
    const alwaysEncounter = document.getElementById('100-percent')
    const partyInfo = await getPartyInfo() // Get selected party info
    if (!partyInfo) return alert("Please select or create a party.")
    toggleModal("encounter-output");
    let partySize = partyInfo.SIZE
    if (partySize > 6) partySize = 6
    const tableBodyChildren = document.getElementById('encounters-table-body').childNodes
    let level = parseInt(partyInfo.LEVEL)
    const tableBody = document.getElementById('table-encounter-output')
    tableBody.innerHTML = ''
    let encounterRowIds = getEncounterRowIds()
    let encountersForDB = []
    let totalQuantity = encounterRowIds.length
    // Loop through the number of encounters the user wants
    for (let index = 0; index < encounterRowIds.length; index++) {
        const elementID = encounterRowIds[index]
        createNewRowInTable(index, elementID) // Create the new row in the output table of Encounters
        // =========================
        //        User Inputs
        // =========================
        let biome = getSelectedValueFromRadioGroup(`biome-${elementID}`);
        const road = getSelectedValueFromRadioGroup(`road-${elementID}`)
        const travelPace = getSelectedValueFromRadioGroup(`pace-${elementID}`)
        const timeOfDay = getSelectedValueFromRadioGroup(`time-${elementID}`)
        const travelMedium = getSelectedValueFromRadioGroup(`travelMedium-${elementID}`).toLowerCase()
        const climate = getSelectedValueFromRadioGroup(`climate-${elementID}`)
        const season = getSelectedValueFromRadioGroup(`season-${elementID}`)
        // const plane = document.getElementById(`table-plane-select-${elementID}`).value // TODO: Plane implementation
        // =========================
        //      Build Encounter
        // =========================
        // Determine Probabilities and Build JSON
        const probabilities = await calculateEncounterProbabilities(biome, timeOfDay, road, travelPace)
        const probs = [probabilities]
        const probTable = convertJsonToRollTable(probs)
        let encounterResult = rollTableLessThan(probTable)
        // let encounterResult = 'combatProb' // TESTING: set encounterResult for testing
        if (alwaysEncounter.checked) {
            const roll = getRndInteger(1, 3)
            if (roll === 1) encounterResult = 'hazardProb'
            if (roll === 2) encounterResult = 'nonCombatProb'
            if (roll === 3) encounterResult = 'combatProb'
        }
        // Encounter Distance
        biome = biome.replaceAll("-"," ")
        const dice = oaEncounterDistance.find(i => i.biome == biome).number_of_dice // Pull number of dice from the database
        const sides = oaEncounterDistance.find(i => i.biome == biome).number_of_sides // Pull the number of sides from the database
        const mult = oaEncounterDistance.find(i => i.biome == biome).multiplier // Pull the multiplier from the database
        const ED = fMultiRoll(dice, sides, mult) // Roll the distance
        // Encounter Variables
        let encounterFinal = "" // Where the encounter data for this encounter will be stored
        let weatherResult = "" // Where the weather data for this encounter will be stored
        let isEncounter = false // Boolean that states whether encounter is an encounter or not
        let isHazard = false // Boolean that staates whether encounter is a hazard or not
        let isNonCombatEncounter = false // Boolean that states whether this encounter is a non-combat encounter
        let isCombatEncounter = false // Boolean that states whether this encounter is a combat encounter
        let encounter = ""
        // ==================
        //    No Encounter
        // ==================
        if (typeof encounterResult === 'undefined') {
            isEncounter = false
            encounterFinal = `No Random Encounter`
        } 
        // ============
        //    Hazard
        // ============
        else if (encounterResult == 'hazardProb'){
            isHazard = true
            encounterFinal = hazard(biome, `hazard-${index}`)
        }
        // ==========================
        //    Non-combat Encounter
        // ==========================
        else if (encounterResult == 'nonCombatProb') {
            isEncounter = true
            isNonCombatEncounter = true
            encounter = handleRoad(road, biome)
            if (encounter == "Random Ship") encounter = randomShip()
            else if (encounter == "Mysterious Island") encounter = mysteriousIsland()
            else if (encounter == "Blue Hole") encounter = blueHole()
            else if (encounter == 'Shipwreck') encounter = randomShipwreck()
            encounterFinal = `<h4><u>NON-COMBAT ENCOUNTER</u></h4>${encounter}...${ED} ft. away.`
        }
        // ======================
        //    Combat Encounter
        // ======================
        else if (encounterResult == 'combatProb') {
            isCombatEncounter = true
            isEncounter = true
            isNonCombatEncounter= false
            /* IDEAS
            === Creature Quantity ===
                - This should only apply to followers
                - Pack animals
                - Solo animals (How to make them challenge the party?)
            === NPCs option (Exclude/Include) ===
            === Other Ideas ===
                - What's the max number of different creatures? 
                - Only apply creature quantity to followers
                - 
            */

            // ENCOUNTER PARAMETERS
            let encDifficulty = await db.eg_difficulty_probabilities.toArray()
            encDifficulty = encDifficulty.filter(e => e.TIME_OF_DAY == timeOfDay.toUpperCase()) // TODO: Need to compute SIDES column from probabilities
            const encounterDifficulty = rollTable(encDifficulty) // Encounter Difficulty
            const xpLowerBound = parseInt(xpThresholds.find(row => row.CHAR_LEVEL === level)[encounterDifficulty.toUpperCase()]) * partySize // XP Lower Bound
            const diffUpIndex = encDifficulty.map(function(e) { return e.DIFFICULTY; }).indexOf(encounterDifficulty) // XP Upper Bound
            if(diffUpIndex === 5) var xpUpperBound = xpLowerBound * 100
            else var xpUpperBound = parseInt(xpThresholds.find(row => row.CHAR_LEVEL === level)[(encDifficulty[diffUpIndex+1].DIFFICULTY).toUpperCase()]) * partySize
            // FILTER TABLE
            encounter = bestiaryProcessed.filter(n => n.BIOMES.includes(biome.toLowerCase()) || n.BIOMES.includes('all')) // Based on Biome
            encounter = encounter.filter(n => n.TIME_OF_DAY.includes(timeOfDay.toLowerCase())) // Based on Time of Day
            encounter = encounter.filter(n => n.XP <= xpUpperBound) // Based on XP Threshold
            encounter = encounter.filter(n => n.ALTITUDE.includes(travelMedium)) // Based on Travel Medium
            // encounter = encounter.filter(n => n.PLANES.includes(plane.toLowerCase())) // TODO: Plane implementation
            // ENCOUNTER ROLLING
            // encounterFinal = generateCompletelyRandomMonsters(encounter, partySize, xpLowerBound, xpUpperBound, encounterDifficulty, ED) // Generate a completely random group of monsters to fit the difficulty
            encounterFinal = await generateOneLeadersAndGroupOfFollowers(encounter, partySize, xpLowerBound, xpUpperBound, encounterDifficulty, ED, level, bestiaryProcessed) // Generate an Encounter with one leader and n followers to fit the encounter difficulty
        }
        // ==================
        //      Weather
        // ==================
        if (isEncounter == true) weatherResult = genWeatherEnc(elementID, index)
        else if (isHazard == true) weatherResult = genWeatherEnc(elementID, index)
        else weatherResult = ['N/A', 'N/A', 'N/A'] // Set the weather to N/A since there was no encounter
        // ======================================
        //      Substitute Dice and Monsters
        // ======================================
        encounterFinal = replaceDiceStringsWithRollTotals(encounterFinal)
        if (isCombatEncounter == false) encounterFinal = await replaceMonstersWithLinks(encounterFinal)
        // ======================
        //      Update Dom
        // ======================
        var p = document.createElement('p')
        p.innerHTML = `${encounterFinal}`
        const outputStuff = document.getElementById(`output-${index}`)
        outputStuff.appendChild(p)
        document.getElementById(`biome-${index}`).innerText = `${biome}, ${timeOfDay}`
        // =========================
        //      Add to DB
        // =========================
        const encounterData = {
            _ID: `${elementID}-${index + 1}`,
            BIOME: biome,
            TIME_OF_DAY: timeOfDay,
            SEASON: season,
            CLIMATE: climate,
            ROAD: road,
            TRAVEL_PACE: travelPace,
            TRAVEL_MEDIUM: travelMedium,
            ENCOUNTER_DISTANCE: ED,
            ENCOUNTER: `${encounterFinal}`,
            WEATHER: weatherResult,
        }
        encountersForDB.push(encounterData)
    }
    await db.eg_encounters.put({
        DATETIME: today,
        NAME: encName,
        PARTY_ID: partyInfo.id,
        QUANTITY: totalQuantity,
        DATA: encountersForDB
    })
    .then(async function(){
        makeToast(`Encounters saved successfully!`, 'success') // Alert user to the success
    })
    .catch(function(error){
        console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
    })
    document.getElementById('name').value = ''
    await populateEncounterHistory(partyInfo.id)
}
async function generateOneLeadersAndGroupOfFollowers(encounter, partySize, xpLowerBound, xpUpperBound, encounterDifficulty, ED, level, bestiaryProcessed){
    /*
    === Leaders and Followers and Lieutenants ===
        - Leaders = monsters with the same creature type/subtype and a higher CR
            - [x] MVP
            - [ ] Could add in monster with higher intelligence for other types/subtypes?
                - Must be able to speak
        - [x] Lieutenant = monster with CR between Leader CR * 0.8 and Leader CR * 0.6
        - [x] Sergeants = monster with CR between Leader CR * 0.59 and Leader CR * 0.4
        - [x] Minions = monster with CR less than Leader CR * 0.39
    */
    function getLeader(encounter, level){
        const lowerLeaderCR = Math.round(level * 0.8)
        const upperLeaderCR = Math.round(level * 1.2)
        const maxCR = Math.max(...encounter.map(o => o['cr']))
        if (maxCR >= lowerLeaderCR && maxCR <= upperLeaderCR) encounter = encounter.filter(n => n['cr'] >= lowerLeaderCR && n['cr'] <= upperLeaderCR) // 
        else encounter = encounter.filter(n => n['cr'] == maxCR)
        let leader = randomProperty(encounter)
        let followers = leader.FOLLOWERS
        while (!followers || followers.length == 0) leader = randomProperty(encounter)
        let lieutenant = getCreatureFromRelationshipList(leader.LIEUTENANTS)
        let sergeant = getCreatureFromRelationshipList(leader.SERGEANTS)
        const randomLeader = [leader,lieutenant,sergeant]
        let randLeader = randomProperty(randomLeader)
        while (!randLeader) randLeader = randomProperty(randomLeader)
        return randLeader
    }
    function getCreatureFromRelationshipList(list){
        if (!list) return null
        let rand = randomProperty(list)
        return bestiaryProcessed.find(n => n.name == rand)
    }
    async function addCreatureToCreatureListFromRelationship(xpLowerBound, xpUpperBound, relationship, creatures, partySize, listXP, label){
        
        if (!relationship) return {CREATURES: creatures, LIST_XP: listXP}
        // -----------------
        // Experience Points
        // -----------------
        let count = 0
        let bookSource = relationship.source
        let adjustedXP = computeAdjustedXpFromListXp(partySize, listXP)
        if (adjustedXP >= xpLowerBound && adjustedXP <= xpUpperBound) return {CREATURES: creatures, LIST_XP: listXP} // Break out because our encounter's XP fits perfectly within the bounds
        while (adjustedXP <= xpUpperBound) {
            listXP.push(relationship.XP) // Push the new creature to the list
            adjustedXP = computeAdjustedXpFromListXp(partySize, listXP) // Compute the new adjusted XP based on adding another creature
            if (adjustedXP <= xpUpperBound) {
                count += 1 // Add one to the number of this monster
            } else {
                listXP = removeItemOnce(listXP, listXP[listXP.length-1]) // Remove the last creature from the list
            }
            if (adjustedXP >= xpLowerBound && adjustedXP <= xpUpperBound) break // Break out because our encounter's XP fits perfectly within the bounds
        }
        // ----------------
        // Creatures Object
        // ----------------
        if (count > 0) {
            creatures.push({
                QUANTITY: count,
                CREATURE: `${pepperoniPizza((relationship.name).toLowerCase(), bookSource)}`,
                XP: relationship.XP,
                LABEL: label
            })
        }
        return {CREATURES: creatures, LIST_XP: listXP}
    }
    function computeAdjustedXpOfCreatures(partySize, creatures){
        let multTable = encXpMultipliers.filter(n => n.PARTY_SIZE == partySize) // Filter multiplier tables based on party size
        let numberOfMonsters = 0
        let XP = 0
        for (let index = 0; index < creatures.length; index++) {
            const element = creatures[index];
            numberOfMonsters += element.QUANTITY
            XP += (element.XP * element.QUANTITY)
        }
        if (numberOfMonsters > 15) numberOfMonsters = 15
        let multiplier = parseFloat(multTable.find(n => n.NUMBER_OF_MONSTERS == numberOfMonsters).MULTIPLIER)
        return {ADJUSTED_XP: XP * multiplier, TOTAL_XP: XP}
    }
    function computeAdjustedXpFromListXp(partySize, listXP){
        let multTable = encXpMultipliers.filter(n => n.PARTY_SIZE == partySize) // Filter multiplier tables based on party size
        const sum = listXP.reduce((partialSum, a) => partialSum + a, 0) // Get the sum of the XP in the encounter
        let numberOfMonsters = listXP.length // Get the length of the array to determine the number of creatures
        if (numberOfMonsters > 15) numberOfMonsters = 15 // D&D 5e does not support a multiplier for an enemy force greater than 15 creatures
        if (numberOfMonsters == 0) numberOfMonsters = 1
        let multiplier = parseFloat(multTable.find(n => n.NUMBER_OF_MONSTERS == numberOfMonsters).MULTIPLIER) // Get the multiplier based on monster quantity, party size and level
        return sum * multiplier // Compute the adjusted XP and return it
    }
    let totalXP = 0 // Total XP
    let creatures = [] // Create an empty list to store our creatures in
    let listXP = []
    // =================
    //     Creatures
    // =================
    let leader = getLeader(encounter, level)
    let leaderName = leader.name
    let bookSource = leader.source

    let leaderLeader = getCreatureFromRelationshipList(leader.LEADERS)
    let lieutenant = getCreatureFromRelationshipList(leader.LIEUTENANTS)
    let sergeant = getCreatureFromRelationshipList(leader.SERGEANTS)
    let minion = getCreatureFromRelationshipList(leader.MINIONS)
    let follower = getCreatureFromRelationshipList(leader.FOLLOWEWRS)
    // ===========
    //      XP
    // ===========
    // Leader
    if (totalXP += leader.XP < xpUpperBound) { 
        totalXP += leader.XP
        creatures.push({
            QUANTITY: 1, 
            CREATURE: `${pepperoniPizza((leaderName).toLowerCase(), bookSource)}`,
            XP: leader.XP,
            LABEL: 'leader'
        })
        listXP.push(leader.XP)
    }
    let creatures1 = await addCreatureToCreatureListFromRelationship(xpLowerBound, xpUpperBound, lieutenant, creatures, partySize, listXP, 'lieutenant') // Lieutenant(s)
    let creatures2 = await addCreatureToCreatureListFromRelationship(xpLowerBound, xpUpperBound, sergeant, creatures1.CREATURES, partySize, creatures1.LIST_XP, 'sergeant') // Sergeant(s)
    let creatures3 = await addCreatureToCreatureListFromRelationship(xpLowerBound, xpUpperBound, minion, creatures2.CREATURES, partySize, creatures2.LIST_XP, 'minion') // Minion(s)
    let creatures4 = await addCreatureToCreatureListFromRelationship(xpLowerBound, xpUpperBound, follower, creatures3.CREATURES, partySize, creatures3.LIST_XP, 'minion') // Follower(s)
    
    
    const xpData = computeAdjustedXpOfCreatures(partySize, creatures4.CREATURES)
    let adjustedXP = xpData.ADJUSTED_XP
    totalXP = xpData.TOTAL_XP
    // ========================
    //    Assemble Encounter
    // ========================
    let creatureLinks = []
    let count = 0
    for (let index = 0; index < creatures.length; index++) {
        const element = creatures[index];
        creatureLinks.push(`${(element.LABEL).toTitleCase()}: ${element.QUANTITY} ${element.CREATURE}`)
        count += element.QUANTITY
    }
    encounter = creatureLinks.join("<br>") // Join the creatures list into a string with a comma seperator
    // Final Encounter Message
    encounterFinal = `<h4><u>COMBAT ENCOUNTER</u></h4>
                        <h4>Encounter Stats</h4>
                        <span>Difficulty: <i>${encounterDifficulty}</i></span><br>
                        <span>XP Lower Bound: <i>${xpLowerBound.toLocaleString()}</i></span><br>
                        <span>XP Upper Bound: <i>${xpUpperBound.toLocaleString()}</i></span><br>
                        <span>Adjusted XP: <i>${adjustedXP.toLocaleString()}</i></span><br>
                        <span>Total XP: <i>${totalXP.toLocaleString()}</i></span><br>
                        <span>XP per PC: <i>${(totalXP / partySize).toLocaleString()}</i></span><br>
                        <span>Number of Creatures: <i>${count}</i></span><br>
                        <h4>Encounter Details</h4>
                        <span>${encounter} <br>Distance: ${ED} ft. away.</span>`
    return encounterFinal
}
function generateCompletelyRandomMonsters(encounter, partySize, xpLowerBound, xpUpperBound, encounterDifficulty, ED){
    var totalXP = 0 // Total XP
    var creatures = [] // Create an empty list to store our creatures in
    const multTable = encXpMultipliers.filter(n => n.PARTY_SIZE == partySize) // Filter multiplier tables based on party size
    var count = 0 // count
    // Keep picking creatures until we go over the XP Threshold
    while (totalXP <= xpUpperBound){
        count += 1
        if(creatures.length != 0){
            var xpMultiplier = parseFloat(multTable.find(n => n.NUMBER_OF_MONSTERS === creatures.length).MULTIPLIER) // Get the multiplier based on number of creatures
            var adjustedXP = totalXP * xpMultiplier // Adjust the XP based on number of creatures
            if (adjustedXP > xpLowerBound && adjustedXP <= xpUpperBound) break // Break out because our encounter's XP fits perfectly within the bounds
            else if(adjustedXP > xpUpperBound){
                const newRE = new RegExp('>(.*)<', 'gm') // Define regex to exctract the creature
                const monster = (newRE.exec((creatures[creatures.length-1]).replace("a(n) ", ""))[1]).toTitleCase()
                totalXP -= parseInt(encounter.find(n => n.name === monster).XP) // Subtract its XP from totalXP
                creatures = removeItemOnce(creatures, creatures[creatures.length-1]) // Remove the last creature from the list
            }
        }
        encounter = encounter.filter(n => n.XP <= xpLowerBound - totalXP) // Filter encounter table based on remaining XP
        if(encounter.length === 0) break // Break out of the loop if there are no creatures to be picked from
        const creature = randomProperty(encounter) // Get a random creature
        const creatureName = creature.name
        const bookSource = bestiaryProcessed.find(n => n.name === creatureName).source // Get the book source
        creatures.push(`1 ${pepperoniPizza((creature.name).toLowerCase(), bookSource)}`) // Append it to the list of creatures
        totalXP += creature.XP // Add the creature's XP to the Total XP
    }
    // Assemble Encounter
    encounter = creatures.join(", ") // Join the creatures list into a string with a comma seperator
    // Final Encounter Message
    encounterFinal = `<h4><u>COMBAT ENCOUNTER</u></h4>
                        <h5>Encounter Stats</h5>
                        <span>Difficulty: <i>${encounterDifficulty}</i></span><br>
                        <span>XP Lower Bound: <i>${xpLowerBound}</i></span><br>
                        <span>XP Upper Bound: <i>${xpUpperBound}</i></span><br>
                        <span>Adjusted XP: <i>${adjustedXP}</i></span><br>
                        <span>Total XP: <i>${totalXP}</i></span><br>
                        <span>XP per PC: <i>${totalXP / partySize}</i></span><br>
                        <span>Number of Creatures: <i>${creatures.length}</i></span><br>
                        <h5>Encounter Details</h5>
                        <span>${encounter} ${ED} ft. away.</span>`
    return encounterFinal
}
// Function to generate a Hazard
function hazard(biome, ID){
    biome = biome.replaceAll(" ", "_")
    // ====================================================
    //                  General Hazards
    // ====================================================
    try {
        // Roll on the table
        var type = rollTable(eval(`hazard${biome}Type`))
    }  catch(e){
        console.log("HAZARD ERROR:", e)
        // Send it
        encounterFinal = `<h2>HAZARD</h2> Sorry! ${biome} Hazards are not currently implemented.`
        return encounterFinal
    }
    if (type){
        // HAZARD DC
            // Roll on the table
            var vDC = rollTable(eval(`hazard${biome}DC`))
            // Log it
            // console.log(`                   Hazard DC: ${vDC}`)
        // SPECIFIC HAZARD TYPE
            // Set up the eval of the pulled type
                // Check if there are spaces in the rolled type
                if (type.includes(" ")) {
                    // Replace spaces with underscore
                    var table1 = type.replace(/ /g,"_")
                    // Evaluate the table to pull from it
                    table = eval(`hazard${biome}${table1}`)
                    // Pull from the table
                    var description = table.find(x => x.DC == vDC).Description
                } else {
                    // Evaluate the table to pull from it
                    var table1 = eval(`hazard${biome}${type}`)
                    // Pull from the table
                    var description = table1.find(x => x.DC == vDC).Description
                }
                // Log it
                // console.log(`                   ${type}: ${description}`)
        // HANDLE DICE IN THE DESCRIPTION
            // Roll the dice using the custom-built function
            description = replaceDiceStringsWithRollTotals(description)
            // console.log(`                   ${type} (ROLLED): ${description}`)
    // ====================================================
    //                  Special Hazards
    // ====================================================
        // HANDLE MAGICAL STORMS AND FOG
            // Roll 1d10 to determine if it's magical
            var magical = getRndInteger(1, 10)
            // Log it
            // console.log(`                   Magic Roll: ${magical}`)
            // Check the hazard type and if the 1d10 above is a 1
            if (type == 'Storm' && magical == 1) {
                // Determine the type of magical storm
                var magicalType = rollTable(eval(`hazard${biome}StormMagical`))
                // Log it
                // console.log(`                   Magic Storm: ${magicalType}`)
            } else if (type == 'Fog' && magical == 1) {
                // Determien the type of magical fog
                var magicalType = rollTable(eval(`hazard${biome}FogMagical`))
                // Log it
                // console.log(`                   Magic Fog: ${magicalType}`)
            } else if (type == 'Whirlpool' && magical == 1) {
                var magicalType = rollTable(eval(`hazard${biome}WhirlpoolMagical`))
            } else {
                var magicalType = `Non-magical`
            }
    // ====================================================
    //                  Push to the DOM
    // ====================================================
    // EXPORT THE MESSAGE
        // Build the message
        var vMessage = `${type} (${magicalType}) with a DC of ${vDC}<br> Description: ${description}`
        // Handle visibility if the hazard is Fog
        if (type == 'Fog') {
            // Pull the distance from the obscured table
            var visibleDistance = eval(`hazard${biome}FogThickness`).find(i => i.Thickness == description).Visibility
            // Log it
            // console.log(`                   Visibility: ${visibleDistance}`)
            // Append to the message
            vMessage += `<br>Visibility: ${visibleDistance}`
        }
        // Send it
        encounterFinal = `<h2>HAZARD</h2>${vMessage}`
    // DISPLAY RESULTS TABLE
        // Check for spaces in the hazard type
        if (type.includes(" ")) {
            // Replace spaces with underscore
            var type = type.replace(/ /g,"_")
        }
        // Set the table
        var vTable = eval(`hazard${biome}CheckResults${type}HTML`)
        // Print the results table
        var p = document.createElement('table')
        p.innerHTML = vTable
        document.getElementById(ID).appendChild(p)
        return encounterFinal
    }
}
// Function to generate a random ship
function randomShip(){
    // ROLL TABLES
    var purpose = rollTable(ship_purpose)
    var type = rollTable(ship_type)
    var adj = rollTable(ship_adjective)
    var noun = rollTable(ship_noun)
    var attitude = rollTable(ship_attitude)
    var attitudeLower = attitude.toLowerCase()
    var races = rollTable(eval(`ship_${attitudeLower}`))
    var disposition = rollTable(ship_disposition)
    if (disposition == 'Emergency') {
        var emergency = rollTable(ship_emergency)
    } else {
        var emergency = 'Nothing Unique'
    }
    var cCrew = ship_crew.find(ship => ship.Ship == type).Crew
    var cPassengers = ship_crew.find(ship => ship.Ship == type).Passengers
    var qCrew = getRndInteger(1, cCrew)
    var qPassengers = getRndInteger(1, cPassengers)
    // BUILD THE MESSAGE
    return vMessage = `The party comes accross a <b>${attitude} ${purpose} ${type}</b> crewed by ${qCrew} (max. ${cCrew}) ${races} with ${qPassengers} (max. ${cPassengers}) ${races} passengers on board. This <b>${races}</b> ship is called the <b>${adj} ${noun}</b> with a disposition of <b>${disposition}</b>: ${emergency}.`
}
// Function to generate a shipwreck
async function randomShipwreck() {      
    // Loop through the quantities to generate that many ships
    for (q = 0; q < quantity; q++) {
        // Roll on the table
        var wreck = rollTable(tableShipwreck)
        // Roll dice in it
        wreck = replaceDiceStringsWithRollTotals(wreck)
        console.log(`Wreck before Link: ${wreck}`)
        // Replace creatures with links
        wreck = await replaceMonstersWithLinks(wreck)
        console.log(`Wreck post-link: ${wreck}`)
        // OUTPUT
        // Set up the message
        var vMessage = `<H2>SHIPWRECK #${q + 1}</H2>`
        // Assemble the message
        vMessage += `<h5>Shipwreck</h5>: ${wreck}`
    }
    // RETURN
    return vMessage
}
// Function to generate a Myserious Island
async function mysteriousIsland(){
    // Set up an output list
    var lOutput = []
    // THEME
    // Get the island theme
    var theme = rollTable(islandTheme)
    // Add the theme to the list
    lOutput.push(`<b>Theme:</b> ${theme}`)
    // THEME DESCRIPTION
    // Get the description
    var description = islandDescription.find(i => i.Theme == theme).Description
    // Push it to the list
    lOutput.push(`<br><b>Description:</b> ${description}`)
    // STORY HOOK
    // Roll on the table
    var storyHook = rollTable(eval(`island${theme}Hooks`))
    // Roll dice within the output
    storyHook = replaceDiceStringsWithRollTotals(storyHook)
    // Add links to creatures
    storyHook = await replaceMonstersWithLinks(storyHook)
    // Push it to the output list
    lOutput.push(`<br><b>Story Hook:</b> ${storyHook}`)
    // INHABITANTS
    // Roll on the table
    var inhabitants = rollTable(eval(`island${theme}Inhabitants`))
    // Roll dice within the output
    inhabitants = replaceDiceStringsWithRollTotals(inhabitants)
    // Add links to creatures
    inhabitants = await replaceMonstersWithLinks(inhabitants)
    // Push it to the output list
    lOutput.push(`<br><b>Inhabitants:</b> ${inhabitants}`)
    // REACTIONS
    // Check if theme is Alien or Sanctum
    if (theme == 'Alien' || theme == 'Sanctum') {
        // Roll on the table
        var reaction = rollTable(eval(`island${theme}Reaction`))
        // Roll dice within the output
        reaction = replaceDiceStringsWithRollTotals(reaction)
        // Add links to creatures
        reaction = await replaceMonstersWithLinks(reaction)
        // Push it to the output list
        lOutput.push(`<br><b>Inhabitants Reaction:</b> ${reaction}`)
    } else {
        var reaction = 'N/A'
    }
    // LEADER
    // Check if theme is NOT Cursed or Wild
    if (theme != 'Cursed' && theme != 'Wild') {
        // Roll on the table
        var leader = rollTable(eval(`island${theme}Leader`))
        // Roll dice within the output
        leader = replaceDiceStringsWithRollTotals(leader)
        // Check for dragon
        if (leader.includes('chromatic dragon')){
            // Get the dragon's type
            var type = rollTable(chromaticDragons)
            // Get the dragons age
            var age = rollTable(dragonAge)
            // Assemble the leader
            leader = `${age} ${type} Dragon`
        } else if (leader.includes('metallic dragon')) {
            // Get the dragon's type
            var type = rollTable(metallicDragons)
            // Get the dragons age
            var age = rollTable(dragonAge)
            // Assemble the leader
            leader = `${age} ${type} Dragon`
        }
        // Push it to the output list
        lOutput.push(`<br><b>Leader:</b> ${leader}`)
    } else {
        var leader = 'N/A'
    }
    // MISC
    // Check if theme is Cursed
    if (theme == 'Cursed') {
        // Get the curse afflicting the island
            // Roll on the table
            var curse = rollTable(eval(`island${theme}Curse`))
            // Roll dice within the output
            curse = replaceDiceStringsWithRollTotals(curse)
            // Add links to creatures
            curse = await replaceMonstersWithLinks(curse)
            // Push it to the output list
            lOutput.push(`<br><b>Curse:</b> ${curse}`)
            // Set other vars
            var motive = 'N/A'
            var feature = 'N/A'
    // Check if theme is Hostile
    } else if (theme == 'Hostile') {
        // Get the Leader's motive
            // Roll on the table
            var motive = rollTable(eval(`island${theme}Motive`))
            // Roll dice within the output
            motive = replaceDiceStringsWithRollTotals(motive)
            // Add links to creatures
            motive = await replaceMonstersWithLinks(motive)
            // Push it to the output list
            lOutput.push(`<br><b>Leader Motive:</b> ${motive}`)
            // Set other vars
            var curse = 'N/A'
            var feature = 'N/A'
    // Check if theme is Wild
    } else if (theme == 'Wild') {
        // Get the island's feature
            // Roll on the table
            var feature = rollTable(eval(`island${theme}Feature`))
            // Roll dice within the output
            feature = replaceDiceStringsWithRollTotals(feature)
            // Add links to creatures
            feature = await replaceMonstersWithLinks(feature)
            // Push it to the output list
            lOutput.push(`<br><b><b>Island Feature:</b> ${feature}`)
            // Set other vars
            var motive = 'N/A'
            var curse = 'N/A'
    } else {
        // Set other vars
        var motive = 'N/A'
        var curse = 'N/A'
        var feature = 'N/A'
    }
    // OUTPUT
    // Set up the message
    var vMessage = `<H5>MYSTERIOUS ISLAND ENCOUNTER</H5>`
    // Assemble the message
    lOutput.forEach(i => {
        vMessage += `${i}`
    })
    // Return
    return vMessage
}
async function blueHole(){
    // Blue Hole dimensions
    var diameter = getRndInteger(1, 10) * 100
    var depth = getRndInteger(1, 10) * 100
    var result = rollTable(blue_hole) // Roll on the table
    result = replaceDiceStringsWithRollTotals(result) // Roll dice in result
    result = await replaceMonstersWithLinks(result) // Replace creatures with links in result
    // Set the final encounter message
    return `The party comes across a Blue Hole that is ${diameter}ft in diameter and ${depth}ft deep. It contains ${result}.`
}
function handleRoad(road, biome){
    if (road == 'On a Road' || road == 'HIGHWAY' || road == 'BYWAY' || road == 'ROYALWAY' || road == 'BRIDLEWAY') {
        let len = road_nc.length // Get length for the d100
        let ad100 = getRndInteger(1, len) // Roll 1dx
        return road_nc[ad100] // Get the rolled encounter
    } else {
        var len = eval(`${(biome.replaceAll(" ", "_")).toLowerCase()}_nc`).length // Get length for the d100
        var ad100 = getRndInteger(1, len) // Roll 1dx
        return eval(`${(biome.replaceAll(" ", "_")).toLowerCase()}_nc`)[ad100] // Get the rolled encounter
    }
}
async function setupTopNav(){
    await sleep(120)
    const list = document.querySelectorAll('.nav-a');
    const url = window.location.href
    list.forEach(element => {
        if (url.includes('index') && element.id.includes('generator')) element.classList.add('active')
        else if (url.includes('wiki') && element.id.includes('wiki')) element.classList.add('active')
        else if (url.includes('about') && element.id.includes('about')) element.classList.add('active')
        else if (url.includes('settings') && element.id.includes('settings')) element.classList.add('active')
    });
}
// Function to create a radio group
function createRadioGroup(parentElement, groupName, arrayOfRadios, nameModifier, extraName, valueObject){
    // Container
    const container = document.createElement('div')
    container.classList.add('radio-input-container')
    parentElement.appendChild(container)
    // Group Label
    const groupLabel = document.createElement('label')
    groupLabel.innerText = `${groupName.replace('-', ' ').toTitleCase()}:`
    groupLabel.classList.add('radio-input-label')
    container.appendChild(groupLabel)
    // Radio Buttons
    arrayOfRadios.forEach(element => {
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = `${nameModifier}-${groupName}-${extraName}-radio`    
        radio.id = `${extraName}-${element.toLowerCase()}-${nameModifier}-${groupName}-radio-group`
        radio.value = element.toLowerCase()

        if (valueObject[groupName] == element.toLowerCase()) radio.checked = true
        container.appendChild(radio)

        const label = document.createElement('label')
        label.innerText = element
        label.htmlFor = `${extraName}-${element.toLowerCase()}-${nameModifier}-${groupName}-radio-group`
        container.appendChild(label)
    });
}
function createNumberInputDiv(parentElement, name, nameModifier, extraName, valueObject){
    const amountContainer = document.createElement('div')
    amountContainer.classList.add('text-input-container')

    const amountLabel = document.createElement('label')
    amountLabel.innerText = `${name.toTitleCase()}:`
    amountLabel.htmlFor = `${extraName}-${nameModifier}-${name}`
    amountLabel.classList.add('text-input-label')
    amountContainer.appendChild(amountLabel)

    const input = document.createElement('input')
    input.type = 'number'
    input.id = `${extraName}-${nameModifier}-${name}`
    input.value = valueObject.value
    input.classList.add('text-input')
    amountContainer.appendChild(input)

    parentElement.appendChild(amountContainer)
    
}
// Populate Elements
function populateDropdownFromArray(dropdownId, array, selectedOption){
    const dropdown = document.getElementById(dropdownId)
    array.forEach(element => {
        const option = document.createElement('option')
        option.id = element
        option.value = element
        if (element == selectedOption) option.selected = true
        option.innerText = element
        dropdown.appendChild(option)
    });
}
// Function to add div to the table
function addDivAndDropdownToTable(id, index, div){
    const divElement = document.createElement('div')
    divElement.id = `${id}-${index}`
    divElement.classList.add('select-container')

    const span = document.createElement('span')
    span.id = `${id}-help`
    span.innerHTML = `<i class="bi bi-question-square"></i>`

    divElement.appendChild(span)

    const selectElement = document.createElement('select')
    selectElement.id = `${id}-select-${index}`
    selectElement.classList.add('select-dropdown')
    divElement.appendChild(selectElement)

    div.appendChild(divElement)
}
// Function to add label and text span to table 
function addLabelAndTextSpan(id, index, div){
    const divElement = document.createElement('div')
    divElement.id = `${id}-div-${index}`

    const label = document.createElement('label')
    label.innerHTML = `<b>${id.toTitleCase()}:</b>`
    label.for = `${id}-span-${index}`
    divElement.appendChild(label)

    const span = document.createElement('span')
    span.id = `${id}-span-${index}`
    span.innerText = '___'
    divElement.appendChild(span)
    
    div.appendChild(divElement)
}
// Function to add TD to table
function addTdToTable(id, index){
    const tdElement = document.createElement('td')
    tdElement.name = `table-${id}`
    tdElement.id = `${id}-${index}`
    return tdElement
}
// Function to populate the side panel elements
function populateSidePanelElementsAndAttachHelpTippy(){
    // populateDropdownFromArray('biome', biome)
    // populateDropdownFromArray('plane', plane)
    // populateDropdownFromArray('road', road)
    // populateDropdownFromArray('travel-medium', travelMedium)
    // populateDropdownFromArray('pace', pace)
    // populateDropdownFromArray('climate', climate)
    // populateDropdownFromArray('season', season)
    // populateDropdownFromArray('time', time)

    // Attach Tippy
    addTippy('encounter-name-help', 'Set a name for this (group of) encounter(s) so you can more easily remember it if you want to check your history.')
    addTippy('quantity-help', 'Set the number of encounters that will be generated per row.')
    addTippy('guarantee-encounter-help', 'If checked, an encounter is guaranteed to occur in every instance. Each type of encounter (combat, non-combat, and hazard) has an equal chance of occuring: 1 out of 3.')
    addTippy('party-name-help', 'Select the party you wish to use for balancing the encounters.')
    
    addTippy('probability-help', 'The probability of each encounter type occuring for just this row. Disregards quantity.')
    addTippy('total-probability-help', 'The probability of at least Encounter Number encounters occuring. E.G. if there are 3 encounters in the table, then the 1st row displays the probability of at least 1 encounter occuring, the 2nd row displays the probabilty of at least 2 encounters occuring, etc.')
}
function addInputContainerToTable(id, index, div){
    const divElement = document.createElement('div')
    divElement.id = `${id}-${index}`
    divElement.classList.add('select-container')

    const span = document.createElement('span')
    span.id = `${id}-help`
    span.innerHTML = `<i class="bi bi-question-square"></i>`

    divElement.appendChild(span)

    div.appendChild(divElement)
}
// Function to populate custom radio group from array
function createCustomRadioGroupFromArray(dropdownId, array, radioName, radioId, selectedOption, rowId){
    const dropdown = document.getElementById(dropdownId)
    const radioGroupContainer = document.createElement('div')
    radioGroupContainer.classList.add('radio-group')
    radioGroupContainer.id = `${radioName}-radio-group-${rowId}`
    array.forEach(element => {
        const icon = eval(`${radioName}Icons`)[element]
        const label = document.createElement('label')
        label.name = 'radio-label'
        label.id = `radio-label-${element}`
        label.classList.add('radio-label')

        const input = document.createElement('input')
        input.classList.add('checkbox')
        input.type = 'radio'
        input.name = `${radioName}-${rowId}`
        input.id = `radio-${element}`
        input.value = element
        if (element == selectedOption) input.checked = true
        
        const span = document.createElement('span')
        span.classList.add('radio-icon')
        span.id = `${(element)}-radio-icon`
        span.innerHTML = icon

        label.appendChild(input)
        label.appendChild(span)

        radioGroupContainer.appendChild(label)
    })
    dropdown.appendChild(radioGroupContainer)
}
// Function to set up the listeners of index.html
function encounterGeneratorListeners() {
    // Generate Encounters(s)
    const generateEncountersButton = document.getElementById("generate-encounter");
    generateEncountersButton.addEventListener("click", async function () {
        await randomEncounter();
    });
    // Party Name
    const partyNameSelect = document.getElementById("select-party-input");
    partyNameSelect.addEventListener("change", async function () {
        populatePartyParametersBasedOnSelectParty();
        await populateEncounterHistory()
    });
    addTippy(
        "total-probs-help",
        "The probability that at least X encounters will occur."
    );
    document.getElementById("settings-save-party").addEventListener("click", function () { saveParty(); });
    const toggleHistory = document.getElementById('toggle-history')
    toggleHistory.addEventListener('click', function(){
        toggleNextChildDisplay(this)
    })
}
// Function to add a row to the encounters table
async function addEncounterRow(clickedElement) {
    let rowId;
    let biomeSelected = 'Grassland'
    let roadSelected = 'NO_ROAD'
    let travelMediumSelected = 'Ground'
    let travelPaceSelected = 'Normal'
    let climateSelected = 'Temperate'
    let seasonSelected = 'Spring'
    let timeOfDaySelected = 'Day'
    if (clickedElement) {
        rowId = getRowIdFromClickedElementWithin(clickedElement);
        // Get selected options from selects
        biomeSelected = getSelectedValueFromRadioGroup(`biome-${rowId}`);
        roadSelected = getSelectedValueFromRadioGroup(`road-${rowId}`)
        travelPaceSelected = getSelectedValueFromRadioGroup(`pace-${rowId}`)
        timeOfDaySelected = getSelectedValueFromRadioGroup(`time-${rowId}`)
        travelMediumSelected = getSelectedValueFromRadioGroup(`travelMedium-${rowId}`)
        climateSelected = getSelectedValueFromRadioGroup(`climate-${rowId}`)
        seasonSelected = getSelectedValueFromRadioGroup(`season-${rowId}`)
    }
    const tableBodyElement = document.getElementById("encounters-table-body");
    const rowElement = document.createElement("tr");
    const numberOfRows = parseInt(
        document.querySelectorAll(".encounters-table-row").length
    );
    const idx = numberOfRows + 1;
    const index = genId();
    rowElement.classList.add("encounters-table-row");
    rowElement.id = `encounters-table-row-${index}`;
    // Generate
    const genTd = document.createElement('td')
    genTd.innerHTML = `<button id="generate-encounter-${index}" class="table-button"><i class="fa-solid fa-dice-d20"></i></button>`
    genTd.addEventListener('click', async function() { await randomEncounter() })
    rowElement.appendChild(genTd)
    // Tools
    const toolsTd = document.createElement("td");
    toolsTd.id = `tools-${index}`;
    toolsTd.classList.add("table-tools");
    toolsTd.innerHTML = `<div class="table-index" id="row-${index}">${idx}</div>
                        <div id="delete-${index}" name="delete-row"><i class="fa-solid fa-trash"></i></div>
                        <div id="clone-${index}" name="clone-row"><i class="fa-solid fa-clone"></i></div>`;
    rowElement.appendChild(toolsTd);
    // Quantity
    const quantityDiv = addTdToTable("table-quantity", index);
    quantityDiv.innerHTML = `
        <div class="number-input-container">
            <button class="plus-minus-button" name="minus" id="quantity-minus-${index}">-</button>
            <input class="number-input" type="number" id="quantity-${index}" value="1">
            <button class="plus-minus-button" name="plus" id="quantity-plus-${index}">+</button>
        </div>`;
    rowElement.appendChild(quantityDiv);
    // Environment
    const environmentDiv = addTdToTable("environment", index);
    addInputContainerToTable("table-biome", index, environmentDiv); // Biome
    addInputContainerToTable("table-travel-medium", index, environmentDiv); // Travel Medium
    rowElement.appendChild(environmentDiv);
    // Party
    const partyDiv = addTdToTable("party", index);
    addInputContainerToTable("party-pace", index, partyDiv) // Party Pace
    addInputContainerToTable("table-road", index, partyDiv); // Road
    rowElement.appendChild(partyDiv);
    // Weather
    const weatherDiv = addTdToTable("weather", index);
    addInputContainerToTable("table-climate", index, weatherDiv); // Climate
    addInputContainerToTable("table-season", index, weatherDiv); // Season
    addInputContainerToTable("table-time", index, weatherDiv); // Time of Day
    rowElement.appendChild(weatherDiv);
    // Probability
    addLabelAndTextSpan("hazard", index, quantityDiv); // Hazard
    addLabelAndTextSpan("combat", index, quantityDiv); // Combat
    addLabelAndTextSpan("non-combat", index, quantityDiv); // Non-combat
    addLabelAndTextSpan("total", index, quantityDiv); // Total
    // Total Probability
    const totalProbDiv = addTdToTable("total-probability", index);
    // rowElement.appendChild(totalProbDiv)
    // Finalize Table
    tableBodyElement.appendChild(rowElement);
    // Party
    createCustomRadioGroupFromArray(`party-pace-${index}`, pace, 'pace', null, travelPaceSelected, index)
    createCustomRadioGroupFromArray(`table-road-${index}`, road, 'road', null, roadSelected, index)
    // Envronment
    createCustomRadioGroupFromArray(`table-biome-${index}`, biome, 'biome', null, biomeSelected, index)
    createCustomRadioGroupFromArray(`table-travel-medium-${index}`, travelMedium, 'travelMedium', null, travelMediumSelected, index)
    // Weather
    createCustomRadioGroupFromArray(`table-climate-${index}`, climate, 'climate', null, climateSelected, index)
    createCustomRadioGroupFromArray(`table-season-${index}`, season, 'season', null, seasonSelected, index)
    createCustomRadioGroupFromArray(`table-time-${index}`, time, 'time', null, timeOfDaySelected, index)
    // Delete Buttons
    document.getElementById(`delete-${index}`).addEventListener("click", function () { deleteRow(this); calculateProababiltyColumn(); });
    // Clone Buttons
    document .getElementById(`clone-${index}`) .addEventListener("click", function () { addEncounterRow(this); calculateProababiltyColumn(); });
    // Quantity Input
    const quantityInput = document.getElementById(`quantity-${index}`);
    document.getElementById(`quantity-${index}`).value = 1;
    quantityInput.addEventListener("input", calculateProababiltyColumn);
    // Quantity Buttons
    const quantityMinusButton = document.getElementById( `quantity-minus-${index}` );
    const quantityPlusButton = document.getElementById( `quantity-plus-${index}` );
    quantityMinusButton.addEventListener("click", function () {
        const quantityInput = document.getElementById(`quantity-${index}`);
        const val = parseInt(quantityInput.value);
        if (val <= 1) quantityInput.value = 1;
        else quantityInput.value = val - 1;
        calculateProababiltyColumn();
    });
    quantityPlusButton.addEventListener("click", function () {
        const quantityInput = document.getElementById(`quantity-${index}`);
        const val = parseInt(quantityInput.value);
        quantityInput.value = val + 1;
        calculateProababiltyColumn();
    });
    // ----------------------------
    //     Selects Listeners
    // ----------------------------
    const biomeDropdown = document.getElementById( `table-biome-select-${index}` );
    const roadDropdown = document.getElementById(`table-road-select-${index}`);
    const travelPaceDropdown = document.getElementById(`party-pace-select-${index}`);
    const timeOfDayDropdown = document.getElementById( `table-time-select-${index}` );
    const dropdowns = document.querySelectorAll('.checkbox')
    dropdowns.forEach((element) => {
        element.addEventListener("change", function () {
            populateProbabilityColumn();
            calculateProababiltyColumn();
        });
    });
    // Function to populate the Probability column
    async function populateProbabilityColumn() {
        const hazardSpan = document.getElementById(`hazard-span-${index}`);
        const combatSpan = document.getElementById(`combat-span-${index}`);
        const nonCombatSpan = document.getElementById( `non-combat-span-${index}` );
        const totalSpan = document.getElementById(`total-span-${index}`);
        const biome = getSelectedValueFromRadioGroup(`biome-${index}`);
        const road = getSelectedValueFromRadioGroup(`road-${index}`)
        const travelPace = getSelectedValueFromRadioGroup(`pace-${index}`)
        const timeOfDay = getSelectedValueFromRadioGroup(`time-${index}`);

        let probs;
        // if (biome != "Biome:" && timeOfDay != "time of Day:") probs = JSON.parse(localStorage.getItem("encounter-probabilities"))[timeOfDay][biome];
        if (biome != "Biome:" && timeOfDay != "time of Day:") {
            probs = await db.eg_encounter_probabilities.toArray()
            probs = probs.filter(i => i.BIOME == biome.toUpperCase() && i.TIME_OF_DAY == timeOfDay.toUpperCase())[0]
        }
        if (!probs) return;

        const probsRevised = await calculateEncounterProbabilities( biome, timeOfDay, road, travelPace );
        hazardSpan.innerText = (probsRevised.hazardProb * 100).toFixed(1) + "%";
        combatSpan.innerText = (probsRevised.combatProb * 100).toFixed(1) + "%";
        nonCombatSpan.innerText = (probsRevised.nonCombatProb * 100).toFixed(1) + "%";
        totalSpan.innerText = (probsRevised.hazardProb * 100 + probsRevised.combatProb * 100 + probsRevised.nonCombatProb * 100).toFixed(1) + "%";
    }
    // Function to delete a row by index from the table when a button is clicked within it
    function deleteRow(clickedElement) {
        const table = tableBodyElement;
        const clickedElementParent = clickedElement.parentElement.parentElement;
        const rowId = clickedElementParent.id;
        const rows = Array.prototype.slice.call(tableBodyElement.children);
        const tableIndex = rows
            .map(function (x) {
                return x.id;
            })
            .indexOf(rowId);
        table.deleteRow(tableIndex);
        resetTableIndex();
    }
    // Function to get the row ID from an element that is clicked within
    function getRowIdFromClickedElementWithin(clickedElement) {
        const clickedElementParent = clickedElement.parentElement.parentElement;
        const rowId = clickedElementParent.id;
        return rowId.replace("encounters-table-row-", "");
    }
    // Reset Index
    function resetTableIndex() {
        const rows = tableBodyElement.children;
        for (let idx = 0; idx < rows.length; idx++) {
            const element = rows[idx];
            const elementID = element.id;
            const index = elementID.replace("encounters-table-row-", "");
            document.getElementById(`row-${index}`).innerHTML = idx + 1; // Set Index
        }
    }
    populateProbabilityColumn();
    rowId = index
    const radioLabels = document.querySelectorAll('.radio-label')
    for (let index = 0; index < radioLabels.length; index++) {
        const element = radioLabels[index]
        const parent = element.parentNode
        if (!(parent.id).includes(rowId)) continue
        const children = element.childNodes
        const value = children[0].value
        addTippy(element.id, `${value.replaceAll("-", " ").replaceAll("_"," ").toTitleCase()}`)
    }
    addTippy("party-pace-help", "<u>Party Travel Pace:</u> Slow reduces the likelihood of all encounters. Normal uses defaults. Fast increases the likelihood of combat encounters and hazards, while decreasing the likelihood of non-combat encounters." );
    addTippy("table-climate-help", "<u>Climate:</u> Affects the weather output.");
    addTippy("table-season-help", "<u>Season:</u> Affects the weather output.");
    addTippy("table-time-help", "<u>Time:</u> Non-combat encounters are more likely during the Day. Combat encounters are more likely during the Night." );
    addTippy("table-biome-help", "<u>Biome:</u> filters the combat, non-combat, and hazard encounters that the party might encounter." );
    addTippy("table-road-help", "<u>Road?:</u> Combat and hazard encounters are less likely On a Road, while non-combat encounters are more likely." );
    addTippy("table-travel-medium-help", "<u>Travel Medium:</u> filters the encounters even further." );
    addTippy(`generate-encounter-${index}`, 'Generate ALL encounters')
    // addTippy("table-plane-help","<u>Plane:</u> filters the list of monsters even futher.");
}
// Function to calculate the probability of the Total Probability column
async function calculateProababiltyColumn() {
    await sleep(100)
    const tableBodyChildren = document.getElementById("encounters-table-body").childNodes;
    const totalProbsDiv = document.getElementById("total-probs-div");
    totalProbsDiv.innerHTML = "";
    let probsArray = [];
    let totalQuantity;
    for (let index = 0; index < tableBodyChildren.length; index++) {
        const element = tableBodyChildren[index];
        const elementID = element.id.replace(`encounters-table-row-`, "");
        const quantity = parseInt( document.getElementById(`quantity-${elementID}`).value );
        totalQuantity += quantity;
        let hazardProb = parseFloat( document.getElementById(`hazard-span-${elementID}`).innerText.replace("%", "") ) / 100;
        let combatProb = parseFloat( document.getElementById(`combat-span-${elementID}`).innerText.replace("%", "") ) / 100;
        let nonCombatProb = parseFloat( document.getElementById(`non-combat-span-${elementID}`).innerText.replace("%", "") ) / 100;
        let totalProb = parseFloat( document.getElementById(`total-span-${elementID}`).innerText.replace("%", "") ) / 100;
        for (let index = 0; index < quantity; index++) {
            probsArray.push({
                elementID: elementID,
                hazardProb: hazardProb,
                combatProb: combatProb,
                nonCombatProb: nonCombatProb,
                totalProb: totalProb,
            });
        }
    }
    // Loop through the quantity to compute probabilites
    for (let index = 0; index < probsArray.length; index++) {
        const element = probsArray[index];
        const dieNumber = element["totalProb"] * 100;
        let prob = calcProbComplex( 100 - dieNumber, index + 1, probsArray.length, 100 );
        prob = roundToSpecifiedDecimalPlaces(prob * 100, 3);
        var frac = new Fraction(prob / 100);
        frac = frac.toLocaleString();
        // Add new Element
        const div = document.createElement("div");
        const span = document.createElement("span");
        span.innerHTML = `<b>${index + 1} Encs.:</b> ${prob}% (${frac})`;
        // Fraction
        div.appendChild(span);
        totalProbsDiv.appendChild(div);
    }
}
async function populateSelectPartyDropdown() {
    const partySelect = document.getElementById("select-party-input");
    const parties = await db._parties.toArray()
    const partyId = localStorage.getItem('party-id')

    partySelect.innerHTML = "";

    const opt = document.createElement('option')
    opt.value = 'new-party'
    opt.innerText = 'New Party...'
    partySelect.appendChild(opt)

    if (parties.length <= 0) return
    

    parties.forEach((element) => {
        const option = document.createElement("option");
        option.innerText = element["NAME"];
        option.value = element["id"];
        if (element["id"] == partyId) option.selected = true;
        partySelect.appendChild(option);
    });
}
// Function to populate the Party Name, Party Level, and Party Size based on Party Select dropdown
async function populatePartyParametersBasedOnSelectParty() {
    const partyName = getSelectedOptionText('select-party-input')
    if (partyName == 'New Party...') return
    const partyNameElement = document.getElementById("party-name-input");
    const partyLevelElement = document.getElementById("party-level-input");
    const partySizeElement = document.getElementById("party-size-input");
    
    const parties = await db._parties.toArray()
    if (parties.length <= 0) return

    const partyId = await getPartyId(partyName)
    localStorage.setItem('party-id', partyId)
    const party = await db._parties.get(partyId)

    partyNameElement.value = party["NAME"];
    partyLevelElement.value = party["LEVEL"];
    partySizeElement.value = party["SIZE"];
}
// Function to save a party
async function saveParty() {
    const partyName = document.getElementById("party-name-input").value;
    const selectedParty = getSelectedOptionText('select-party-input')
    if (!partyName) return alert("Please input a name.")
    const partyId = parseInt(document.getElementById('select-party-input').value)
    console.log("🚀 ~ file: index.js:296 ~ saveParty ~ partyId:", partyId)
    const partyLevel = document.getElementById("party-level-input").value;
    const partySize = document.getElementById("party-size-input").value;
    const parties = await db._parties.toArray()

    if (parties.includes(partyName)) return alert("A party with that name already exists!")
    if (partyName != selectedParty && stringExistsInArray(parties, 'NAME', partyName)) return alert("A party with that name already exists!")
    
    const data = {
        NAME: partyName,
        LEVEL: partyLevel,
        SIZE: partySize,
    }
    
    if (partyName == selectedParty || selectedParty != 'New Party...') { // Update the selected party
        if (partyName != selectedParty) {
            const con = confirm("Are you sure you want to change this party's name?")
            if (!con) return
        }
        const response = db._parties.update( partyId, data )
        response
            .then(function(){
                makeToast(`<b>${partyName}</b> updated successfully!`, 'success')
            })
            .catch(function(error){
                console.error(`! ~~~~~~~~~~~~~~~~~~ Error ~~~~~~~~~~~~~~~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
            })
    }
    else { // Add a new party
        const response = db._parties.put(data)
        response
            .then(function(){
                makeToast(`<b>${partyName}</b> added successfully!`, 'success')
            })
            .catch(function(error){
                console.error(`! ~~~~~~~~~~~~~~~~~~ Error ~~~~~~~~~~~~~~~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
            })
    }
    localStorage.setItem("party-id", partyId);
    populateSelectPartyDropdown();
}
function buildEncounterModal(data){
    data = data.DATA // Grab only the encounter data 
    let table = document.getElementById('table-main')
    table.setAttribute('width', '100% !important;')

    let tableBody = document.getElementById('table-encounter-output')
    tableBody.innerHTML = ''

    for (let index = 0; index < data.length; index++) {
        const element = data[index];    
        const tr = document.createElement('tr')

        const tdIndex = document.createElement('td')
        const tdBiome = document.createElement('td')
        const tdEncounter = document.createElement('td')
        const tdWeather = document.createElement('td')

        tdIndex.innerText = index + 1
        tdBiome.innerText = element.BIOME
        tdEncounter.innerHTML = element.ENCOUNTER
        
        let weather = (element.WEATHER[0] == 'N/A' && element.WEATHER[1] == 'N/A' && element.WEATHER[2] == 'N/A')? "N/A" : `${element.WEATHER[0]}${element.WEATHER[1]}${element.WEATHER[2]}`
        tdWeather.innerHTML = weather
        
        tr.appendChild(tdIndex)
        tr.appendChild(tdBiome)
        tr.appendChild(tdEncounter)
        tr.appendChild(tdWeather)

        tableBody.appendChild(tr)
    }

    toggleModal("encounter-output");
}
async function calculateEncounterProbabilities(biome, timeOfDay, road, travelPace) {
    biome = biome.toUpperCase()
    timeOfDay = timeOfDay.toUpperCase()
    road = road.toUpperCase()
    travelPace = travelPace.toUpperCase()
    // ===== Starting Probabilities =====
    let probs = await db.eg_encounter_probabilities.toArray()
    probs = probs.find(i => i.BIOME == biome && i.TIME_OF_DAY == timeOfDay)
    let combatProb = probs.COMBAT
    let nonCombatProb = probs.NON_COMBAT;
    let hazardProb = probs.HAZARD
    // ===== Road Modifiers =====
    let roadModifiers = await db.eg_road_modifiers.toArray()
    roadModifiers = roadModifiers.find(i => i.TIME_OF_DAY == timeOfDay && i.ROAD_TYPE == road)
    let roadCombatMod = roadModifiers.COMBAT
    let roadNonCombatMod = roadModifiers.NON_COMBAT
    let roadHazardMod = roadModifiers.HAZARD
    let roadPercentType = roadModifiers.PERCENT_TYPE
    if (roadPercentType == 0) { // Relative PERCENT_TYPE
        roadCombatMod = combatProb * roadCombatMod
        roadNonCombatMod = nonCombatProb * roadNonCombatMod
        roadHazardMod = hazardProb * roadHazardMod
    }
    // ===== Pace Modifiers =====
    let paceModifiers = await db.eg_pace_modifiers.toArray()
    paceModifiers = paceModifiers.find(i => i.PACE == travelPace && i.TIME_OF_DAY == timeOfDay)
    let travelPaceCombatMod = paceModifiers.COMBAT
    let travelPaceNonCombatMod = paceModifiers.NON_COMBAT
    let travelPaceHazardMod = paceModifiers.HAZARD
    let travelPacePercentType = paceModifiers.PERCENT_TYPE
    if (travelPacePercentType == 0) { // Relative PERCENT_TYPE
        travelPaceCombatMod = combatProb * travelPaceCombatMod
        travelPaceNonCombatMod = nonCombatProb * travelPaceNonCombatMod
        travelPaceHazardMod = hazardProb * travelPaceHazardMod
    }
    // ===== Final Probabilities =====
    combatProb = combatProb + roadCombatMod + travelPaceCombatMod
    nonCombatProb = nonCombatProb + roadNonCombatMod + travelPaceNonCombatMod
    hazardProb = hazardProb + roadHazardMod + travelPaceHazardMod

    return {
        nonCombatProb: nonCombatProb,
        combatProb: combatProb,
        hazardProb: hazardProb,
    };
}
async function getPartyId(partyName){
    let ID = await db._parties.where({NAME: partyName}).toArray() 
    return ID[0].id 
}