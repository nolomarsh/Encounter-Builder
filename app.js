$( () => {

    const filter = {
        cr: undefined,
    }

    $('#crBtn').click( () => {
        $('#crOptions').show()
    })

     $('button').click( (e) => {
        e.preventDefault()

        $.ajax({
            url:'https://api.open5e.com/monsters/',
            data: {
                limit : 50,
                page: 1,
                document__slug: 'wotc-srd',
            }
        }).then( (data) => {
            console.log(data);
        },
        () => {
            console.log('bad request');
        })
     })
})
