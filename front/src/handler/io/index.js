
export const create = ( state, {com} ) => {
    state.waiting_room = {}

    com.on('players_info', ({you, room}) => {
        console.log('receive players_info')
        
        state.myId = you
        state.waiting_room = room
        state.waiting_room.to_update = true
    })

    com.on('start', ({ type }) => {
        console.log('starting')

        state.gameState = 'run'
        delete state.waiting_room

        if ( type == 'surfer' ) {
            //TODO launch surfer client
        } else if ( type == 'god' ) {
            //TODO launch god client
        }
    })

    com.on('state', ({}) => {
        //TODO update state        
    })

}
