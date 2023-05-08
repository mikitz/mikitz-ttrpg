function setupSettings(){
    const anchorIcons = document.getElementsByName('anchor-icon')
    for (let index = 0; index < anchorIcons.length; index++) {
        const element = anchorIcons[index];
        const parentId = (element.parentElement.parentElement).id
        element.addEventListener('click', function(){
            copyToClipboard(`https://mikitz.github.io/mikitz-ttrpg/html/settings.html#${parentId}`, false)
            makeToast(`<b>${parentId}</b> link copied to the clipboard!`, 'success')
        })
    }
    for (let index = 0; index < table_settingsTables.length; index++) {
        let element = table_settingsTables[index];
        const page = element.split("_")[0]
        if (element == "_parties" || element == "sbg_settings") eg_displayJsGrid(`${element}-div`, eval(`${element}`), `${element}`)
        else eval(`${page}_displayJsGrid('${element}-div', eval(${element}), '${element}')`)
        $(`#${element}-div`).on('keydown','input[type=text], input[type=number]',(event) => {
            if(event.which === 13){ // Detect enter keypress
                event.preventDefault()
                $(`#${element}-div`).jsGrid("updateItem") // Update the row
            }
        });``
    }
    tippy('.restore-defaults', {
        content: "Restore defaults"
    })
    tippy('.define-percent-type', {
        content: `<h2 style="margin-top: 0 !important;><a href="/encounter-generator/html/wiki.html">Relative vs. Absolute Percent</a></h2>
                    <p>On 1d100, each face represents an absolute 1%. E.G. if a hazard occurs on faces 91-100, there is a 10% chance a hazard will occur.</p>
                    <h3 class="anchor-sub" id="understanding-percentages-absolute">Absolute</h3>
                        <p>Now, I want to increase this probability an absolute 5%. What is the new range? The new range is 86-100 which is 10 + 5 = a 15% chance. So to compute the absolute probability when making a change with absolute percentages, you need only add the initial probability to the change.</p>
                    <h3 class="anchor-sub" id="understanding-percentages-relative">Relative</h3>
                        <p>Now, I want to increase this probability a relative 20%. What is the new range? The new range is 89-100 which is a 12% probability. How did I get there? To get there, I took 20% of the initial probability: 10 * 0.2 = 2. Then, I added the absolute probability that was computed from the relative probability to the initial probability: 10 + 2 = 12.</p>
                        <p style="margin-top: 0.75rem;"><i>Note: a relative increase of 100% doubles the probability.</i></p>`,
        allowHTML: true,
        delay: [null, null],
        interactive: true,
    })
    addTippy("prob-of-extra-spells-define","This is the probability that the wizard will get extra spells at any given level. It is meant to simulate the wizard finding spell scrolls and copying them into their spellbook.")
    addTippy("max-number-of-extra-spells-define","The is the maximum number of extra spells the wizard can have at any given level.")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
}
async function msg_displayJsGrid(elementId, objectArray, tableName){
    if (tableName != 'restore') objectArray = await db[tableName].toArray()
    const keys = Object.keys(objectArray[0])
    let fields = []

    let insert = (elementId.includes('cities'))? true : false
    let filter = (elementId.includes('cities'))? true : false
    let deleteBool = (elementId.includes('cities'))? true : false
    let controlWidth = (elementId.includes('cities'))? '60px' : '35px'

    const msg_wealth = await db.msg_wealth.toArray()
    const msg_magicness = await db.msg_magicness.toArray()

    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        let type = (element == 'OPERATOR' || element == "MAGICNESS" && tableName == "msg_cities" || element == "WEALTH" && tableName == "msg_cities")? "select" : "text"
        let items = null
        if (element == 'OPERATOR') items = ['PLUS','MINUS'] 
        if (element == 'MAGICNESS' && tableName == "msg_cities") items = msg_magicness.map(e => e.MAGICNESS)
        if (element == 'WEALTH' && tableName == "msg_cities") items = msg_wealth.map(e => e.WEALTH)
        let edit = (elementId.includes('cities') && element == 'id' 
            || element == 'RARITY' 
            || element == 'LEVEL' 
            || element == 'ITEM_RARITY'
            || element == 'WEALTH' && elementId.includes('wealth')
            || element == 'MAGICNESS' && elementId.includes('magicness'))? false : true
        const obj = {
            name: element,
            type: type,
            editing: edit,
            filtering: filter,
            width: 'auto',
            items: items,
        }
        fields.push(obj)
    }
    fields.push({
        type: "control",
        width: controlWidth,
        deleteButton: deleteBool,
    })
    // Build the grid with jsGrid
    $(`#${elementId}`).jsGrid({
        width: "100%",
        height: "auto",
        editing: true,
        sorting: true,
        paging: true,
        data: objectArray,
        fields: fields,
        onItemUpdated: async function(args){
            function getChangedColumns(item, previousItem) {
                const changedColumns = [];
                for (const key in item) {
                    if (item.hasOwnProperty(key) && previousItem.hasOwnProperty(key)) {
                        const it = parseFloat(item[key])
                        const prevItem = parseFloat(previousItem[key])
                        if (key == "NONE_A" || key == "NONE_B" || key == "MINOR_A" || key == "MINOR_B" || key == "MAJOR_A" || key == "MAJOR_B" || key == "WONDROUS_A" || key == "WONDROUS_B"
                            || key == "ARMORS" || key == "ITEMS" || key == "POISONS" || key == "SPELL_COMPONENTS" || key == "SPELL_SCROLLS" || key == "WEAPONS"
                            || key == "DIE_SIZE" || key == "RARITY_MOD" || key == "B_MOD" || key == "MAJOR" || key == "MINOR" || key == "WONDROUS" || key == "PRICE" 
                            || key == "POPULATION" || key == "MAGICNESS" || key == "WEALTH") {
                            if (it !== prevItem) changedColumns.push(key);
                        }
                    }
                }
                return changedColumns;
            }
            const tableData = args.grid.data
            const tableName = (args.grid._container[0].id).replace("-div","")
            const tableLabel = document.getElementById(tableName).innerText
            const rowData = args.item
            const primaryKeyHeader = Object.keys(args.item)[0]
            let primaryKey = rowData[primaryKeyHeader]
            if (tableName == 'msg_cities') primaryKey = rowData[Object.keys(args.item)[4]]
            const changedColumns = getChangedColumns(args.item, args.previousItem);

            if (changedColumns.length > 0) {
                for (let index = 0; index < changedColumns.length; index++) {
                    const element = changedColumns[index];
                    const value = rowData[element]
                    const nan = isNaN(value)
                    
                    if (nan) {
                        makeToast(`Please input a number in <b>${element}</b>! Changes reverted.`, 'warning')
                        args.grid.data[index] = args.previousItem;
                        args.grid.refresh(); // Refresh the grid to apply the changes
                        return
                    }                     
                }
            }
            let result = db[tableName].update(primaryKey, rowData)
            result
                .then(function(){
                    makeToast(`<b>${tableLabel}</b> updated successfully!`, 'success')
                })
                .catch(function(error){
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                    makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
                })
        },
        onItemDeleted: async function(args){
            const tableData = args.grid.data
            const tableName = (args.grid._container[0].id).replace("-div","")
            const tableLabel = document.getElementById(tableName).innerText
            const primaryKey = args.item.id
            const cityName = args.item.NAME
            db.msg_cities.delete(primaryKey)
                .then(function(){
                    makeToast(`<b>${cityName}</b> deleted successfully from the <b>${tableLabel}</b> table!`, 'success')
                })
                .catch(function(error){
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                    makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
                })
        }
    });
        
}
async function eg_displayJsGrid(elementId, objectArray, tableName){
    if (tableName != 'restore') objectArray = await db[tableName].toArray()
    let keys
    try { keys = Object.keys(objectArray[0]) }
    catch (error) { 
        document.getElementById(elementId).innerHTML = `<span><br><br><h3>The void is deafening...😞</h3></span>`
        return console.error("🚀 ~ file: settings.js:169 ~ eg_displayJsGrid ~ tableName:", tableName) 
    }

    let fields = []
    let insert = (elementId.includes('parties'))? true : false
    let filter = (elementId.includes('parties'))? true : false
    let deleteBool = (elementId.includes('parties'))? true : false
    let controlWidth = (elementId.includes('parties'))? '60px' : '35px'
    let pagination = (elementId.includes('encounter_probabilities'))? true : false
    let pageSize = (pagination == true)? 30 : null

    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        let type = (element == 'PERCENT_TYPE')? "select" : "text"
        let items = (element == 'PERCENT_TYPE')? ['RELATIVE','ABSOLUTE'] : null
        let edit = (element == 'id' 
            || element == 'BIOME' 
            || element == 'TIME_OF_DAY' 
            || element == 'ROAD_TYPE'
            || element == 'PACE' 
            || element == 'DIFFICULTY'
            || element == 'ADJUSTMENT'
            || element == 'TOTAL' 
            || element == 'ITEM')? false : true
        const obj = {
            name: element,
            type: type,
            editing: edit,
            filtering: filter,
            width: 'auto',
            items: items,
        }
        fields.push(obj)
    }
    fields.push({
        type: "control",
        width: controlWidth,
        deleteButton: deleteBool,
    })
    // Build the grid with jsGrid
    $(`#${elementId}`).jsGrid({
        width: "100%",
        height: "auto",
        editing: true,
        sorting: true,
        paging: pagination,
        pageSize: pageSize,
        // filtering: filter,
        data: objectArray,
        // controller: objectArray,
        fields: fields,
        onItemUpdated: async function(args){
            function getChangedColumns(item, previousItem) {
                const changedColumns = [];
                for (const key in item) {
                    if (item.hasOwnProperty(key) && previousItem.hasOwnProperty(key)) {
                        const it = parseFloat(item[key])
                        const prevItem = parseFloat(previousItem[key])
                        if (key == "NON_COMBAT" || key == "COMBAT" || key == "HAZARD" || key == "PROBABILITY" || key == "VALUE") {
                            if (it !== prevItem) changedColumns.push(key);
                        }
                    }
                }
                return changedColumns;
            }
            const tableData = args.grid.data
            const tableName = (args.grid._container[0].id).replace("-div","")
            const tableLabel = document.getElementById(tableName).innerText
            const index = args.grid.data.indexOf(args.item)
            let rowData = args.item
            if (tableName == 'eg_encounter_probabilities') {
                const total = parseFloat(rowData.NON_COMBAT) + parseFloat(rowData.COMBAT) + parseFloat(rowData.HAZARD)
                rowData.TOTAL = total
                args.grid.data[index] = rowData
                args.grid.refresh()
            }
            const primaryKey = rowData['id']
            
            const changedColumns = getChangedColumns(args.item, args.previousItem);
            
            if (changedColumns.length > 0) {
                for (let index = 0; index < changedColumns.length; index++) {
                    const element = changedColumns[index];
                    const value = rowData[element]
                    const nan = isNaN(value)
                    
                    if (nan) {
                        makeToast(`Please input a number in <b>${element}</b>! Changes reverted.`, 'warning')
                        args.grid.data[index] = args.previousItem;
                        args.grid.refresh(); // Refresh the grid to apply the changes
                        return
                    } 
                    if (rowData.PERCENT_TYPE == 'ABSOLUTE' && value > 1){
                        makeToast(`<b>${element}</b> values for ABSOLUTE rows must be equal to or less than 1! Changes reverted.`, 'warning')
                        args.grid.data[index] = args.previousItem;
                        args.grid.refresh(); // Refresh the grid to apply the changes
                        return
                    } 
                    else if (rowData.PERCENT_TYPE == 'RELATIVE' && value > 2){
                        makeToast(`<b>${element}</b> values for RELATIVE rows must be equal to or less than 2! Changes reverted.`, 'warning')
                        args.grid.data[index] = args.previousItem;
                        args.grid.refresh(); // Refresh the grid to apply the changes
                        return
                    }
                    else if (rowData.ITEM == "Probability of Extra Spells" && value > 1 || value < 0) {
                        makeToast(`<b>${element}</b> value for Probability of Extra Spells must be between 0 and 1! Changes reverted.`, 'warning')
                        args.grid.data[index] = args.previousItem;
                        args.grid.refresh(); // Refresh the grid to apply the changes
                        return
                    }
                    else if (rowData.ITEM == "Maximum Number of Extra Spells" && isInt(value) == false) {
                        makeToast(`<b>${element}</b> value for Maximum Number of Extra Spells must be an integer! Changes reverted.`, 'warning')
                        args.grid.data[index] = args.previousItem; // BUG: This changes the ITEM value in row 1 for some reason
                        args.grid.refresh(); // Refresh the grid to apply the changes
                        return
                    }
                }
            }

            if (tableName == 'eg_difficulty_probabilities') {
                const timeOfDay = rowData.TIME_OF_DAY
                const data = tableData.filter(e => e.TIME_OF_DAY == timeOfDay)
                const sum = data.reduce((accumulator, currentValue) => { return accumulator + parseFloat(currentValue.PROBABILITY) }, 0);
                if (sum > 1) {
                    makeToast(`The <b>PROBABILITY</b> for <i>${timeOfDay}</i> sum must be less than or equal to 1! Changes reverted.`, 'warning')
                    args.grid.data[index] = args.previousItem;
                    args.grid.refresh(); // Refresh the grid to apply the changes
                    return
                }
            }

            let result = db[tableName].update(primaryKey, rowData)   
            result
                .then(function(){         
                    makeToast(`<b>${tableLabel}</b> updated successfully!`, 'success')
                })
                .catch(function(error){
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                    makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
                })
        },
        onItemDeleted: async function(args){
            const tableData = args.grid.data
            const tableName = (args.grid._container[0].id).replace("-div","")
            const tableLabel = document.getElementById(tableName).innerText
            const primaryKey = args.item.id
            const cityName = args.item.NAME
            db._parties.delete(primaryKey)
                .then(function(){
                    makeToast(`<b>${cityName}</b> deleted successfully from the <b>${tableLabel}</b> table!`, 'success')
                })
                .catch(function(error){
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                    makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
                })
        }
    });
        
}
function settingsListeners(){
    const restoreDefaultsIcons = document.getElementsByClassName('restore-defaults')
    for (let index = 0; index < restoreDefaultsIcons.length; index++) {
        const element = restoreDefaultsIcons[index];
        element.addEventListener('click', async function(){
            const tableName = element.parentElement.id
            const tableLabel = element.parentElement.innerText
            let con = confirm(`Are you sure you want to restore ${tableLabel} to its defaults? This is irreversible!`)
            if (!con) return
            $(`#${tableName}-div`).jsGrid("destroy")
            await db[tableName].clear()
            let JSONname = tableName.replaceAll("_", "-").replaceAll('table', 'defaults')
            JSONname = JSONname.split('-')
            console.log("🚀 ~ file: settings.js:325 ~ element.addEventListener ~ JSONname:", JSONname)
            const page = JSONname.shift()
            console.log("🚀 ~ file: settings.js:328 ~ element.addEventListener ~ JSONname:", JSONname)
            JSONname = `defaults-${JSONname.join("-")}`
            console.log("🚀 ~ file: settings.js:330 ~ element.addEventListener ~ JSONname:", JSONname)
            const defaultTable = await fetchLocalJson(`/mikitz-ttrpg/data/defaults/${JSONname}`)
            let result = db[tableName].bulkPut(defaultTable)
            result
                .then(function(){
                    eval(`${page}_displayJsGrid('${tableName}-div', eval(${tableName}), '${tableName}')`)
                    makeToast(`<b>${tableLabel}</b> successfully restored to defaults!`, 'success')
                })
                .catch(function(error){
                    console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
                    makeToast(`${error.name}: ${error.message.split("\n")[0]}`, 'error')
                })
        })
    }

    const exportSettingsButton = document.getElementById('export-settings')
    exportSettingsButton.addEventListener('click', async function() { await exportData() })

    const uploadSettingsButton = document.getElementById('upload-settings')
    uploadSettingsButton.addEventListener('click', async function() { await importData() })
}
function setupSources(){
    const sourcesContainer = document.getElementById('sources-container')
    if (!localStorage.getItem('sources')) localStorage.setItem('sources', JSON.stringify(sources1))
    let sources = JSON.parse(localStorage.getItem('sources'))
    for (let index = 0; index < sources.length; index++) {
        const element = sources[index];
        const div = document.createElement('div')
        div.classList.add('custom-checkbox-container')
        if (element.SELECTED == true) div.classList.add('checked')
        div.id = element.ABBREVIATION
        div.innerText = element.ABBREVIATION
        div.name = 'source-checkbox'
        div.addEventListener('click', function(){
            this.classList.toggle('checked')
            const newData = []
            const sources = JSON.parse(localStorage.getItem('sources'))
            for (let index = 0; index < sources.length; index++) {
                let element = sources[index];
                const node = document.getElementById(element.ABBREVIATION)
                const classes = node.classList
                const con = classes.contains('checked')
                if (con) element.SELECTED = true
                else element.SELECTED = false
                newData.push(element)
            }
            localStorage.setItem('sources', JSON.stringify(newData))
        })
        sourcesContainer.appendChild(div)
        addTippy(element.ABBREVIATION, `${element.FULL_NAME}`)
    }

    const selectNoSources = document.getElementById('button-none-sources')
    const selectAllSources = document.getElementById('button-all-sources')

    selectNoSources.addEventListener('click', function(){
        const newData = []
        for (let index = 0; index < sources.length; index++) {
            const element = sources[index];
            const node = document.getElementById(element.ABBREVIATION)
            if (node.classList.contains('checked')) {
                node.classList.remove('checked')
                element.SELECTED = false
            }
            newData.push(element)
        }
        localStorage.setItem('sources', JSON.stringify(newData))
    })

    selectAllSources.addEventListener('click', function(){
        const newData = []
        for (let index = 0; index < sources.length; index++) {
            const element = sources[index];
            const node = document.getElementById(element.ABBREVIATION)
            if (!node.classList.contains('checked')) {
                node.classList.add('checked')
                element.SELECTED = true
            }
            newData.push(element)
        }   
        localStorage.setItem('sources', JSON.stringify(newData))
    })
}