const dbVersion = 11 // TODO: dbVersion - change this every time you commit.
async function setupDB(){
    await db.version(dbVersion).stores({ // Set up the NPCs table
    // ---- Global ----
        _parties: `
            ++id,
            NAME,
            LEVEL,
            SIZE`,
        _sources: `
            ABBREVIATION,
            FULL_NAME,
            SELECTED`,
    // ---- Encounter Generator ----
        eg_encounters: `
            ++id,
            DATETIME,
            NAME,
            PARTY_ID,
            QUANTITY,
            DATA`,
        eg_encounter_probabilities: `
            ++id,
            BIOME,
            TIME_OF_DAY,
            NON_COMBAT,
            COMBAT,
            HAZARD`,
        eg_road_modifiers: `
            ++id,
            ROAD_TYPE,
            TIME_OF_DAY,
            NON_COMBAT,
            COMBAT,
            HAZARD,
            PERCENT_TYPE`,
        eg_pace_modifiers: `
            ++id,
            PACE,
            TIME_OF_DAY,
            NON_COMBAT,
            COMBAT,
            HAZARD,
            PERCENT_TYPE`,
        eg_difficulty_probabilities: `
            ++id,
            DIFFICULTY,
            TIME_OF_DAY,
            PROBABILITY`,
        eg_cr_adjustment_probabilities: `
            ++id,   
            ADJUSTMENT,
            TIME_OF_DAY,
            PROBABILITY`,
        eg_custom_non_combat_encounters: `
            ++id,
            biome,
            road,
            time_of_day,
            travel_medium,
            description`,
        // TODO: Add custom hazards
        eg_custom_hazards: `
            ++id,
            biome,
            name,
            outcomes`,
    // ---- Magic Shop Generator ----
        msg_magic_shops: `
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
        msg_cities: `
            ++id,
            NAME,
            POPULATION,
            MAGICNESS,
            WEALTH`,
        msg_price_modifier_variables: `
            ITEM_RARITY,
            NONE_A,
            NONE_B,
            MINOR_A,
            MINOR_B,
            MAJOR_A,
            MAJOR_B,
            WONDROUS_A,
            WONDROUS_B`,
        msg_number_of_dice_variables: `
            ITEM_RARITY,
            ARMORS,
            ITEMS,
            POISONS,
            POTIONS,
            SPELL_COMPONENTS,
            SPELL_SCROLLS,
            WEAPONS`,
        msg_wealth: `
            WEALTH,
            DICE_SIZE,
            OPERATOR`,
        msg_magicness: `
            MAGICNESS,
            RARITY_MOD,
            B_MOD`,
        msg_equipment_prices: `
            RARITY,
            MINOR,
            MAJOR,
            WONDROUS`,
        msg_spell_scroll_prices: `
            LEVEL,
            PRICE`,
    // ---- NPC Generator ----
        npcg_npcs: `
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
        sbg_spellbooks: `
            ++id,
            datetime,
            level,
            schools,
            spell_quantity,
            spells`,
        sbg_settings: `
            ++id,
            item,
            value`,
    // ---- Battle Map Generator ----
        bmg_maps: `
            ++id,
            DATETIME,
            BIOME,
            GRID,
            HEIGHT,
            HEX_ORIENTATION,
            NAME,
            PLANE,
            PPI,
            TILE_DATA,
            WALLS_FVTT,
            WALLS_UVTT,
            WIDTH`,
    })
    if (await db.eg_encounter_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-encounter-probabilities') // Load local JSON
        db.eg_encounter_probabilities.bulkPut(data)
    }
    if (await db.eg_road_modifiers.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-road-modifiers') // Load local JSON
        db.eg_road_modifiers.bulkPut(data)
    }
    if (await db.eg_pace_modifiers.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-pace-modifiers') // Load local JSON
        db.eg_pace_modifiers.bulkPut(data)
    }
    if (await db.eg_difficulty_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-difficulty-probabilities') // Load local JSON
        db.eg_difficulty_probabilities.bulkPut(data)
    }
    if (await db.eg_cr_adjustment_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-cr-adjustment-probabilities') // Load local JSON
        db.eg_cr_adjustment_probabilities.bulkPut(data)
    }
    if (await db.msg_cities.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-cities')
        db.msg_cities.bulkPut(table)
    }
    if (await db.msg_price_modifier_variables.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-price-modifier-variables')
        db.msg_price_modifier_variables.bulkPut(table)
    }
    if (await db.msg_number_of_dice_variables.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-number-of-dice-variables')
        db.msg_number_of_dice_variables.bulkPut(table)
    }
    if (await db.msg_wealth.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-wealth')
        db.msg_wealth.bulkPut(table)
    }
    if (await db.msg_magicness.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-magicness')
        db.msg_magicness.bulkPut(table)
    }
    if (await db.msg_equipment_prices.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-equipment-prices')
        db.msg_equipment_prices.bulkPut(table)
    }
    if (await db.msg_spell_scroll_prices.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-spell-scroll-prices')
        db.msg_spell_scroll_prices.bulkPut(table)
    }
    if (await db.sbg_settings.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-sbg-settings')
        db.sbg_settings.bulkPut(table)
    }
    if (await db._sources.count() <= 0) {
        const table = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-sources')
        db._sources.bulkPut(table)
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