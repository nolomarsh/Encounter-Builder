$( () => {

    const filter = {
        cr: undefined,
    }

    const addSearchResult = (monster) => {
        $div = $('<div>').addClass('searchResult').appendTo($('#searchResults'))
        $name = $('<p>').text(monster.name).appendTo($div)
        $cr = $('<p>').text(monster.challenge_rating).appendTo($div)
        $add = $('<div>').text('Add to Encounter').addClass('addBtn').appendTo($div)
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
