
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

	services.bus.emit("changeGameState", state.gameState);

    })

    services.com.on('state', ({god, surfers, sharks, waves}) => {
        state.god = god
        state.surfers = surfers
        state.sharks = sharks
        state.waves = waves

    	console.log(waves);
    })

}
