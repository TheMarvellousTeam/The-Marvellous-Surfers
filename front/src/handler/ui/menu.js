let state = null

export const create = ( aState, {com} ) => {
    state = aState
    
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

}

export const deleteUI = () => {
    let e = document.getElementById('waiting_room')
    while ( e.lastChild ) {
        e.removeChild(e.lastChild)
    }
}

export const renderUI = () => {
    if ( ! state.waiting_room ) {
        deleteUI()
    } else if ( state.waiting_room.to_update ) {
        deleteUI()
        for ( let id in state.waiting_room ) {
            let player = state.waiting_room[id]
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
        state.waiting_room.to_update = false
    }
}
