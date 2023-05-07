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