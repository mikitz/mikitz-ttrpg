async function populateEncounterHistory(partyId){
    if (!partyId) partyId = parseInt(document.getElementById('select-party-input').value)
    const listDiv = document.getElementById('history-table-body')
    listDiv.innerHTML = ``

    let encountersData = await db.table_encounters.reverse().toArray()
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
            let encountersData = await db.table_encounters.get(id)
            buildEncounterModal(encountersData)
        })

        document.getElementById(`${element.id}-delete`).addEventListener('click', async function(){
            const id = parseInt(this.id.replaceAll('-delete', ''))
            await deleteRowByPrimaryKey(id, 'table_encounters')
        })
    }
}