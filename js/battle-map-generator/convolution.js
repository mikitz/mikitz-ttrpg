function addRiver(riverData, tileData, colorData, contexts, ppi, data){
    const direction = data[0][9]
    const xStart = riverData.beginRiver.x
    const yStart = riverData.beginRiver.y
    const riverWidth = riverData.riverWidth
    const riverHeight = riverData.riverHeight
    const ctxImages = contexts.images
    const ctxElevation = contexts.elevation
    const ctxTerrain = contexts.terrain
    const ctxCover = contexts.cover

    if (direction === DIRECTIONS.VERTICAL_BOTTOM_RIGHT_TO_TOP_LEFT || 
        direction === DIRECTIONS.VERTICAL_TOP_LEFT_TO_BOTTOM_RIGHT) {
            for (let x = xStart; x < riverWidth + xStart; x++) {
                for (let y = 0; y < riverHeight; y++) {
                    const tile = (tileData[`${x},${y}`]) ? tileData[`${x},${y}`] : null
                    if (!tile) continue
                    tile.classification = ''
                    tile.color = colorData.WATER
                    tile.cover_tier = null
                    tile.elevation = 0
                    tile.image = null
                    tile.type = ''
                    tileData[`${x},${y}`] = tile
                    ctxImages.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    fillCenterOutAnimation(contexts.tiles, tile.c.x, tile.c.y, ppi, tile.color, false)
                    ctxCover.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    ctxElevation.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    ctxTerrain.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    addLabels(data, x, y, tile, contexts)
                }
            }
    } 
    else if (direction === DIRECTIONS.HORIZONTAL_BOTTOM_RIGHT_TO_TOP_LEFT || 
        direction === DIRECTIONS.HORIZONTAL_TOP_LEFT_TO_BOTTOM_RIGHT) {
            for (let x = 0; x < riverHeight; x++) {
                for (let y = xStart; y < riverWidth + xStart; y++) {
                    const tile = (tileData[`${x},${y}`]) ? tileData[`${x},${y}`] : null
                    if (!tile) continue
                    tile.classification = ''
                    tile.color = colorData.WATER
                    tile.cover_tier = null
                    tile.elevation = 0
                    tile.image = null
                    tile.type = ''
                    tileData[`${x},${y}`] = tile
                    ctxImages.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    fillCenterOutAnimation(contexts.tiles, tile.c.x, tile.c.y, ppi, tile.color, false)
                    ctxCover.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    ctxElevation.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    ctxTerrain.clearRect(tile.c.x, tile.c.y, ppi, ppi)
                    addLabels(data, x, y, tile, contexts)
                }
            }
    }
    return tileData
}
function addRoad(roadData){

}
function addPond(pondData){

}
function addLake(lakeData){

}
