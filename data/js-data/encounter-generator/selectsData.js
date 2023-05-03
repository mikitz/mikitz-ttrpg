let biome = [
    "Arctic",
    "Desert",
    "Forest",
    "Grassland",
    "Hill",
    "Jungle",
    "Mountain",
    "Open-Water",
    "Swamp",
    "Underdark",
    "Underwater",
    "Woodland",
];
let climate = ["Arid-Dry", "Continental", "Polar", "Temperate", "Tropical"];
let landform = [
    "Default",
    "Coast",
    "Farm",
    "Hamlet",
    "Village",
    "Town",
    "City",
    "Dungeon",
    "Cave",
    "Island",
    "Penninsula",
];
let plane = [
    "Material",
    "Acheron",
    "Air",
    "Arborea",
    "Arcadia",
    "Astral",
    "Bytopia",
    "Carceri",
    "Earth",
    "Elemental Chaos",
    "Elysium",
    "Ethereal",
    "Far Realm",
    "Feywild",
    "Fire",
    "Gehenna",
    "Hades",
    "Limbo",
    "Mechanus",
    "Mount Celestia",
    "Pandemonium",
    "Shadowfell",
    "The Abyss",
    "The Beastlands",
    "The Nine Hells",
    "Water",
    "Ysgard",
];
let season = ["Spring", "Summer", "Fall", "Winter"];
let hexType = [
    "Hex Rows - Odd",
    "Hex Rows - Even",
    "Hex Columns - Odd",
    "Hex Columns - Even",
];
let road = ["NO_ROAD","HIGHWAY","BYWAY","ROYALWAY","BRIDLEWAY"];
let travelMedium = ["Ground", "Air", "Water"];
let pace = ["Normal", "Slow", "Fast"];
let time = ["Day", "Night"];

