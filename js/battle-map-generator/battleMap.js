async function generateBattleMap(battleMapData, seed){
    const startTime = Date.now()
    const canvases = document.getElementsByName('canvas')
    const contexts = {}
    for (let index = 0; index < canvases.length; index++) {
        const element = canvases[index];
        const ctx = element.getContext('2d')
        contexts[element.id] = ctx
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    if (battleMapData) { // Battle Map Data is passed through if we're redrawing a map
        const gridType = battleMapData.grid_type
        if (gridType == 'square') generateSquareGridBattleMap(null, null, battleMapData)
        else generateHexBattleMap(null, null, battleMapData)
        return
    }
    /* -----------------------
            User Inputs
    ----------------------- */
    let name = document.getElementById('name').value ? document.getElementById('name').value : document.getElementById('seed').value
    const width = parseInt(document.getElementById("width-input").value)
    const height = parseInt(document.getElementById("height-input").value)
    const gridSize = parseInt(document.getElementById("grid-size").value)
    const landform = document.getElementById('form').value
    const climate = document.getElementById('climate').value
    const season = document.getElementById('season').value
    const directionOrientation = getSelectedValueFromRadioGroup('orientation')
    const hexOrientation = (document.getElementById('hex-type').value)? document.getElementById('hex-type').value : null
    
    if (!width || !height || !gridSize) return alert("Width, Height, and Grid Size are required.")

    const biome = document.getElementById('biome').value
    const plane = document.getElementById('plane').value
    const biomeUpper = biome.toUpperCase()
    const biomeLower = biome.toLowerCase()
    const gridType = getSelectedValueFromRadioGroup('grid-type')
    // Labels
    const terrainLabelsOpacity = getLabelAndTileOpacity('terrain-checkbox', 'terrain-opacity-input')
    const coordinatesLabelsOpacity = getLabelAndTileOpacity('coordinates-checkbox', 'coordinates-opacity-input')
    const coverLabelsOpacity = getLabelAndTileOpacity('cover-checkbox', 'cover-opacity-input')
    const elevationLabelsOpacity = getLabelAndTileOpacity('elevation-checkbox', 'elevation-opacity-input')
    const labelsArray = [terrainLabelsOpacity, coordinatesLabelsOpacity, coverLabelsOpacity, elevationLabelsOpacity]
    // Features
    const cliffsProb = getSelectedValueFromRadioGroup('cliffs')
    const hillsProb = getSelectedValueFromRadioGroup('hills')
    // const lakeProb = getSelectedValueFromRadioGroup('lake')
    // const pondProb = getSelectedValueFromRadioGroup('pond')
    const riverProb = getSelectedValueFromRadioGroup('river')
    const roadProb = getSelectedValueFromRadioGroup('road')

    let seedText
    if (seed) {
        seedText = seed[1]
        seed = seed[0]
    } else {
        seed = getSeed('seed', [biome,landform,plane,climate,season,width,height])
        seedText = seed[1]
        seed = seed[0]
    }
    const direction = determineDirection(directionOrientation, seed)
    const userInputsArray = [name, width, height, gridSize, directionOrientation, hexOrientation, biome, plane, gridType, direction]
    
    // const cliff = specialFeatureOnBattleMapBoolean(cliffsProb, seed)
    const cliff = false
    // const hill = specialFeatureOnBattleMapBoolean(hillsProb, seed)
    const hill = false
    const lake = specialFeatureOnBattleMapBoolean(lakeProb, seed)
    const pond = specialFeatureOnBattleMapBoolean(pondProb, seed)
    const river = specialFeatureOnBattleMapBoolean(riverProb, seed)
    const road = specialFeatureOnBattleMapBoolean(roadProb, seed)
    const specialFeaturesBooleanArray = [cliff,hill,lake,pond,river,road]
    /* -----------------------
            Get Data
    ----------------------- */
    // let colorData = await fetchLocalJson(`mikitz-ttrpg\data\json\battle-map-generator\COLORS_${SEASON}`)
    let colorData = await db.bmg_colors_summer.toArray()
    colorData = colorData.find(i => i.BIOME === biomeUpper)
    // Table Data
    let tableCover = await db.bmg_cover.toArray()
    let tableDiffTerrain = await db.bmg_difficult_terrain.toArray()
    let tableTerrain = await db.bmg_normal_terrain.toArray()
    let tableCoverType = await db.bmg_cover_type.toArray()
    let tableTerrainClassification = await db.bmg_terrain_types.toArray()
    const tableHill = (hill) ? await db.bmg_hill_probabilities.toArray() : null
    const tableCliff = (cliff) ? await db.bmg_cliff_probabilities.toArray() : null
    tableCoverType = convertPropertiesArrayToSeedRollableObject(tableCoverType, "COVER_TYPE", "PROBABILITY")
    tableTerrain = convertObjectToSeedRollableObject(tableTerrain.find(e => e.BIOME == biomeUpper))
    tableDiffTerrain = convertObjectToSeedRollableObject(tableDiffTerrain.find(e => e.BIOME == biomeUpper))
    tableCover = convertObjectToSeedRollableObject(tableCover.find(e => e.BIOME == biomeUpper))
    tableTerrainClassification = convertObjectToSeedRollableObject(tableTerrainClassification.find(e => e.BIOME == biomeUpper))
    const specialFeaturesTables = [tableCover,tableDiffTerrain,tableTerrain,tableCoverType,tableTerrainClassification,tableHill,tableCliff]
    // Check Dimensions
    const isDimensionsCompatible = checkForCompatibleDimensionsBoolean(width, height, gridSize)
    if (isDimensionsCompatible) return alert(`Width / Grid Size = ${widthDividedByGridSize} and Height / Grid Size = ${heightDividedByGridSize}. At least one of these quotients is not a whole number. Please ensure that each of these quotients is a whole number, I.E. no decimal places.`)
    // Special Features
    const cliffDieSize = (cliff) ? tableCliff.find(elem => elem.BIOME == biomeLower).DIE_SIZE : null
    const hillDieSize = (hill) ? tableHill.find(elem => elem.BIOME == biomeLower).DIE_SIZE : null
    const riverWidth = (river) ? getRiverWidth(height) : null
    const beginRiver = (river) ? determinePathBeginningCoordinates(direction, height, width, seed) : null
    const roadWidth = (road) ? getRoadWidth() : null
    const beginRoad = (road) ? determinePathBeginningCoordinates(direction, height, width, seed) : null
    const specialFeaturesMiscData = [cliffDieSize,hillDieSize,riverWidth,beginRiver,beginRoad]
    /* ------------------------
           Setup Canvases
    ------------------------ */
    const canvasesContainer = document.getElementById('canvases-container')
    canvasesContainer.style.height = (height * gridSize) + 'px'
    canvasesContainer.style.width = (width * gridSize) + 'px'
    document.getElementById('terrain').style.opacity = terrainLabelsOpacity
    document.getElementById('elevation').style.opacity = elevationLabelsOpacity
    document.getElementById('coordinates').style.opacity = coordinatesLabelsOpacity
    document.getElementById('cover').style.opacity = coverLabelsOpacity
    /* ------------------------
            Generate Map
    ------------------------ */
    drawKey('legend', colorData)
    const data = [userInputsArray,specialFeaturesBooleanArray,specialFeaturesMiscData,colorData,specialFeaturesTables,labelsArray]
    if (gridType == 'square') battleMapData = await generateSquareGridBattleMap(data, seed, null, colorData, contexts)
    else if (gridType == 'hex') battleMapData = await generateHexBattleMap(data, seed, null, colorData, contexts)
    /* ---------------------
            Save Map
    --------------------- */
    const battleMap = new BattleMap(
        name,
        battleMapData.tileData,
        gridSize,
        width,
        height,
        biome,
        plane,
        gridType,
        hexOrientation,
        climate,
        season,
        seedText
    )
    cacheBattleMapId(battleMap)
    await saveBattleMap(battleMap)
    const endTime = Date.now()
    const elapsed = endTime - startTime
    const formattedTime = formatMillisecondsToReadable(elapsed)
    console.log("🚀 ~ file: index.js:332 ~ startBabylon ~ formattedTime:", formattedTime)
    makeToast(`Map generated in ${formattedTime}!`, 'success')
    return battleMap
}
/* =======================
        Grid Type
        Functions
======================= */
async function generateSquareGridBattleMap(data, seed, battleMapData, colorData, contexts){
    let sleepTime = false
    const sleepDuration = 1
    const progressElement = document.getElementById('progress')
    const direction = data[0][9]
    const width = data[0][1]
    const height = data[0][2]
    const totalTiles = height * width
    const ctxArray = Object.entries(contexts)
    const ppi = data[0][3]
    ctxArray.forEach(element => {
        const ctx = element[1]
        ctx.canvas.height = height * ppi
        ctx.canvas.width = width * ppi
    });
    let tileData = {}
    let tile
    let currentTile = 0
    if (direction === 1){
        for (var i = 0; i < width; i++) { 
            for (var j = 0; j < height; j++) {
                if (sleepTime) await sleep(sleepDuration)
                let tile = generateTile(data, i, j, seed, colorData, contexts)
                if (tile.image) addImageUsingContext(contexts.images, tile.image, tile.c.x, tile.c.y, IMAGE_SIZE_MODIFIER, ppi, seed)
                fillCenterOutAnimation(contexts.tiles, tile.c.x, tile.c.y, ppi, tile.color, false) // Animation = false b/c it's too slow with big maps
                addLabels(data, i, j, tile, contexts)
                currentTile++
                // updateProgressElement(progressElement, currentTile, totalTiles)
                tileData[`${i},${j}`] = tile
            }
        }
    } else if (direction === 2){ 
        for (var j = 0; j < height; j++) { 
            for (var i = 0; i < width; i++) {
                if (sleepTime) await sleep(sleepDuration)
                let tile = generateTile(data, i, j, seed, colorData, contexts)
                if (tile.image) addImageUsingContext(contexts.images, tile.image, tile.c.x, tile.c.y, IMAGE_SIZE_MODIFIER, ppi, seed)
                fillCenterOutAnimation(contexts.tiles, tile.c.x, tile.c.y, ppi, tile.color, false) // Animation = false b/c it's too slow with big maps
                addLabels(data, i, j, tile, contexts)
                currentTile++
                // updateProgressElement(progressElement, currentTile, totalTiles)
                tileData[`${i},${j}`] = tile
            }
        }
    } else if (direction === 3){
        for (var i = width-1; i > -1; i--) { 
            for (var j = height-1; j > -1; j--) {
                if (sleepTime) await sleep(sleepDuration)
                let tile = generateTile(data, i, j, seed, colorData, contexts)
                if (tile.image) addImageUsingContext(contexts.images, tile.image, tile.c.x, tile.c.y, IMAGE_SIZE_MODIFIER, ppi, seed)
                fillCenterOutAnimation(contexts.tiles, tile.c.x, tile.c.y, ppi, tile.color, false) // Animation = false b/c it's too slow with big maps
                addLabels(data, i, j, tile, contexts)
                currentTile++
                // updateProgressElement(progressElement, currentTile, totalTiles)
                tileData[`${i},${j}`] = tile
            }
        }
    } else if (direction === 4) {
        for (var j = height-1; j > -1; j--) { 
            for (var i = width-1; i > -1; i--) {
                if (sleepTime) await sleep(sleepDuration)
                let tile = generateTile(data, i, j, seed, colorData, contexts)
                if (tile.image) addImageUsingContext(contexts.images, tile.image, tile.c.x, tile.c.y, IMAGE_SIZE_MODIFIER, ppi, seed)
                fillCenterOutAnimation(contexts.tiles, tile.c.x, tile.c.y, ppi, tile.color, false) // Animation = false b/c it's too slow with big maps
                addLabels(data, i, j, tile, contexts)
                currentTile++
                // updateProgressElement(progressElement, currentTile, totalTiles)
                tileData[`${i},${j}`] = tile
            }
        }
    }
    return {tileData: tileData}
}
function generateHexBattleMap(data, seed, battleMapData, colorData, contexts){
    const hexOrientation = document.getElementById('hex-type').value
    const direction = data[0][12]
    const a = PPI / 2 // Edge Length (a)
    const r = Math.sqrt(3) / 2 * a // Apothem (r)
    const R = a // Circumcircle Radius (R)
    const b = Math.sqrt(a**2 - r**2) // b side of the triangle
    // ROWS
    const xOff = a + 1
    const yOff = r + 1
    let x = ((R + b) * i) + xOff
    let y = yOff
    if (i === 0) x = xOff
    if (hexOrientation.includes('even')) {
        if (i === 0 && j > 0) { y = (r * j) + yOff + (r * j) + r } // The first hex in each row after the first row
        else if (i === 0) { y = (y * j) + yOff + r } // The very first hex
        else if ((j > 0) && (i % 2 != 0)) { y = (r * j) + yOff + (r * j) } // Even Tiles after the first row
        else if ((j > 0) && (i % 2 === 0)) { y = (r * (j + 1)) + yOff + (r * j) } // Odd Tile after the first row
        else if (i % 2 != 0) { y = (r * j) + yOff } // Even Tiles in the first row
        else if (i % 2 === 0) { y = (r * (j + 1)) + yOff } // Odd Tiles in the first row
    } else if (hexOrientation.includes('odd')) {
        if (i === 0 && j > 0) { y = (r * j) + yOff + (r * j) } // The first hex in each row after the first row
        else if (i === 0) { y = (y * j) + yOff } // The very first hex
        else if ((j > 0) && (i % 2 === 0)) { y = (r * j) + yOff + (r * j) } // Even Tiles after the first row
        else if ((j > 0) && (i % 2 != 0)) { y = (r * (j + 1)) + yOff + (r * j) } // Odd Tile after the first row
        else if (i % 2 === 0) { y = (r * j) + yOff } // Even Tiles in the first row
        else if (i % 2 != 0) { y = (r * (j + 1)) + yOff } // Odd Tiles in the first row
    }
    let transformedDirection = direction
    if (hexOrientation.includes('row') && direction == 1) transformedDirection = 2
    if (hexOrientation.includes('row') && direction == 2) transformedDirection = 3
    if (hexOrientation.includes('row') && direction == 3) transformedDirection = 4
    if (hexOrientation.includes('row') && direction == 4) transformedDirection = 1
    if (transformedDirection === 1){
        for (var i = 0; i < width; i++) { // Loop through all the tiles on the x axis 
            for (var j = 0; j < height; j++) { // Loop through all tiles on the y axis
                let tile = terrainTile(i, j, seed)

            }
        }
    } else if (transformedDirection === 2){
        for (var j = 0; j < height; j++) { // Loop through all the tiles on the x axis 
            for (var i = 0; i < width; i++) { // Loop through all tiles on the y axis
                let tile = terrainTile(i, j, seed)
            }
        }
    } else if (transformedDirection === 3){
        for (var i = width-1; i > -1; i--) { // Loop through all the tiles on the x axis 
            for (var j = height-1; j > -1; j--) { // Loop through all tiles on the y axis
                let tile = terrainTile(i, j, seed)
            }
        }
    } else {
        for (var j = height-1; j > -1; j--) { // Loop through all the tiles on the x axis 
            for (var i = width-1; i > -1; i--) { // Loop through all tiles on the y axis
                let tile = terrainTile(i, j, seed)
            }
        }
    }
}
/* =======================
          Helper
        Functions
======================= */
function getSeed(seedInputElementId, params){
    let seedInput = document.getElementById(seedInputElementId).value
    let seed = params.reduce((acc, curr) => `${acc}.${curr}`, seedInput)
    return [new Math.seedrandom(seed), seed]
}
function getSeedFromSeedString(seedString){
    return new Math.seedrandom(seedString)
}
function specialFeatureOnBattleMapBoolean(featureProb, seed){
    if (featureProb == 'no') return false
    else if (featureProb == 'yes') return true
    else {
        featureProb = parseFloat(featureProb / 100)
        if (featureProb <= seed()) return true
        else return false
    }
}
function checkForCompatibleDimensionsBoolean(width, height, gridSize){
    const widthDividedByGridSize = ( width * gridSize ) / gridSize // Calculate width / gridSize
    const heightDividedByGridSize = ( height * gridSize ) / gridSize // Calculate height / gridSize
    // Alert user to modulus
    if (heightDividedByGridSize % 1 != 0 || widthDividedByGridSize % 1 != 0) return true
}
function determineDirection(directionOrientation, seed, direction){
    if (direction) return direction
    const rng = seed()
    if (directionOrientation == 'vertical') {
        if (rng <= 0.50) return DIRECTIONS.RIGHT_TO_LEFT
        else if (rng >= 0.51 && rng <= 1.00) return DIRECTIONS.LEFT_TO_RIGHT
    }
    else if (directionOrientation == 'horizontal') {
        if (rng <= 0.50) return DIRECTIONS.TOP_DOWN
        else if (rng >= 0.51 && rng <= 1.00) return DIRECTIONS.BOTTOM_UP
    } 
    else if (directionOrientation == 'random') {
        if (rng <= 0.25) return DIRECTIONS.RIGHT_TO_LEFT
        else if (rng >= 0.26 && rng <= 0.50) return DIRECTIONS.LEFT_TO_RIGHT
        else if (rng >= 0.51 && rng <= 0.75) return DIRECTIONS.TOP_DOWN
        else if (rng >= 0.76 && rng <= 1.00) return DIRECTIONS.BOTTOM_UP
    }
}
function determinePathBeginningCoordinates(direction, height, width, seed){
    const rng = seed()
    if (direction === DIRECTIONS.RIGHT_TO_LEFT || direction === DIRECTIONS.LEFT_TO_RIGHT) return (height - 1) * rng
    else if (direction === DIRECTIONS.TOP_DOWN || direction === DIRECTIONS.BOTTOM_UP) return (width - 1) * rng
}
function cacheBattleMapId(battlMapObject){
    localStorage.setItem('current-battle-map-id', battlMapObject._id)
}
async function saveBattleMap(battleMapJSON){
    await db.bmg_maps.put(battleMapJSON)
        .then(function(){
            const name = (battleMapJSON.name) ? battleMapJSON.name : battleMapJSON.seed
            makeToast(`<b>${name}</b> map saved successfully!`, 'success')
            populateBattleMapHistory()
        }).catch(async function(error) {
            if ((error.name === 'QuotaExceededError') || (error.inner && error.inner.name === 'QuotaExceededError')) {
                const con = confirm("In order to save the battle map that was just generated, three (3) old battle maps must be deleted. This is irreversible.")
                if (con) {
                    let data = await db.bmg_maps.orderBy('datetime').reverse().toArray()
                    data = data.slice(-3)
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];    
                        await db.bmg_maps.delete(element.id)
                    }
                }
            } else {
                console.error(`! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`, `Message: ${error.message}`)
            }
        })
}
function computeHexVariables(PPI){
    const angle = 2 * Math.PI / 2 // Angle of each edge from center
    const a = PPI / 2 // Edge Length (a)
    const d = PPI // Long Diagonal (d)
    const s = Math.sqrt(3) * a // Short Diagonal (s)
    const p = 6 * a // Perimeter (p)
    const A = 3/2 * Math.sqrt(3) * a**2 // Area (A)
    const r = Math.sqrt(3) / 2 * a // Apothem (r)
    const R = a // Circumcircle Radius (R)
    const b = Math.sqrt(a**2 - r**2) // b side of the triangle
    const xOff = a + 1
    const yOff = r + 1
    var x = xOff
    var y = yOff 
    return {angle:angle,a:a,d:d,s:s,p:p,A:A,r:r,R:R,b:b,xOff:xOff,yOff:yOff,x:x,y:y}
}
function getLabelAndTileOpacity(checkboxId, opacityId){
    let opacity
    const hasLabels = document.getElementById(checkboxId).checked
    if (hasLabels) {
        opacity = document.getElementById(opacityId).value
    }
    return opacity
}
function getColumnName(n) {
    let name = '';
    while (n > 0) {
        n--;
        name = String.fromCharCode('A'.charCodeAt(0) + (n % 26)) + name;
        n = Math.floor(n / 26);
    }
    return name;
}
function drawKey(elementID, colorData){ // Function to build the key
    const groundColor = colorData.NORMAL
    const difficult_terrainColor = colorData.DIFFICULT
    const impasseColor = colorData.COVER
    const waterColor = colorData.WATER
    const roughWaterColor = colorData.ROUGH_WATER
    const roadColor = colorData.ROAD
    // Get the element
    var key = document.getElementById(elementID)
    key.classList.remove('hidden')
    // Empty it
    if (key){
        key.innerHTML = ''
        // List of terrain types
        const terrains = ['ground', 'difficult_terrain', 'impasse', 'road', 'water', 'roughWater']
        const terrainColorMap = []
        // Loop through each terrain type
        terrains.forEach(element => {
            const terrainColor = eval(`${element}Color`)
            // Set up Terrain Data div
            const terrainDataDiv = document.createElement('div')
            terrainDataDiv.className = 'terrain-data'
            terrainDataDiv.id = `${element}-container`
            if (element == 'ground') terrainDataDiv.classList.add('active-tool')
            if (element == 'ground') localStorage.setItem('active-tool', 'Ground')
            const terrainColorDiv = document.createElement('div')
            terrainColorDiv.className = 'terrain-color'
            const terrainLabelDiv = document.createElement('div')
            terrainLabelDiv.className = 'terrain-label'
            element = element.replace("_", " ").replace("Water", " Water").toTitleCase()
            terrainLabelDiv.innerText = element
            terrainDataDiv.id = `${element}-container`

            const canvas = document.createElement('canvas')
            canvas.height = 40
            canvas.width = 40
            canvas.id = element
            canvas.addEventListener('click', function(){
                localStorage.setItem('active-tool', element)
                const containers = document.querySelectorAll('.terrain-data')
                for (let index = 0; index < containers.length; index++) {
                    const element = containers[index];
                    element.classList.remove('active-tool')
                }
                const container = document.getElementById(`${element}-container`)
                container.classList.add('active-tool')
            })
            ctx = canvas.getContext('2d')
            ctx.fillStyle = `rgb(${terrainColor})`
            ctx.fillRect(0, 0, 40, 40)

            terrainColorDiv.appendChild(canvas)

            terrainDataDiv.appendChild(terrainColorDiv)
            terrainDataDiv.appendChild(terrainLabelDiv)

            key.appendChild(terrainDataDiv)

            terrainColorMap.push({
                "TERRAIN": element,
                "COLOR": terrainColor
            })
            localStorage.setItem('key-colors', JSON.stringify(terrainColorMap))
        });
    }
}
function updateProgressElement(element, currentTile, totalTiles){
    element.innerText = `Processing Tile... ${currentTile} / ${totalTiles.toLocaleString()} (${parseInt((currentTile / totalTiles) * 100)}%)`
}