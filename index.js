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
function setActiveTool(){
    let url = window.location.href
    for (let index = 0; index < pages.length; index++) {
        const element = pages[index];
        if (url.includes(element)) {
            document.getElementById(element).classList = ''
            document.getElementById(element).classList.add('site-button-active')
        } else if (!document.getElementById(element).classList.contains('site-button-under-construction')) {
            document.getElementById(element).classList = ''
            document.getElementById(element).classList.add('site-button')
        }
    }

    const underConstructionElements = document.querySelectorAll('.site-button-under-construction')
    for (let index = 0; index < underConstructionElements.length; index++) {
        const element = underConstructionElements[index];
        element.addEventListener('click', function(event){
            event.preventDefault(); // Prevents the link from being followed
        })
    }
    url = window.location
    const parser = new URL(url || window.location);
    parser.searchParams.set('sub_page', 0);
    window.history.pushState(0, "", parser.href)
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
function setupSubnav(){
    let pageName = (window.location.href).split('/')
    pageName = (pageName[pageName.length - 1]).replace(".html","").split("?")[0]
    const pageSubNavs = subNavs.find(e => e.PAGE == pageName).NAVS
    const subNavElement = document.getElementById('sub-nav')
    
    for (let index = 0; index < pageSubNavs.length; index++) {
        const element = pageSubNavs[index];
        const subNavData = subNavIcons.find(e => e.SUB_NAV == element)
        const icon = subNavData.ICON
        const a = document.createElement('a')
        a.classList.add('nav-a')
        a.href = (subNavData.LINK)? subNavData : '#'
        a.id = element
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.innerHTML = icon

        const span = document.createElement('span')
        span.innerText = element

        a.appendChild(span)
        subNavElement.appendChild(a)
    }
}
function setActiveSubPage(){
    const params = new URLSearchParams(window.location.search);
    const subPageIndex = params.get("sub_page");

    let pageName = (window.location.href).split('/')
    pageName = (pageName[pageName.length - 1]).replace(".html","").split("?")[0]
    let subPage = subNavs.find(e => e.PAGE == pageName).NAVS[subPageIndex]
    console.log("🚀 ~ file: index.js:154 ~ setActiveSubPage ~ subPage:", subPage)

    const subPages = document.querySelectorAll('.nav-a')
    for (let index = 0; index < subPages.length; index++) {
        const element = subPages[index];
        if (subPage == element.id) element.classList.add('active')
        else element.classList.remove('active')
    }
    

}