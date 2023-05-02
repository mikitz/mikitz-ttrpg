function setupSpellbook(){
    setupGroupFromArray('wizard-level', 'wizard-level', levels, true, 'radio')
    setupGroupFromArray('wizard-school', 'wizard-school', schoolsOfMagic, false, 'checkbox')

    const generateButton = document.getElementById('generate')
    generateButton.addEventListener('click', function(){
        generateSpellbook()
    })
}
async function generateSpellbook(){
    document.getElementById('output').innerText = ''
    
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

    const spellBook = await fetchLocalJson('/mikitz-ttrpg/data/json/spellslot_levels')
    const dbSpells = await fetchLocalJson('/mikitz-ttrpg/data/json/spells')
    // const subclassSchool = await fetchLocalJson('/mikitz-ttrpg/data/json/wizard_subclasses') // TODO: Finish populating this JSON // TODO: Add this to settings

    const spellLevel = spellBook.find(e => e.LEVEL == level).SLOT_LEVEL
    let tSpells = dbSpells.filter(e => e.level <= spellLevel)
    tSpells = tSpells.filter((e) => schools.includes(e.school))

    var bigString = ''
    var lSpells = []
    for (let index = 0; index < numberOfSpells; index++) {
        var prop = randomProperty(tSpells)
        var sName = prop.name
        while (lSpells.includes(sName)) {
            prop = randomProperty(tSpells)
            sName = prop.name
        }
        lSpells.push(sName)
            const sLink = (prop.LINK)? prop.LINK : null
            const vMessage = `${sName}: <a href="${sLink}" rel="noopener noreferrer" target="_blank">${sLink}</a>`
            let li = document.createElement('div')
            li.innerHTML = vMessage
            document.getElementById('output').appendChild(li)
            var vMessage1 = `<a href="${sLink}" rel="noopener noreferrer" target="_blank">${sName}</a>`
            bigString += `${vMessage1}, `
    }
}