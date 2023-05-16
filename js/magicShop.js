const wealthMap = [
    {"WEALTH":"aristocratic","INDEX":0},
    {"WEALTH":"comfortable","INDEX":1},
    {"WEALTH":"modest","INDEX":2},
    {"WEALTH":"poor","INDEX":3},
    {"WEALTH":"squalid","INDEX":4},
    {"WEALTH":"wealthy","INDEX":5},
    {"WEALTH":"wretched","INDEX":6}
]
const magicnessMap = [
    {"MAGICNESS":"high","INDEX":0},
    {"MAGICNESS":"low","INDEX":1},
    {"MAGICNESS":"medium","INDEX":2},
    {"MAGICNESS":"medium-high","INDEX":3},
    {"MAGICNESS":"very-high","INDEX":4},
    {"MAGICNESS":"very-low","INDEX":5}
]
// Function to pull the population and populate it based on the selected city size
function setPopulationBasedOnCitySize(citySize){
    const population = table_settlementData.find(i => i.TYPE == citySize).POPULATION
    const inputPopulation = document.getElementById('population')
    inputPopulation.value = population
}
// Function to pull find the appropriate city size based on population
function setCitySizeBasedOnPopulation(population){
    population = parseInt(population.replace(/\D/g,''))
    let citySize = table_settlementData.find(i => population >= i.POPULATION).TYPE
    const selectCitySize = document.getElementsByName('city-size')
    for (let index = 0; index < selectCitySize.length; index++) {
        const element = selectCitySize[index]
        if (element.value == citySize.toLowerCase()) document.getElementById(element.id).checked = true        
    }
}
// Function to set up listeners
function setupMagicShop(){
    const createCityButton = document.getElementById('button-create-city')
    createCityButton.addEventListener('click', function(){ toggleModal("create-city-modal") })

    const saveCityButton = document.getElementById('button-save-city')
    saveCityButton.addEventListener('click', function(){ saveCity() })

    const updateCityButton = document.getElementById('button-update-city')
    updateCityButton.addEventListener('click', function(){ updateCity() })

    const citySelect = document.getElementById('city-list')
    citySelect.addEventListener('change', function() { loadCity(citySelect.value) })

    const buttonGenerate = document.getElementById('button-generate')
    buttonGenerate.addEventListener('click', function(){ generateMagicShop() })

    const selectCitySize = document.getElementsByName('city-size')
    for (let index = 0; index < selectCitySize.length; index++) {
        const element = selectCitySize[index];
        if (element.checked) setPopulationBasedOnCitySize(element.value.toTitleCase())
        element.addEventListener('change', function() { 
            for (let index = 0; index < selectCitySize.length; index++) {
                const element = selectCitySize[index];
                if (element.checked) setPopulationBasedOnCitySize(element.value.toTitleCase())
            }
        })
    }

    const inputPopulation = document.getElementById('population')
    inputPopulation.addEventListener('keyup', function() { setCitySizeBasedOnPopulation(this.value) })
    inputPopulation.addEventListener('keyup', function(evt){
        const n = parseInt(this.value.replace(/\D/g,''), 10);
        inputPopulation.value = n.toLocaleString();
    }, false)

    const buttonSelectAllShopTypes = document.getElementById('button-all-shop-types')
    buttonSelectAllShopTypes.addEventListener('click', function() { 
        const shopCheckboxes = document.getElementsByName('shop-type-checkbox')
        let checkedCount = 0
        for (let index = 0; index < shopCheckboxes.length; index++) {
            const element = shopCheckboxes[index]
            const classes = Array.from(element.classList)
            if (classes.includes('checked')) {
                checkedCount += 1
                continue
            } else element.classList.toggle('checked')            
        }
        if (checkedCount == shopCheckboxes.length) {
            for (let index = 0; index < shopCheckboxes.length; index++) {
                const element = shopCheckboxes[index];
                element.classList.toggle('checked')
            }
        }
    })

    const shopCheckboxes = document.getElementsByName('shop-type-checkbox')
    for (let index = 0; index < shopCheckboxes.length; index++) {
        const element = shopCheckboxes[index]
        element.addEventListener('click', function() { 
            element.classList.toggle('checked')
        })          
    }

    const quantityMinusButton = document.getElementById(`quantity-minus`)
    const quantityPlusButton = document.getElementById(`quantity-plus`)
    quantityMinusButton.addEventListener('click', function(){
        const quantityInput = document.getElementById(`quantity`)
        const val = parseInt(quantityInput.value)
        if (val <= 1) quantityInput.value = 1
        else quantityInput.value = val - 1
    })
    quantityPlusButton.addEventListener('click', function(){
        const quantityInput = document.getElementById(`quantity`)
        const val = parseInt(quantityInput.value)
        quantityInput.value = val + 1
    })
    const populationMinusButton = document.getElementById(`population-minus`)
    const populationPlusButton = document.getElementById(`population-plus`)
    populationMinusButton.addEventListener('click', function(){
        const populationInput = document.getElementById(`population`)
        const val = parseInt(populationInput.value)
        if (val <= 1) populationInput.value = 1
        else populationInput.value = val - 1
    })
    populationPlusButton.addEventListener('click', function(){
        const populationInput = document.getElementById(`population`)
        const val = parseInt(populationInput.value)
        populationInput.value = val + 1
    })

    const toggleDisplayElements = document.getElementsByName('toggle-display')
    toggleDisplayElements.forEach(element => {
        element.addEventListener('click', function(){ toggleNextChildDisplay(this) })
    });
    // const toggleHistory = document.getElementById('toggle-history')
    // toggleHistory.addEventListener('click', function(){ toggleNextChildDisplay(this) })
    // const toggleOptions = document.getElementById('toggle-options')
    // toggleOptions.addEventListener('click', function(){ toggleNextChildDisplay(this) })

    setupVersionNumber()
    setTooltips()
}
function setTooltips(){
    tippy('#quantity', {
        allowHTML: true,
        content: "<B>WARNING</B></p> Generating more than 1 store has the potential to take a very long time."
    })
    // Wealth
    const radioLabels = document.getElementsByName('radio-label')
    for (let index = 0; index < radioLabels.length; index++) {
        const element = radioLabels[index]
        const children = element.childNodes
        const value = children[1].value
        children[3].id = `${value}-span`
        addTippy(`${value}-span`, `${value.replaceAll("-", " ")}`)
    }
    // Shop Type
    const shopTypeCheckboxes = document.getElementsByName('shop-type-checkbox')
    for (let index = 0; index < shopTypeCheckboxes.length; index++) {
        const element = shopTypeCheckboxes[index];
        addTippy(`${element.id}`, `${element.id.replace('-checkbox', '').replaceAll('-', ' ')}`)
    }
    addTippy('population', "Population")
}
// Function to sort list alphabetically
function sortList(ID) {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById(ID);
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list items:
      for (i = 0; i < (b.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Check if the next item should
        switch place with the current item: */
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
}
// Function for generating multiple magic shops
async function generateMagicShop(){
    const dt = new Date()
    // Set Up
    document.getElementById('output').innerHTML = '' // Clear Output
    const allJSONs = [{
        TYPE:"DELETE THIS ROW",
        NAME: "DELETE THIS ROW",
        LINK: "DELETE THIS ROW",
        PRICE_FINAL_GP: "DELETE THIS ROW",
        PRICE_STARTING_GP: "DELETE THIS ROW",
        COMPONENT: "DELETE THIS ROW",
        RARITY: "DELETE THIS ROW",
        LEVEL: "DELETE THIS ROW",
        ITEM_TYPE: "DELETE THIS ROW",
        SCHOOL: "DELETE THIS ROW",
        TIER: "DELETE THIS ROW",
        STORE_NUMBER: "DELETE THIS ROW"
    }]
    let JSONS = []
    // ------------------------
    //       User Inputs
    // ------------------------
    // Quantity
    let quantity = parseInt(document.getElementById('quantity').value) // Quantity
    if (Number.isNaN(quantity)) quantity = 1
    // Population
    let population = parseInt(document.getElementById("population").value.replaceAll(",","")) // Get the population
    if (population == "") return alert("Please input a population.")
    
    else if (population > 1000000000) population = 1000000000
    let cityName = getSelectedOptionText('city-list') 
    // if (cityName == '') cityName = null // TODO: Why did I do this?
    const userWealth = getSelectedValueFromRadioGroup('wealth')
    let magicness = getSelectedValueFromRadioGroup('magicness')
    magicnessNum = parseInt(document.getElementById(`${magicness}-span`).innerText)
    // Start: Shop Type
    const shopCheckboxes = document.getElementsByName('shop-type-checkbox')
    let itemTypes = []
    for (let index = 0; index < shopCheckboxes.length; index++) {
        const element = shopCheckboxes[index]
        const classes = Array.from(element.classList)
        if (classes.includes('checked')) itemTypes.push((element.id).replaceAll("-", " ").replaceAll(" checkbox",""))       
    }
    if (itemTypes.length == 0) return alert("At least one shop type must be selected.")
    // End: Shop Type
    const itemTiers = ['none', 'minor', 'major', 'wondrous']
    const itemRarities = ['common', 'uncommon', 'rare', 'very rare', 'legendary']
    const dieSize = 4
    function modifyStock(userWealth, magicness, stock){
        userWealth = userWealth.toLowerCase()
        const wealthOperator = table_wealth.find(i => i.WEALTH == userWealth).OPERATOR
        const wealthDieSize = table_wealth.find(i => i.WEALTH == userWealth).DIE_SIZE
        // const magicnessOperator = table_magicness.find(i => i.MAGICNESS == magicness).OPERATOR 
        // const magicnessDieSize = table_magicness.find(i => i.MAGICNESS == magicness).DIE_SIZE // When magicness affects stock quantity
        // const magicnessDieSize = table_magicness.find(i => i.MAGICNESS == magicness).RARITY_MOD // When magicness affects item rarities in stock
        let wealthMod = 0
        let magicnessMod = 0
        if (wealthDieSize != 0) {
            wealthMod = getRndInteger(1, wealthDieSize)
            if (wealthOperator == 'minus') stock = stock - wealthMod
            else if (wealthOperator == 'plus') stock = stock + wealthMod
        }
        // if (magicnessDieSize != 0) {
        //     magicnessMod = getRndInteger(1, magicnessDieSize)
        //     if (magicnessOperator == 'minus') stock = stock - magicnessMod
        //     else if (magicnessOperator == 'plus') stock = stock + magicnessMod
        // }

        return parseInt(stock)
    }
    function getMinSpellLevelFromRarity(rarity){
        if (rarity == 'common') return 0
        if (rarity == 'uncommon') return 2
        if (rarity == 'rare') return 4
        if (rarity == 'very rare') return 6
        if (rarity == 'legendary') return 9
    }
    function getMaxSpellLevelFromRarity(rarity){
        if (rarity == 'common') return 1
        if (rarity == 'uncommon') return 3
        if (rarity == 'rare') return 5
        if (rarity == 'very rare') return 8
        if (rarity == 'legendary') return 9
    }
    function calculatePrice(priceModifier, itemRarity, itemTier, itemCost, itemType){
        if (itemTier == 'NONE') itemTier = 'MINOR'
        let finalPrice = 0
        let startingPrice
        let operatorRoll

        if (itemCost) startingPrice = itemCost
        else startingPrice = table_equipmentPrices.find(i => i.RARITY == itemRarity.toTitleCase())[`${itemTier}`]

        const priceModRoll = getRndInteger(0, 20)
        if (!itemCost) operatorRoll = getRndInteger(0, 1)

        if (operatorRoll == 0) priceModifier -= priceModRoll / 100
        else if (operatorRoll == 1) priceModifier += priceModRoll / 100

        if (priceModifier < 1 && itemCost) finalPrice = Math.round(((startingPrice * (1 + (priceModRoll / 100))) + Number.EPSILON) * 100) / 100
        else finalPrice = Math.round(((startingPrice * priceModifier) + Number.EPSILON) * 100) / 100

        return [startingPrice, finalPrice]
    }
    function modifyPriceModifierVariables(magicness){
        const len = table_priceModifierVariables.length
        let table_modified = []
        if (magicness == 0) return table_priceModifierVariables
        // Reducing the items rarities that can be generated
        if (magicness < 0) { 
            magicness = Math.abs(magicness)
            table_modified = table_priceModifierVariables.slice(0, len - magicness)
        }
        // Increasing the item rarities that can be generated
        else {
            table_modified.push(table_priceModifierVariables[0])
            // magicness = magicness - (Math.abs(magicness) * 2)
            for (let index = 0; index < magicness; index++) {
                const itemRarity = itemRarities[index + 1]
                const itemRarityIndex = (index - 1 >= 0) ? index - 1 : 0
                const priceModVars = table_priceModifierVariables.find(e => e.ITEM_RARITY == itemRarities[itemRarityIndex])
                table_modified.push({
                    ITEM_RARITY: itemRarity,
                    NONE: priceModVars.NONE,
                    MINOR: priceModVars.MINOR,
                    MAJOR: priceModVars.MAJOR,
                    WONDROUS: priceModVars.WONDROUS
                })                
            }
            magicness = len + (magicness - (Math.abs(magicness) * 2))
            magicness = (magicness - (Math.abs(magicness) * 2)) + 1
            table_modified = table_modified.concat(table_priceModifierVariables.slice(magicness))
        }

        return table_modified
    }
    // ------------------------
    //     Generate Stores
    // ------------------------
    let storeInventory = []
    const popLN = Math.log(population)
    const popLog = Math.log10(population)
    // let table_priceModifierVariablesModified = modifyPriceModifierVariables(magicnessNum)
    // console.log("table_priceModifierVariables:", table_priceModifierVariablesModified)
    let table_priceModifierVariablesModified = await db.msg_price_modifier_variables.toArray()
    let table_numberOfDiceVariables = await db.msg_number_of_dice_variables.toArray()
    let table_magicness = await db.msg_magicness.toArray()
    let table_wealth = await db.msg_wealth.toArray()
    let table_equipmentPrices = await db.msg_equipment_prices.toArray()
    let table_spells = await fetchLocalJson(`/mikitz-ttrpg/data/json/spells`)
    let sources = await db._sources.toArray()
    sources = sources.filter(e => e.SELECTED == true)
    const sourceAbbrs = sources.map(e => e.ABBREVIATION);
    magic_items = magic_items.filter(e => sourceAbbrs.includes(e.SOURCE));
    // Loop through each store
    for (let index = 0; index < quantity; index++) { 
        let stockTotal = 0
        const storeNumber = index + 1 // Set the store number
        // --------------------
        //    GENERATE ITEMS
        // --------------------
        // Loop through the item rarities
        for (let index = 0; index < itemRarities.length; index++) { 
            const itemRarity = itemRarities[index] // Get the item rarity
            // console.log("itemRarity:", itemRarity)
            // let settlementData = eval(`table_${camelize(itemRarity)}SettlementData`)
            // settlementData = settlementData.find(i => i.TYPE == citySize.toTitleCase()) // Get the proper table given the item rarity and city size
            let itemsTable = magic_items.filter(i => i.RARITY == itemRarity.toTitleCase()) // Filter the items based on the item rarity
            const minSpellLevel = getMinSpellLevelFromRarity(itemRarity)
            const maxSpellLevel = getMaxSpellLevelFromRarity(itemRarity)
            // Loop through each item type
            for (let index = 0; index < itemTypes.length; index++) { 
                const itemType = itemTypes[index].toUpperCase() // Get the item type
                // console.log("itemType:", itemType)
                // const numberOfDice = settlementData[`NUMBER_OF_DICE_${itemType.replaceAll(" ", "_")}`] // Get the number of dice for this item type
                const diceVariable = table_numberOfDiceVariables.find(e => e.ITEM_RARITY == itemRarity)[itemType.toUpperCase()] // Get the dice variable to compute the number of dice
                const numberOfDice = Math.ceil( popLog + ( popLog * diceVariable ) ) + 1; // Compute the number of dice for this item type and population
                const typeSearchQuery = cutString(itemType.toTitleCase(), 'back', 1)
                let itemsTableType
                let itemsByType = []
                if (itemType == 'ITEMS') itemsTableType = itemsTable.filter(i => !(i.TYPE).includes('armor') && !(i.TYPE).includes('poison') && !(i.TYPE).includes('potion') && !(i.TYPE).includes('weapon')) // Filter only items
                else if (itemType == 'SPELL SCROLLS') itemsTableType = table_spells.filter(i => i.LEVEL <= maxSpellLevel && i.LEVEL >= minSpellLevel)
                else if (itemType == 'SPELL COMPONENTS') {
                    itemsByType = table_spells.filter(i => i.LEVEL <= maxSpellLevel && i.LEVEL >= minSpellLevel)
                    // console.log("🚀 ~ file: generateShop.js ~ line 164 ~ generateMagicShop ~ Spell Components", itemsByType)
                    let itemsFinal = []
                    for (let index = 0; index < itemsByType.length; index++) {
                        const element = itemsByType[index];
                        let materialComponentsCost
                        let materialComponents
                        let components
                        if (typeof element.components != "object") {
                            components = (element.components).replaceAll("'",`"`).replaceAll("True", true).replaceAll(`"s `, `'s `)
                            materialComponents = JSON.parse(components).m
                        } else materialComponents = element.components.m
                        // console.log("🚀 ~ file: generateShop.js ~ line 180 ~ generateMagicShop ~ materialComponents", materialComponents)
                        if (materialComponents && materialComponents.cost >= 0) {
                            if(typeof element.components != 'object') element.components = JSON.parse(components)
                            itemsFinal.push(element)
                        }
                    }
                    itemsByType = itemsFinal
                    // console.log("🚀 ~ file: generateShop.js ~ line 170 ~ generateMagicShop ~ itemsByType", itemsByType)
                }
                else if (itemType == 'POISONS') itemsTableType = table_poisons.filter(i => i.RARITY == itemRarity)
                else itemsTableType = itemsTable.filter(i => (i.TYPE).includes(typeSearchQuery)) // Filter the items based on the item type
                // console.log(`🚀 ~ file: generateShop.js ~ line 185 ~ generateMagicShop ~ itemsTableType for ${itemRarity} ${itemType} :`, itemsTableType)
                // Loop through each item tier
                for (let index = 0; index < itemTiers.length; index++) {
                    let itemCost
                    const itemTier = itemTiers[index].toUpperCase() // Get the item tier
                    // console.log("itemTier:", itemTier)
                    // const priceModifier = settlementData[`PRICE_MOD_${itemTier.replaceAll(" ", "_")}`] // Get the price modifier for this item tier
                    try { var priceModifierVariables = table_priceModifierVariablesModified.find(e => e.ITEM_RARITY == itemRarity) }
                    catch(error) { continue }
                    // console.log("priceModifierVariables:", priceModifierVariables)
                    if (!priceModifierVariables) continue
                    const bMod = table_magicness.find(e => e.MAGICNESS == magicness).B_MOD
                    const priceModifier = ( priceModifierVariables[`${itemTier}_B`] * bMod) + priceModifierVariables[`${itemTier}_A`] * popLN
                    // console.log("priceModifier:", priceModifier)
                    if (priceModifier > 2.11) continue
                    let itemsTableTier
                    let stockQuantity = 0
                    if (priceModifier) { // If there is a price mod. then this city will potentially have some in stock
                        if (!itemType == 'SPELL COMPONENTS' || !itemType == 'SPELL SCROLLS') itemsTableTier = itemsTableType.filter(i => i.TIER == itemTier.toLowerCase()) // Filter the items based on the item tier if there is a price mod. 
                        if (!itemType == 'SPELL COMPONENTS' || !itemType == 'SPELL SCROLLS') itemsTableTier = itemsTableTier.filter(i => !(i.TYPE).includes('Futuristic') || !(i.TYPE).includes('Modern')) // Filter out futuristic and modern items
                        else if (itemType == 'POISONS') itemsTableTier = itemsTableType.filter(i => i.TIER == itemTier.toLowerCase())
                        else itemsTableTier = itemsTableType
                        itemsByType = itemsByType.concat(itemsTableTier)
                        stockQuantity = getRndInteger(0, parseInt(numberOfDice))  // Determine how much are in stock using number of dice as the sides
                        stockQuantity = modifyStock(userWealth, magicness, stockQuantity)
                        stockTotal += stockQuantity
                    } 
                    // console.log(`🚀 ~ file: generateShop.js ~ line 180 ~ generateMagicShop ~ stockQuantity for ${itemRarity} ${itemType} ${itemTier}`, stockQuantity)
                    // Loop through the stock quantity to randomly get some items
                    for (let index = 0; index < stockQuantity; index++) {
                        let itemComponents
                        const item = getRandomItemFromArray(itemsByType) // Get a random item 
                        if (item) {
                            const hrefs = pepperoniPizza(itemType, item.SOURCE, item.NAME)
                            if (itemType == 'SPELL COMPONENTS') {
                                itemCost = (item.components.m).cost / 100
                                itemComponents = item.components.m.text
                            }
                            const priceData = calculatePrice(priceModifier, itemRarity, itemTier, itemCost)
                            storeInventory.push({
                                TYPE: itemType,
                                NAME: item.NAME,
                                LINK: convertLinkToExcelHyperlink(hrefs[0]),
                                PRICE_FINAL_GP: priceData[1].toLocaleString(),
                                PRICE_STARTING_GP: priceData[0].toLocaleString(),
                                COMPONENT: itemComponents,
                                RARITY: item.RARITY,
                                LEVEL: item.LEVEL,
                                ITEM_TYPE: item.TYPE,
                                SCHOOL: item.SCHOOL,
                                TIER: item.TIER,
                                STORE_NUMBER: storeNumber
                            })
                        }
                    }
                }
            }
        }
    }
    JSONS = allJSONs.concat(storeInventory)
    const JSONlength = JSONS.length
    const storeName = (document.getElementById('store-name').value != '')? document.getElementById('store-name').value : "No Name"
    // Download a CSV with all the stores outputs in it
    if (JSONlength > 1) {
        const allCSV = JSONtoCSV(JSONS)
        const date = dt.toLocaleDateString().replaceAll("/", ".")
        const time = dt.toLocaleTimeString().replaceAll(":", ".")
        downloadAsCSV(allCSV, `${storeName} - ${cityName} (${date} @ ${time})`)
    }
    // ====== UPDATE DBS =======
    const cityId = await getCityId(cityName) // Get the city's ID
    // Stores
    await db.msg_magic_shops.put({ 
        DATETIME: dt,
        STORE_NAME: storeName,
        CITY_NAME: cityName,
        CITY_ID: cityId,
        ITEM_TYPES: itemTypes, 
        STORE_QUANTITY: quantity,
        POPULATION: population,
        MAGICNESS: magicness,
        WEALTH: userWealth,
        DATA: JSONS,
    })
    .then(async function(){
        makeToast(`Generated magic shops for <b>${cityName}</b> saved successfully!`, 'success') // Alert user to the success
    })
    .catch(function(error){
        console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
    })
    populateHistory() // Update the History div
    document.getElementById('store-name').value = ''
}
function updateCity(){

}
// Function to save a city
async function saveCity(){
    const name = document.getElementById('name-create').value // Get the the name from the text input
    if (!name) return alert("Please input a name.") // Alert the user if they try to save a city without a name

    let userWealth = getSelectedValueFromRadioGroup('wealth-create') // Get the userWealth from the radio group
    userWealth = wealthMap.find(e => e.WEALTH == userWealth).INDEX
    let magicness = getSelectedValueFromRadioGroup('magicness-create') // Get the magicness from the radio group
    magicness = magicnessMap.find(e => e.MAGICNESS == magicness).INDEX
    const cityData = await db.msg_cities.toArray() // Get the cities table from the DB
    if (stringExistsInArray(cityData, 'NAME', name)) return alert("Duplicate city names are not permitted.") // Prevent duplicate names in the DB only if the user wants to save a new city

    let population = document.getElementById('population-create').value // Get the population in place text
    population = parseInt(population.replace(/\D/g,'')) // Parse it as an int while removing commas    

    await db.msg_cities.put({ // Add a brand new city to the DB
        NAME: name,
        POPULATION: parseInt(population),
        MAGICNESS: magicness,
        WEALTH: userWealth
    })
    .then(async function(){
        makeToast(`<b>${name}</b> added successfully!`, 'success') // Alert user to the success
        let ID = await getCityId(name) // Get the city's ID
        await setupCitiesDropdown() // Update the cities select to reflect changes
        document.getElementById('city-list').value = ID // Select the city in the dropdown
    })
    .catch(function(error){
        console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
    })
    document.getElementById('population-create').value = ''
    document.getElementById('name-create').value = ''
    toggleModal('create-city-modal')
}
// Function to set up the cities dropdown
async function setupCitiesDropdown(){
    await sleep(100)
    const citySelect = document.getElementById('city-list')
    citySelect.innerHTML = ``

    const selectOption = document.createElement('option')
    selectOption.value = 'select'
    selectOption.innerText = 'Select city...'
    citySelect.appendChild(selectOption)

    let citiesArray = await db.msg_cities.toArray()
    if (!citiesArray) return
    
    for (let index = 0; index < citiesArray.length; index++) {
        const element = citiesArray[index];
        const option = document.createElement('option')
        option.value = element.id
        option.innerText = element.NAME
        citySelect.appendChild(option)
    }
}
// Load city when selected in dropdown
async function loadCity(city){
    const divPopulation = document.getElementById('population')
    const cityId = parseInt(document.getElementById('city-list').value)

    let citySize = 'gigalopolis'
    let population = '10000000'
    let userWealth = 'modest'
    let magicness = 'medium'

    if (city != 'select') {
        const cityData = await db.msg_cities.get(cityId)
        name = cityData.NAME
        citySize = cityData.CITY_SIZE
        population = cityData.POPULATION
        userWealth = cityData.WEALTH
        magicness = cityData.MAGICNESS
    }

    divPopulation.value = population

    const table_wealth = await db.msg_wealth.toArray()
    const table_magicness = await db.msg_magicness.toArray()
    userWealth = table_wealth.map(e => e.WEALTH)[userWealth]
    magicness = table_magicness.map(e => e.MAGICNESS)[magicness]

    document.getElementById(`${userWealth}-wealth-radio`).checked = true
    document.getElementById(`${magicness}-magicness-radio`).checked = true
}
async function populateHistory(){
    const listDiv = document.getElementById('history-table-body')
    listDiv.innerHTML = ``
    let magicStores = await db.msg_magic_shops.reverse().toArray()
    for (let index = 0; index < magicStores.length; index++) {
        const element = magicStores[index]

        const tr = document.createElement('tr')

        const tdIndex = document.createElement('td')
        const tdStoreName = document.createElement('td')
        const tdCity = document.createElement('td')
        const tdDate = document.createElement('td')
        const tdTime = document.createElement('td')
        const tdDownload = document.createElement('td')
        const tdMagicness = document.createElement('td')
        const tdWealth = document.createElement('td')
        const tdItemTypes = document.createElement('td')
        const tdQuantity = document.createElement('td')
        const tdDelete = document.createElement('td')

        tdIndex.innerHTML = magicStores.length - index
        tdStoreName.innerHTML = element.STORE_NAME
        tdCity.innerHTML = element.CITY_NAME
        tdDate.innerHTML = element.DATETIME.toLocaleDateString()
        tdTime.innerHTML = element.DATETIME.toLocaleTimeString()
        tdDownload.innerHTML = `<i class="fa-solid fa-download" id="download-${element.id}"></i>`
        tdMagicness.innerHTML = element.MAGICNESS.replaceAll("-", " ")
        tdWealth.innerHTML = element.WEALTH.replaceAll("-", " ")
        tdItemTypes.innerHTML = (element.ITEM_TYPES.length == 7)? 'all' : element.ITEM_TYPES.join(", ")
        tdQuantity.innerHTML = element.STORE_QUANTITY
        tdDelete.innerHTML = `<i class="fa-solid fa-trash" id="delete-${element.id}"></i>`

        tr.appendChild(tdIndex)
        tr.appendChild(tdStoreName)
        tr.appendChild(tdCity)
        tr.appendChild(tdDate)
        tr.appendChild(tdTime)
        tr.appendChild(tdDownload)
        tr.appendChild(tdMagicness)
        tr.appendChild(tdWealth)
        tr.appendChild(tdItemTypes)
        tr.appendChild(tdQuantity)
        tr.appendChild(tdDelete)

        listDiv.appendChild(tr)

        document.getElementById(`download-${element.id}`).addEventListener('click', async function(){
            const id = parseInt(this.id.replaceAll('download-', ''))
            const storeData = await db.msg_magic_shops.get(id)
            const date = storeData.DATETIME.toLocaleDateString().replaceAll("/", ".")
            const time = storeData.DATETIME.toLocaleTimeString().replaceAll(":", ".")
            const JSONS = storeData.DATA
            const allCSV = JSONtoCSV(JSONS)
            downloadAsCSV(allCSV, `${storeData.STORE_NAME} - ${storeData.CITY_NAME} (${date} @ ${time})`)
        })

        document.getElementById(`delete-${element.id}`).addEventListener('click', async function(){
            const id = parseInt(this.id.replaceAll('delete-', ''))
            await deleteRowByPrimaryKey(id)
        })
    }
}
async function getCityId(cityName){
    let ID = await db.msg_cities.where({NAME: cityName}).toArray() // Get the object of the newly created city
    return ID[0].id // Get the ID for the new city
}