let biomeIcons = {
    "Arctic": '<i class="fa-solid fa-icicles"></i>',
    "Desert": '<i class="fa-solid fa-umbrella-beach"></i>',
    "Forest": '<i class="fa-solid fa-tree"></i>',
    "Grassland": '<i class="fa-solid fa-wheat-awn"></i>',
    "Hill": '<i class="fa-solid fa-mound"></i>',
    "Jungle": '<i class="fa-solid fa-sun-plant-wilt"></i>',
    "Mountain": '<i class="fa-solid fa-mountain"></i>',
    "Open-Water": '<i class="fa-solid fa-water"></i>',
    "Swamp": '<i class="fa-solid fa-spa"></i>',
    "Underdark": '<i class="fa-solid fa-gem"></i>',
    "Underwater": '<i class="fa-solid fa-fish"></i>',
    "Woodland": '<i class="fa-solid fa-seedling"></i>'
}
let climateIcons = {
    "Arid-Dry": '<i class="fa-regular fa-sun"></i>',
    "Continental": '<i class="fa-solid fa-mountain-sun"></i>',
    "Polar": '<i class="fa-solid fa-icicles"></i>',
    "Temperate": '<i class="fa-solid fa-sun-plant-wilt"></i>',
    "Tropical": '<i class="fa-solid fa-umbrella-beach"></i>'
}
let travelMediumIcons = {
    "Ground": '<i class="fa-solid fa-car"></i>',
    "Air": '<i class="fa-solid fa-dove"></i>',
    "Water": '<i class="fa-solid fa-ship"></i>'
}
let timeIcons = {
    "Day": '<i class="fa-solid fa-sun"></i>',
    "Night": '<i class="fa-solid fa-moon"></i>'
}
let paceIcons = {
    "Normal": '<i class="fa-solid fa-person-walking"></i>',
    "Slow": '<i class="fa-solid fa-person-walking-with-cane"></i>',
    "Fast": '<i class="fa-solid fa-person-walking-arrow-right"></i>'
}
let roadIcons = {
    "NO_ROAD": '<i class="fa-solid fa-road-circle-xmark"></i>',
    "HIGHWAY": '<i class="fa-solid fa-road"></i>',
    "BYWAY": '<i class="fa-solid fa-road-circle-exclamation"></i>',
    "ROYALWAY": '<i class="fa-solid fa-road-circle-check"></i>',
    "BRIDLEWAY": '<i class="fa-solid fa-road-lock"></i>',
}
let seasonIcons = {
    "Spring": '<i class="fa-solid fa-cloud-sun-rain"></i>',
    "Summer": '<i class="fa-solid fa-umbrella-beach"></i>',
    "Fall": '<i class="fa-solid fa-wind"></i>',
    "Winter": '<i class="fa-solid fa-snowflake"></i>'
}
// let table_settingsTables = ['encounter_probabilities','road_modifiers','pace_modifiers','difficulty_probabilities','cr_adjustment_probabilities','parties']
let table_settingsTables = ['encounter_probabilities','road_modifiers','pace_modifiers','difficulty_probabilities','parties']
let sources1 = [
    {"ABBREVIATION":"AAG","FULL_NAME":"Astral Adventure Guide","SELECTED":true},
    {"ABBREVIATION":"AI","FULL_NAME":"Acquisitions Incorporated","SELECTED":true},
    {"ABBREVIATION":"AitFR-AVT","FULL_NAME":"Adventures in the Forgotten Realms: A Verdant Tomb","SELECTED":true},
    {"ABBREVIATION":"AitFR-THP","FULL_NAME":"Adventures in the Forgotten Realms: The Hidden Page","SELECTED":true},
    {"ABBREVIATION":"AZfyT","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"BAM","FULL_NAME":"Boo's Astral Menagerie","SELECTED":true},
    {"ABBREVIATION":"BGDIA","FULL_NAME":"Baldur's Gate: Descent into Avernus","SELECTED":true},
    {"ABBREVIATION":"CM","FULL_NAME":"Candlekeep Mysteries","SELECTED":true},
    {"ABBREVIATION":"CoS","FULL_NAME":"Curse of Strahd","SELECTED":true},
    {"ABBREVIATION":"CRCotN","FULL_NAME":"Critical Role: Call of the Netherdeep","SELECTED":true},
    {"ABBREVIATION":"DC","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"DMG","FULL_NAME":"Dungeon Master's Guide","SELECTED":true},
    {"ABBREVIATION":"DSotDQ","FULL_NAME":"Dragonlance: Shadow of the Dragon Queen","SELECTED":true},
    {"ABBREVIATION":"EET","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"EGW","FULL_NAME":"Explorer's Guide to Wildemount","SELECTED":true},
    {"ABBREVIATION":"ERLW","FULL_NAME":"Eberron: Rising from the Last Ware","SELECTED":true},
    {"ABBREVIATION":"FTD","FULL_NAME":"Fizban's Treasury of Dragons","SELECTED":true},
    {"ABBREVIATION":"GGR","FULL_NAME":"Guildmaster's Guide to Ravnica","SELECTED":true},
    {"ABBREVIATION":"GoS","FULL_NAME":"Ghosts of Saltmarsh","SELECTED":true},
    {"ABBREVIATION":"HAT-LMI","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"HftT","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"HotDQ","FULL_NAME":"Hoard of the Dragon Queen","SELECTED":true},
    {"ABBREVIATION":"IDRotF","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"IMR","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"JttRC","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"KftGV","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"LLK","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"LMoP","FULL_NAME":"Lost Mine of Phandelver","SELECTED":true},
    {"ABBREVIATION":"LoX","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"MCV2DC","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"MM","FULL_NAME":"Monster Manual","SELECTED":true},
    {"ABBREVIATION":"MOT","FULL_NAME":"Mythic Odysseys of Theros","SELECTED":true},
    {"ABBREVIATION":"MTF","FULL_NAME":"Mordenkainen's Tome of Foes","SELECTED":true},
    {"ABBREVIATION":"NRH-AT","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"NRH-TLT","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"OGA","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"OotA","FULL_NAME":"Out of the Abyss","SELECTED":true},
    {"ABBREVIATION":"PHB","FULL_NAME":"Player's Handbook","SELECTED":true},
    {"ABBREVIATION":"PotA","FULL_NAME":"Princes of the Apocalypse","SELECTED":true},
    {"ABBREVIATION":"PSX","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"RMBRE","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"RoT","FULL_NAME":"Rise of Tiamat","SELECTED":true},
    {"ABBREVIATION":"RoTOS","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"SCAG","FULL_NAME":"Sword Coast Adventurer's Guide","SELECTED":true},
    {"ABBREVIATION":"SCC","FULL_NAME":"Strixhaven: A Curriculum of Chaos","SELECTED":true},
    {"ABBREVIATION":"SDW","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"SKT","FULL_NAME":"Storm King's Thunder","SELECTED":true},
    {"ABBREVIATION":"TCE","FULL_NAME":"Tasha's Cauldron of Everything","SELECTED":true},
    {"ABBREVIATION":"TftYP","FULL_NAME":"Tales from the Yawning Portal","SELECTED":true},
    {"ABBREVIATION":"ToA","FULL_NAME":"Tomb of Annihilation","SELECTED":true},
    {"ABBREVIATION":"TTP","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"UAWGE","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"VGM","FULL_NAME":"Volo's Guide to Monsters","SELECTED":true},
    {"ABBREVIATION":"VRGR","FULL_NAME":"Van Richten's Guide to Ravenloft","SELECTED":true},
    {"ABBREVIATION":"WBtW","FULL_NAME":"","SELECTED":true},
    {"ABBREVIATION":"WDH","FULL_NAME":"Waterdeep: Dragon Heist","SELECTED":true},
    {"ABBREVIATION":"WDMM","FULL_NAME":"Waterdeep: Dungeon of the Mad Mage","SELECTED":true},
    {"ABBREVIATION":"XGE","FULL_NAME":"Xanathar's Guide to Everything","SELECTED":true},
    {"ABBREVIATION":"XMtS","FULL_NAME":"X Marks the Spot","SELECTED":true}
]