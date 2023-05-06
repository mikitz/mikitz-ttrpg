const dbVersion = 4 // TODO: dbVersion - change this every time you commit.
async function setupDB(){
    await db.version(dbVersion).stores({ // Set up the NPCs table
    // ---- Encounter Generator ----
        encounters: `
            ++id,
            DATETIME,
            NAME,
            PARTY_ID,
            QUANTITY,
            DATA`,
        encounter_probabilities: `
            ++id,
            BIOME,
            TIME_OF_DAY,
            NON_COMBAT,
            COMBAT,
            HAZARD`,
        road_modifiers: `
            ++id,
            ROAD_TYPE,
            TIME_OF_DAY,
            NON_COMBAT,
            COMBAT,
            HAZARD,
            PERCENT_TYPE`,
        pace_modifiers: `
            ++id,
            PACE,
            TIME_OF_DAY,
            NON_COMBAT,
            COMBAT,
            HAZARD,
            PERCENT_TYPE`,
        difficulty_probabilities: `
            ++id,
            DIFFICULTY,
            TIME_OF_DAY,
            PROBABILITY`,
        cr_adjustment_probabilities: `
            ++id,   
            ADJUSTMENT,
            TIME_OF_DAY,
            PROBABILITY`,
        parties: `
            ++id,
            NAME,
            LEVEL,
            SIZE`,
    // ---- Magic Shop Generator ----
        magic_shops: `
            ++id,
            DATETIME,
            STORE_NAME,
            CITY_NAME,
            CITY_ID,
            ITEM_TYPES,
            STORE_QUANTITY,
            POPULATION,
            MAGICNESS,
            WEALTH,
            DATA`,
        cities: `
            ++id,
            NAME,
            POPULATION,
            MAGICNESS,
            WEALTH`,
        priceModifierVariables: `
            ITEM_RARITY,
            NONE_A,
            NONE_B,
            MINOR_A,
            MINOR_B,
            MAJOR_A,
            MAJOR_B,
            WONDROUS_A,
            WONDROUS_B`,
        numberOfDiceVariables: `
            ITEM_RARITY,
            ARMORS,
            ITEMS,
            POISONS,
            POTIONS,
            SPELL_COMPONENTS,
            SPELL_SCROLLS,
            WEAPONS`,
        wealth: `
            WEALTH,
            DICE_SIZE,
            OPERATOR`,
        magicness: `
            MAGICNESS,
            RARITY_MOD,
            B_MOD`,
        equipmentPrices: `
            RARITY,
            MINOR,
            MAJOR,
            WONDROUS`,
        spellScrollPrices: `
            LEVEL,
            PRICE`,
    // ---- NPC Generator ----
        npcs: `
            id,
            datetime,
            race,
            height_inches, 
            weight_pounds,
            age,
            sex,
            pregnant,
            name,
            nickname,
            gender,
            pronouns,
            sexual_orientation,
            relationship_orientation,
            alignment,
            voice,
            mbti_name,
            mbti,
            mbti_description,
            languages,
            relationship_status,
            background,
            trait,
            bond,
            flaw,
            ideal,
            body_shape,
            body_type,
            hair_length,
            hair_type,
            hair_color,
            face_shape,
            eye_color`,
    // ---- Spellbook Generator ----
        spellbooks: `
            ++id,
            datetime,
            level,
            schools,
            spell_quantity,
            spells`,
        settings: `
            probability_of_extra_spells,
            extra_spells_max`
    })
    if (await db.encounter_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-encounter-probabilities') // Load local JSON
        db.encounter_probabilities.bulkPut(data) // Add default if not already in the DB
    }
    if (await db.road_modifiers.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-road-modifiers') // Load local JSON
        db.road_modifiers.bulkPut(data) // Add default if not already in the DB
    }
    if (await db.pace_modifiers.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-pace-modifiers') // Load local JSON
        db.pace_modifiers.bulkPut(data) // Add default if not already in the DB
    }
    if (await db.difficulty_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-difficulty-probabilities') // Load local JSON
        db.difficulty_probabilities.bulkPut(data) // Add default if not already in the DB
    }
    if (await db.cr_adjustment_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-cr-adjustment-probabilities') // Load local JSON
        db.cr_adjustment_probabilities.bulkPut(data) // Add default if not already in the DB
    }
    if (await db.cities.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-cities')
        db.cities.bulkPut(table) // Add default cities if not already in the DB
    }
    if (await db.priceModifierVariables.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-price-modifier-variables')
        db.priceModifierVariables.bulkPut(table) // Add default cities if not already in the DB
    }
    if (await db.numberOfDiceVariables.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-number-of-dice-variables')
        db.numberOfDiceVariables.bulkPut(table) // Add default cities if not already in the DB
    }
    if (await db.wealth.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-wealth')
        db.wealth.bulkPut(table) // Add default cities if not already in the DB
    }
    if (await db.magicness.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-magicness')
        db.magicness.bulkPut(table) // Add default cities if not already in the DB
    }
    if (await db.equipmentPrices.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-equipment-prices')
        db.equipmentPrices.bulkPut(table) // Add default cities if not already in the DB
    }
    if (await db.spellScrollPrices.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-spell-scroll-prices')
        db.spellScrollPrices.bulkPut(table) // Add default cities if not already in the DB
    }
    if (await db.settings.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-spellbook-settings')
        db.spellScrollPrices.bulkPut(table) // Add default cities if not already in the DB
    }
}
async function deleteRowByPrimaryKey(primaryKey, table){
    let con = confirm(`Are you sure you want to delete this ${table}? This is irreversible!`)
    if (!con) return
    await db[table].delete(primaryKey)
        .then(function(){
            makeToast(`Item deleted successfully!`, 'success')
        })
        .catch(function(error){
            console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
            makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
        })
} 
async function getPartyId(partyName){
    let ID = await db.parties.where({NAME: partyName}).toArray() 
    return ID[0].id 
}
async function exportData(){
    let data = []
    const tables = db.tables
    for (let index = 0; index < tables.length; index++) {
        const element = tables[index];
        const tableName = element.name
        const tableData = await element.toArray()
        data.push({ 
            "NAME": tableName,
            "DATA": tableData
        })
    } 

    const dt = new Date()
    const date = dt.toLocaleDateString().replaceAll("/", ".")
    const time = dt.toLocaleTimeString().replaceAll(":", ".")
    downloadObjectAsJson(data, `Mikitz' Encounter Generator Data Export (${date} @ ${time})`)
}
async function importData(){
    const fileInput = document.getElementById('import-data')
    const file = fileInput.files[0]
    if (file.type !== 'application/json') return alert('Please select a JSON file.')

    const reader = new FileReader()
    reader.onload = async (event) => {
        const textContent = JSON.parse(event.target.result)
        for (let index = 0; index < textContent.length; index++) {
            const element = textContent[index];
            const name = element.NAME
            const data = element.DATA

            await db[name].clear()
                .then(async function(){})
                .catch(function(error){
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                })
            await db[name].bulkPut(data)
                .then(async function(){
                    makeToast(`<b>${name}</b> data <i>imported</i> successfully!`, 'success') // Alert user to the success
                    fileInput.value = ''
                })
                .catch(function(error){
                    fileInput.value = ''
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                })
        }
    };
    reader.readAsText(file);
}
async function downloadRowData(table, id, key){
    const data = await db[table].get(id)
    const date = data.DATETIME.toLocaleDateString().replaceAll("/", ".")
    const time = data.DATETIME.toLocaleTimeString().replaceAll(":", ".")
    const JSONS = data[key]
    const allCSV = JSONtoCSV(JSONS)
    downloadAsCSV(allCSV, `${table} - ${id} (${date} @ ${time})`)
}