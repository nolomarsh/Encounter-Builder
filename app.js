$( () => {

    const search = {
        //Options arrays let me use functions to populate my selects, making the code DRYer
        crOptions: ['0','1/8','1/4','1/2','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
        typeOptions: ['aberration','beast','celestial','construct','dragon','elemental','fey','fiend','giant','humanoid','monstrosity','ooze','plant','undead'],
        populateSelects: () => {
            for (let option of search.crOptions) {
                $option = $('<option>').attr('value',`${option}`).text(`${option}`).appendTo($('#crDrop'))
            }
            for (let option of search.typeOptions) {
                $option = $('<option>').attr('value',`${option}`).text(`${option}`).appendTo($('#typeDrop'))
            }
        }

    }


    //object containing variables and methods related to the encounter box
    const encounter = {
        $table: $('.encounterTable'),
        count: 0,
        monsters: [],
        exp: 0,
        crToExpTable: {
            '0': 10,
            '1/8': 25,
            '1/4': 50,
            '1/2': 100,
            '1': 200,
            '2': 450,
            '3': 700,
            '4': 1100,
            '5': 1800,
            '6': 2300,
            '7': 2900,
            '8': 3900,
            '9': 5000,
            '10': 5900,
            '11': 7200,
            '12': 8400,
            '13': 10000,
            '14': 11500,
            '15': 13000,
            '16': 15000,
            '17': 18000,
            '18': 20000,
            '19': 22000,
            '20': 25000,
            '21': 33000,
            '22': 41000,
            '23': 50000,
            '24': 62000,
            '25': 75000,
            '26': 90000,
            '27': 105000,
            '28': 120000,
            '29': 135000,
            '30': 155000
        },
        add: inMonster => {
            //Whether or not the monster is already in the monsters array, increment total count
            //if the monster is already in the monsters array, increment its count
            for (let object of encounter.monsters) {
                if (object.name === inMonster.name){
                    object.count++
                    encounter.count++
                    return
                }
            }
            //if it isn't, create an object with its name and exp value(based on CR), with initial count 1, and add it to the monsters array
            const monObject = {
                name: inMonster.name,
                exp: encounter.crToExp(inMonster.challenge_rating),
                count: 1,
                fullData: inMonster,
            }
            encounter.monsters.push(monObject)
            encounter.count++
        },
        //turn a monster's cr into the corresponding exp value
        crToExp: cr => {
            for (let key in encounter.crToExpTable) {
                if (`${cr}` === key) {
                    return encounter.crToExpTable[key]
                }
            }
        },
        //based on the number of monsters and the 5e encounter building rules, calculate the adjusted exp of the encounter
        adjustExp: () => {
            let sum = 0;
            for (let monster of encounter.monsters) {
                sum += (monster.exp * monster.count)
            }
            if (encounter.count === 1) {
                encounter.exp = sum
            } else if (encounter.count === 2) {
                encounter.exp = sum * 1.5
            } else if (encounter.count <= 6) {
                encounter.exp = sum * 2
            } else if (encounter.count <= 10) {
                encounter.exp = sum * 2.5
            } else if (encounter.count <= 14) {
                encounter.exp = sum * 3
            } else if (encounter.count >= 15) {
                encounter.exp = sum * 4
            }
        },
        //update the encounter table to reflect changes to the monsters array
        refreshTable: () => {
            //clear all rows but the header row
            $('.encounterRow').remove()
            //update the encounter adjusted EXP
            encounter.adjustExp()
            //create a row for each unique type of monster in the encounter, including how many of each kind and their individual experience value
            for (let object of encounter.monsters) {
                $row = $('<tr>').addClass('encounterRow').appendTo(encounter.$table)
                $nameCell = $('<td>').text(`${object.count} x ${object.name}`).appendTo($row)
                $exp = $('<td>').text(object.exp).appendTo($row)
            }
            //create a final row displaying adjusted encounter exp
            $expRow = $('<tr>').addClass('encounterRow resultsRow').appendTo(encounter.$table)
            $text = $('<th>').text('Adjusted Exp:').appendTo($expRow)
            $adjExp = $('<th>').text(`${encounter.exp}`).appendTo($expRow)
        },
    }

    const addSearchResult = (monster) => {
        $tr = $('<tr>').addClass('searchResult').appendTo($('#searchResults'))
        $name = $('<td>').text(monster.name).appendTo($tr)
        $infoIcon = $('<i>').addClass("fas fa-info-circle")
        $name.prepend($infoIcon)
        $cr = $('<td>').text(monster.challenge_rating + ` (${encounter.crToExp(monster.challenge_rating)})`).appendTo($tr)
        $type = $('<td>').text(monster.type).appendTo($tr)
        $alignment = $('<td>').text(monster.alignment).appendTo($tr)
        $addCell = $('<td>').appendTo($tr)
        $add = $('<i>').addClass("fas fa-plus").appendTo($addCell)
        $infoIcon.click( () => {
            populateCard(monster)
        })
        $add.click( (e) => {
            encounter.add(monster)
            encounter.refreshTable()
        })
    }

    const populateCard = (monster) => {
        $('#cardName').text(monster.name)
        $('#cardTypes').text(`${monster.size} ${monster.type}, ${monster.alignment}`)
        //AC logic
        if (monster.armor_desc){
            $('#cardAC').text(`${monster.armor_class} (${monster.armor_desc})`)
        } else {
            $('#cardAC').text(`${monster.armor_class}`)
        }
        //Speed logic
        const moveTypes = ['fly','swim','climb','burrow']
        $('#cardSpeeds').empty()
        $('<span>').text(`${monster.speed.walk}ft`).appendTo('#cardSpeeds')
        for (let move of moveTypes) {
            if (Object.keys(monster.speed).includes(move)){
                $('<span>').text(`, ${move} ${monster.speed[move]}ft`).appendTo('#cardSpeeds')
            }
        }
        //HP
        $('#cardHP').text(`${monster.hit_points} (${monster.hit_dice})`)
        //CR
        $('#cardCR').text(`${monster.challenge_rating} (${encounter.crToExp(monster.challenge_rating)})`)
        //Ability Scores
        $('#cardStr').text(monster.strength)
        $('#cardDex').text(monster.dexterity)
        $('#cardCon').text(monster.constitution)
        $('#cardInt').text(monster.intelligence)
        $('#cardWis').text(monster.wisdom)
        $('#cardCha').text(monster.charisma)
        //traits
        
    }

    $('#crDrop').change( (e) => {
        e.preventDefault()
        console.log($('#crDrop').val());
        return false
    })

    search.populateSelects()

    const dragon = {
            "slug": "adult-black-dragon",
            "name": "Adult Black Dragon",
            "size": "Huge",
            "type": "dragon",
            "subtype": "",
            "group": "Black Dragon",
            "alignment": "chaotic evil",
            "armor_class": 19,
            "armor_desc": "natural armor",
            "hit_points": 195,
            "hit_dice": "17d12+85",
            "speed": {
                "walk": 40,
                "fly": 80,
                "swim": 40
            },
            "strength": 23,
            "dexterity": 14,
            "constitution": 21,
            "intelligence": 14,
            "wisdom": 13,
            "charisma": 17,
            "strength_save": null,
            "dexterity_save": 7,
            "constitution_save": 10,
            "intelligence_save": null,
            "wisdom_save": 6,
            "charisma_save": 8,
            "perception": 11,
            "skills": {
                "perception": 11,
                "stealth": 7
            },
            "damage_vulnerabilities": "",
            "damage_resistances": "",
            "damage_immunities": "acid",
            "condition_immunities": "",
            "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
            "languages": "Common, Draconic",
            "challenge_rating": "14",
            "actions": [
                {
                    "name": "Multiattack",
                    "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
                },
                {
                    "name": "Bite",
                    "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage.",
                    "attack_bonus": 11,
                    "damage_dice": "2d10+1d8",
                    "damage_bonus": 6
                },
                {
                    "name": "Claw",
                    "desc": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.",
                    "attack_bonus": 11,
                    "damage_dice": "2d6",
                    "damage_bonus": 6
                },
                {
                    "name": "Tail",
                    "desc": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.",
                    "attack_bonus": 11,
                    "damage_dice": "2d8",
                    "damage_bonus": 6
                },
                {
                    "name": "Frightful Presence",
                    "desc": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
                },
                {
                    "name": "Acid Breath (Recharge 5-6)",
                    "desc": "The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one.",
                    "attack_bonus": 0,
                    "damage_dice": "12d8"
                }
            ],
            "reactions": "",
            "legendary_desc": "The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.",
            "legendary_actions": [
                {
                    "name": "Detect",
                    "desc": "The dragon makes a Wisdom (Perception) check."
                },
                {
                    "name": "Tail Attack",
                    "desc": "The dragon makes a tail attack."
                },
                {
                    "name": "Wing Attack (Costs 2 Actions)",
                    "desc": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
                }
            ],
            "special_abilities": [
                {
                    "name": "Amphibious",
                    "desc": "The dragon can breathe air and water."
                },
                {
                    "name": "Legendary Resistance (3/Day)",
                    "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
                }
            ],
            "spell_list": [],
            "img_main": null,
            "document__slug": "wotc-srd",
            "document__title": "Systems Reference Document",
            "document__license_url": "http://open5e.com/legal"
        }

    // populateCard(dragon)

    $.ajax({
        url:'https://api.open5e.com/monsters/',
        data: {
            limit : 50,
            page: 1,
            document__slug: 'wotc-srd',
        }
    }).then( (data) => {
        for (let monster of data.results) {
            addSearchResult(monster)
        };
    },
    () => {
        console.log('bad request');
    })
})
