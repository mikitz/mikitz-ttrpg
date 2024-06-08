class Wall {
    // Only input is the coordinates -- [x1, y1, x2, y2]
    constructor(c) {
        this._id = genId();
        this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
        this.light = WALL_SENSE_TYPES.NORMAL;
        this.move = WALL_SENSE_TYPES.NORMAL;
        this.sight = WALL_SENSE_TYPES.NORMAL;
        this.sound = WALL_SENSE_TYPES.NORMAL;
        this.dir = WALL_DIRECTIONS.BOTH;
        this.door = WALL_DOOR_TYPES.NONE;
        this.ds = WALL_DOOR_STATES.CLOSED;
        this.flags = {};
    }
}
class TerrainWall {
    // Only input is the coordinates -- [x1, y1, x2, y2]
    constructor(c) {
        this._id = genId();
        this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
        this.light = WALL_SENSE_TYPES.LIMITED;
        this.move = WALL_SENSE_TYPES.NORMAL;
        this.sight = WALL_SENSE_TYPES.LIMITED;
        this.sound = WALL_SENSE_TYPES.LIMITED;
        this.dir = WALL_DIRECTIONS.BOTH;
        this.door = WALL_DOOR_TYPES.NONE;
        this.ds = WALL_DOOR_STATES.CLOSED;
        this.flags = {};
    }
}
class InvisibleWall {
    // Only input is the  coordinates -- [x1, y1, x2, y2]
    constructor(c) {
        this._id = genId();
        this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
        this.light = WALL_SENSE_TYPES.NONE;
        this.move = WALL_SENSE_TYPES.NORMAL;
        this.sight = WALL_SENSE_TYPES.NONE;
        this.sound = WALL_SENSE_TYPES.NONE;
        this.dir = WALL_DIRECTIONS.BOTH;
        this.door = WALL_DOOR_TYPES.NONE;
        this.ds = WALL_DOOR_STATES.CLOSED;
        this.flags = {};
    }
}
class EtherealWall {
    // Only input is the coordinates -- [x1, y1, x2, y2]
    constructor(c) {
        this._id = genId();
        this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
        this.light = WALL_SENSE_TYPES.NORMAL;
        this.move = WALL_SENSE_TYPES.NONE;
        this.sight = WALL_SENSE_TYPES.NORMAL;
        this.sound = WALL_SENSE_TYPES.NONE;
        this.dir = WALL_DIRECTIONS.BOTH;
        this.door = WALL_DOOR_TYPES.NONE;
        this.ds = WALL_DOOR_STATES.CLOSED;
        this.flags = {};
    }
}
class Door {
    // Only input is the coordinates -- [x1, y1, x2, y2]
    constructor(c) {
        this._id = genId();
        this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
        this.light = WALL_SENSE_TYPES.NORMAL;
        this.move = WALL_SENSE_TYPES.NORMAL;
        this.sight = WALL_SENSE_TYPES.NORMAL;
        this.sound = WALL_SENSE_TYPES.NORMAL;
        this.dir = WALL_DIRECTIONS.BOTH;
        this.door = WALL_DOOR_TYPES.DOOR;
        this.ds = WALL_DOOR_STATES.CLOSED;
        this.flags = {};
    }
}
class SecretDoor {
    // Only input is the coordinates -- [x1, y1, x2, y2]
    constructor(c) {
        this._id = genId();
        this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
        this.light = WALL_SENSE_TYPES.NORMAL;
        this.move = WALL_SENSE_TYPES.NORMAL;
        this.sight = WALL_SENSE_TYPES.NORMAL;
        this.sound = WALL_SENSE_TYPES.NORMAL;
        this.dir = WALL_DIRECTIONS.BOTH;
        this.door = WALL_DOOR_TYPES.SECRET;
        this.ds = WALL_DOOR_STATES.CLOSED;
        this.flags = {};
    }
}
class Tile {
    constructor(
        coords,
        classification,
        elevation,
        type,
        imageName,
        color,
        coverTier
    ) {
        this._id = genId();
        this.c = coords; // [x,y,z]
        this.classification = classification; // TERRAIN_CLASSIFICATIONS | NORMAL: 0, DIFFICULT: 1, IMPASSE: 2
        this.elevation = elevation; // Integer
        this.type = type;
        this.image = imageName;
        this.color = color; // "51,51,51"
        this.cover_tier = coverTier;
    }
}
class BattleMap {
    constructor(
        name,
        tileData,
        ppi,
        width,
        height,
        biome,
        plane,
        gridType,
        hexOrientation,
        climate,
        season,
        seed,
        wallsUvtt,
        wallsFvtt
    ) {
        this._id = genId();
        this.name = name;
        this.td = tileData;
        this.dt = new Date();
        this.ppi = ppi;
        this.w = width;
        this.h = height;
        this.biome = biome;
        this.plane = plane;
        this.grid_type = gridType;
        this.hex_orientation = hexOrientation;
        this.climate = climate;
        this.season = season;
        this.seed = seed;
        this.wallsUvtt = wallsUvtt;
        this.wallsFvtt = wallsFvtt;
    }
}
