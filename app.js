$( () => {

    const search = {
        //Options arrays let me use functions to populate my selects, making the code DRYer
        crChoice: '',
        typeChoice: '',
        alignmentChoice: '',
        officialOnly: false,
        pageNum: 1,
        totalResults: 0,
        crOptions: ['0','1/8','1/4','1/2','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
        typeOptions: ['aberration','beast','celestial','construct','dragon','elemental','fey','fiend','giant','humanoid','monstrosity','ooze','plant','undead'],
        alignmentOptions: ['lawful good','neutral good','chaotic good','lawful neutral','neutral','chaotic neutral','lawful evil','neutral evil','chaotic evil','unaligned'],
        populateSelects: () => {
            for (let option of search.crOptions) {
                $option = $('<option>').attr('value',`${option}`).text(`${option}`).appendTo($('#crDrop'))
            }
            for (let option of search.typeOptions) {
                $option = $('<option>').attr('value',`${option}`).text(`${option}`).appendTo($('#typeDrop'))
            }
            for (let option of search.alignmentOptions) {
                $option = $('<option>').attr('value',`${option}`).text(`${option}`).appendTo($('#alignmentDrop'))
            }
        },
        //appends a tr containing all of the info for the entry to the search results table
        printResult: (monster) => {
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
        },
        run: () => {
            if (search.pageNum === 1) {
                $('.searchResult').remove()
            }
            //makes the officialOnly boolean determine whether 3rd party content is displayed
            let sourceFilter = ''
            if (search.officialOnly){
                sourceFilter = 'wotc-srd'
            }
            $.ajax({
                url:'https://api.open5e.com/monsters/',
                data: {
                    limit : 50,
                    page: search.pageNum,
                    document__slug: 'wotc-srd',
                    challenge_rating: search.crChoice,
                    type: search.typeChoice,
                    alignment: search.alignmentChoice,
                    document__slug: sourceFilter
                }
            }).then( (data) => {
                for (let monster of data.results) {
                    search.printResult(monster)
                }
                console.log(data);
                search.totalResults = data.count
            },
            () => {
                console.log('bad request');
            })
        }
    }


    //object containing variables and methods related to the encounter box
    const encounter = {
        $table: $('.encounterTable'),
        partySize: 1,
        partyLevel: 1,
        count: 0,
        monsters: [],
        exp: 0,
        expThresholdsByLevel: {
            1: [25,50,75,100],
            2: [50,100,150,200],
            3: [75,150,225,400],
            4: [125,250,375,500],
            5: [250,500,750,1100],
            6: [300,600,900,1400],
            7: [350,750,1100,1700],
            8: [450,900,1400,2100],
            9: [550,1100,1600,2400],
            10: [600,1200,1900,2800],
            11: [800,1600,2400,3600],
            12: [1000,2000,3000,4500],
            13: [1100,2200,3400,5100],
            14: [1250,2500,3800,5700],
            15: [1400,2800,4300,6400],
            16: [1600,3200,4800,7200],
            17: [2000,3900,5900,8800],
            18: [2100,4200,6300,9500],
            19: [2400,4900,7300,10900],
            20: [2800,5700,8500,12700]
        },
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
        getDifficulty: () => {
            const partyThresholdEasy = encounter.partySize * encounter.expThresholdsByLevel[encounter.partyLevel][0]
            const partyThresholdMedium = encounter.partySize * encounter.expThresholdsByLevel[encounter.partyLevel][1]
            const partyThresholdHard = encounter.partySize * encounter.expThresholdsByLevel[encounter.partyLevel][2]
            const partyThresholdDeadly = encounter.partySize * encounter.expThresholdsByLevel[encounter.partyLevel][3]
            if (encounter.exp < partyThresholdEasy) {
                return 'Trivial'
            } else if (encounter.exp < partyThresholdMedium) {
                return 'Easy'
            } else if (encounter.exp < partyThresholdHard) {
                return 'Medium'
            } else if (encounter.exp < partyThresholdDeadly) {
                return 'Hard'
            } else {
                return 'Deadly'
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
                $nameCell.click( (e) => {
                    object.count--
                    if (object.count === 0) {
                        // console.log(encounter.monsters.indexOf(object));
                        encounter.monsters.splice(encounter.monsters.indexOf(object),1)
                    }

                    encounter.refreshTable()
                })
            }
            if (encounter.monsters.length > 0){
                //create a final row displaying adjusted encounter exp
                $expRow = $('<tr>').addClass('encounterRow resultsRow').appendTo(encounter.$table)
                $text = $('<th>').text('Adjusted Exp:').appendTo($expRow)
                $adjExp = $('<th>').text(`${encounter.exp}`).appendTo($expRow)
                //create a row to display encounter difficulty for the selected party
                $difRow = $('<tr>').addClass('encounterRow').appendTo(encounter.$table)
                $difText = $('<th>').text('Difficulty:').appendTo($difRow)
                $difficulty = $('<th>').text(encounter.getDifficulty()).appendTo($difRow)
            }
        },
        populateSelects: () => {
            for (let i = 1; i <= 8; i++) {
                const $option = $('<option>').attr('value',i).text(i).appendTo($('#partySizeDrop'))
                if (i === 4) {
                    $option.attr('selected',true)
                }
            }
            for (let i = 1; i <= 20; i++) {
                $('<option>').attr('value',i).text(i).appendTo($('#partyLevelDrop'))
            }
        }
    }

    //Turns lowercase key names with underscores into separate, capitalized words
    const toCapString = string => {
        let splitString = string.split('_')
        // for (let word of splitString) {
        //     word = word.slice(0,1).toUpperCase() + word.slice(1)
        //     console.log(word);
        // }
        for (let i = 0; i < splitString.length; i++) {
            splitString[i] = splitString[i].slice(0,1).toUpperCase() + splitString[i].slice(1)
        }
        return splitString.join(' ')
    }

    const populateCard = (monster) => {
        $('#infoCard').show().css('transform','scale(1)')
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
        $('#cardTraits').empty()
        //saves
        let hasSave = false
        const saves = ['Strength_save','Dexterity_save','Constitution_save','Intelligence_save','Wisdom_save','Charisma_save']
        for (let save of saves) {
            if (monster[save.toLowerCase()]){
                hasSave = true
                const $span = $('<span>').text(`${save.slice(0,3)} +${monster[save.toLowerCase()]}, `).addClass('saves').appendTo($('#cardTraits'))
            }
        }
        //removes comma from last save, there's probably a better way to do this but oh well
        $('.saves').last().text($('.saves').last().text().slice(0,-2))
        //if there are any saves, stick the Saving Throws header in front of them
        if (hasSave){
            $b = $('<b>').text('Saving Throws ')
            $('#cardTraits').prepend($b)
        }
        //skills
        if (Object.keys(monster.skills).length > 0) {
            const $div = $('<div>').appendTo($('#cardTraits'))
            const $title = $('<b>').text('Skills ').appendTo($div)
            for (let skill in monster.skills){
                const $name = $('<span>').text(toCapString(skill)).appendTo($div)
                const $bonus = $('<span>').text(` +${monster.skills[skill]}, `).addClass('bonus').appendTo($div)
            }
            $('.bonus').last().text($('.bonus').last().text().slice(0,-2))
        }
        //The rest of the traits are formatted much simpler so I made the code a little DRYer
        const stringTraits = ['damage_vulnerabilities','damage_resistances','damage_immunities','condition_immunities','senses','languages']
        for (let trait of stringTraits) {
            if (monster[trait] !== '') {
                const $div = $('<div>').appendTo($('#cardTraits'))
                const $title = $('<b>').text(toCapString(trait) + ' ').appendTo($div)
                const $text = $('<span>').text(monster[trait]).appendTo($div)
            }
        }
        //Special Abilities
        $('#cardSpecialAbilities').empty()
        if (monster.special_abilities !== '') {
            for (ability of monster.special_abilities) {
                const $div = $('<div>').appendTo($('#cardSpecialAbilities'))
                const $title = $('<em>').text(ability.name + '. ').appendTo($div)
                const $desc = $('<span>').text(ability.desc).appendTo($div)
            }
        }
        //Actions
        $('#cardActions').empty()
        for (let action of monster.actions){
            const $div = $('<div>').appendTo($('#cardActions'))
            const $name = $('<em>').text(action.name + '. ').appendTo($div)
            const $desc = $('<span>').text(action.desc).appendTo($div)
        }
        //reactions
        $('#cardReactions').empty()
        if (monster.reactions === '') {
            $('.cardReactionsContainer').hide()
        } else {
            $('.cardReactionsContainer').show()
            for (let reaction of monster.reactions){
                const $div = $('<div>').appendTo($('#cardReactions'))
                const $name = $('<em>').text(reaction.name + '. ').appendTo($div)
                const $desc = $('<p style="display: inline">').text(reaction.desc).appendTo($div)
            }
        }
        //legendary Actions
        $('#cardLegendaryActions').empty()
        if (monster.legendary_actions === '') {
            $('.cardLegendaryActionsContainer').hide()
        } else {
            $('.cardLegendaryActionsContainer').show()
            const $legDesc = $('<p>').text(monster.legendary_desc).appendTo($('#cardLegendaryActions'))
            for (let action of monster.legendary_actions){
                const $div = $('<div>').appendTo($('#cardLegendaryActions'))
                const $name = $('<em>').text(action.name + '. ').appendTo($div)
                const $desc = $('<p style="display: inline">').text(action.desc).appendTo($div)
            }
        }


    }

    $('#crDrop').change( (e) => {
        e.preventDefault()
        search.crChoice = $('#crDrop').val()
        search.pageNum = 1
        search.run()
        // return false
    })

    $('#typeDrop').change( (e) => {
        e.preventDefault()
        search.typeChoice = $('#typeDrop').val()
        search.pageNum = 1
        search.run()
    })

    $('#alignmentDrop').change( (e) => {
        e.preventDefault()
        search.alignmentChoice = $('#alignmentDrop').val()
        search.pageNum = 1
        search.run()
    })

    $('#officialOnly').change( () => {
        if (search.officialOnly) {
            search.officialOnly = false
        } else {
            search.officialOnly = true
        }
        search.pageNum = 1
        search.run();
    })

    $('#partySizeDrop').change( (e) => {
        e.preventDefault()
        encounter.partySize = $('#partySizeDrop').val()
        encounter.refreshTable()
    })

    $('#partyLevelDrop').change( (e) => {
        e.preventDefault()
        encounter.partyLevel = $('#partyLevelDrop').val()
        encounter.refreshTable()
    })

    $('#infoCard').click( () => {
        $('#infoCard').css('transform','scale(.25)')
        setTimeout( () => {
            $('#infoCard').hide()
        }, 90)
    })

    //A touch of infinite scrolling added in
    $(document).scroll( () => {
        if ($(document).scrollTop() + $(window).height() === $(document).height() && Math.ceil(search.totalResults/50) > search.pageNum){
            search.pageNum++
            search.run()
        }
    })

    $('#infoCard').hide()
    search.populateSelects()
    encounter.populateSelects()
    search.run()
    console.log($('html').height());
})
