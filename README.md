# Encounter-Builder

This project is a first attempt at a fully functional application based around making an AJAX request to an API. I chose the open5e API, containing data about Dungeons & Dragons 5th Edition. The first portion of the application is an encounter builder including a filterable list of monsters from the SRD Monster Manual, as well as some third party sources. The second portion is a filterable spell list with all data coming from the Player's Handbook.

## The Apps
### Encounter Builder

This app features a filterable list of monsters from the API's sources. The searchbar allows a user to input a string and causes the table to return any monsters whose name contain that string. The dropdowns allow the user to filter by challenge rating, creature type, and alignment, and a checkbox allows the user to exclude 3rd-party content. The table refreshes on each change to the filters, pulling up to 50 items per request which fit the search criteria. An event listener also prompts the application to load more items when the user scrolls to the end of the list, so long as more items exist.

Clicking the info icon for a monster opens a modal card containing deeper details about the monster including abilities scores, special abilities, and the various actions that the monster may take. Clicking the modal causes it to close, so the user need not scroll within the modal to find a close button.

Clicking the "+" button at the right end of a row adds the monster to the current working encounter, in blue. The encounter table displays name, count, and individual experience value of each type of monster in the encounter, as well as the adjusted experience value of the encounter based on Dungeon Master's Guide specifications, and compares it to the various experience thresholds provided by the DMG for the user's given party size and average level in order to display the estimated difficulty of the encounter.


### Spell List

This app incorporates much of the same functionality as the encounter builder, minus the encounter table itself. Users may enter a string or search criteria in the dropdowns to filter the list of spells. Clicking the info button toggles the modal row for the given spell, displaying deeper details about the spell's effects.

