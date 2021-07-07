$( () => {

    const filter = {
        cr: undefined,
    }

    const addSearchResult = (monster) => {
        $tr = $('<tr>').addClass('searchResult').appendTo($('#searchResults'))
        $name = $('<td>').text(monster.name).appendTo($tr)
        $cr = $('<td>').text(monster.challenge_rating).appendTo($tr)
        $type = $('<td>').text(monster.type).appendTo($tr)
        $alignment = $('<td>').text(monster.alignment).appendTo($tr)
        $add = $('<td>').text('Add to Encounter').addClass('addBtn').appendTo($tr)
    }

    $('#chooseCR').submit( (e) => {
        e.preventDefault()
        console.log($('#crDrop').val());
    })

    $('#crBtn').click( () => {
        $('#crOptions').show()
    })

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
