// Function to set to a selection
// Source: https://stackoverflow.com/questions/78932/how-do-i-programmatically-set-the-value-of-a-select-box-element-using-javascript
function selectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}
// Function to suggest climate type based on the selected biome
function select_climate() {
    // Get Biome
    var d = document.getElementById("biome")
    var biome = d.options[d.selectedIndex].text
    console.log(`Biome: ${biome}`)
    // Switch to handle all the biomes
    switch(biome) {
        case 'Arctic':
            selectElement('climate', 'polar')
            break
        case 'Coastal':
            selectElement('climate', 'tropical')
            break
        case 'Desert':
            selectElement('climate', 'arid/dry')
            break
        case 'Farmland':
            selectElement('climate', 'temperate')
            break
        case 'Forest':
            selectElement('climate', 'temperate')
            break
        case 'Grassland':
            selectElement('climate', 'temperate')
            break
        case 'Hill':
            selectElement('climate', 'temperate')
            break
        case 'Jungle':
            selectElement('climate', 'tropical')
            break
        case 'Mountain':
            selectElement('climate', 'continental')
            break
        case 'Open_Water':
            selectElement('climate', 'temperate')
            break
        case 'Swamp':
            selectElement('climate', 'tropical')
            break
        case 'Underdark':
            selectElement('climate', 'polar')
            break
        case 'Underwater':
            selectElement('climate', 'temperate')
            break
        case 'Urban':
            selectElement('climate', 'temperate')
            break
        case 'Wasteland':
            selectElement('climate', 'arid/dry')
            break
        case 'Woodland':
            selectElement('climate', 'temperate')
            break
    }   
}
// MAIN FUNCTION
function generate_weather() {
    clearWeather()
    // Get the selected campaign
    var campaignName = localStorage.getItem('selectedCampaign')
    // Check if there is a campaign name
    // Gen. Pop. Local Storage
    var genPop = localStorage.getItem('generatorPopup')
    if (!genPop){
        localStorage.setItem('generatorPopup', 'false')
    } else {
        if (genPop === 'false'){
            // Check if there is a campaign name
            if (!campaignName){
                // alert("Please create/select a campaign first!")
                // return
                if (!confirm("No campaign is selected. Any data generated from generators or pickers will not save. Click OK to generate anyway and prevent this warning from showing again. Click Cancel to abort generation. A campaign can be created by clicking CREATE in the Campaigns dropdown. Select a campaign by clicking on it.")) {
                    // Cancel Generator
                    console.log("User cancelled generator.")
                    return
                } else {
                    // Save in local storage that user doesn't want to see this alert again
                    localStorage.setItem('generatorPopup', 'true')
                }
            }
        }
    }
    // Pull the group ID
    var groupID = parseInt(localStorage.getItem(`${campaignName}.weatherGroupID`))
    // Log a seperator
    console.log("------------------WEATHER--------------------------------")
    // Get climate
    var a = document.getElementById("climate")
    var climate = a.options[a.selectedIndex].text
    // Get season
    var b = document.getElementById("season")
    var season = b.options[b.selectedIndex].text
    // Pull average temperature
    var avgTemp = weather.find(i => i.Type == climate)[`${season}_Average_Temp_F`]
    // Pull precipitation probability
    var precProb = weather.find(i => i.Type == climate)[`${season}_Precipitation_Prob`]
    // Pull heavy precipitaion probability
    var precProbHeavy = weather.find(i => i.Type == climate)[`${season}_Heavy_Precipitation_Prob`]
    // Log to Console
    console.log(`VARIABLES
        Climate: ${climate}
        Season: ${season}
        Avg. Temp.: ${avgTemp}
        Precipitaiton Prob.: ${precProb}
        Heavy Prec. Prob.: ${precProbHeavy}`)
    // Rolls
    var rWind = getRndInteger(1, 20)
    var rWindDir = getRndInteger(1, 8)
    var rTemp = getRndInteger(1, 20)
    var rPrec = getRndInteger(1, 1000)
    var rPrecType = getRndInteger(1, 20)
    // Log to Console
    console.log(`ROLLS
        Wind: ${rWind} (1d20)
        Wind Dir: ${rWindDir} (1d16)
        Temp: ${rTemp} (1d20)
        Prec: ${rPrec} (1d1000)
        Prec Type: ${rPrecType} (1d20)`)

    // OUTCOMES
        // TEMPERATURE
            // Extract Temperature Modifier
            var tempMod = temperature.find(i => i.roll == rTemp).result
            // Extrect Dice Sides
            const MoreRegEx = /(?<=d)(\d*)/g
            var num_of_sides = MoreRegEx.exec(tempMod)
            num_of_sides = parseInt(num_of_sides[0])
            // Roll the die
            var rTempRoll = getRndInteger(1, num_of_sides)
            // Get the modifier
            const NewRegEx2 = /\W/gm
            var tempSymbol = NewRegEx2.exec(tempMod)
            var tempSymbol = tempSymbol[0]
            // Get the multiplier
            const NewRegEx3 = /\*(\d+)/gm
            var tempMultiplier = NewRegEx3.exec(tempMod)
            if (!tempMultiplier) {tempMultiplier = 1}
            else {tempMultiplier = parseInt(tempMultiplier[1])}
            // Calculate temperature modifier
            tempModFinal = rTempRoll * tempMultiplier
            // Calculate the temperature in fahrenheit
            if (tempSymbol == '-') {
                var TempF = avgTemp - tempModFinal
            } else {
                var TempF = avgTemp + tempModFinal
            }
            // Calculate temperature in celsius
            var TempC = (TempF-32) * (5/9)
            // Effect Message
            if (TempF < 0) {
                var mTempEffect = "Whenever the temperature is at or below 0 degrees Fahrenheit, a creature exposed to the cold must succeed on a DC 10 Constitution saving throw at the end of each hour or gain one level of exhaustion. <br>Creatures with resistance or immunity to cold damage automatically succeed on the saving throw, as do creatures wearing cold weather gear (thick coats, gloves, and the like) and creatures naturally adapted to cold climates."
            } else if (TempF > 100) {
                var mTempEffect = "When the temperature is at or above 100 degrees Fahrenheit, a creature exposed to the heat and without access to drinkable water must succeed on a Constitution saving throw at the end of each hour or gain one level of exhaustion. <br> The DC is 5 for the first hour and increases by 1 for each additional hour. Creatures wearing medium or heavy armor, or who are clad in heavy clothing, have disadvantage on the saving throw. <br> Creatures with resistance or immunity to fire damage automatically succeed on the saving throw, as do creatures naturally adapted to hot climates."
            } else {
                var mTempEffect = 'N/A'
            }
            // Temperature Message
            var mTemp = `<h4>TEMPERATURE</h4> Temperature: ${Math.round(TempF)}°F (${Math.round(TempC)}°C)<br> Mechanical Effect: ${mTempEffect}`
            // Log Temperature
            console.log(`TEMPERATURE
                Sides: ${num_of_sides}
                Roll: ${rTempRoll}
                Symbol: ${tempSymbol}
                Multiplier: ${tempMultiplier}
                Die: ${tempMod}
                Mod.: ${tempModFinal}
                °F: ${TempF}
                °C: ${TempC}`)
        // PRECIPITATION
            // Precipitation Class (Light/Medium/Heavy)
            if (rPrec < precProbHeavy) {
                var precClass = `Heavy`
            } else if (rPrec < precProbHeavy*2) {
                var precClass = 'Light'
            } else if (rPrec < precProb) {
                var precClass = 'Medium'
            } else {
                var precClass = 'No precipitation'
            }
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
            var mPrec = `<h4>PRECIPITATION</h4> Precipitation: ${precClass} ${precType}<br>Mechanical Effect: ${mPrecEffect}`
            // Log Precipitation
            console.log(`PRECIPITATION
                Class: ${precClass}
                Type: ${precType}`)
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
            var mWind = `<h4>WIND</h4> Wind Speed: ${windSpeed}<br>Wind Direction: ${windDir}<br> Mechanical Effect: ${mWindEffect}`
            // Log Wind
            console.log(`WIND
                Speed: ${windSpeed}
                Direction: ${windDir}`)
    // POPULATE OUTCOME
    // Define the message
    var mResult = `<h2>WEATHER</h2>${mWind} ${mTemp} ${mPrec}`
    // Populate the webpage with the result
    var p = document.createElement('p')
    p.innerHTML = mResult
    document.getElementById("weather").appendChild(p)
    // APPEND TO THE DB
    if (campaignName){
        // FIRESTORE
        import('/src/pages/profile/firebaseInit.js').then((init)=> { 
            // IMPORTS
                let db = init.db
                let auth = init.auth
                let onAuthStateChanged = init.onAuthStateChanged
                let addDoc = init.addDoc        
                let collection = init.collection        
            // Work with the FireStore Database
            onAuthStateChanged(auth, (user) => { // Check if User is logged in
                if (user){
                        // UPDATE DATA
                        var date = new Date(); // Instantiate a new Date object
                        const today = date.toLocaleDateString() // Today's date
                        // Set up the NPC object
                        var JSONobj = {"groupID": `Group ${groupID}`,
                                        "temperature": mTemp,
                                        "precipitation": mPrec,
                                        "wind": mWind,
                                        "date": today}
                        // SET THE DATA
                        addDoc(collection(db, `campaigns`, user.uid, campaignName, `weather`, 'weather_history'), JSONobj)
                }
            })
        }).catch(error => { console.log(error) }) // Auth Errors
    }
}