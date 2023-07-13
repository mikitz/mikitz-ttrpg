function setupTippys(){
    addTippy('width-help', `VTTs might not support more than ${(16384).toLocaleString()} pixels.`)
    addTippy('height-help', `VTTs might not support more than ${(16384).toLocaleString()} pixels.`)
    addTippy('res', "The number of pixels long one side of each tile will be.")
    addTippy('vertical', 'Rivers and roads will primarly be vertical.')
    addTippy('horizontal', 'Rivers and roads will primarly be horizontal.')
    addTippy('export-webp', 'Export as WEBP')
    addTippy('export-png', 'Export as PNG')
    addTippy('generate', 'Generate battle map')
    addTippy('clear-canvas', 'Clear the battle map')
    addTippy('export-json', 'Export as JSON')
    addTippy('export-uvtt', 'Export as UVTT')
    addTippy('export-fvtt', 'Export as FVTT')
    addTippy('toggle-visibility', 'Toggle collasped state')
    addTippy('direction-help', `Determines the direction of the road(s) and/or river(s).`)
    addTippy('biome-help', 'Determines the types of tiles that can be rolled when generating the map.')
    addTippy('form-help', 'Coming Soon!')
    addTippy('plane-help', 'Coming Soon!')
    addTippy('terrain-help', 'The probability that non-difficult terrain tiles will appear.')
    addTippy('difficult-terrain-help', 'The probability that difficult terrain tiles will appear.')
    addTippy('cover-help', 'The probability that cover tiles will appear.')
    addTippy('precipitation-probability-help', 'The probability that light precipitation will fall.')
    addTippy('heavy-precipitation-probability-help', 'The probability that heavy precipitation will fall.')
    addTippy('cliff-help', 'Elevation changes of 10 or more feet per tile.')
    addTippy('hill-help', 'Elevation changes of 2.5 feet per tile.')
    addTippy('random-seed', 'Random seed')
    addTippy('share-seed', 'Copy seed URL')
    addTippy('grid-size-help','Tile texture files are 200x200px, so any Grid Size above 200 will result in blurry tile images.')
    addTippy('flip-horizontally', 'Flip the map horizontally')
    addTippy('flip-vertically', 'Flip the map vertically')
    addTippy('rotate-left', 'Rotate the map counterclockwise 90°')
    addTippy('rotate-right', 'Rotate the map clockwise 90°')
}
async function setupDefaults(){
    const generalSettings = await db.bmg_general_settings.toArray()
    const terrainLabels = parseFloat(generalSettings[7].VALUE)
    const coordinateLabels = parseFloat(generalSettings[8].VALUE)
    const coverLabels = parseFloat(generalSettings[9].VALUE)
    const elevationLabels = parseFloat(generalSettings[10].VALUE)
    
    const terrainCheckbox = document.getElementById('terrain-checkbox')
    const coordinatesCheckbox = document.getElementById('coordinates-checkbox')
    const coverCheckbox = document.getElementById('cover-checkbox')
    const elevationCheckbox = document.getElementById('elevation-checkbox')

    const terrainOpacityElement = document.getElementById('terrain-opacity-input')
    const coordinatesOpacityElement = document.getElementById('coordinates-opacity-input')
    const coverOpacityElement = document.getElementById('cover-opacity-input')
    const elevationOpacityElement = document.getElementById('elevation-opacity-input')
    
    if (terrainLabels > 0) {
        terrainOpacityElement.value = terrainLabels
        terrainCheckbox.checked = true
        toggleLabelElements(terrainCheckbox)
        updateOpacityCanvases(terrainCheckbox, terrainLabels)
    }
    if (coordinateLabels > 0) {
        coordinatesOpacityElement.value = coordinateLabels
        coordinatesCheckbox.checked = true
        toggleLabelElements(coordinatesCheckbox)
        updateOpacityCanvases(coordinatesCheckbox, coordinateLabels)
    }
    if (coverLabels > 0) {
        coverOpacityElement.value = coverLabels
        coverCheckbox.checked = true
        toggleLabelElements(coverCheckbox)
        updateOpacityCanvases(coverCheckbox, coverLabels)
    }
    if (elevationLabels > 0) {
        elevationOpacityElement.value = elevationLabels
        elevationCheckbox.checked = true
        toggleLabelElements(elevationCheckbox)
        updateOpacityCanvases(elevationCheckbox, elevationLabels)
    }
    
    const gridSize = generalSettings[6].VALUE
    document.getElementById('grid-size').value = gridSize
    
    const hexType = generalSettings[11].VALUE
    document.getElementById('hex-type').value = hexType

    const gridType = generalSettings[12].VALUE
    document.getElementById('grid-type').value = gridType

    const mapWidth = generalSettings[13].VALUE
    document.getElementById('width-input').value = mapWidth

    const mapHeight = generalSettings[14].VALUE
    document.getElementById('height-input').value = mapHeight
}
function setupBattleMapUiListeners(){
    // Label Checkbox
    const tileLabelCheckboxes = document.getElementsByName('label-checkbox')
    tileLabelCheckboxes.forEach(element => {
        element.addEventListener('input', function(){ toggleLabelElements(this) })
    });
    // Label Opacity Input
    const opacityInputs = document.querySelectorAll('.opacity-input')
    opacityInputs.forEach(element => {
        element.addEventListener('input', function() {
            const canvasId = (this.id).replace("-opacity-input","")
            const canvasElement = document.getElementById(canvasId)
            canvasElement.style.opacity = parseFloat(this.value)
        })
    });
    // Seed URL
    const copySeedUrlButton = document.getElementById('share-seed')
    copySeedUrlButton.addEventListener('click', function(){ exportSeedUrl() })
    // Map Transformers
    const rotateRight = document.getElementById('rotate-right')
    rotateRight.addEventListener('click', async function(){ await transformBattleMap('right') })
    const rotateLeft = document.getElementById('rotate-left')
    rotateLeft.addEventListener('click', async function() { await transformBattleMap('left') })

    const flipHorizontally = document.getElementById('flip-horizontally')
    flipHorizontally.addEventListener('click', async function(){ transformBattleMap('horizontal') })
    const flipVertically = document.getElementById('flip-vertically')
    flipVertically.addEventListener('click', async function(){ transformBattleMap('vertical') })

}   
function setupBattleMapCanvasListeners(){

}
function urlListener(){
    let url = new URL(window.location.href)
    if (!url.search) return
    let params = new URLSearchParams(url.search)
    let seedString = params.get('seed')
    let seed = getSeedFromSeedString(seedString)
    let battleMapData = null
    let seedParams = seedString.split('.')
    document.getElementById('seed').value = seedParams[0]
    document.getElementById('biome').value = seedParams[1]
    document.getElementById('form').value = seedParams[2]
    document.getElementById('plane').value = seedParams[3]
    document.getElementById('climate').value = seedParams[4]
    document.getElementById('season').value = seedParams[5]
    document.getElementById('width-input').value = seedParams[6]
    document.getElementById('height-input').value = seedParams[7]
    generateBattleMap(battleMapData, [seed, seedString])
}
function toggleLabelElements(element){
    // Display the Opacity input
    const ID = element.id.replace('-checkbox', '')
    if (element.checked) {
        const opacityLabel = document.getElementById(`${ID}-opacity-label`)
        const opacityInput = document.getElementById(`${ID}-opacity-input`)
        opacityLabel.classList.remove('hidden')
        opacityLabel.classList.add('visible')
        opacityInput.classList.remove('hidden')
        opacityInput.classList.add('visible')
    } else {
        const opacityLabel = document.getElementById(`${ID}-opacity-label`)
        const opacityInput = document.getElementById(`${ID}-opacity-input`)
        opacityLabel.classList.add('hidden')
        opacityLabel.classList.remove('visible')
        opacityInput.classList.add('hidden')
        opacityInput.classList.remove('visible')
    }
    const canvas = document.getElementById(ID)
    if (element.checked) canvas.style.display = 'block'
    else canvas.style.display = 'none'
}
function updateOpacityCanvases(element, opacity){
    const canvasId = (element.id).replace("-checkbox","")
    const canvasElement = document.getElementById(canvasId)
    canvasElement.style.opacity = parseFloat(opacity)
}