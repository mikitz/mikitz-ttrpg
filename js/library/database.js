const dbVersion = 2 // TODO: dbVersion - change this every time you commit.
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
        // TODO: Incorporate ROAD, TIME_OF_DAY, and TRAVEL_MEDIUM
        eg_custom_non_combat_encounters: `
            ++id,
            BIOME,
            DESCRIPTION`,
        // TODO: Add custom hazards
        eg_custom_hazards: `
            ++id,
            BIOME,
            NAME,
            OUTCOMES`,
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
            _id,
            name,
            td,
            dt,
            ppi,
            w,
            h,
            biome,
            plane,
            grid_type,
            hex_orientation,
            climate,
            season,
            seed`,
        bmg_biome_features: `
            ++id,
            BIOME,
            CILFFS,
            HILLS,
            LAKE,
            POND,
            RIVER,
            ROAD`,
        bmg_terrain_types: `
            ++id,
            BIOME,
            NORMAL,
            DIFFICULT,
            COVER`,
        bmg_colors_summer: `
            ++id,
            BIOME,
            NORMAL,
            DIFFICULT,
            COVER,
            BOULDER,
            TREE,
            WATER,
            ROAD,
            ROUGH_WATER`,
        bmg_cover: `
            ++id,
            BIOME,
            boulder,
            branches,
            carcass,
            livestock,
            ruins,
            shrub,
            tree`,
        bmg_difficult_terrain: `
            ++id,
            BIOME,
            ice,
            lava,
            mud,
            quicksand,
            rocks,
            sand,
            slush,
            snow,
            water,
            rough_water,
            scree,
            long_grass,
            plants`,
        bmg_normal_terrain: `
            ++id,
            BIOME,
            crop,
            dirt,
            flowers,
            fungi,
            gravel,
            herbs,
            leaves,
            moss,
            mulch,
            rock,
            shells,
            twigs,
            weeds,
            grass,
            sand`,
        bmg_cover_type: `
            ++id,
            COVER_TYPE,
            PROBABILITY`,
        bmg_hill_probabilities: `
            ++id,
            BIOME,
            PROBABILITY`,
        bmg_cliff_probabilities: `
            ++id,
            BIOME,
            PROBABILITY`,
        bmg_water_type: `
            ++id,
            WATER_TYPE,
            PROBABILITY`,
        bmg_general_settings: `
            ++id,
            SETTING,
            VALUE`
    })
    // ------ Encounter Generator
    if (await db.eg_encounter_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-encounter-probabilities')
        db.eg_encounter_probabilities.bulkPut(data)
    }
    if (await db.eg_road_modifiers.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-road-modifiers')
        db.eg_road_modifiers.bulkPut(data)
    }
    if (await db.eg_pace_modifiers.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-pace-modifiers')
        db.eg_pace_modifiers.bulkPut(data)
    }
    if (await db.eg_difficulty_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-difficulty-probabilities')
        db.eg_difficulty_probabilities.bulkPut(data)
    }
    if (await db.eg_cr_adjustment_probabilities.count() <= 0) {
        const data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/defaults-cr-adjustment-probabilities')
        db.eg_cr_adjustment_probabilities.bulkPut(data)
    }
    // ------ Battle Map Generator
    if (await db.bmg_biome_features.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-biome-features')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, ...value };
        });
        db.bmg_biome_features.bulkPut(data)
    }
    if (await db.bmg_terrain_types.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-biome-terrain-types')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, ...value };
        });
        db.bmg_terrain_types.bulkPut(data)
    }
    if (await db.bmg_colors_summer.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-colors-summer')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, ...value };
        });
        db.bmg_colors_summer.bulkPut(data)
    }
    if (await db.bmg_cover.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-cover')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, ...value };
        });
        db.bmg_cover.bulkPut(data)
    }
    if (await db.bmg_difficult_terrain.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-terrain-difficult')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, ...value };
        });
        db.bmg_difficult_terrain.bulkPut(data)
    }
    if (await db.bmg_normal_terrain.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-terrain-normal')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, ...value };
        });
        db.bmg_normal_terrain.bulkPut(data)
    }
    if (await db.bmg_cover_type.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-cover-type')
        data = Object.entries(data).map(([key, value]) => {
            return { "COVER_TYPE": key, "PROBABILITY": value };
        });
        db.bmg_cover_type.bulkPut(data)
    }
    if (await db.bmg_hill_probabilities.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-feature-hill-probabilities')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, "PROBABILITY": value };
        });
        db.bmg_hill_probabilities.bulkPut(data)
    }
    if (await db.bmg_cliff_probabilities.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-feature-cliff-probabilities')
        data = Object.entries(data).map(([key, value]) => {
            return { "BIOME": key, "PROBABILITY": value };
        });
        db.bmg_cliff_probabilities.bulkPut(data)
    }
    if (await db.bmg_water_type.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-water-type')
        data = Object.entries(data).map(([key, value]) => {
            return { "WATER_TYPE": key, "PROBABILITY": value };
        });
        db.bmg_water_type.bulkPut(data)
    }
    if (await db.bmg_general_settings.count() <= 0) {
        let data = await fetchLocalJson('/mikitz-ttrpg/data/defaults/bmg-general-settings')
        db.bmg_general_settings.bulkPut(data)
    }
    // ------ Magic Shop Generator
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
    // ------ General
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