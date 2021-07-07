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
                exp: crToExp(inMonster.challenge_rating),
                count: 1
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
        $cr = $('<td>').text(monster.challenge_rating + ` (${crToExp(monster.challenge_rating)})`).appendTo($tr)
        $type = $('<td>').text(monster.type).appendTo($tr)
        $alignment = $('<td>').text(monster.alignment).appendTo($tr)
        $addCell = $('<td>').appendTo($tr)
        $add = $('<i>').addClass("fas fa-plus").appendTo($addCell)
        $add.click( (e) => {
            encounter.add(monster)
            encounter.refreshTable()
        })
    }

    //converts challenge rating to encounter exp
    const


    $('#crDrop').change( (e) => {
        e.preventDefault()
        console.log($('#crDrop').val());
        return false
    })

    search.populateSelects()

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
