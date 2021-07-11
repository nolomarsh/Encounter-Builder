$( () => {
    const search = {
        $table: $('#searchResults'),
        totalResults: 0,
        pageNum: 1,
        searchString: '',
        levelChoice: '',
        schoolChoice: '',
        classChoice: '',
        levelOptions: ['0','1','2','3','4','5','6','7','8','9'],
        schoolOptions: ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'],
        classOptions: ['Bard','Cleric','Druid','Paladin','Ranger','Paladin','Ranger','Sorcerer','Warlock','Wizard'],
        castingTimeOptions: ['1 bonus action','1 reaction','1 action','1 minute','10 minutes','1 hour','8 hours'],
        populateSelects: () => {
            for (let option of search.levelOptions) {
                $option = $('<option>').attr('value',option).appendTo($('#levelDrop'))
                if (option === '0') {
                    $option.text('Cantrip')
                } else if (option === '1') {
                    $option.text('1st')
                } else if (option === '2'){
                    $option.text('2nd')
                } else if (option === '3') {
                    $option.text('3rd')
                } else {
                    $option.text(`${option}th`)
                }
            }
            for (let option of search.schoolOptions) {
                $option = $('<option>').attr('value',option).text(option).appendTo($('#schoolDrop'))
            }
            for (let option of search.classOptions) {
                $option = $('<option>').attr('value',option).text(option).appendTo($('#classDrop'))
            }
        },
        printResult: spell => {
            const $row = $('<tr>').addClass('mainRow').appendTo(search.$table)
            const $name = $('<td>').text(spell.name).appendTo($row)

            const $infoIcon = $('<i>').addClass("fas fa-info-circle")
            $name.prepend($infoIcon)

            const $level = $('<td>').text(spell.level.slice(0,3)).appendTo($row)
            if ($level.text() === 'Can') {
                $level.text('Cantrip')
            }
            const $school = $('<td>').text(spell.school).appendTo($row)

            const $castingTime = $('<td>').text(spell.casting_time).appendTo($row)
            if (spell.ritual === 'yes') {
                $('<span>').text(' (ritual)').appendTo($castingTime)
            }

            const $components = $('<td>').text(spell.components).appendTo($row)
            const $range = $('<td>').text(spell.range).appendTo($row)

            const $duration = $('<td>').text(spell.duration).appendTo($row)
            if (spell.concentration === 'yes') {
                $('<span>').text(' (concentration)').appendTo($duration)
            }
            //Creates modal row after each entry containing decription, material details(if applicable), upcast details (if applicable)
            const $hiddenRow = $('<tr>').addClass('modalRow hidden').appendTo(search.$table)
            const $hiddenPane = $('<td colspan="7">').addClass('hiddenPane').appendTo($hiddenRow)
            if (spell.material !== '') {
                const $material = $('<p>').text(spell.material).appendTo($hiddenPane)
                $material.prepend($('<b>').text('Material. '))
            }
            const $description = $('<p>').text(spell.desc).appendTo($hiddenPane)
            $description.prepend($('<b>').text('Description. '))
            if (spell.higher_level !== '') {
                const $upCast = $('<p>').text(spell.higher_level).appendTo($hiddenPane)
                $upCast.prepend($('<b>').text('At Higher Levels. '))
            }
            const $classes = $('<p>').text(spell.dnd_class).appendTo($hiddenPane)
            $classes.prepend($('<b>').text('Classes. '))
            //Add click listener to the info icon
            $infoIcon.click( () => {
                $hiddenRow.toggleClass('hidden')
            })
        },
        run: () => {
            if (search.pageNum === 1) {
                $('.mainRow').remove()
                $('.modalRow').remove()
            }
            $.ajax({
                url:'https://api.open5e.com/spells/',
                data: {
                    limit : 50,
                    page: search.pageNum,
                    search: search.searchString,
                    level_int: search.levelChoice,
                    school: search.schoolChoice
                }
            }).then( (data) => {
                for (let spell of data.results) {
                    //had to put the conditional in because API search functionality returned unexpected results
                    if (search.searchString === '' || (spell.name.toLowerCase()).includes(search.searchString.toLowerCase())){
                        search.printResult(spell)
                    }
                }
                search.totalResults = data.count
            }, () => {
                console.log('Bad request');
            })
        }
    }
    search.populateSelects()
    search.run()

    $('.filter').change( (e) => {
        e.preventDefault()
        search[$(e.currentTarget).attr('choice')] = $(e.currentTarget).val()
        search.pageNum = 1
        search.run()
    })

    $(document).scroll( () => {
        if ($(document).scrollTop() + $(window).height() === $(document).height() && Math.ceil(search.totalResults/50) > search.pageNum){
            search.pageNum++
            search.run()
        }
    })

})
