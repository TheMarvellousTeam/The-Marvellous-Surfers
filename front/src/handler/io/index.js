
export const create = ( state, {com} ) => {
    state.waiting_room = {}

    function updateState(srvState) {
        state.god = srvState.god
        state.surfers = srvState.surfers
        state.sharks = srvState.sharks
        state.waves = srvState.waves
    }

    com.on('players_info', ({you, room}) => {
        console.log('receive players_info')
        
        state.myId = you
        state.waiting_room.players = room
        state.waiting_room.to_update = true
    })

    com.on('start', ({ type, srvState }) => {
        console.log('starting')

        updateState(srvState)
        state.gameState = 'run'
        delete state.waiting_room

        if ( type == 'surfer' ) {
            //TODO launch surfer client
        } else if ( type == 'god' ) {
            //TODO launch god client
        }
    })

    com.on('state', ({god, surfers, sharks, waves}) => {
        state.god = god
        state.surfers = surfers
        state.sharks = sharks
        state.waves = waves
    })

}
