// ========= Listeners ==========
function setupAllListeners() {
    async function setupFeatures() {
        // Function to setup Features
        const biome = document.getElementById("biome").value;
        const BIOME = biome.toUpperCase();
        const form = document.getElementById("form").value;
        const FORM = biome.toUpperCase();
        // Data
        const tableBiomeFeatures = await db.bmg_biome_features.toArray();
        // Filter Data
        const cliffsProb = tableBiomeFeatures.find((i) => i.BIOME === BIOME)[
            "CLIFFS"
        ];
        const hillsProb = tableBiomeFeatures.find((i) => i.BIOME === BIOME)[
            "HILLS"
        ];
        const lakeProb = tableBiomeFeatures.find((i) => i.BIOME === BIOME)[
            "LAKE"
        ];
        const pondProb = tableBiomeFeatures.find((i) => i.BIOME === BIOME)[
            "POND"
        ];
        const riverProb = tableBiomeFeatures.find((i) => i.BIOME === BIOME)[
            "RIVER"
        ];
        const roadProb = tableBiomeFeatures.find((i) => i.BIOME === BIOME)[
            "ROAD"
        ];
        // Update DOM
        // document.getElementById('cliff-random').value = cliffsProb
        // document.getElementById('hill-random').value = hillsProb
        document.getElementById("lake-random").value = lakeProb;
        document.getElementById("pond-random").value = pondProb;
        document.getElementById("river-random").value = riverProb;
        document.getElementById("road-random").value = roadProb;
    }
    function calculateResolution() {
        let width = parseInt(document.getElementById("width-input").value); // Get the width
        let height = parseInt(document.getElementById("height-input").value); // Get the height
        let PPI = parseInt(document.getElementById("grid-size").value); // Get the PPI
        const grid = getSelectedValueFromRadioGroup("grid-type");
        // CALCULATIONS
        const widthDividedPPI = (width * PPI) / PPI; // Calculate width / PPI
        const heightDividedPPI = (height * PPI) / PPI; // Calcuate height / PPI
        if (heightDividedPPI % 1 != 0 || widthDividedPPI % 1 != 0) {
            // Alert user to modulus
            document.getElementById("image_size").innerHTML = ""; // Empty the element's HTML
            document.getElementById(
                "image_size"
            ).innerHTML = `<b>Output Resolution:</b> <i>Invalid Dimensions: <br> Width / PPT = ${widthDividedPPI} <br> Height / PPT = ${heightDividedPPI} <br> At least one of these quotients is not a whole number. Please ensure that each of these quotients is a whole number, I.E. no decimal places.</i>`;
            return;
        }
        if (grid === "square") {
            var w = width * PPI;
            var h = height * PPI;
        } else {
            const angle = (2 * Math.PI) / 2; // Angle of each edge from center
            const a = PPI / 2; // Edge Length (a)
            const d = PPI; // Long Diagonal (d)
            const s = Math.sqrt(3) * a; // Short Diagonal (s)
            const p = 6 * a; // Perimeter (p)
            const A = (3 / 2) * Math.sqrt(3) * a ** 2; // Area (A)
            const r = (Math.sqrt(3) / 2) * a; // Apothem (r)
            const R = a; // Circumcircle Radius (R)
            const b = Math.sqrt(a ** 2 - r ** 2); // b side of the triangle
            // CANVAS
            const hexOrientation = document.getElementById("hex-type").value; // Get Hex Orientation
            if (hexOrientation.includes("column")) {
                var h = parseInt(height * (r * 2) + r + 2); // Set canvas height
                var w = parseInt(width * (a + b) + b + 2); // Set canvas width
            } else {
                var w = parseInt(height * (r * 2) + r + 2); // Set canvas height
                var h = parseInt(width * (a + b) + b + 2); // Set canvas width
            }
        }
        const totalPixels = (h * w).toLocaleString();
        const tiles = (height * width).toLocaleString();
        // OUTPUT
        // Get Elements
        const heightInPixelsSpan = document.getElementById("height-pixels");
        const widthInPixelsSpan = document.getElementById("width-pixels");
        const totalTilesSpan = document.getElementById("total-tiles");
        const totalPixelsSpan = document.getElementById("total-pixels");
        // Update Elements
        heightInPixelsSpan.innerHTML = `${h.toLocaleString()} <span style="font-size: smaller;">pixels</span>`;
        widthInPixelsSpan.innerHTML = `${w.toLocaleString()} <span style="font-size: smaller;">pixels</span>`;
        totalTilesSpan.innerText = tiles;
        totalPixelsSpan.innerText = totalPixels;
    }
    calculateResolution();
    setupFeatures();
    document.getElementById("seed").value = randomWordSlug();
    const toggleDisplayElements = document.getElementsByName("toggle-display");
    toggleDisplayElements.forEach((element) => {
        element.addEventListener("click", function () {
            toggleNextChildDisplay(this);
        });
    });
    // Attributes Listeners
    // document.getElementById('json-input').addEventListener('change', function() { loadJsonToCanvas() })
    // Dimensions Listeners
    const elements = document.getElementsByName("resolution");
    elements.forEach((element) => {
        element.addEventListener("input", function () {
            calculateResolution();
        });
    });
    // Environment Listeners
    const biomeSelect = document.getElementById("biome");
    biomeSelect.addEventListener("change", function () {
        setupTerrain();
        setupFeatures();
    });
    // Grid Listeners
    // Grid Type listener
    const gridTypeRadio = document.getElementsByName("grid-type");
    const select = document.getElementById("hex-type");
    gridTypeRadio.forEach((element) => {
        element.addEventListener("input", function () {
            // Display the Hex-Type select
            const gridType = getSelectedValueFromRadioGroup("grid-type");
            if (gridType == "square") select.style.display = "none";
            else if (gridType == "hex") select.style.display = "block";
            // Redraw the battle map
            const mapName = JSON.parse(
                localStorage.getItem("currently-viewing-map-json")
            );
            redrawCanvasLabels(mapName);
        });
    });
    // Grid Lines listener
    // const gridLinesCheckbox = document.getElementById('grid lines-labels-checkbox')
    // gridLinesCheckbox.addEventListener('change', function() {
    //     const isChecked = this.checked
    //     const lineWidthSelect = document.getElementById('line-width')
    //     const lineWidthLabel = document.getElementById('line-width-label')
    //     if (isChecked) {
    //         lineWidthLabel.style.display = 'block'
    //         lineWidthSelect.style.display = 'block'
    //     } else {
    //         lineWidthLabel.style.display = 'none'
    //         lineWidthSelect.style.display = 'none'
    //     }
    //     // Redraw the battle map
    //     const mapName = document.getElementById('map-history-dropdown').value
    //     redrawCanvasLabels(mapName)
    //     // Line Width
    //     try { document.getElementById('line-width').addEventListener('change', function(){
    //             const mapName = document.getElementById('map-history-dropdown').value
    //             redrawCanvasLabels(mapName)
    //         })
    //     } catch (error) { console.error(" line-width Listener | Grid not visible:", error) }
    // })
    // Hex Type listener
    const hexTypeSelect = document.getElementById("hex-type");
    hexTypeSelect.addEventListener("change", async function () {
        // Redraw the battle map
        const currentBattleMapId = localStorage.getItem(
            "current-battle-map-id"
        );
        const mapName = await db.bmg_maps.get(currentBattleMapId);
        redrawCanvasLabels(mapName);
    });
    // TV Listeners
    const tvResSelect = document.getElementById("tv-res");
    tvResSelect.addEventListener(
        "change",
        setBattleMapPropertiesFromTvProperties
    );

    const tvSizeInput = document.getElementById("tv-size-inches-input");
    tvSizeInput.addEventListener(
        "input",
        setBattleMapPropertiesFromTvProperties
    );
    // Button Listeners
    // document.getElementById('clear-canvas').addEventListener('click', function() { clearCanvas('battle-map') })
    document
        .getElementById("export-webp")
        .addEventListener("click", async function () {
            const canvases = [
                "tiles",
                "images",
                "terrain",
                "elevation",
                "coordinates",
                "cover",
            ];
            const canvas = mergeCanvases(canvases);
            await exportCanvas(canvas, "webp");
        });
    document
        .getElementById("export-png")
        .addEventListener("click", async function () {
            const canvases = [
                "tiles",
                "images",
                "terrain",
                "elevation",
                "coordinates",
                "cover",
            ];
            const canvas = mergeCanvases(canvases);
            await exportCanvas(canvas, "png");
        });
    document
        .getElementById("export-json")
        .addEventListener("click", async function () {
            const canvases = [
                "tiles",
                "images",
                "terrain",
                "elevation",
                "coordinates",
                "cover",
            ];
            const canvas = mergeCanvases(canvases);
            const currentBattleMapId = localStorage.getItem(
                "current-battle-map-id"
            );
            const currentBattleMap = await db.bmg_maps.get(currentBattleMapId);
            exportToJson(currentBattleMap);
        });
    document
        .getElementById("export-uvtt")
        .addEventListener("click", async function () {
            const canvases = [
                "tiles",
                "images",
                "terrain",
                "elevation",
                "coordinates",
                "cover",
            ];
            const canvas = mergeCanvases(canvases);
            const currentBattleMapId = localStorage.getItem(
                "current-battle-map-id"
            );
            let currentBattleMap = await db.bmg_maps.get(currentBattleMapId);
            const name = currentBattleMap.name;
            currentBattleMap = convertJsonToUvtt(currentBattleMap, canvas);
            exportToUvtt(currentBattleMap, name);
        });
    document
        .getElementById("export-fvtt")
        .addEventListener("click", async function () {
            const ppi = parseInt(document.getElementById("grid-size").value);
            if (ppi < 50)
                return alert(
                    "FoundryVTT does not support a grid size less than 50!"
                );
            let canvas = document.getElementById("tiles");
            if (isCanvasBlank(canvas))
                return alert("Please generate a map first.");
            const canvases = [
                "tiles",
                "images",
                "terrain",
                "elevation",
                "coordinates",
                "cover",
            ];
            canvas = mergeCanvases(canvases);
            console.log("🚀 ~ canvas:", canvas);
            const currentBattleMapId = localStorage.getItem(
                "current-battle-map-id"
            );
            let currentBattleMap = await db.bmg_maps.get(currentBattleMapId);
            const name = currentBattleMap.name;
            currentBattleMap = convertJsonToFoundryVTT(
                currentBattleMap,
                canvas
            );
            exportJsonToFvtt(currentBattleMap, name);
            exportCanvas(canvas, "webp");
        });
    // document.getElementById('toggle-visibility').addEventListener('click', function() { toggleCollapsables(this) })
    const generateBattleMapButtons =
        document.getElementsByName("generate-buttons");
    generateBattleMapButtons.forEach((button) => {
        button.addEventListener("click", async function () {
            // clickedHard(this)
            const loaderContainer = document.getElementById("loader-container");
            const legend = document.getElementById("legend");
            // const progressContainer = document.getElementById('progress')
            // progressContainer.classList.remove('hidden')
            legend.classList.remove("hidden");
            loaderContainer.classList.remove("hidden");
            loaderContainer.style.display = "block";
            await generateBattleMap();
            // progressContainer.classList.add('hidden')
            // loaderContainer.classList.add('hidden')
            loaderContainer.style.display = "none";
            const battleMapCanvas = document.getElementById("tiles");
            battleMapCanvas.addEventListener("click", function (event) {
                const ctx = battleMapCanvas.getContext("2d");
                const rect = battleMapCanvas.getBoundingClientRect();
                const currentMapdata = JSON.parse(
                    localStorage.getItem("currently-viewing-map-json")
                );
                const PPI = currentMapdata.PPI;

                const keyColors = JSON.parse(
                    localStorage.getItem("key-colors")
                );
                const activeTool = localStorage.getItem("active-tool");
                const color = keyColors.find(
                    (e) => e.TERRAIN == activeTool
                ).COLOR;

                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                const gridType = getSelectedValueFromRadioGroup("grid-type");
                if (gridType == "square") {
                    x = Math.floor(x / PPI) * PPI;
                    y = Math.floor(y / PPI) * PPI;
                    ctx.clearRect(x, y, PPI, PPI);
                    fillCenterOut(ctx, x, y, PPI, color);
                } else if (gridType == "hex") {
                    // TODO: Implement interactivity for hex maps
                }
            });
        });
    });
    document
        .getElementById("random-seed")
        .addEventListener("click", function () {
            document.getElementById("seed").value = randomWordSlug();
        });
    // Function for the generate button's onclick
    async function clickedHard(buttonElement) {
        generateBattleMapOnClick();
    }
    // Function that is called when the Generate Battle Map button is clicked
    async function generateBattleMapOnClick() {
        const startTime = Date.now();

        const loaderContainer = document.getElementById("loader-container");
        const progressContainer = document.getElementById("progress");

        // progressContainer.classList.remove('hidden')
        loaderContainer.classList.remove("hidden");

        const battleMapJSON = await generateBattleMapJson();
        await drawJsonOnCanvas(battleMapJSON, "battle-map");
        const blah = battleMapJSON.TILE_DATA.filter((e) => e.COVER != "N/A");
        console.log(
            "🚀 ~ file: battleMap.js:274 ~ generateBattleMapOnClick ~ blah:",
            blah
        );

        // progressContainer.classList.add('hidden')
        loaderContainer.classList.add("hidden");

        const endTime = Date.now();
        const elapsed = endTime - startTime;
        const formattedTime = formatMillisecondsToReadable(elapsed);
        console.log(
            "🚀 ~ file: index.js:332 ~ startBabylon ~ formattedTime:",
            formattedTime
        );

        await db.bmg_maps
            .put(battleMapJSON)
            .then(function () {
                makeToast(
                    `<b>${battleMapJSON.NAME}</b> map saved successfully!`,
                    "success"
                );
                populateBattleMapHistory();
            })
            .catch(async function (error) {
                if (
                    error.name === "QuotaExceededError" ||
                    (error.inner && error.inner.name === "QuotaExceededError")
                ) {
                    const con = confirm(
                        "In order to save the battle map that was just generated, three (3) old battle maps must be deleted. This is irreversible."
                    );
                    if (con) {
                        let data = await db.bmg_maps
                            .orderBy("datetime")
                            .reverse()
                            .toArray();
                        data = data.slice(-3);
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            await db.bmg_maps.delete(element.id);
                        }
                    }
                } else {
                    console.error(
                        `! ~~~~ Error ~~~~ ! \n Name: ${error.name} \n`,
                        `Message: ${error.message}`
                    );
                }
            });
    }
    // Function to toggle collapsable state of fieldset-content
    function toggleCollapsables(buttonElement) {
        const fieldsetContents = document.querySelectorAll(".fieldset-content");
        const collapsed = localStorage.getItem("collapsed");
        fieldsetContents.forEach((element) => {
            if (collapsed == "false") {
                element.classList.add("hidden");
                element.classList.remove("visible");
                element.style.height = "20px";
                localStorage.setItem("collapsed", true);
            } else if (collapsed == "true") {
                element.classList.add("visible");
                element.classList.remove("hidden");
                element.style.height = "fit-content";
                localStorage.setItem("collapsed", false);
            }
        });
        buttonElement.classList.toggle("closed");
    }
    // Canvas Listeners
    // const battleMapCanvas = document.getElementById('battle-map-canvas-container')
    // battleMapCanvas.addEventListener('wheel', function(e){
    //     const zoomElement = document.getElementById('battle-map')
    //     let zoom = 1
    //     const ZOOM_SPEED = 0.1
    //     if (e.deltaY > 0) {
    //         zoomElement.style.transform = `scale(${(zoom -= ZOOM_SPEED)})`;
    //     } else {
    //     zoomElement.style.transform = `scale(${(zoom += ZOOM_SPEED)})`;
    //     }
    // })
}
// ========= Animations ===========
function fillCenterOut(ctx, x, y, ppi, color) {
    var size = 0;
    var maxSize = ppi;
    var growthRate = ppi / 30; // pixels per frame
    function animate() {
        ctx.clearRect(x, y, maxSize, maxSize); // clear the entire potential area of the square
        size += growthRate;
        if (size > maxSize) size = maxSize;
        ctx.fillStyle = `rgb(${color})`;
        var topLeftX = x + (maxSize - size) / 2;
        var topLeftY = y + (maxSize - size) / 2;
        ctx.fillRect(topLeftX, topLeftY, size, size);
        if (size < maxSize) requestAnimationFrame(animate);
    }
    animate();
}
// ========= TV Presets ===========
function calculateMapPropertiesFromTvProperties(
    sizeInches,
    widthPixels,
    heightPixels
) {
    sizeInches = parseInt(sizeInches);
    widthPixels = parseInt(widthPixels);
    heightPixels = parseInt(heightPixels);

    const ppi = Math.ceil(widthPixels / sizeInches);
    const widthTiles = Math.ceil(widthPixels / ppi);
    const heightTiles = Math.ceil(heightPixels / ppi);

    return { ppi: ppi, widthTiles: widthTiles, heightTiles: heightTiles };
}
function setBattleMapPropertiesFromTvProperties() {
    const tvResolutionJson = {
        "1080p": {
            width: 1920,
            height: 1080,
        },
        "2k": {
            width: 2560,
            height: 1440,
        },
        "4k": {
            width: 3840,
            height: 2160,
        },
        "8k": {
            width: 7680,
            height: 4320,
        },
    };

    const tvSize = parseInt(
        document.getElementById("tv-size-inches-input").value
    );
    const tvResolution = document.getElementById("tv-res").value;
    if (tvResolution === "select-res") return;

    const resolutionData = tvResolutionJson[tvResolution];

    const battleMapProps = calculateMapPropertiesFromTvProperties(
        tvSize,
        resolutionData.width,
        resolutionData.height
    );

    const widthInput = document.getElementById("width-input");
    const heightInput = document.getElementById("height-input");
    const gridSize = document.getElementById("grid-size");

    widthInput.value = battleMapProps.widthTiles;
    heightInput.value = battleMapProps.heightTiles;
    gridSize.value = battleMapProps.ppi;
}
// ========= Set up Dom ===========
function setupAllDElements() {
    // OnInput function for slider number input
    function sliderNumberOnInput(children) {
        const numberInput = children[1];
        const slider = children[2];
        const numberValue = numberInput.value;
        slider.value = numberValue;
    }
    // OnInput function for slider
    function sliderOnInput(children) {
        const numberInput = children[1];
        const slider = children[2];
        const sliderValue = slider.value;
        numberInput.value = sliderValue;
    }
    // Sliders
    const sliders = document.querySelectorAll(".slider-container");
    sliders.forEach((element) => {
        const children = element.children; // Get the elements children
        const label = children[0].innerText;
        for (let index = 0; index < children.length; index++) {
            const child = children[index];
            const childClass = child.className;
            if (childClass == "slider-label") continue;
            else if (childClass == "slider-number")
                child.addEventListener("input", function () {
                    sliderNumberOnInput(children);
                });
            else if (childClass == "slider")
                child.addEventListener("input", function () {
                    sliderOnInput(children);
                });
        }
    });
    // Selects
    const selects = document.querySelectorAll(".select-container");
    for (let index = 0; index < selects.length; index++) {
        const element = selects[index];
        const children = element.children;
        const tableName = camelize(children[0].innerText.toLowerCase());
        const select = children[1];
        if (tableName == "plane") select.disabled = true; // TODO: Remove this when other planes are added
        if (tableName == "landform") select.disabled = true; // TODO: Remove this when we add geography types
        // Handle History
        if (tableName == "load") {
            try {
                const battleMapHistory = JSON.parse(
                    localStorage.getItem("battle-map-history")
                );
                battleMapHistory.forEach((element) => {
                    const option = document.createElement("option");
                    option.innerText = element.NAME;
                    option.value = element.NAME;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error("setupSelects() | Error --", error);
            }
            continue;
        }
        // Handle Hex Type
        if (tableName == "hexType") {
            const gridType = getSelectedValueFromRadioGroup("grid-type");
            if (gridType == "square") select.style.display = "none";
            else if (gridType == "hex") select.style.display = "block";
        }
        // Handle other selects
        if (tableName === "tvRes.") return;
        for (let index = 0; index < eval(tableName).length; index++) {
            const element = eval(tableName)[index];
            const option = document.createElement("option");
            option.innerText = element;
            if (element == "Open Water") option.value = "OpenWater";
            else if (element == "Hex Rows - Odd") option.value = "row-odd";
            else if (element == "Hex Rows - Even") option.value = "row-even";
            else if (element == "Hex Columns - Odd")
                option.value = "column-odd";
            else if (element == "Hex Columns - Even")
                option.value = "column-even";
            else option.value = element;
            if (element == "Material") option.selected = true;
            select.appendChild(option);
        }
    }
    // const isChecked = document.getElementById('grid lines-labels-checkbox').checked
    const lineWidthSelect = document.getElementById("line-width");
    const lineWidthLabel = document.getElementById("line-width-label");
    // if (isChecked) {
    //     lineWidthLabel.style.display = 'block'
    //     lineWidthSelect.style.display = 'block'
    // } else {
    //     lineWidthLabel.style.display = 'none'
    //     lineWidthSelect.style.display = 'none'
    // }
}
// ========= Data Manipulation ===========
async function loadJsonToCanvas() {
    // Function that loads the uploaded JSOn to the map
    async function fileToJSON(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (event) =>
                resolve(JSON.parse(event.target.result));
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsText(file);
        });
    }
    const jsonFile = await fileToJSON(
        document.getElementById("json-input").files[0]
    );
    drawJsonOnCanvas(jsonFile, "battle-map");
}
// function convertJsonToFoundryVTT(JSON) {
//     // Function to build a FoundryVTT Scene JSON from JSON
//     function getFoundryVttGridType(data) {
//         const gridType = data.GRID;
//         const hexOrientation = data.HEX_ORIENTATION;
//         let foundryGridType;
//         if (gridType == "square") return (foundryGridType = 1);
//         if (gridType == "hex" && hexOrientation == "column-even")
//             return (foundryGridType = 5);
//         if (gridType == "hex" && hexOrientation == "row-even")
//             return (foundryGridType = 3);
//         if (gridType == "hex" && hexOrientation == "column-odd")
//             return (foundryGridType = 4);
//         if (gridType == "hex" && hexOrientation == "row-odd")
//             return (foundryGridType = 2);
//     }
//     if (!JSON) return alert("Please generate a map first.");
//     const canvas = document.getElementById("battle-map");
//     if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
//     const imageString = document
//         .getElementById("battle-map")
//         .toDataURL("image/webp")
//         .split(";base64,")[1];
//     if (!imageString) return alert("Please generate a map first.");
//     const width = JSON.WIDTH * JSON.PPI;
//     const height = JSON.HEIGHT * JSON.PPI;
//     const padding = 0;
//     const worldName = localStorage.getItem("world-name");
//     // Update FVTT
//     const FVTT = {
//         name: JSON.NAME, // Set the Name
//         navigation: true,
//         navOrder: 0,
//         navName: "",
//         img: `/worlds/${worldName}/${JSON.NAME}.webp`, //  imageString, // Set the Image
//         foreground: null,
//         thumb: null,
//         width: width, // + (width * padding), // Set the Width
//         height: height, // + (height * padding), // Set the Height
//         padding: padding,
//         initial: null,
//         backgroundColor: "#999999",
//         gridType: getFoundryVttGridType(JSON), // Set the Grid Type
//         grid: JSON.PPI, // Set the Grid Size
//         shiftX: 0,
//         shiftY: 0,
//         gridColor: "#000000",
//         gridAlpha: 0.2,
//         gridDistance: 5,
//         gridUnits: "ft",
//         tokenVision: true,
//         fogExploration: true,
//         fogReset: 1657809433087,
//         globalLight: false,
//         globalLightThreshold: null,
//         darkness: 0,
//         drawings: [],
//         tokens: [],
//         lights: [], // "lights": JSON.LIGHTS | For the future
//         notes: [],
//         sounds: [],
//         templates: [],
//         tiles: [],
//         walls: JSON.WALLS_FVTT,
//         playlist: null,
//         playlistSound: null,
//         journal: null,
//         weather: "",
//         flags: {},
//     };
//     return FVTT;
// }
// async function exportJsonToFvtt(JSONobj) {
//     // Function to export as FVTT
//     if (!JSONobj) return alert("Please generate a map first.");
//     if (JSONobj.ppi < 50) return alert("FoundryVTT does not support a grid size less than 50!");
//     const canvas = document.getElementById("battle-map");
//     if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
//     const UVTT = convertJsonToFoundryVTT(JSONobj);
//     const name = JSONobj.NAME;
//     console.log("FVTT:", UVTT);
//     var dataStr =
//         "data:text/json;charset=utf-8," +
//         encodeURIComponent(JSON.stringify(UVTT));

