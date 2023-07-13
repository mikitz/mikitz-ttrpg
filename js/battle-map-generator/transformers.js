async function transformBattleMap(vector){
    const canvases = document.getElementsByName('canvas')
    const contexts = {}
    for (let index = 0; index < canvases.length; index++) {
        const element = canvases[index];
        const ctx = element.getContext('2d')
        contexts[element.id] = ctx
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    const battleMapData = await db.bmg_maps.get(localStorage.getItem('current-battle-map-id'))
    const map = battleMapData.td
    const ppi = battleMapData.ppi
    let seed = getSeed('seed', [battleMapData.biome,battleMapData.landform,battleMapData.plane,battleMapData.climate,battleMapData.season,battleMapData.w,battleMapData.h])
    seed = seed[0]
    
    let xPixels, yPixels
    let xTile, yTile
    let newTiles = {}
    for (let key in map) {
        let [x, y] = key.split(",").map(Number);
        let tile = map[`${x},${y}`]
        if (vector == 'right'){
            xPixels = ((battleMapData.h - y) * ppi ) - ppi
            yPixels = x * ppi
            xTile = battleMapData.h - y - 1
            yTile = x
        }
        else if (vector == 'left') {
            xPixels = y * ppi
            yPixels = ((battleMapData.w - x) * ppi ) - ppi
            xTile = y
            yTile = battleMapData.w - x - 1
        }
        else if (vector == 'horizontal') {
            xPixels = ((battleMapData.w - x) * ppi ) - ppi
            yPixels = y * ppi
            xTile = battleMapData.w - x - 1
            yTile = y
        } 
        else if (vector == 'vertical') {
            xPixels = x * ppi
            yPixels = ((battleMapData.h - y) * ppi ) - ppi
            xTile = x
            yTile = battleMapData.h - y - 1
        }
        tile.c.x = xPixels
        tile.c.y = yPixels
        newTiles[`${xTile},${yTile}`] = tile
        if (tile.image) addImageUsingContext(contexts.images, tile.image, xPixels, yPixels, IMAGE_SIZE_MODIFIER, ppi, seed)
        fillCenterOutAnimation(contexts.tiles, xPixels, yPixels, ppi, tile.color, false) // Animation = false b/c it's too slow with big maps
        addLabels(null, xTile, yTile, tile, contexts, false, ppi)
    }
    battleMapData.td = newTiles
    await db.bmg_maps.put(battleMapData, battleMapData._id)
}