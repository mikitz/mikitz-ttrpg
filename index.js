function setupIndex(){
    const versionNumberElements = document.querySelectorAll('.version-number')
    for (let index = 0; index < versionNumberElements.length; index++) {
        const element = versionNumberElements[index];
        const versionNumber = element.id.replace('-','')
        element.innerHTML = eval(versionNumber)
    }   
    function mobileWarning(){
        const width = window.innerWidth
        const warningElement = document.getElementById('mobile-warning')
        if (width <= 600) warningElement.style.display = 'inline'
        else warningElement.style.display = 'none'
    }
    mobileWarning()
    window.addEventListener('resize', function(event){
        mobileWarning()
    })

    addTippy('feedback-definition', '<span class="definition">Feedback</span> is defined as any ideas that you would like to see implemented, or for constructive criticism about the UI, UX, or the algorithms.')
}
function preventLinkFiring(){
    // Prevent the under construction pages from opening broken links
    const underConstructionElements = document.querySelectorAll('.site-button-under-construction')
    for (let index = 0; index < underConstructionElements.length; index++) {
        const element = underConstructionElements[index];
        element.addEventListener('click', function(event){
            event.preventDefault(); // Prevents the link from being followed
        })
    }
    // Make it so clicking settings applied the appropriate anchor
    const url = (window.location.href).split('/')
    const pageName = (url[url.length - 1]).replace(".html","")
    if (pageName != index || pageName != settings || pageName != wiki) {
        document.getElementById('settings').href = `/mikitz-ttrpg/html/settings.html#${pageName}-heading` 
        document.getElementById('wiki').href = `/mikitz-ttrpg/html/wiki.html#${pageName}-heading` 
    }
}
function setupGroupFromArray(radioGroupId, radioGroupName, array, random, groupType, icons){
    const radioGroup = document.getElementById(radioGroupId)
    const theme = (localStorage.getItem('theme')).replace("theme-","")
    if (random) array.unshift('?')
    if (groupType == 'checkbox') { // Add 'all' button
        const label = document.createElement('label')
        label.id = radioGroupName

        const input = document.createElement('input')
        input.classList.add('checkbox')
        input.id = 'all'
        input.value = 'all'

        const span = document.createElement('span')
        span.innerText = 'all'

        label.appendChild(input)
        label.appendChild(span)

        radioGroup.appendChild(label)

        label.addEventListener('click', function(){
            const elements = document.getElementsByName(this.id)
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (element.id == 'random') element.checked = false
                else element.checked = true
            }
        })
    }
    if (groupType == 'checkbox') { // Add 'none' button
        const label = document.createElement('label')
        label.id = radioGroupName

        const input = document.createElement('input')
        input.classList.add('checkbox')
        input.id = 'none'
        input.value = 'none'

        const span = document.createElement('span')
        span.innerText = 'none'

        label.appendChild(input)
        label.appendChild(span)

        radioGroup.appendChild(label)

        label.addEventListener('click', function(){
            const elements = document.getElementsByName(this.id)
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (element.id == 'random') element.checked = true
                else element.checked = false
            }
        })
    }
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const label = document.createElement('label')
        label.name = 'radio-label'

        const input = document.createElement('input')
        input.classList.add('checkbox')
        input.type = groupType
        input.name = radioGroupName
        input.id = (element == '?')? 'random' : element
        input.value = (element == '?')? 'random' : element
        if (element == '?' || random == false) input.checked = true

        const span = document.createElement('span')
        if (icons) {
            const icon = `${icons}/${theme}/${element}.webp`
            span.innerHTML = `<img src="${icon}" alt="${element}" width="128" height="128">`
        } else span.innerText = element

        label.appendChild(input)
        label.appendChild(span)

        radioGroup.appendChild(label)
    }
}
function setupVersionNumber(){
    let suffix = ''
    let versionNumber
    let pageName = (window.location.href).split('/')
    pageName = (pageName[pageName.length - 1]).replace(".html","").split("?")[0]
    if (pageName.includes('generator')) {
        versionNumber = pageName.replace('-generator',' ').replace("-", " ")
        suffix = 'Gen'
    }
    versionNumber = versionNumber.toTitleCase().replaceAll(" ","")

    // Display the Version Number
    const versionNumberElement = document.getElementById('version-number')
    if (versionNumber != 'index') versionNumberElement.innerText = eval(`versionNumber${versionNumber}${suffix}`)

    const changeLogName = pageName.replaceAll(" ","").replace("-generator",'')
    // Add the Link to the Version Number display
    const versionLink = document.getElementById('version-link')
    versionLink.href = `https://github.com/mikitz/mikitz-ttrpg/blob/main/changelogs/${changeLogName}-${suffix.toLowerCase()}.md`
}
function toggleLayout(){
    const layoutBool = document.getElementById('slider-layout').checked // True = panel layout, False = flex layout
    let layout
    if (layoutBool) layout = 'panel'
    else layout = 'flex'
    
    const url = window.location.href
    if (url.includes('encounter')) localStorage.setItem('eg-layout', layoutBool)
    if (url.includes('battle-map')) localStorage.setItem('bmg-layout', layoutBool)

    if (layout == 'flex') {
        document.getElementById(`flex-layout`).classList.remove('hidden')
        document.getElementById(`flex-layout`).classList.add('visible')
        document.getElementById(`panel-layout`).classList.add('hidden')
        document.getElementById(`panel-layout`).classList.remove('visible')
    }
    else if (layout == 'panel') {
        document.getElementById(`panel-layout`).classList.remove('hidden')
        document.getElementById(`panel-layout`).classList.add('visible')
        document.getElementById(`flex-layout`).classList.add('hidden')
        document.getElementById(`flex-layout`).classList.remove('visible')
    }
}
function setupLayout(){
    const url = window.location.href
    let layoutBool
    if (url.includes('encounter')) layoutBool = localStorage.getItem('eg-layout')
    if (url.includes('battle-map')) layoutBool = localStorage.getItem('bmg-layout')

    document.getElementById('slider-layout').checked = layoutBool
}