//     var dlAnchorElem = document.getElementById("downloadAnchorElem");
//     dlAnchorElem.setAttribute("href", dataStr);
//     dlAnchorElem.setAttribute("download", `(FoundryVTT) ${name}.json`);
//     dlAnchorElem.click();

//     await exportCanvas("battle-map", "webp");
// }
function convertJsonToUvtt(JSON) {
    // Function to build UVTT from JSON
    if (!JSON) return alert("Please generate a map first.");
    const canvas = document.getElementById("battle-map");
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
    const imageString = document
        .getElementById("battle-map")
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
    const canvas = document.getElementById("battle-map");
    if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
    const name = JSONobj.NAME;
    var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(JSONobj));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${name}.json`);
    dlAnchorElem.click();
}
function exportToUvtt(JSONobj) {
    // Function to export the currently viewed map as a UVTT file
    if (!JSONobj) return alert("Please generate a map first.");
    const canvas = document.getElementById("battle-map");
    if (isCanvasBlank(canvas)) return alert("Please generate a map first.");
    const UVTT = convertJsonToUvtt(JSONobj);
    const name = JSONobj.NAME;
    console.log("UVTT:", UVTT);
    var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(UVTT));

    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${name}.uvtt`);
    dlAnchorElem.click();
}
function getRandomSeed() {
    // Function to get the number from the seed
    // Get the user's seed input
    var seedUser = document.getElementById("seed").value;
    // Get a random seed
    var seed = new Math.seedrandom(seedUser);
    // Print it to the page
    document.getElementById("output").innerHTML = seed();
}
async function populateBattleMapHistory() {
    const listDiv = document.getElementById("history-table-body");
    listDiv.innerHTML = ``;
    let data = await db.bmg_maps.orderBy("dt").reverse().toArray();
    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        const tr = document.createElement("tr");
        tr.id = element._id;

        const tdID = document.createElement("td");
        const tdView = document.createElement("td");
        const tdDelete = document.createElement("td");
        const tdDate = document.createElement("td");
        const tdTime = document.createElement("td");
        const tdName = document.createElement("td");
        const tdBiome = document.createElement("td");
        const tdDimensions = document.createElement("td");

        let dt =
            typeof element.dt == "string" ? new Date(element.dt) : element.dt;

        tdID.innerText = data.length - index;
        tdView.innerHTML = `<i class="fa-solid fa-eye view-row" id="${element._id}-view"></i>`;
        tdDelete.innerHTML = `<i class="fa-solid fa-trash delete-row" id="${element._id}-delete"></i>`;
        tdDate.innerText = dt.toLocaleDateString();
        tdTime.innerText = dt.toLocaleTimeString();
        tdName.innerHTML = `<span id="map-name-${element._id}">${element.name}</span>`;
        tdBiome.innerText = element.biome;
        tdDimensions.innerText = `${element.h}x${element.w} @ ${element.ppi}ppi`;

        tr.appendChild(tdID);
        tr.appendChild(tdView);
        tr.appendChild(tdDelete);
        tr.appendChild(tdDate);
        tr.appendChild(tdTime);
        tr.appendChild(tdName);
        tr.appendChild(tdBiome);
        tr.appendChild(tdDimensions);

        listDiv.appendChild(tr);

        const viewIcon = document.getElementById(`${element._id}-view`);
        viewIcon.addEventListener("click", async function () {
            const primaryKey = this.id.replace("-view", "");
            const mapData = await db.bmg_maps.get({ _id: primaryKey });
            drawJsonOnCanvas(mapData, "battle-map"); // TODO: Refactor drawJsonOnCanvas()
        });
        const deleteIcon = document.getElementById(`${element._id}-delete`);
        deleteIcon.addEventListener("click", function () {
            const primaryKey = this.id.replaceAll("-delete", "");
            deleteRowByPrimaryKey(primaryKey, "bmg_maps");
            populateBattleMapHistory();
        });
    }
}
// ========= Battle_Maps ==========
async function generateBattleMapJson() {
    // Function to generate a battle map JSON
    // =================
    //    USER INPUTS
    // =================
    // Attributes
    let name = document.getElementById("name").value; // Get the Name
    if (name == "" && localStorage.getItem("battle-map-history")) {
        if (localStorage.getItem("name-number")) {
            const nameNumber = parseInt(localStorage.getItem("name-number"));
            name = `Auto-named Map ${nameNumber + 1}`;
            localStorage.setItem("name-number", nameNumber + 1);
        } else {
            const nameNumber =
                JSON.parse(localStorage.getItem("battle-map-history")).length +
                1;
            localStorage.setItem("name-number", nameNumber);
        }
    } else if (name == "" && !localStorage.getItem("battle-map-history")) {
        name = `Auto-named Map 1`;
        localStorage.setItem("name-number", 1);
    }
    // Dimensions
    const width = parseInt(document.getElementById("width-input").value); // Get the width
    const height = parseInt(document.getElementById("height-input").value); // Get the height
    const gridSize = parseInt(document.getElementById("grid-size").value); // Get the gridSize
    if (!width || !height || !gridSize)
        return alert("Width, Height, and Grid Size are required.");
    // Environment
    const biome = document.getElementById("biome").value; // Biome
    const plane = document.getElementById("plane").value; // Plane
    const BIOME = biome.toUpperCase(); // Convert biome to uppercase
    const biomeLower = BIOME.toLowerCase(); // Convert biome to lowercase
    // Grid
    const grid = getSelectedValueFromRadioGroup("grid-type");
    // Terrain
    const terrainProb = document.getElementById("regular-terrain-input").value;
    const diffTerrainProb = document.getElementById(
        "difficult-terrain-input"
    ).value;
    const coverProb = document.getElementById("cover-input").value;
    const terrainSum =
        parseInt(terrainProb) + parseInt(diffTerrainProb) + parseInt(coverProb);
    if (terrainSum > 100 || terrainSum < 100) {
        return alert(
            "Terrain probabilities does not equal 100! Ensure that Terrain, Diff. Terrain, and Cover probabilities add up to 100."
        );
    }
    // Features
    const cliffsProb = document.getElementById("cliffs-input").value;
    const hillsProb = document.getElementById("hills-input").value;
    const lakeProb = document.getElementById("lake-input").value;
    const pondProb = document.getElementById("pond-input").value;
    const riverProb = document.getElementById("river-input").value;
    const roadProb = document.getElementById("road-input").value;
    // Seed
    let seed = document.getElementById("seed").value;
    seed = new Math.seedrandom(
        `${seed}.${height}.${width}.${gridSize}.${biome}`
    );
    for (let index = 0; index < 10; index++) {
        // console.log(seed())
    }
    // ========================
    //       GET DATA
    // ========================
    // Terrain
    let tableBiomeTerrainTypes = [
        {
            BIOME: BIOME,
            TERRAIN: terrainProb / 100,
            "DIFF. TERRAIN": diffTerrainProb / 100,
            COVER: coverProb / 100,
        },
    ];
    // Feature Booleans
    // getFeatureBoolean rolls 1d100 and if the roll is equal to or lower than...
    // ...the probability, which is taken from the user's input, then the object is sent to...
    // ...true. This means that that will be present on the battle map.
    const cliff = getFeatureBool(cliffsProb);
    const hill = getFeatureBool(hillsProb);
    const lake = getFeatureBool(lakeProb);
    const pond = getFeatureBool(pondProb);
    const river = getFeatureBool(riverProb);
    const road = getFeatureBool(roadProb);
    // Colors
    // let colorData = await fetchLocalJson(`mikitz-ttrpg\data\json\battle-map-generator\COLORS_${SEASON}`) // Get the colors JSON for the specific season
    let colorData = await fetchLocalJson(
        `/mikitz-ttrpg/data/json/battle-map-generator/COLORS_SUMMER`
    ); // Get the colors JSON for the specific season
    colorData = colorData.find((i) => i.TYPE === BIOME);
    // Table Data
    let tableCover = await fetchLocalJson(
        "/mikitz-ttrpg/data/json/battle-map-generator/COVER"
    );
    const blahTable = await fetchLocalJson(
        "/mikitz-ttrpg/data/json/battle-map-generator/refactored/COVER_TEST"
    );
    console.log(
        "🚀 ~ file: battleMap.js:824 ~ generateBattleMapJson ~ blahTable:",
        convertObjectToSeedRollableObject(blahTable[BIOME])
    );

    let tableDiffTerrain = await fetchLocalJson(
        "/mikitz-ttrpg/data/json/battle-map-generator/DIFF._TERRAIN"
    );
    let tableTerrain = await fetchLocalJson(
        "/mikitz-ttrpg/data/json/battle-map-generator/TERRAIN"
    );
    const tableCoverType = await fetchLocalJson(
        "/mikitz-ttrpg/data/json/battle-map-generator/COVER_TYPE"
    );
    const tableHill = await fetchLocalJson(
        "/mikitz-ttrpg/data/json/battle-map-generator/DIE_SIZE_HILL"
    );
    const tableCliff = await fetchLocalJson(
        "/mikitz-ttrpg/data/json/battle-map-generator/DIE_SIZE_CLIFF"
    );
    // Filter Tables
    tableCover = tableCover.filter((i) => i.TYPE === BIOME);
    tableDiffTerrain = tableDiffTerrain.filter((i) => i.TYPE === BIOME);
    tableTerrain = tableTerrain.filter((i) => i.TYPE === BIOME);
    // ========================
    //       BUILD TABLE
    // ========================
    const rollTableBiomeTerrainTypes = convertJsonToRollTable(
        tableBiomeTerrainTypes
    );
    // ========================
    //   CALCULATE DIMENSIONS
    // ========================
    const h = height * gridSize; // Height
    const w = width * gridSize; // Width
    const widthDividedByGridSize = (width * gridSize) / gridSize; // Calculate width / gridSize
    const heightDividedByGridSize = (height * gridSize) / gridSize; // Calcuate height / gridSize
    // Alert user to modulus
    if (heightDividedByGridSize % 1 != 0 || widthDividedByGridSize % 1 != 0) {
        alert(`Width / Grid Size = ${widthDividedByGridSize} and Height / Grid Size = ${heightDividedByGridSize}. 
        At least one of these quotients is not a whole number.
        Please ensure that each of these quotients is a whole number, I.E. no decimal places.`);
        return;
    }
    // ================
    //   GENERATE MAP
    // ================
    // const tableName = eval(`table_${BIOME}_${SEASON}_${CLIMATE}`) // Get the table for this specific biome in this season and this climate
    let cliffDieSize = null;
    if (cliff)
        cliffDieSize = tableCliff.find(
            (elem) => elem.BIOME === biomeLower
        ).DIE_SIZE; // Get the Cliff table
    let hillDieSize = null;
    if (hill)
        hillDieSize = tableHill.find(
            (elem) => elem.BIOME === biomeLower
        ).DIE_SIZE; // Get the Hill table
    const riverWidth = getRiverWidth(height); // River Width
    const roadWidth = getRoadWidth(); // Road Width
    const orient = getSelectedValueFromRadioGroup("orientation"); // Pull the user selected drawing direction
    const rDirection = determineDirection(orient); // Determine the direction
    const beginRiver = determineRiverBeginningCoordinates(
        rDirection,
        height,
        width
    ); // Determine the coordinates where the river will start
    const beginRoad = determineRoadBeginningCoordinates(
        rDirection,
        height,
        width
    ); // Determine the coordinates where the river will start

    let terrainTypes = await generateAllTiles(
        rDirection,
        height,
        width,
        rollTableBiomeTerrainTypes,
        BIOME,
        cliff,
        hill,
        lake,
        pond,
        river,
        road,
        cliffDieSize,
        hillDieSize,
        height,
        rDirection,
        grid,
        beginRoad,
        beginRiver,
        riverWidth,
        roadWidth,
        gridSize,
        colorData,
        tableCoverType,
        tableCover,
        tableDiffTerrain,
        tableTerrain
    );
    let wallData = terrainTypes[1];
    let wallDataFVTT = terrainTypes[2];
    terrainTypes = terrainTypes[0];

    // =============
    //   SAVE DATA
    // =============
    const date = new Date(); // Instantiate a new Date object
    const today = date.toLocaleDateString(); // Today's date
    let hexOrientation;
    if (grid === "square") hexOrientation = null;
    else if (grid === "hex")
        hexOrientation = document.getElementById("hex-type").value;
    // Set up JSON Object
    const JSONobj = {
        NAME: name,
        DATETIME: date,
        PPI: gridSize,
        WIDTH: width,
        HEIGHT: height,
        TILE_DATA: terrainTypes,
        BIOME: biome,
        PLANE: plane,
        GRID: grid,
        HEX_ORIENTATION: hexOrientation,
        WALLS_FVTT: wallDataFVTT,
        WALLS_UVTT: wallData,
    };
    // Set Local Storage items
    try {
        localStorage.setItem(
            "currently-viewing-map-json",
            JSON.stringify(JSONobj)
        );
    } catch (error) {
        console.warn("Map is too big to save! See the below error");
        console.error("MAP TOO BIG --", error);
        alert(
            "Map too big to save! Please export it before leaving the webpage."
        );
    }
    return JSONobj;
}
function getFeatureBool(featureProb) {
    // Function to return a Feature boolean based on the probabilty of occuring
    featureProb = parseInt(featureProb);
    let boolean = false;
    const roll = getRndInteger(1, 100);
    if (roll <= featureProb) boolean = true;
    return boolean;
}
function determineDirection(orientation) {
    // Function to determine the direction by which to draw the canvas
    if (!orientation) var rDirection = getRndInteger(1, 4); // Random roll
    if (orientation === "vertical") {
        var rDirection = getRndInteger(1, 2); // Roll to determine if up or down
        if (rDirection === 1) {
            rDirection = 2;
        } // Down
        else {
            rDirection = 4;
        } // Up
    } else {
        var rDirection = getRndInteger(1, 2); // Roll to determine Right or Left
        if (rDirection === 1) {
            rDirection = 1;
        } // Right
        else {
            rDirection = 3;
        } // Left
    }
    return rDirection;
}
function getRiverWidth(height) {
    // Function to determine the river's width
    let riverWidth;
    try {
        riverWidth = document.getElementById("river-width-width").value;
        if (riverWidth === "") {
            riverWidth = getRndInteger(1, Math.floor(height / 3));
        }
    } catch (e) {
        riverWidth = getRndInteger(1, Math.floor(height / 3));
    }
    return riverWidth;
}
function getRoadWidth() {
    // Function to determine the road's width
    let roadWidth;
    try {
        roadWidth = document.getElementById("road-width-width").value;
        if (roadWidth === "") {
            roadWidth = getRndInteger(1, 3);
        }
    } catch (e) {
        roadWidth = getRndInteger(1, 3);
    }
}
function determineRiverBeginningCoordinates(direction, height, width) {
    // Function to determine where the River should start
    if (direction === 1 || direction === 3)
        return (beginRiver = getRndInteger(0, height - 1));
    else if (direction === 2 || direction === 4)
        return (beginRiver = getRndInteger(0, width - 1));
}
function determineRoadBeginningCoordinates(direction, height, width) {
    // Function to determine where the road should start
    if (direction === 1 || direction === 3)
        return (beginRiver = getRndInteger(0, height - 1));
    else if (direction === 2 || direction === 4)
        return (beginRiver = getRndInteger(0, width - 1));
}
function determineHexXandY(i, j, xOff, yOff, hexOrientation, R, b, r) {
    // Function to deterimine the X and Y coordinates on the canvas to draw a hexagon tile
    let x = (R + b) * i + xOff;
    let y = yOff;
    if (i === 0) x = xOff;
    if (hexOrientation.includes("even")) {
        if (i === 0 && j > 0) {
            y = r * j + yOff + r * j + r;
        } // The first hex in each row after the first row
        else if (i === 0) {
            y = y * j + yOff + r;
        } // The very first hex
        else if (j > 0 && i % 2 != 0) {
            y = r * j + yOff + r * j;
        } // Even Tiles after the first row
        else if (j > 0 && i % 2 === 0) {
            y = r * (j + 1) + yOff + r * j;
        } // Odd Tile after the first row
        else if (i % 2 != 0) {
            y = r * j + yOff;
        } // Even Tiles in the first row
        else if (i % 2 === 0) {
            y = r * (j + 1) + yOff;
        } // Odd Tiles in the first row
    } else if (hexOrientation.includes("odd")) {
        if (i === 0 && j > 0) {
            y = r * j + yOff + r * j;
        } // The first hex in each row after the first row
        else if (i === 0) {
            y = y * j + yOff;
        } // The very first hex
        else if (j > 0 && i % 2 === 0) {
            y = r * j + yOff + r * j;
        } // Even Tiles after the first row
        else if (j > 0 && i % 2 != 0) {
            y = r * (j + 1) + yOff + r * j;
        } // Odd Tile after the first row
        else if (i % 2 === 0) {
            y = r * j + yOff;
        } // Even Tiles in the first row
        else if (i % 2 != 0) {
            y = r * (j + 1) + yOff;
        } // Odd Tiles in the first row
    }
    return { x: x, y: y };
}
// ========= Battle_Maps_Tiles ==========
async function generateAllTiles(
    rDirection,
    height,
    width,
    rollTableBiomeTerrainTypes,
    BIOME,
    cliff,
    hill,
    lake,
    pond,
    river,
    road,
    cliffDieSize,
    hillDieSize,
    height,
    rDirection,
    gridType,
    beginRoad,
    beginRiver,
    riverWidth,
    roadWidth,
    PPI,
    colorData,
    tableCoverType,
    tableCover,
    tableDiffTerrain,
    tableTerrain
) {
    // Function to generate all tiles
    // ==================
    //    Data Classes
    // ==================
    class Wall {
        // Only input is the coordinates -- [x1, y1, x2, y2]
        constructor(c) {
            this._id = genId(); // Generate using genId()
            this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
            this.light = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.move = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sight = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sound = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.dir = 0; // CONST.WALL_DIRECTIONS | BOTH: 0, LEFT: 1, RIGHT: 2
            this.door = 0; // CONST.WALL_DOOR_TYPES | NONE: 0, DOOR: 1, SECRET: 2
            this.ds = 0; // CONST.WALL_DOOR_STATES | CLOSED: 0, OPEN: 1, LOCKED: 2
            this.flags = {};
        }
    }
    class TerrainWall {
        // Only input is the coordinates -- [x1, y1, x2, y2]
        constructor(c) {
            this._id = genId(); // Generate using genId()
            this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
            this.light = 10; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.move = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sight = 10; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sound = 10; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.dir = 0; // CONST.WALL_DIRECTIONS | BOTH: 0, LEFT: 1, RIGHT: 2
            this.door = 0; // CONST.WALL_DOOR_TYPES | NONE: 0, DOOR: 1, SECRET: 2
            this.ds = 0; // CONST.WALL_DOOR_STATES | CLOSED: 0, OPEN: 1, LOCKED: 2
            this.flags = {};
        }
    }
    class InvisibleWall {
        // Only input is the  coordinates -- [x1, y1, x2, y2]
        constructor(c) {
            this._id = genId(); // Generate using genId()
            this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
            this.light = 0; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.move = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sight = 0; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sound = 0; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.dir = 0; // CONST.WALL_DIRECTIONS | BOTH: 0, LEFT: 1, RIGHT: 2
            this.door = 0; // CONST.WALL_DOOR_TYPES | NONE: 0, DOOR: 1, SECRET: 2
            this.ds = 0; // CONST.WALL_DOOR_STATES | CLOSED: 0, OPEN: 1, LOCKED: 2
            this.flags = {};
        }
    }
    class EtherealWall {
        // Only input is the coordinates -- [x1, y1, x2, y2]
        constructor(c) {
            this._id = genId(); // Generate using genId()
            this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
            this.light = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.move = 0; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sight = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sound = 0; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.dir = 0; // CONST.WALL_DIRECTIONS | BOTH: 0, LEFT: 1, RIGHT: 2
            this.door = 0; // CONST.WALL_DOOR_TYPES | NONE: 0, DOOR: 1, SECRET: 2
            this.ds = 0; // CONST.WALL_DOOR_STATES | CLOSED: 0, OPEN: 1, LOCKED: 2
            this.flags = {};
        }
    }
    class Door {
        // Only input is the coordinates -- [x1, y1, x2, y2]
        constructor(c) {
            this._id = genId(); // Generate using genId()
            this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
            this.light = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.move = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sight = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sound = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.dir = 0; // CONST.WALL_DIRECTIONS | BOTH: 0, LEFT: 1, RIGHT: 2
            this.door = 1; // CONST.WALL_DOOR_TYPES | NONE: 0, DOOR: 1, SECRET: 2
            this.ds = 0; // CONST.WALL_DOOR_STATES | CLOSED: 0, OPEN: 1, LOCKED: 2
            this.flags = {};
        }
    }
    class SecretDoor {
        // Only input is the coordinates -- [x1, y1, x2, y2]
        constructor(c) {
            this._id = genId(); // Generate using genId()
            this.c = c; // Coordinates of wall vertices in pixels | Includes padding -- [x1, y1, x2, y2]
            this.light = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.move = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sight = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.sound = 20; // CONST.WALL_SENSE_TYPES | NONE: 0, LIMITED: 10, NORMAL: 20
            this.dir = 0; // CONST.WALL_DIRECTIONS | BOTH: 0, LEFT: 1, RIGHT: 2
            this.door = 2; // CONST.WALL_DOOR_TYPES | NONE: 0, DOOR: 1, SECRET: 2
            this.ds = 0; // CONST.WALL_DOOR_STATES | CLOSED: 0, OPEN: 1, LOCKED: 2
            this.flags = {};
        }
    }
    // ===============
    //    Load Data
    // ===============
    const groundColor = colorData.NORMAL; // Get the Ground tile color
    const difficult_terrainColor = colorData.DIFFICULT; // Get the Difficult Terrain tile color
    const impasseColor = colorData.COVER; // Get the Impass tile color
    const boulderColor = colorData.BOULDER; // Get the Boulder tile color
    const treeColor = colorData.TREE; // Get the Tree tile color
    const waterColor = colorData.WATER; // Get the Water tile color
    const roughWaterColor = colorData.ROUGH_WATER; // Get the Rough Water tile color
    const roadColor = colorData.ROAD; // Get the Road tile color
    let terrainTypes = [];
    let wallDataUVTT = []; // Wall data for UniversalVTT
    let wallDataFVTT = []; // Wall data for FoundryVTT
    // =================
    //    Square Grid
    // =================
    if (gridType === "square") {
        if (rDirection === 1) {
            for (var i = 0; i < width; i++) {
                // Loop through all the tiles on the x axis
                for (var j = 0; j < height; j++) {
                    // Loop through all tiles on the y axis
                    await generateTile(rDirection);
                }
            }
        } else if (rDirection === 2) {
            for (var j = 0; j < height; j++) {
                // Loop through all the tiles on the x axis
                for (var i = 0; i < width; i++) {
                    // Loop through all tiles on the y axis
                    await generateTile(rDirection);
                }
            }
        } else if (rDirection === 3) {
            for (var i = width - 1; i > -1; i--) {
                // Loop through all the tiles on the x axis
                for (var j = height - 1; j > -1; j--) {
                    // Loop through all tiles on the y axis
                    await generateTile(rDirection);
                }
            }
        } else {
            for (var j = height - 1; j > -1; j--) {
                // Loop through all the tiles on the x axis
                for (var i = width - 1; i > -1; i--) {
                    // Loop through all tiles on the y axis
                    await generateTile(rDirection);
                }
            }
        }
    }
    // =================
    //     Hex Grid
    // =================
    else if (gridType === "hex") {
        const hexOrientation = document.getElementById("hex-type").value;
        const angle = (2 * Math.PI) / 2; // Angle of each edge from center
        const a = PPI / 2; // Edge Length (a)
        const d = PPI; // Long Diagonal (d)
        const s = Math.sqrt(3) * a; // Short Diagonal (s)
        const p = 6 * a; // Perimeter (p)
        const A = (3 / 2) * Math.sqrt(3) * a ** 2; // Area (A)
        const r = (Math.sqrt(3) / 2) * a; // Apothem (r)
        const R = a; // Circumcircle Radius (R)
        const b = Math.sqrt(a ** 2 - r ** 2); // b side of the triangle
        // ROWS
        const xOff = a + 1;
        const yOff = r + 1;
        var x = xOff;
        var y = yOff;
        let dir = rDirection;
        if (hexOrientation.includes("row") && rDirection == 1) dir = 2;
        if (hexOrientation.includes("row") && rDirection == 2) dir = 3;
        if (hexOrientation.includes("row") && rDirection == 3) dir = 4;
        if (hexOrientation.includes("row") && rDirection == 4) dir = 1;
        if (dir === 1) {
            // Loop through all the tiles on the x axis
            for (var i = 0; i < width; i++) {
                // Loop through all tiles on the y axis
                for (var j = 0; j < height; j++) {
                    const hexCoords = determineHexXandY(
                        i,
                        j,
                        xOff,
                        yOff,
                        hexOrientation,
                        R,
                        b,
                        r
                    );
                    x = hexCoords["x"];
                    y = hexCoords["y"];
                    await generateTile(dir);
                }
            }
        } else if (dir === 2) {
            // Loop through all the tiles on the x axis
            for (var j = 0; j < height; j++) {
                // Loop through all tiles on the y axis
                for (var i = 0; i < width; i++) {
                    const hexCoords = determineHexXandY(
                        i,
                        j,
                        xOff,
                        yOff,
                        hexOrientation,
                        R,
                        b,
                        r
                    );
                    x = hexCoords["x"];
                    y = hexCoords["y"];
                    await generateTile(dir);
                }
            }
        } else if (dir === 3) {
            // Loop through all the tiles on the x axis
            for (var i = width - 1; i > -1; i--) {
                // Loop through all tiles on the y axis
                for (var j = height - 1; j > -1; j--) {
                    const hexCoords = determineHexXandY(
                        i,
                        j,
                        xOff,
                        yOff,
                        hexOrientation,
                        R,
                        b,
                        r
                    );
                    x = hexCoords["x"];
                    y = hexCoords["y"];
                    await generateTile(dir);
                }
            }
        } else {
            // Loop through all the tiles on the x axis
            for (var j = height - 1; j > -1; j--) {
                // Loop through all tiles on the y axis
                for (var i = width - 1; i > -1; i--) {
                    const hexCoords = determineHexXandY(
                        i,
                        j,
                        xOff,
                        yOff,
                        hexOrientation,
                        R,
                        b,
                        r
                    );
                    x = hexCoords["x"];
                    y = hexCoords["y"];
                    await generateTile(dir);
                }
            }
        }
    }
    // =================
    //     Functions
    // =================
    // Function to generate a tile
    async function generateTile(rDirection) {
        // debugger
        let color = "";
        // =====================
        //         DATA
        // =====================
        const tileTypeResult = rollTableLessThan(rollTableBiomeTerrainTypes);
        let tableName;
        if (tileTypeResult == "COVER")
            tableName = convertJsonToRollTable(tableCover);
        else if (tileTypeResult == "TERRAIN")
            tableName = convertJsonToRollTable(tableTerrain);
        else if (tileTypeResult == "DIFF. TERRAIN")
            tableName = convertJsonToRollTable(tableDiffTerrain);
        // =========================================
        //            INITIAL GENERATRION
        // =========================================
        var typeUnchanged = rollTableLessThan(tableName); // Roll Table for this BIOME
        while (!typeUnchanged) typeUnchanged = rollTableLessThan(tableName); // Ensure it doesn't return undefined
        // HANDLE INCLUDES/EXCLUDES
        if (!cliff)
            while (typeUnchanged.includes("CLIFF"))
                typeUnchanged = rollTableLessThan(tableName);
        if (!hill)
            while (typeUnchanged.includes("HILL"))
                typeUnchanged = rollTableLessThan(tableName);
        if (!lake)
            while (typeUnchanged.includes("LAKE"))
                typeUnchanged = rollTableLessThan(tableName);
        if (!pond)
            while (typeUnchanged.includes("POND"))
                typeUnchanged = rollTableLessThan(tableName);
        if (!river)
            while (typeUnchanged.includes("RIVER"))
                typeUnchanged = rollTableLessThan(tableName);
        if (!road)
            while (typeUnchanged.includes("ROAD"))
                typeUnchanged = rollTableLessThan(tableName);
        if (!cliff && !hill) var elevation = 0; // NOT cliff and NOT hill
        // PREPARE TYPE
        var type = typeUnchanged.replace("_ground", ""); // Replace _ground with ""
        type = type.replace("_cover", ""); // Replace _cover with ""
        type = type.replace("_difficult_terrain", ""); // Replace _difficult_terrain with ""
        terrainTypes.push({
            COORDS: `${i}, ${j}`,
            TYPE: type,
            ELEVATION: elevation,
        }); // Push it to the terrain types array
        // =========================================
        //     GENERATE BASED ON ADJACENT TILES
        // =========================================
        if (cliff || hill || lake || pond || river || road) {
            var stuff = await specialTiles(
                cliff,
                hill,
                lake,
                pond,
                river,
                road,
                i,
                j,
                cliffDieSize,
                hillDieSize,
                type,
                elevation,
                color,
                terrainTypes,
                height,
                rDirection,
                gridType,
                beginRoad,
                beginRiver,
                riverWidth,
                roadWidth
            );
            type = stuff[0];
            elevation = stuff[2];
        }
        // =========================================
        //                  COLOR
        // =========================================
        // ROAD
        if (type === "road") {
            // Fix the color
            color = eval(`${type}Color`);
            // Fix the Cover
            cover = "N/A";
        }
        // WATER
        if (type === "river - calm" || type === "water") {
            // Calm water
            color = eval(`waterColor`);
            cover = "N/A";
        } else if (type === "river - rough") {
            // Rough water
            color = eval(`roughWaterColor`);
            cover = "N/A";
        }
        // =========================================
        //             IMAGES & COLOR
        // =========================================
        // Set image
        var image = "";
        // COVER
        if (
            typeUnchanged.includes("cover") &&
            !type.includes("river") &&
            !type.includes("road")
        ) {
            var cover = rollTable(tableCoverType); // Roll cover type
            const coverImge = cover.replace("/", "-"); // Cover Image
            const imgNum = 1; // Set the number
            // Set color based on cover
            if (cover === "1/1") {
                color = eval(`impasseColor`); // Set the color to the impasse color
                if (gridType == "square") {
                    // TODO: Implement this for Hex Grids. A challenge because UVTT does not support Hex Grid, so need to make my own FoundryVTT module
                    // Set up the walls for UVTT
                    let terrainWall = getWallCoordinatesArrayUvtt(i, j); // Get the coordinates for the Terrain Wall to be added
                    wallDataUVTT.push(terrainWall); // Append a wall to the walls JSON
                    // Set up the walls for FoundryVTT
                    let foundryVttWall = addFoundryVttWall(
                        TerrainWall,
                        i,
                        j,
                        PPI
                    ); // Returns an array of all the sides
                    for (
                        let index = 0;
                        index < foundryVttWall.length;
                        index++
                    ) {
                        wallDataFVTT.push(foundryVttWall[index]);
                    } // Loop through the array to add it to the final array and append it to the final FoundryVTT wall array
                }
            } else color = eval(`difficult_terrainColor`); // Set the color to the difficult terrain color
            var DC = "N/A"; // Set the DC to N/A
            image = `/mikitz-ttrpg/img/battle-map-generator/${type.toLowerCase()}-${imgNum}-${coverImge}.svg`; // Set the image
        }
        // DIFFICULT TERRAIN
        else if (
            typeUnchanged.includes("difficult_terrain") &&
            !type.includes("river") &&
            !type.includes("road")
        ) {
            color = eval(`difficult_terrainColor`); // Set the color difficult terrain color
            var DC = "N/A"; // Set the DC to N/A
            cover = "N/A"; // Fix the Cover
            // if (typeUnchanged.includes('MUD')) image = `/battle-map-generator/img/battleMapGenerator/Textures/Natural_Textures/Dirt/Wet_Mud_B_01.jpg`
        }
        // GROUND
        else if (
            typeUnchanged.includes("ground") &&
            !type.includes("river") &&
            !type.includes("road")
        ) {
            color = eval(`groundColor`); // Set the color to the ground color
            var DC = "N/A"; // Set the DC to N/A
            cover = "N/A"; // Fix the Cover
            // if (typeUnchanged.includes('GRASS')) image = `/battle-map-generator/img/battleMapGenerator/Textures/Natural_Textures/Grass/Grass_Rough_A_01.jpg`
        }
        color = color.replaceAll("-", ","); // Fix the Color
        terrainTypes[terrainTypes.length - 1] = {
            COORDS: `${i}, ${j}`,
            TYPE: type,
            ELEVATION: elevation,
            COVER: cover,
            IMAGE: image,
            TYPE_UNCHANGED: typeUnchanged,
            COLOR: color,
        }; // Update the element in the array to reflect the changes
    }
    // Function to generate tiles based on user inputs and adjacent tiles
    async function specialTiles(
        cliff,
        hill,
        lake,
        pond,
        river,
        road,
        i,
        j,
        cliffDieSize,
        hillDieSize,
        type,
        elevation,
        color,
        terrainTypes,
        height,
        rDirection,
        grid,
        beginRoad,
        beginRiver,
        riverWidth,
        roadWidth
    ) {
        // console.log("RAND. DIRECTION (INTERNAL):", rDirection)
        // console.log("BEGIN RIVER (INTERNAL)", beginRiver)
        // console.log("GRID (INTERNAL)", grid)
        // console.log("RIVER (INTERNAL)", river)
        const tableWaterType = await fetchLocalJson(
            "/mikitz-ttrpg/data/json/battle-map-generator/WATER_TYPE"
        );
        elevation = 0;
        // FUNCTIONS
        // Cliff
        function generateCliff() {
            // Check if first
            if (i === 0 && j === 0) {
                elevation = 0;
            } else {
                // Roll to see if cliff
                const roll = getRndInteger(1, cliffDieSize);
                // Cliff
                if (roll === 1 || roll === 2) {
                    // ADJACENT ELEVATION
                    // Set up adjacent elevation array
                    var adjacentElevation = [];
                    // Lower Left
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i - 1}, ${j + 1}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Left
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i - 1}, ${j}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Upper Left
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i - 1}, ${j - 1}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Above
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i}, ${j - 1}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Log the array
                    // console.log("Adjacent Elevation:", adjacentElevation)
                    // Get the max elevation of adjacent tiles
                    const maxElevation = Math.max(...adjacentElevation);
                    // console.log("Max Elevation:", maxElevation)
                    // SET ELEVATION
                    // Set it
                    if (Number.isNaN(maxElevation)) {
                        elevation = getRndInteger(1, 5) * 5;
                    } else {
                        // Up or Down
                        const upDown = getRndInteger(1, 2);
                        if (upDown === 1) {
                            // Drop the elevation
                            elevation = maxElevation - 10;
                        } else {
                            // Raise the elevation
                            elevation = maxElevation + 10;
                        }
                    }
                } else {
                    elevation = 0;
                }
            }
            return elevation;
        }
        // Hill
        function generateHill() {
            // Check if first
            if (i === 0 && j === 0) {
                elevation = 0;
            } else {
                // Roll to see if cliff
                const roll = getRndInteger(1, hillDieSize);
                // Cliff
                if (roll === 1 || roll === 2) {
                    // ADJACENT ELEVATION
                    // Set up adjacent elevation array
                    var adjacentElevation = [];
                    // Lower Left
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i - 1}, ${j + 1}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Left
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i - 1}, ${j}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Upper Left
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i - 1}, ${j - 1}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Above
                    try {
                        adjacentElevation.push(
                            terrainTypes.find(
                                (ele) => ele.COORDS === `${i}, ${j - 1}`
                            ).ELEVATION
                        );
                    } catch (e) {}
                    // Get the max elevation of adjacent tiles
                    const maxElevation = Math.max(...adjacentElevation);
                    // SET ELEVATION
                    // Set it
                    if (Number.isNaN(maxElevation)) {
                        elevation = getRndInteger(1, 5) * 5;
                    } else {
                        // Up or Down
                        const upDown = getRndInteger(1, 2);
                        if (upDown === 1) {
                            // Drop the elevation
                            elevation = maxElevation - 2.5;
                        } else {
                            // Raise the elevation
                            elevation = maxElevation + 2.5;
                        }
                    }
                } else {
                    elevation = 0;
                }
            }
            return elevation;
        }
        // GENERATE
        if (cliff) elevation = generateCliff();
        if (hill) elevation = generateHill();
        if (cliff && hill) {
            const roll = getRndInteger(1, 2);
            if (roll === 1) elevation = generateCliff();
            else elevation = generateHill();
        }
        // Lake
        if (lake) {
        }
        // Pond
        if (pond) {
        }
        // River
        if (river) {
            // Function to set the color and type of the river
            function setTypeAndColor(waterType) {
                type = `river - ${waterType}`;
                if (waterType === "calm") color = `waterColor`;
                else if (waterType === "rough") color = `roughWaterColor`;
                else if (waterType === "turbulent")
                    color = `turbulentWaterColor`;
                return [type, color];
            }
            // Begin River
            // Roll water type
            const waterType = rollTable(tableWaterType);
            // Length of array - height
            const query = terrainTypes.length - (height + 1);
            // console.log("QUERY:", query)
            // BUILD DIRECTIONS
            // SQUARE GRID
            if (grid === "square") {
                // Top-left Start and vertical progression
                if (rDirection === 1) {
                    // Start River
                    if (j === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (j === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
                // Top-left Start and horizontal progression
                else if (rDirection === 2) {
                    // Start River
                    if (i === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (i === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
                // Bottom-right Start and vertical progression
                else if (rDirection === 3) {
                    // Start River
                    if (j === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (j === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
                // Bottom-right Start and horizontal progression
                else if (rDirection === 4) {
                    // Start River
                    if (i === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (i === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
            } else {
                // Top-left Start and vertical progression
                if (rDirection === 1) {
                    // Start River
                    if (j === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (j === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
                // Top-left Start and horizontal progression
                else if (rDirection === 2) {
                    // Start River
                    if (i === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (i === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
                // Bottom-right Start and vertical progression
                else if (rDirection === 3) {
                    // Start River
                    if (j === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (j === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
                // Bottom-right Start and horizontal progression
                else if (rDirection === 4) {
                    // Start River
                    if (i === beginRiver) {
                        var tc = setTypeAndColor(waterType);
                        type = tc[0];
                        color = tc[1];
                        elevation = getRndInteger(0, riverWidth / 2) * -2.5;
                    }
                    // Width greater than 1
                    if (riverWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < riverWidth; index++) {
                            if (i === beginRiver + index) {
                                var tc = setTypeAndColor(waterType);
                                type = tc[0];
                                color = tc[1];
                                elevation =
                                    getRndInteger(0, riverWidth / 2) * -2.5;
                            }
                        }
                    }
                }
            }
        }
        // Road
        if (road) {
            // Function to set the color and type of the river
            function setTypeAndColor() {
                type = `road`;
                color = "ROAD";
                return [type, color];
            }
            // Length of array - height
            const query = terrainTypes.length - (height + 1);
            // console.log("QUERY:", query)
            // BUILD DIRECTIONS
            // SQUARE GRID
            if (grid === "square") {
                // Top-left Start and vertical progression
                if (rDirection === 1) {
                    // Start River
                    if (j === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (j === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
                // Top-left Start and horizontal progression
                else if (rDirection === 2) {
                    // Start River
                    if (i === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (i === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
                // Bottom-right Start and vertical progression
                else if (rDirection === 3) {
                    // Start River
                    if (j === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (j === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
                // Bottom-right Start and horizontal progression
                else if (rDirection === 4) {
                    // Start River
                    if (i === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (i === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
            } else {
                // Top-left Start and vertical progression
                if (rDirection === 1) {
                    // Start River
                    if (j === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (j === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
                // Top-left Start and horizontal progression
                else if (rDirection === 2) {
                    // Start River
                    if (i === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (i === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
                // Bottom-right Start and vertical progression
                else if (rDirection === 3) {
                    // Start River
                    if (j === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (j === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
                // Bottom-right Start and horizontal progression
                else if (rDirection === 4) {
                    // Start River
                    if (i === beginRoad) {
                        var tc = setTypeAndColor();
                        type = tc[0];
                        color = tc[1];
                        elevation = 0;
                    }
                    // Width greater than 1
                    if (roadWidth > 1) {
                        // Loop through the river width
                        for (let index = 1; index < roadWidth; index++) {
                            if (i === beginRoad + index) {
                                var tc = setTypeAndColor();
                                type = tc[0];
                                color = tc[1];
                                elevation = 0;
                            }
                        }
                    }
                }
            }
        }
        // CONSOLE LOG
        if (cliff || hill || lake || pond || river || road) {
            // console.log("TYPE:", type)
            // console.log("COLOR:", color)
            // console.log("ELEVATION:", elevation)
        }
        // RETURN
        return [type, color, elevation];
    }
    // Function to add FoundryVTT walls around a tile
    function addFoundryVttWall(wallType, x, y, gridSize) {
        const padding = 0.1;
        const paddingSizeX = Math.round(x * padding);
        const paddingSizeY = Math.round(y * padding);
        let tileCoords = getWallCoordinatesArrayUvtt(x, y);
        for (let index = 0; index < tileCoords.length; index++) {
            // Convert the coordinates into pixels
            const element = tileCoords[index]; // Get the element
            element.x = element.x * gridSize; // + paddingSizeX // Convert the X coordinate
            element.y = element.y * gridSize; // + paddingSizeY // Convert the Y coordinate
        }
        let sideCoords = [
            [
                // Top Side
                tileCoords[0].x, // x1
                tileCoords[0].y, // y1
                tileCoords[1].x, // x2
                tileCoords[1].y, // y2
            ],
            [
                // Right Side
                tileCoords[1].x, // x1
                tileCoords[1].y, // y1
                tileCoords[2].x, // x2
                tileCoords[2].y, // y2
            ],
            [
                // Bottom Side
                tileCoords[2].x, // x1
                tileCoords[2].y, // y1
                tileCoords[3].x, // x2
                tileCoords[3].y, // y2
            ],
            [
                // Left Side
                tileCoords[3].x, // x1
                tileCoords[3].y, // y1
                tileCoords[0].x, // x2
                tileCoords[0].y, // y2
            ],
        ];
        let walls = [];
        for (let index = 0; index < sideCoords.length; index++) {
            const element = sideCoords[index];
            const wall = new wallType(element);
            walls.push(wall);
        }
        return walls;
    }
    // Function to get the coordinates of a wall
    function getWallCoordinatesArrayUvtt(i, j) {
        // Set the top-left corner based on the hexOrientation
        let topLeftCorner;
        // Hex grid
        if (gridType == "hex") {
            if (hexOrientation == "column-even") topLeftCorner = { x: i, y: j };
            else if (hexOrientation == "column-odd")
                topLeftCorner = { x: i, y: j };
            else if (hexOrientation == "row-even")
                topLeftCorner = { x: j, y: i };
            else if (hexOrientation == "row-odd")
                topLeftCorner = { x: j, y: i };
        }
        // Square grid
        else if (gridType == "square") {
            if (rDirection == 1) topLeftCorner = { x: j, y: i };
            else if (rDirection === 2) topLeftCorner = { x: i, y: j };
            else if (rDirection === 3) topLeftCorner = { x: j, y: i };
            else if (rDirection === 4) topLeftCorner = { x: i, y: j };
        }
        // Set up the Wall object
        const wall = [
            {
                // Top-left corner
                x: topLeftCorner.x,
                y: topLeftCorner.y,
            },
            {
                // Top-right corner
                x: topLeftCorner.x + 1,
                y: topLeftCorner.y,
            },
            {
                // Bottom-right corner
                x: topLeftCorner.x + 1,
                y: topLeftCorner.y + 1,
            },
            {
                // Bottom-left corner
                x: topLeftCorner.x,
                y: topLeftCorner.y + 1,
            },
            {
                // Top-left corner again to complete the square
                x: topLeftCorner.x,
                y: topLeftCorner.y,
            },
        ];
        return wall;
    }
    return [terrainTypes, wallDataUVTT, wallDataFVTT];
}
// ========= Battle_Maps_Drawing ==========
function addImage(canvasID, imageSRC, x, y, size, randRotation) {
    // Function to add an image to canvas
    // Pull the canvas
    var canvas = document.getElementById(canvasID);
    // Get context
    var ctx = canvas.getContext("2d");
    // Set up a new image object
    var imageObj = new Image();
    // Load it
    imageObj.onload = function () {
        ctx.drawImage(imageObj, x, y, size, size);
    };
    // Img Source
    imageObj.src = imageSRC;
}
function clearCanvas(id) {
    // Function to clear the Canvas
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
    document.getElementById("legend").innerHTML = "";
}
function addLabels(ctx, label, x, y, text, distance, size, hexOptions) {
    // Function to add labels
    // LOCAL STORAGE PULL
    // Get the data from localStorage
    const campaignName = localStorage.getItem("selectedCampaign");
    if (campaignName) {
        var settings = JSON.parse(
            localStorage.getItem("campaignSettings")
        ).battle_map_settings; // Get the settings for this campaign
    } else {
        var settings = JSON.parse(localStorage.getItem("battleMaps")); // Get the data from localStorage
    }
    // Get element
    if (distance) {
        var tileCover = settings[`${label}-labels-checkbox`];
        // If true
        if (tileCover) {
            var opacityCover = parseFloat(settings[`${label}-opacity-input`]);
        }
    } else {
        try {
            // See if user wants labels
            var tileCover = document.getElementById(
                `${label}-labels-checkbox`
            ).checked;
            // If input is blank set to one
            if (!document.getElementById(`${label}-opacity-input`).value) {
                var opacityCover = 1;
            } else {
                var opacityCover = parseFloat(
                    document.getElementById(`${label}-opacity-input`).value
                );
            }
        } catch (e) {
            // Do nothing
        }
    }
    if (tileCover) {
        // If the tile is black
        if (text === "1/1") {
            // console.log("BLACK OPACITY:", opacityCoords)
            ctx.fillStyle = `rgb(0, 0, 0, ${opacityCover})`;
        }
        // If the tile is white
        else {
            // console.log("NON-BLACK OPACITY:", opacityCoords)
            ctx.fillStyle = `rgb(0, 0, 0, ${opacityCover})`;
        }
        ctx.textAlign = "center";
        ctx.font = `${size}px Comic Sans MS`;
        // Check for Hexes in Rows
        if (hexOptions && hexOptions.includes("row")) {
            // Flip x and y to accommodate Hex Rows
            var x1 = x;
            var y1 = y;
            x = y1;
            y = x1;
        }
        // Add the label
        ctx.fillText(`${text}`, x, y);
    }
}
function addGrid(type, ctx, RGB, distance, x, y, width, height) {
    // Function for visible grid
    // Square Grid
    if (type === "square") {
        // Grid Visible
        try {
            var gridVis = document.getElementById(
                "grid lines-labels-checkbox"
            ).checked;
        } catch (e) {
            var gridVis = false;
            // console.log("GRID VISIBLE:", e)
        }
        // User wants visible grid
        if (gridVis) {
            if (distance) {
                // Get the width in pixels
                var line = parseInt(settings["line-width"]);
            } else {
                // Get the width in pixels
                var line = parseInt(
                    document.getElementById("line-width").value
                );
            }
            // GRID
            // Set the color for the grid
            ctx.fillStyle = `black`;
            // Draw Rectangle
            ctx.fillRect(x, y, width, height);
            // TILE
            // Set the color for the inner square
            ctx.fillStyle = `rgb(${RGB})`;
            // Draw inner square
            ctx.fillRect(
                x + line,
                y + line,
                width - line * 2,
                height - line * 2
            );
            // Use does not want visible grid
        } else {
            // Set the color
            ctx.fillStyle = `rgb(${RGB})`;
            // Draw Rectangle
            ctx.fillRect(x, y, width, height);
            // console.log("GRID ERROR", e)
        }
    }
    // Hex Grid
    else {
        // User wants a visible grid
        if (document.getElementById("grid lines-labels-checkbox").checked) {
            if (distance) {
                // Get the width in pixels
                var line = settings["line-width"];
            } else {
                // Get the width in pixels
                var line = document.getElementById("line-width").value;
            }
            if (line === 0) {
                // Set the line width to 1
                ctx.lineWidth = 1;
                // Set the color
                ctx.strokeStyle = `rgb(${RGB})`;
                // Draw the outline
                ctx.stroke();
            } else {
                // Set the line width to the user's input
                ctx.lineWidth = parseInt(line);
                // Set the color
                ctx.strokeStyle = "#000000";
                // Draw the outline
                ctx.stroke();
            }
            // User does not want a visible grid
        } else {
            // Set the line width to 1
            ctx.lineWidth = 1;
            // Set the color
            ctx.strokeStyle = `rgb(${RGB})`;
            // Draw the outline
            ctx.stroke();
        }
    }
}
function fillRectangle(
    element,
    x,
    y,
    width,
    height,
    RGB,
    coordinates,
    type,
    DC,
    cover,
    distance,
    elevation
) {
    // Function to fill a rectangle
    if (!cover) {
        cover = "N/A";
    } else {
        cover = cover;
    } // Cover
    if (!DC) {
        DC = "N/A";
    } else {
        DC = DC;
    } // DC
    var terrain = type.split("_"); // Split terrain by "_"
    var ctx = document.getElementById(element).getContext("2d"); // Get context
    // ADD LABELS
    addGrid("square", ctx, RGB, distance, x, y, width, height); // Visible Grid & Paint Tile
    addLabels(
        ctx,
        "dc",
        x + width * 0.15,
        y + height * 0.15,
        DC,
        distance,
        width * 0.125
    ); // DC Label
    addLabels(
        ctx,
        "cover",
        x + width * 0.85,
        y + height * 0.15,
        cover,
        distance,
        width * 0.125
    ); // Cover Label
    addLabels(
        ctx,
        "coordinates",
        x + width / 2,
        y + width * 0.55,
        coordinates,
        distance,
        width * 0.25
    ); // Tile Coordinate Label
    addLabels(
        ctx,
        "terrain",
        x + width * 0.5,
        y + width * 0.95,
        terrain,
        distance,
        width * 0.12
    ); // Terrain Label
    addLabels(
        ctx,
        "elevation",
        x + width * 0.15,
        y + height * 0.15,
        elevation,
        distance,
        width * 0.12
    ); // Elevation Label
}
function fillPolygon(
    element,
    numSides,
    xCenter,
    yCenter,
    size,
    RGB,
    coordinates,
    type,
    DC,
    cover,
    distance,
    elevation,
    width
) {
    // Function to draw a polygon
    if (!cover) {
        cover = "N/A";
    } else {
        cover = cover;
    } // Cover
    if (!DC) {
        DC = "N/A";
    } else {
        DC = DC;
    } // DC
    const terrain = type.split("_"); // Split terrain by "_"
    const hexOptions = document.getElementById("hex-type").value; // Get how the user wants to lay the hexes out
    var ctx = document.getElementById(element).getContext("2d"); // Get context
    // DRAW POLYGON
    ctx.beginPath(); // Start a path
    if (hexOptions.includes("column"))
        ctx.moveTo(xCenter + size * Math.cos(0), yCenter + size * Math.sin(0));
    // Create the shape
    else ctx.moveTo(yCenter + size * Math.sin(0), xCenter + size * Math.cos(0)); // Create the shape
    // Draw the sides
    for (var i = 1; i <= numSides; i++) {
        // Hexagon Columns
        if (hexOptions.includes("column")) {
            const x = xCenter + size * Math.cos((i * 2 * Math.PI) / numSides); // Define x
            const y = yCenter + size * Math.sin((i * 2 * Math.PI) / numSides); // Define y
            ctx.lineTo(x, y); // Draw one of the hexagon edges
            // Hexagon Rows
        } else {
            const y = xCenter + size * Math.cos((i * 2 * Math.PI) / numSides); // Define x
            const x = yCenter + size * Math.sin((i * 2 * Math.PI) / numSides); // Define y
            ctx.lineTo(x, y); // Draw one of the hexagon edges
        }
    }
    addGrid("hex", ctx, RGB, distance); // add the grid if the user wants a grid
    // FILL POLYGON
    ctx.fillStyle = `rgb(${RGB})`; // Set the fill color
    ctx.fill(); // Fill the polygon
    // LABELS
    // Hex Columns
    if (hexOptions.includes("column")) {
        addLabels(
            ctx,
            "dc",
            xCenter - size * 0.4,
            yCenter - size * 0.5,
            DC,
            distance,
            width * 0.04
        ); // DC Label
        addLabels(
            ctx,
            "cover",
            xCenter + size * 0.4,
            yCenter - size * 0.5,
            cover,
            distance,
            width * 0.04
        ); // Cover Label
        addLabels(
            ctx,
            "coordinates",
            xCenter,
            yCenter + size * 0.25,
            coordinates,
            distance,
            size * 0.4
        ); // Tile Coordinate Label
        addLabels(
            ctx,
            "terrain",
            xCenter,
            yCenter + size * 0.8,
            terrain,
            distance,
            size * 0.2
        ); // Terrain Label
        addLabels(
            ctx,
            "elevation",
            xCenter - size * 0.4,
            yCenter - size * 0.5,
            elevation,
            distance,
            size * 0.2
        ); // Elevation Label
    }
    // Hex Rows
    else if (hexOptions.includes("row")) {
        addLabels(
            ctx,
            "dc",
            yCenter - size * 0.4,
            xCenter - size * 0.5,
            DC,
            distance,
            width * 0.04
        ); // DC Label
        addLabels(
            ctx,
            "cover",
            yCenter + size * 0.4,
            xCenter - size * 0.5,
            cover,
            distance,
            width * 0.04
        ); // Cover Label
        addLabels(
            ctx,
            "coordinates",
            yCenter,
            xCenter + size * 0.25,
            coordinates,
            distance,
            size * 0.4
        ); // Tile Coordinate Label
        addLabels(
            ctx,
            "terrain",
            yCenter,
            xCenter + size * 0.7,
            terrain,
            distance,
            size * 0.2
        ); // Terrain Label
        addLabels(
            ctx,
            "elevation",
            yCenter - size * 0.4,
            xCenter - size * 0.5,
            elevation,
            distance,
            size * 0.2
        ); // Elevation Label
    }
}
function redrawCanvasLabels(mapName) {
    // Function to redraw canvas with specified label visible
    const gridType = getSelectedValueFromRadioGroup("grid-type");
    let hexOrientation = null;
    if (gridType == "hex")
        hexOrientation = document.getElementById("hex-type").value;

    const canvas = document.getElementById("battle-map"); // Canvas
    const ctx = canvas.getContext("2d"); // Context

    if (mapName === "choose" && canvas.width === 0)
        return clearCanvas("battle-map");
    // Load the most recently created map if no map is selected
    else if (mapName === "choose") {
        const data = JSON.parse(
            localStorage.getItem("currently-viewing-map-json")
        );
        data.GRID = gridType;
        data.HEX_ORIENTATION = hexOrientation;
        drawJsonOnCanvas(data, "battle-map");
        return;
    }
    // Load the specified map
    else if (mapName) {
        var breakIt = false;
        // const battleMapHistory = JSON.parse(localStorage.getItem('battle-map-history'))
        // var data = battleMapHistory.find(i => i.NAME == mapName)
        const data = mapName;
        data.GRID = gridType;
        data.HEX_ORIENTATION = hexOrientation;
        drawJsonOnCanvas(data, "battle-map");
    } else if (breakIt == false) {
        var data = JSON.parse(
            localStorage.getItem("currently-viewing-map-json")
        );
    }
    if (data)
        localStorage.setItem(
            "currently-viewing-map-json",
            JSON.stringify(data)
        );
}
async function drawJsonOnCanvas(data, canvas) {
    // Function to redraw from JSON data
    const canvasElement = document.getElementById(canvas);
    const currentTileSpan = document.getElementById("current-tile");
    const totalTilesSpan = document.getElementById("number-of-tiles");
    // USER INPUTS
    const grid = data.grid;
    const width = data.width;
    const height = data.height;
    const PPI = data.ppi;
    const biome = data.biome;
    const hexOrientation = data.hex_orientation;
    data = data.TILE_DATA;
    // CONVERT USER INPUTS
    const BIOME = biome.toUpperCase(); // Convert biome to uppercase
    const biomeLower = BIOME.toLowerCase(); // Convert biome to lowercase
    // PULL COLORS
    // let colorData = await fetchLocalJson(`/mikitz-ttrpg/data/json/battle-map-generator/COLORS_${SEASON}`) // Get the colors JSON for the specific season
    let colorData = await fetchLocalJson(
        `/mikitz-ttrpg/data/defaults/bmg-colors-summer`
    ); // Get the colors JSON for the specific season
    console.log(
        "🚀 ~ file: battleMap.js:2081 ~ drawJsonOnCanvas ~ colorData:",
        colorData
    );
    colorData = colorData[BIOME];
    const groundColor = colorData.NORMAL.replaceAll("-", ","); // Get the Ground tile color
    const difficult_terrainColor = colorData.DIFFICULT.replaceAll("-", ","); // Get the Difficult Terrain tile color
    const impasseColor = colorData.COVER.replaceAll("-", ","); // Get the Impass tile color
    const boulderColor = colorData.BOULDER.replaceAll("-", ","); // Get the Boulder tile color
    const treeColor = colorData.TREE.replaceAll("-", ","); // Get the Tree tile color
    const waterColor = colorData.WATER.replaceAll("-", ","); // Get the Water tile color
    const roughWaterColor = colorData.ROUGH_WATER.replaceAll("-", ","); // Get the Rough Water tile color
    const roadColor = colorData.ROAD.replaceAll("-", ","); // Get the Road tile color
    const ctx = canvasElement.getContext("2d");
    // CLEAR CANVAS
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear it
    // REDRAW THE CANVAS
    if (grid === "square") {
        var w = width * PPI;
        var h = height * PPI;
        ctx.canvas.height = h; // Set its height
        ctx.canvas.width = w; // Set its width
        // totalTilesSpan.innerText = data.length
        // Loop through each tile in the JSON
        for (let tile = 0; tile < data.length; tile++) {
            // currentTileSpan.innerText = tile + 1
            // Coordinates
            const coords = data[tile].COORDS;
            const i = coords.split(", ")[0];
            const j = coords.split(", ")[1];
            const cover = data[tile].COVER;
            const elevation = data[tile].ELEVATION;
            const type = data[tile].TYPE;
            const image = data[tile].IMAGE;
            const typeUnchanged = data[tile].TYPE_UNCHANGED; // Type Unchanged
            const color = data[tile].COLOR; // Color
            const DC = "N/A"; // Set the DC to N/A
            const distance = null; // Set Distance to null
            // Square Grid
            if (grid === "square") {
                // if (typeUnchanged.includes('GRASS') || typeUnchanged.includes('MUD')) {
                // addImage(canvas, image, (i * PPI), (j * PPI), PPI * 1) // Add Image
                // } else {
                addImage(canvas, image, i * PPI, j * PPI, PPI * 0.9); // Add Image
                fillRectangle(
                    canvas,
                    i * PPI,
                    j * PPI,
                    PPI,
                    PPI,
                    color,
                    `${i}, ${j}`,
                    type,
                    DC,
                    cover,
                    distance,
                    elevation
                ); // Draw the Tile
                //

                // }
            }
        }
    }
    // Hex Grid
    else {
        // HEXAGON MATH
        const angle = (2 * Math.PI) / 2; // Angle of each edge from center
        const a = PPI / 2; // Edge Length (a)
        const d = PPI; // Long Diagonal (d)
        const s = Math.sqrt(3) * a; // Short Diagonal (s)
        const p = 6 * a; // Perimeter (p)
        const A = (3 / 2) * Math.sqrt(3) * a ** 2; // Area (A)
        const r = (Math.sqrt(3) / 2) * a; // Apothem (r)
        const R = a; // Circumcircle Radius (R)
        const b = Math.sqrt(a ** 2 - r ** 2); // b side of the triangle
        // Hexagon Orientation
        // var hexOrientation = document.getElementById('hex-type').value
        // CANVAS
        if (hexOrientation.includes("column")) {
            ctx.canvas.height = height * (r * 2) + r + 2; // Set canvas height
            ctx.canvas.width = width * (a + b) + b + 2; // Set canvas width
        } else {
            ctx.canvas.width = height * (r * 2) + r + 2; // Set canvas height
            ctx.canvas.height = width * (a + b) + b + 2; // Set canvas width
        }
        // Set the DC to N/A
        const DC = "N/A";
        // Set Distance to null
        const distance = null;
        // CONSTANT VARS
        const xOff = a + 1;
        const yOff = r + 1;
        var x = xOff;
        var y = yOff;
        // ROWS
        if (hexOrientation.includes("row")) {
            for (var i = 0; i < width; i++) {
                // Loop through all the tiles on the x axis
                for (var j = 0; j < height; j++) {
                    // Loop through all tiles on the y axis
                    // GET DATA
                    const cover = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).COVER;
                    const elevation = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).ELEVATION;
                    const type = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).TYPE; // Tile type
                    const image = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).IMAGE;
                    const typeUnchanged = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).TYPE_UNCHANGED;
                    const color = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).COLOR;
                    // Even Rows
                    if (hexOrientation === "row-even") {
                        // COORDINATES
                        const hexCoords = determineHexXandY(
                            i,
                            j,
                            xOff,
                            yOff,
                            hexOrientation,
                            R,
                            b,
                            r
                        );
                        x = hexCoords["x"];
                        y = hexCoords["y"];
                        // Draw it
                        addImage(canvas, image, y - R / 2, x - R / 2, PPI / 2); // Add the image
                        fillPolygon(
                            canvas,
                            6,
                            x,
                            y,
                            R,
                            color,
                            `${i}, ${j}`,
                            type,
                            DC,
                            cover,
                            distance,
                            elevation,
                            width
                        ); // Draw the Tile
                    }
                    // Odd Rows
                    else if (hexOrientation === "row-odd") {
                        // COORDINATES
                        const hexCoords = determineHexXandY(
                            i,
                            j,
                            xOff,
                            yOff,
                            hexOrientation,
                            R,
                            b,
                            r
                        );
                        x = hexCoords["x"];
                        y = hexCoords["y"];
                        // Draw it
                        addImage(canvas, image, y - R / 2, x - R / 2, PPI / 2); // Add the image
                        fillPolygon(
                            canvas,
                            6,
                            x,
                            y,
                            R,
                            color,
                            `${i}, ${j}`,
                            type,
                            DC,
                            cover,
                            distance,
                            elevation,
                            width
                        ); // Draw the Tile
                    }
                }
            }
        }
        // COLUMNS
        else if (hexOrientation.includes("column")) {
            for (var i = 0; i < width; i++) {
                // Loop through all the tiles on the x axis
                for (var j = 0; j < height; j++) {
                    // Loop through all tiles on the y axis
                    // GET DATA
                    const cover = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).COVER;
                    const elevation = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).ELEVATION;
                    const type = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).TYPE; // Tile type
                    const image = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).IMAGE;
                    const typeUnchanged = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).TYPE_UNCHANGED;
                    const color = data.find(
                        (tile) => tile.COORDS === `${i}, ${j}`
                    ).COLOR;
                    // Even Columns
                    if (hexOrientation === "column-even") {
                        // COORDINATES
                        const hexCoords = determineHexXandY(
                            i,
                            j,
                            xOff,
                            yOff,
                            hexOrientation,
                            R,
                            b,
                            r
                        );
                        x = hexCoords["x"];
                        y = hexCoords["y"];
                        // Draw it
                        addImage(canvas, image, x - R / 2, y - R / 2, PPI / 2); // Add the image
                        fillPolygon(
                            canvas,
                            6,
                            x,
                            y,
                            R,
                            color,
                            `${i}, ${j}`,
                            type,
                            DC,
                            cover,
                            distance,
                            elevation,
                            width
                        ); // Draw the Tile
                    }
                    // Odd Columns
                    else if (hexOrientation === "column-odd") {
                        // COORDINATES
                        const hexCoords = determineHexXandY(
                            i,
                            j,
                            xOff,
                            yOff,
                            hexOrientation,
                            R,
                            b,
                            r
                        );
                        x = hexCoords["x"];
                        y = hexCoords["y"];
                        // Draw it
                        addImage(canvas, image, x - R / 2, y - R / 2, PPI / 2); // Add the image
                        fillPolygon(
                            canvas,
                            6,
                            x,
                            y,
                            R,
                            color,
                            `${i}, ${j}`,
                            type,
                            DC,
                            cover,
                            distance,
                            elevation,
                            width
                        ); // Draw the Tile
                    }
                }
            }
        }
    }
    // DRAW THE KEY
    drawKey(
        "legend",
        groundColor,
        difficult_terrainColor,
        impasseColor,
        boulderColor,
        treeColor,
        waterColor,
        roughWaterColor,
        roadColor
    );
}
function drawKey(
    elementID,
    groundColor,
    difficult_terrainColor,
    impasseColor,
    boulderColor,
    treeColor,
    waterColor,
    roughWaterColor,
    roadColor
) {
    // Function to build the key
    // Get the element
    var key = document.getElementById(elementID);
    // Empty it
    if (key) {
        key.innerHTML = "";
        // List of terrain types
        const terrains = [
            "ground",
            "difficult_terrain",
            "impasse",
            "road",
            "water",
            "roughWater",
        ];
        const terrainColorMap = [];
        // Loop through each terrain type
        terrains.forEach((element) => {
            const terrainColor = eval(`${element}Color`);
            // Set up Terrain Data div
            const terrainDataDiv = document.createElement("div");
            terrainDataDiv.className = "terrain-data";
            terrainDataDiv.id = `${element}-container`;
            if (element == "ground")
                terrainDataDiv.classList.add("active-tool");
            if (element == "ground")
                localStorage.setItem("active-tool", "Ground");
            const terrainColorDiv = document.createElement("div");
            terrainColorDiv.className = "terrain-color";
            const terrainLabelDiv = document.createElement("div");
            terrainLabelDiv.className = "terrain-label";
            element = element
                .replace("_", " ")
                .replace("Water", " Water")
                .toTitleCase();
            terrainLabelDiv.innerText = element;
            terrainDataDiv.id = `${element}-container`;

            const canvas = document.createElement("canvas");
            canvas.height = 40;
            canvas.width = 40;
            canvas.id = element;
            canvas.addEventListener("click", function () {
                localStorage.setItem("active-tool", element);
                const containers = document.querySelectorAll(".terrain-data");
                for (let index = 0; index < containers.length; index++) {
                    const element = containers[index];
                    element.classList.remove("active-tool");
                }
                const container = document.getElementById(
                    `${element}-container`
                );
                container.classList.add("active-tool");
            });
            ctx = canvas.getContext("2d");
            ctx.fillStyle = `rgb(${terrainColor})`;
            ctx.fillRect(0, 0, 40, 40);

            terrainColorDiv.appendChild(canvas);

            terrainDataDiv.appendChild(terrainColorDiv);
            terrainDataDiv.appendChild(terrainLabelDiv);

            key.appendChild(terrainDataDiv);

            terrainColorMap.push({
                TERRAIN: element,
                COLOR: terrainColor,
            });
            localStorage.setItem("key-colors", JSON.stringify(terrainColorMap));
        });
    }
}
// ========= Settings ==========
function saveSettings(elementID) {
    // Function to save settings
    const value = document.getElementById(elementID).value.toLowerCase();
    localStorage.setItem(elementID, value);
}
function setupSettingsListners() {
    document
        .getElementById("world-name")
        .addEventListener("input", function () {
            saveSettings(this.id);
        });
}
function setupSettings() {
    document.getElementById("world-name").value =
        localStorage.getItem("world-name");
}
