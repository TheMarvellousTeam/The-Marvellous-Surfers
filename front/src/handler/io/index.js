
export const create = ( state, {com} ) => {

    let e = document.getElementById('waiting_room')

    let ul = document.createElement('ul')
    let input = document.createElement('input')
    input.type = 'text'
    input.value = 'Enter your name'
    let go = document.createElement('button')
    go.value = 'Go !'
    go.onclick = function() {
        e.removeChild(input)
        e.removeChild(go)
        com.emit('join', {name: input.value})
        e.appendChild(ul)
    }
    e.appendChild(input)
    e.appendChild(go)

    com.on('players_info', ({you, room}) => {
        console.log('receive players_info')
        while( ul.lastChild ) {
            ul.removeChild(ul.lastChild)
        }
        console.log(room)
        for ( let id in room ) {
            let player = room[id]
            console.log(player)
            let li = document.createElement('li')
            li.innerHTML = player.name + (player.ready ? ' (ready)' : ' (not ready)')
            if ( id == you ) {
                let ready = document.createElement('button')
                ready.value = 'Ready !'
                ready.onclick = function(){
                    com.emit('ready')
                    li.removeChild(ready)
                }
                li.appendChild(ready)
            }
            ul.appendChild(li)
        }
    })

    com.on('start', ({ type }) => {
        if ( type == 'surfer' ) {
            //TODO launch surfer client
        } else if ( type == 'god' ) {
            //TODO launch god client
        }
    })

}
