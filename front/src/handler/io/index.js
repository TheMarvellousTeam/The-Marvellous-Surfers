
const median = arr => {
    arr.slice().sort( (a,b) => a < b ? 1 : -1 )
    return arr.length % 2 == 0
        ? ( arr[ arr.length/2-1 ] + arr[ arr.length/2 ] ) / 2
        : arr[ Math.floor(arr.length /2) ]
}

export const create = ( state, services ) => {
    state.waiting_room = {}

    function updateState(srvState) {
        state.god = srvState.god
        state.surfers = srvState.surfers
        state.sharks = srvState.sharks
        state.waves = srvState.waves
    }

    services.com.on('players_info', ({you, room}) => {

        state.myId = you
        state.waiting_room.players = room
        state.waiting_room.to_update = true
    })

    services.com.on('start', (msg) => {
        updateState(msg.state)
        state.gameState = 'run'
        delete state.waiting_room

	services.bus.emit('changeGameState', state.gameState);

    })

    const deltas = []
    let lastDate = Date.now()

    services.com.on('state', ({surfers, sharks, waves}) => {

        // init interpolate
        state.interpolate = state.interpolate || {}
        state.interpolate.previous = state.interpolate.previous || {}
        state.interpolate.next = state.interpolate.next || {}

        // calcul delta
        const delta = Date.now() - lastDate
        lastDate = Date.now()

        deltas.push( delta )
        while( deltas.length > 5 )
            deltas.shift()

        // compute probable delta
        const d = median( deltas )

        state.interpolate.next = {
            date: Date.now() + d,
            surfers,
            sharks,
            waves,
        }

        state.interpolate.previous = {
            date        : Date.now(),
            surfers     : state.surfers,
            sharks      : state.sharks,
            waves       : state.waves,
        }
    })

}
