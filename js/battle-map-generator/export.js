function mergeCanvases(arrayOfCanvasIds) {
    const canvasses = []; // Create an empty array in which to store all the canvas elements
    const canvas = document.createElement("canvas"); // Create a dummy canvas on which to write all the canvas data
    const ctx = canvas.getContext("2d");

    arrayOfCanvasIds.forEach((element) => {
        canvasses.push(document.getElementById(element));
    });
    canvas.width = canvasses[0].width;
    canvas.height = canvasses[0].height;

    canvasses.forEach((canvas) => {
        const opacity = getOpacity(canvas);
        console.log(
            "🚀 ~ file: export.js:24 ~ exportCanvases ~ opacity:",
            opacity
        );
        ctx.globalAlpha = opacity; // Set the opacity for this layer
        ctx.drawImage(canvas, 0, 0); // Draw every canvas on the dummy canvas
    });
    return canvas;
}
async function exportCanvas(canvas, filetype) {
    // Function to export canvas by canvas ID or canvas element
    const canvasTemp =
        typeof canvas === "string" || canvas instanceof String
            ? document.getElementById(canvas)
            : canvas;
    if (isCanvasBlank(canvasTemp)) return alert("Please generate a map first.");
    let data = await db.bmg_maps.orderBy("dt").reverse().toArray();
    const name = data[0].name;
    // EXPORT
    const link = document.createElement("a"); // Create new link
    link.download = `${name}.${filetype}`; // Set up the file name
    link.href = canvasTemp.toDataURL(`image/${filetype}`); // Grab the canvas image data
    link.click(); // Click the link to export
}
function getOpacity(canvas) {
    let opacity = canvas.style.opacity;
    const display = canvas.style.display;
    if (opacity == "" && display == "none") return 0;
    else if (opacity == "" && display != "none") return 1.0;
    else return opacity;
}
function convertJsonToFoundryVTT(JSON, mergedCanvas) {
    // Function to build a FoundryVTT Scene JSON from JSON
    function getFoundryVttGridType(data) {
        const gridType = data.GRID;
        const hexOrientation = data.HEX_ORIENTATION;
        let foundryGridType;
        if (gridType == "square") return (foundryGridType = 1);
        if (gridType == "hex" && hexOrientation == "column-even")
            return (foundryGridType = 5);
        if (gridType == "hex" && hexOrientation == "row-even")
            return (foundryGridType = 3);
        if (gridType == "hex" && hexOrientation == "column-odd")
            return (foundryGridType = 4);
        if (gridType == "hex" && hexOrientation == "row-odd")
            return (foundryGridType = 2);
    }
    if (!JSON) return alert("Please generate a map first.");
    const canvas = document.getElementById("tiles");
    if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
    const imageString = mergedCanvas
        .toDataURL("image/webp")
        .split(";base64,")[1];
    if (!imageString) return alert("Please generate a map first.");
    const width = JSON.WIDTH * JSON.PPI;
    const height = JSON.HEIGHT * JSON.PPI;
    const padding = 0;
    const worldName = localStorage.getItem("world-name");
    // Update FVTT
    const FVTT = {
        name: JSON.name, // Set the Name
        navigation: true,
        navOrder: 0,
        navName: "",
        img: `/worlds/${worldName}/${JSON.NAME}.webp`, //  imageString, // Set the Image
        foreground: null,
        thumb: null,
        width: width, // + (width * padding), // Set the Width
        height: height, // + (height * padding), // Set the Height
        padding: padding,
        initial: null,
        backgroundColor: "#999999",
        gridType: getFoundryVttGridType(JSON), // Set the Grid Type
        grid: JSON.PPI, // Set the Grid Size
        shiftX: 0,
        shiftY: 0,
        gridColor: "#000000",
        gridAlpha: 0.2,
        gridDistance: 5,
        gridUnits: "ft",
        tokenVision: true,
        fogExploration: true,
        fogReset: 1657809433087,
        globalLight: false,
        globalLightThreshold: null,
        darkness: 0,
        drawings: [],
        tokens: [],
        lights: [], // "lights": JSON.LIGHTS | For the future
        notes: [],
        sounds: [],
        templates: [],
        tiles: [],
        walls: JSON.WALLS_FVTT,
        playlist: null,
        playlistSound: null,
        journal: null,
        weather: "",
        flags: {},
    };
    return FVTT;
}
function exportJsonToFvtt(JSONobj, name) {
    // Function to export as FVTT
    if (!JSONobj) return alert("Please generate a map first.");
    if (JSONobj.ppi < 50)
        return alert("FoundryVTT does not support a grid size less than 50!");

    var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(JSONobj));

    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `(FoundryVTT) ${name}.json`);
    dlAnchorElem.click();
}
function convertJsonToUvtt(JSON, mergedCanvas) {
    // Function to build UVTT from JSON
    if (!JSON) return alert("Please generate a map first.");
    const canvas = document.getElementById("tiles");
    if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
    // Set up the UVTT object
    // Note that all positions and sizes are in the unit of Tiles.
    // https://arkenforge.com/universal-vtt-files/
    const UVTT = {
        software: "Mikitz' Battle Map Generator",
        creator: "Mikitz",
        format: 1.0,
        resolution: {
            map_origin: {
                x: 0, // X coordinate where the map starts
                y: 0, // Y coordinate where the map starts
            },
            map_size: {
                x: 0, // The width of the map in Tiles
                y: 0, // The height of the map in Tiles
            },
            pixels_per_grid: 120, // The number of pixels per Tile side
        },
        line_of_sight: [], // This is for Walls in FoundryVTT
        objects_line_of_sight: [], // This is for Walls in FoundryVTT
        portals: [
            // This is for Invisible Walls in FoundryVTT, but a Door icon is added, thus making it interactable... this is strange
            // {
            //     position: {
            //         x: 1,
            //         y: 2
            //     },
            //     bounds: [
            //         {
            //             x: 1,
            //             y: 1
            //         },
            //         {
            //             x: 2,
            //             y: 2
            //         }
            //     ],
            //     rotation: 0.00, // Float | in radians
            //     closed: false, // Boolean |
            //     freestanding: false // Boolean |
            // }
        ],
        environment: {
            baked_lighting: false, // Boolean | Is lighting baked into this image?
            ambient_light: null, // Hex color code | Ambient lighting colour to apply over the entire scene
        },
        lights: [
            // This is for Light Sources in FoundryVTT
            // {
            //     position: {
            //         x: 6.5,
            //         y: 2
            //     },
            //     range: 4.5,
            //     intensity: 20.0,
            //     color: "ff563D00",
            //     shadows: true
            // }
        ],
        image: "", // base64-encoded PNG or WEBP
    };
    // Get base64-encoded PNG
    const imageString = mergedCanvas
        .toDataURL("image/webp")
        .split(";base64,")[1];
    if (!imageString) return alert("Please generate a map first.");
    // Update UVTT
    UVTT.resolution.map_size.x = JSON.WIDTH;
    UVTT.resolution.map_size.y = JSON.HEIGHT;
    UVTT.resolution.pixels_per_grid = JSON.PPI;
    UVTT.objects_line_of_sight = JSON.WALLS_UVTT;
    UVTT.image = imageString;
    return UVTT;
}
function exportToJson(JSONobj) {
    // Function to export the currently viewed map as a JSON
    if (!JSONobj) return alert("Please generate a map first.");
    const canvas = document.getElementById("tiles");
    if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
    const name = JSONobj.name;
    var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(JSONobj));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${name}.json`);
    dlAnchorElem.click();
}
function exportToUvtt(JSONobj, name) {
    // Function to export the currently viewed map as a UVTT file
    if (!JSONobj) return alert("Please generate a map first.");
    const canvas = document.getElementById("tiles");
    if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
    var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(JSONobj));

    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${name}.uvtt`);
    dlAnchorElem.click();
}
function exportSeedUrl() {
    const seed = document.getElementById("seed").value;
    const biome = document.getElementById("biome").value;
    const landform = document.getElementById("form").value;
    const plane = document.getElementById("plane").value;
    const climate = document.getElementById("climate").value;
    const season = document.getElementById("season").value;
    const width = parseInt(document.getElementById("width-input").value);
    const height = parseInt(document.getElementById("height-input").value);
    let seedText = getSeed("seed", [
        biome,
        landform,
        plane,
        climate,
        season,
        width,
        height,
    ])[1];
    let url = `https://mikitz.github.io/mikitz-ttrpg/html/pages/battle-map-generator.html?seed=${seedText}`;
    copyToClipboard(url, true);
}
