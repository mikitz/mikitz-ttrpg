function generateTile(data, i, j, seed, colorData, contexts){
    const hasCliffs = data[1][0]
    const hasHills = data[1][1]
    const elevationCanvas = contexts.elevation

    tile = terrainTile(data, i, j, seed, colorData)

    if (hasCliffs) tile = cliffTile(tile, elevationCanvas)
    if (hasHills) tile = hillTile(tile, elevationCanvas)
    
    return tile
}
function terrainTile(data, i, j, seed, colorData){
    let elevation = 0
    let coverType = null
    const ppi = data[0][3]
    // Tile Terrain Classification : NORMAL, DIFFICULT, COVER
    const tableTerrainClassification = data[4][4]
    const tileTerrainClassificationRng = getRandomNumberFromSeed(seed)
    let tileTerrainClassification = rollSeedRollableObject(tableTerrainClassification, tileTerrainClassificationRng)
    // Tile Terrain Type | Based on Tile Terrain Classification : too many to list 
    const tableTerrain = data[4][2]
    const tableDiffTerrain = data[4][1]
    let tileTerrainType
    const tileTerrainTypeRng = getRandomNumberFromSeed(seed)
    if (tileTerrainClassification == "NORMAL") tileTerrainType = rollSeedRollableObject(tableTerrain, tileTerrainTypeRng)
    else if (tileTerrainClassification == "DIFFICULT") tileTerrainType = rollSeedRollableObject(tableDiffTerrain, tileTerrainTypeRng)
    // Color | Based on Tile Terrain Type : NORMAL, DIFFICULT, COVER
    let tileColor = colorData[tileTerrainClassification]
    // Image | Based on Tile Terrain Type == COVER
    let tileImage = null
    let coverTier = null
    if (tileTerrainClassification == "COVER") {
        const tableCoverTier = data[4][3]
        const tableCover = data[4][0]
        // const imageRng = getRandomNumberFromSeed(seed) // TODO: Randomize the image number
        const imgNum = 1
        const coverRng = getRandomNumberFromSeed(seed)
        tileTerrainType = rollSeedRollableObject(tableCover, coverRng)
        const coverTierRng = getRandomNumberFromSeed(seed)
        coverTier = rollSeedRollableObject(tableCoverTier, coverTierRng)
        tileImage = `/mikitz-ttrpg/img/battle-map-generator/${tileTerrainType.toLowerCase()}-${imgNum}-${coverTier.replace("/","-")}.svg`
    }

    return new Tile(
        {x: i * ppi, y: j * ppi},
        tileTerrainClassification,
        elevation,
        tileTerrainType,
        tileImage,
        tileColor,
        coverTier
    )
}
/* =====================
        Special
         Tiles
===================== */
function cliffTile(tile, elevationCanvas){
    return tile
}
function hillTile(tile, elevationCanvas){
    return tile
}
/* =======================
        Canvas
======================= */
function fillCenterOutAnimation(ctx, x, y, ppi, tileColor, isAnimated, tileOpacity) {
    tileOpacity = (!tileOpacity) ? 1.0 : tileOpacity
    var size = 0
    var maxSize = ppi
    var growthRate = (isAnimated == true) ? ppi / 30 : ppi * 2
    function animate() {
        ctx.clearRect(x, y, maxSize, maxSize)
        size += growthRate
        if (size > maxSize) size = maxSize
        ctx.fillStyle = `rgba(${tileColor},${tileOpacity})`
        var topLeftX = x + (maxSize - size) / 2
        var topLeftY = y + (maxSize - size) / 2
        ctx.fillRect(topLeftX, topLeftY, size, size)
        if (size < maxSize) requestAnimationFrame(animate)
    }
    animate()
}
function drawTile(x, y, gridType){
    if (gridType == 'square') {
        
    } else if (gridType == 'hex') {

    }
}
function addImageUsingContext(ctx, imageSRC, x, y, sizeMod, ppi, seed){ 
    const rng = seed();
    x += ppi * 0.05;
    y += ppi * 0.05;
    var img = new Image();
    img.src = imageSRC;
    img.onload = function() { 
        let randomRotation = 2 * Math.PI * rng; // Convert to radians for ctx.rotate
        ctx.translate(x + ppi * sizeMod / 2, y + ppi * sizeMod / 2);
        ctx.rotate(randomRotation);
        ctx.drawImage(img, -ppi * sizeMod / 2, -ppi * sizeMod / 2, ppi * sizeMod, ppi * sizeMod);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
/* =======================
        Labels
======================= */
function addLabelSquareGrid(labelName, textToDisplay, textOpacity, x, y, ppi, ctx, tileClassification){
    if (textOpacity) ctx.canvas.style.display = 'block'
    if (!textOpacity) ctx.canvas.style.display = 'none'
    textOpacity = 1.0

    let fontSizeModifier = 0.1
    if (labelName == 'terrain') fontSizeModifier = 0.15
    if (labelName == 'coordinates') fontSizeModifier = 0.30

    let xModifier
    if (labelName == 'terrain') xModifier = ppi * 0.50
    if (labelName == 'elevation') xModifier = ppi * 0.15
    if (labelName == 'coordinates') xModifier = ppi * 0.50
    if (labelName == 'cover') xModifier = ppi * 0.85

    let yModifier
    if (labelName == 'terrain') yModifier = ppi * 0.95
    if (labelName == 'elevation') yModifier = ppi * 0.15
    if (labelName == 'coordinates') yModifier = ppi * 0.60
    if (labelName == 'cover') yModifier = ppi * 0.15

    const textColorRgb = (tileClassification == 'COVER') ? '255,255,255' : '0,0,0'
    ctx.fillStyle = `rgba(${textColorRgb},${textOpacity})`
    ctx.textAlign = `center`
    ctx.font = `${ppi * fontSizeModifier}px Comic Sans MS`
    if (textToDisplay || typeof textToDisplay === 'number' && !isNaN(textToDisplay)) ctx.fillText(textToDisplay, x + xModifier, y + yModifier)
}
function addLabelHexGrid(labelName, textToDisplay, x, y, ctx, hexOrientation){
    let xModifier
    if (labelName == 'terrain') xModifier = 0
    if (labelName == 'elevation') xModifier = 0
    if (labelName == 'coordinates') xModifier = 0
    if (labelName == 'cover') xModifier = 0
    let yModifier
    if (labelName == 'terrain') yModifier = 0
    if (labelName == 'elevation') yModifier = 0
    if (labelName == 'coordinates') yModifier = 0
    if (labelName == 'cover') yModifier = 0
}
function addLabels(data, i, j, tile, contexts, hexOrientation, modifyLabels){
    console.log("🚀 ~ file: tiles.js:149 ~ addLabels ~ modifyLabels:", modifyLabels)
    let terrainLabelsOpacity
    let coordinatesLabelsOpacity
    let coverLabelsOpacity
    let elevationLabelsOpacity
    let ppi
    if (!modifyLabels) {
        terrainLabelsOpacity = parseFloat(data[5][0])
        coordinatesLabelsOpacity = parseFloat(data[5][1])
        coverLabelsOpacity = parseFloat(data[5][2])
        elevationLabelsOpacity = parseFloat(data[5][3])
        ppi = data[0][3]
    } 
    else {
        terrainLabelsOpacity = parseFloat(document.getElementById('terrain-opacity-input').value)
        coordinatesLabelsOpacity = parseFloat(document.getElementById('coordinates-opacity-input').value)
        coverLabelsOpacity = parseFloat(document.getElementById('cover-opacity-input').value)
        elevationLabelsOpacity = parseFloat(document.getElementById('elevation-opacity-input').value)
        ppi = modifyLabels
    }
    if (!hexOrientation){
        addLabelSquareGrid('terrain', tile.type, terrainLabelsOpacity, tile.c.x, tile.c.y, ppi, contexts.terrain, tile.classification) 
        addLabelSquareGrid('coordinates', `${getColumnName(i + 1)}${j+1}`, coordinatesLabelsOpacity, tile.c.x, tile.c.y, ppi, contexts.coordinates, tile.classification) 
        addLabelSquareGrid('cover', tile.cover_tier, coverLabelsOpacity, tile.c.x, tile.c.y, ppi, contexts.cover, tile.classification) 
        addLabelSquareGrid('elevation', tile.elevation, elevationLabelsOpacity, tile.c.x, tile.c.y, ppi, contexts.elevation, tile.classification)
    } else if (hexOrientation.includes('row')){

    } else if (hexOrientation.includes('column')){

    }
}