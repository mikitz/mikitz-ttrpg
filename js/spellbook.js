function setupSpellbook(){
    setupGroupFromArray('wizard-level', 'wizard-level', levels, true, 'radio', false)
    setupGroupFromArray('wizard-school', 'wizard-school', schoolsOfMagic, false, 'checkbox', false)

    const generateButton = document.getElementById('generate')
    generateButton.addEventListener('click', function(){
        generateSpellbook()
    })
    const toggleHistory = document.getElementById('toggle-history')
    toggleHistory.addEventListener('click', function(){
        toggleNextChildDisplay(this)
    })

    setupVersionNumber()

    addTippy("download-csv", "Download CSV")
    addTippy("download-txt", "Download TXT")
    addTippy("copy-output-links", "Copy output with links")
    addTippy("copy-output-no-links", "Copy output without links")

    const downloadCSV = document.getElementById('download-csv')
    downloadCSV.addEventListener('click', function(){
        const data = JSON.parse(localStorage.getItem('recent-spellbook'))
        const csv = JSONtoCSV(data.SPELLS)
        let dt = (typeof data.DATETIME == 'string')? new Date(data.DATETIME) : data.DATETIME
        const date = dt.toLocaleDateString().replaceAll("/", ".")
        const time = dt.toLocaleTimeString().replaceAll(":", ".")
        downloadAsCSV(csv, `Spellbook (${date} @ ${time})`)
    })

    const downloadTXT = document.getElementById('download-txt')
    downloadTXT.addEventListener('click', function(){
        const data = JSON.parse(localStorage.getItem('recent-spellbook'))
        let text = ''
        for (let index = 0; index < data.SPELLS.length; index++) {
            const element = data.SPELLS[index];
            text += `${element.NAME}: ${element.LINK}\n`
        }
        let dt = (typeof data.DATETIME == 'string')? new Date(data.DATETIME) : data.DATETIME
        const date = dt.toLocaleDateString().replaceAll("/", ".")
        const time = dt.toLocaleTimeString().replaceAll(":", ".")
        downloadAsTXT(`Spellbook (${date} @ ${time})`, text)
    })

    const copyOutputLinks = document.getElementById('copy-output-links')
    copyOutputLinks.addEventListener('click', function(){
        let textToCopy = ''
        const data = JSON.parse(localStorage.getItem('recent-spellbook'))
        for (let index = 0; index < data.SPELLS.length; index++) {
            const element = data.SPELLS[index];
            textToCopy += `${element.NAME}: ${element.LINK}\n`
        }
        copyToClipboard(textToCopy, true)
    })

    const copyOutputNoLinks = document.getElementById('copy-output-no-links')
    copyOutputNoLinks.addEventListener('click', function(){
        let textToCopy = ''
        const data = JSON.parse(localStorage.getItem('recent-spellbook'))
        for (let index = 0; index < data.SPELLS.length; index++) {
            const element = data.SPELLS[index];
            textToCopy += `${element.NAME}\n`
        }
        copyToClipboard(textToCopy, true)
    })
}
async function generateSpellbook(){
    // document.getElementById('output').innerText = ''
    document.getElementById('output-table').innerHTML = ''
    
    let level = getSelectedValueFromRadioGroup('wizard-level')
    let schools = getSelectedItemsFromCheckboxGroup('wizard-school')

    schools = schools.map(item => item.charAt(0).toUpperCase()) // Conver the school names to their abbreviations

    if (level === 'random') level = getRndInteger(1, 20)
    else level = parseInt(level)

    let numberOfSpells = ( ( level - 1 ) * 2 ) + 6

    for (let index = 1; index < level + 1; index++) { // Simulates the wizard adding spell scrolls to their spellbook at certain levels
        const coin = getRndInteger(1, 2) // TODO: Add to settings
        const extra = getRndInteger(1, 4) // TODO: Add to settings
        if (coin === 2) numberOfSpells += extra
    }

    const spellBook = await fetchLocalJson('/mikitz-ttrpg/data/json/spellslot-levels')
    const dbSpells = await fetchLocalJson('/mikitz-ttrpg/data/json/spells')

    const spellLevel = spellBook.find(e => e.LEVEL == level).SLOT_LEVEL
    let tSpells = dbSpells.filter(e => e.level <= spellLevel)
    tSpells = tSpells.filter((e) => schools.includes(e.school))
    tSpells = tSpells.filter((e) => !e.name.includes("UA")) // Remove UA Spells
    tSpells = tSpells.filter((e) => !e.source.includes("UA"))

    const tableData = []

    let lSpells = []
    for (let index = 0; index < numberOfSpells; index++) {
        let prop = randomProperty(tSpells)
        let sName = prop.name
        while (lSpells.includes(sName)) {
            prop = randomProperty(tSpells)
            sName = prop.name
        }
        const sLink = cheesePizza(prop.name, prop.source)
        lSpells.push({"NAME": sName, "LINK": sLink[0]})
        // const vMessage = `${sName}: ${sLink[1]}`
        // let li = document.createElement('div')
        // li.innerHTML = vMessage
        // document.getElementById('output').appendChild(li)

        const magicSchool = (schoolFirstLetter) => {
            for (let index = 0; index < schoolsOfMagic.length; index++) {
                const element = schoolsOfMagic[index];
                if (element.charAt(0) == schoolFirstLetter.toLowerCase()) return element
            }
        }

        tableData.push({
            NAME: sLink[1],
            LEVEL: prop.level,
            SCHOOL: magicSchool(prop.school),
            SOURCE: prop.source
        })
    }
    tableData.sort((a, b) => a.LEVEL - b.LEVEL) // Sort by ascending level

    $("#output-table").jsGrid({
        height: "100%",
        sorting: true,
        paging: false,
        data: tableData,
        // pageSize: 15,
        fields: [
            {name: "NAME", type: "text", width: "20rem"},
            {name: "LEVEL", type: "text", width: "5rem"},
            {name: "SCHOOL", type: "text", width: "10rem"},
            {name: "SOURCE", type: "text", width: "5rem"}
        ]
    })
    
    const now = new Date()
    const data = {
        DATETIME: now,
        LEVEL: level,
        SCHOOLS: schools,
        SPELL_QUANTITY: numberOfSpells,
        SPELLS: lSpells,
    }
    localStorage.setItem('recent-spellbook', JSON.stringify(data))
    await db.spellbooks.put(data)
    await populateSpellbookHistory()
}
async function populateSpellbookHistory(){
    const history = document.getElementById('history-table-body')
    history.innerHTML = ''
    const spellbooks = await db.spellbooks.toArray()
    for (let index = 0; index < spellbooks.length; index++) {
        const element = spellbooks[index];
        const tr = document.createElement('tr')
        let dt = (typeof element.DATETIME == 'string')? new Date(element.DATETIME) : element.DATETIME

        const tdIndex = document.createElement('td')
        const tdDate = document.createElement('td')
        const tdTime = document.createElement('td')
        const tdLevel = document.createElement('td')
        const tdSchools = document.createElement('td')
        const tdDownload = document.createElement('td')
        const tdDelete = document.createElement('td')
        
        tdIndex.innerText = spellbooks.length - index
        tdDate.innerText = dt.toLocaleDateString()
        tdTime.innerText = dt.toLocaleTimeString()
        tdLevel.innerText = element.LEVEL
        tdSchools.innerText = (element.SCHOOLS.length == 8)? 'all' : element.SCHOOLS.join(", ")
        tdDownload.innerHTML = `<i class="fa-solid fa-download" id="download-${element.id}"></i>`
        tdDelete.innerHTML = `<i class="fa-solid fa-trash" id="${element.id}-delete"></i>`

        tr.appendChild(tdIndex)
        tr.appendChild(tdDate)
        tr.appendChild(tdTime)
        tr.appendChild(tdLevel)
        tr.appendChild(tdSchools)
        tr.appendChild(tdDownload)
        tr.appendChild(tdDelete)

        history.appendChild(tr)

        document.getElementById(`download-${element.id}`).addEventListener('click', async function(){
            const id = parseInt(this.id.replaceAll('download-', ''))
            await downloadRowData('spellbooks', id, 'SPELLS')
        })

        document.getElementById(`${element.id}-delete`).addEventListener('click', async function(){
            const id = parseInt(this.id.replaceAll('-delete', ''))
            await deleteRowByPrimaryKey(id, 'spellbooks')
            await populateSpellbookHistory()
        })
    }
}