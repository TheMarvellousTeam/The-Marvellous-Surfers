let state = null
let comm = null

const div = document.getElementById('waiting_room')

export const create = ( aState, {com} ) => {
    state = aState
    comm = com
     
    let input = document.createElement('input')
    input.type = 'text'
    input.value = 'Enter your name'
    let go = document.createElement('button')
    go.value = 'Go !'
    go.onclick = function() {
        div.removeChild(input)
        div.removeChild(go)
        comm.emit('join', {name: input.value})
    }
    div.appendChild(input)
    div.appendChild(go)
}

export const deleteUI = () => {
    while ( div.lastChild ) {
        div.removeChild(div.lastChild)
    }
}

export const setVisible = (visible) => {
    style = ""
    if ( visible ) {
        style = "block"
    }
    div.style.display = style
}

export const render = () => {
    
    if ( ! state.waiting_room ) {
        deleteUI()
    } else if ( state.waiting_room.to_update ) {
        deleteUI()
        let ul = document.createElement('ul')
        div.appendChild(ul)
        for ( let id in state.waiting_room ) {
            let player = state.waiting_room[id]
            let li = document.createElement('li')
            li.innerHTML = player.name + (player.ready ? ' (ready)' : ' (not ready)')
            if ( id == you ) {
                let ready = document.createElement('button')
                ready.value = 'Ready !'
                ready.onclick = function(){
                    comm.emit('ready')
                    li.removeChild(ready)
                }
                li.appendChild(ready)
            }
            ul.appendChild(li)
        }
        state.waiting_room.to_update = false
    }
}
