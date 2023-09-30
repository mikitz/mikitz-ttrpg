# Change Log

### Alpha 4 -- WIP
-   [ ] Real-time interactivity
    - https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
    - https://stackoverflow.com/questions/24562414/why-does-canvas-re-render-the-entire-canvas-rather-than-only-a-specific-portion
-   [ ] Set zoom level automatically based on element size so that the whole map is visible
-   [ ] Backend | Algo -- Implemented hills
    -   [ ] Settings | Tile Probability -- added table to adjust the probability of a hill tile occurring by biome
    -   [ ] Settings | Hill Size -- added a table to adjust the size of the cliffs by biome
-   [ ] Backend | Algo -- Implemented cliffs
    -   [ ] Settings | Tile Probability -- added table to adjust the probability of a cliff tile occurring by biome
    -   [ ] Settings | Cliff Size -- added a table to adjust the size of the cliffs by biome

### Alpha 3 -- WIP
-   [x] UX | Map Tools -- Added four map tools: rotate clockwise/counterclockwise, and flip horizontally/vertically
-   [ ] UX | Presets -- Added presets for dimensions
-   [ ] UX | Dimension Tools -- Added a dimensions calculator based on common TV sizes and resolutions
-   [ ] UI | History -- View icon now properly displays the battle map when clicked
-   [ ] Backend | Algo -- Implemented season
-   [ ] Backend | Algo -- Implemented climate
-   [ ] Backend | Algo -- Implemented road
    -   [ ] Settings | ... ---
    -   [ ] Settings | ... ---
-   [ ] Backend | Algo -- Implemented river
    -   [ ] Settings | ... ---
    -   [ ] Settings | ... ---
-   [ ] Backend | Export -- fixed WEBP, PNG, UVTT, and FVTT exports
 
### Alpha 2 -- 6/6/2023
-   [x] Seeds
-   [x] UI | Seeds -- Random seed button
-   [x] UI | Generation -- added a loading indicator when the battle map is generating
-   [x] UI | Features -- Updated this to be a 3-button radio group: NO, RANDOM (per settings), and YES
-   [x] UX | Settings
    -   [x] Settings | MVP -- added summer colors, biome features, biome terrain types, cover type, cover, cliff probabilities, hill probabilities, difficult terrain probabilities, normal terrain probabilities, and water type to settings.
    -   [x] Settings | Tile Label Defaults -- added a setting to set defaults for each label (visibility, opacity)
    -   [x] Settings | Grid Size Default -- added a setting to allow the user to set a default grid size
    -   [x] Settings | Hex Type -- added a setting to allow the user to select a default hex type when hex grid is chosen 
    -   [x] Settings | Grid Type -- added a setting to allow the user to select a default grid type 
    -   [x] Settings | Height -- added a setting to allow the user to select a default map height 
    -   [x] Settings | Width -- added a setting to allow the user to select a default map width
-   [x] UI | Copy Seed -- Added a button to copy the seed as a URL
-   [x] UX | Generate Map from URL -- If a map seed is in the URL, then a map is automatically generated using that seed

### Alpha 1 -- 5/21/2023
-   [x] Added history table
-   [x] New UI with only one side panel