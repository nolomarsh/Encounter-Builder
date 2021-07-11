# Encounter-Builder

This project is a first attempt at a fully functional application based around making an AJAX request to an API. I chose the open5e API, containing data about Dungeons & Dragons 5th Edition. The first portion of the application is an encounter builder including a filterable list of monsters from the SRD Monster Manual, as well as some third party sources. The second portion is a filterable spell list with all data coming from the Player's Handbook.

## The Apps
### Encounter Builder

This app features a filterable list of monsters from the API's sources. The searchbar allows a user to input a string and causes the table to return any monsters whose name contain that string. The dropdowns allow the user to filter by challenge rating, creature type, and alignment, and a checkbox allows the user to exclude 3rd-party content. The table refreshes on each change to the filters, pulling up to 50 items per request which fit the search criteria. An event listener also prompts the application to load more items when the user scrolls to the end of the list, so long as more items exist.

Clicking the info icon for a monster opens a modal card containing deeper details about the monster including abilities scores, special abilities, and the various actions that the monster may take. Clicking the modal causes it to close, so the user need not scroll within the modal to find a close button.

Clicking the "+" button at the right end of a row adds the monster to the current working encounter, in blue. The encounter table displays name, count, and individual experience value of each type of monster in the encounter, as well as the adjusted experience value of the encounter based on Dungeon Master's Guide specifications, and compares it to the various experience thresholds provided by the DMG for the user's given party size and average level in order to display the estimated difficulty of the encounter.


### Spell List

This app incorporates much of the same functionality as the encounter builder, minus the encounter table itself. Users may enter a string or search criteria in the dropdowns to filter the list of spells. Clicking the info button toggles the modal row for the given spell, displaying deeper details about the spell's effects.

## General Comments

The API had many branches for different types of game information, but I was a little disappointed to discover how little data was in most of the other branches/how poorly it was formatted. I hoped to make a small character builder application, but given that each class had only a single subclass listed and the fact that each class's entire list of class features was given in a single string, I opted not to.

I attempted to add a save functionality so that you could save an encounter to local storage and load it later, but the limitations of localStorage, namely that it can really only store strings, meant that it would have taken me considerably more time than I allotted myself to convert the monster table into a string which can be parsed back apart into useful info. It's doable, but felt like a much larger undertaking than I had anticipated so I put it on the backburner until I ran out of time.

I feel compelled to also formally note on here that - and if you've talked to me for ten minutes, you've heard me say it about a dozen times -  I am not much of a designer. I spent considerable time fiddling with colors and fonts before ultimately deciding that they all either looked the same or looked silly. I think the color palette works decently enough, and the font is easily readable on desktop and mobile so I decided to leave it as default.
