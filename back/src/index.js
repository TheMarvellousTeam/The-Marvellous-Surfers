import {create as createCom}    from './service/com'
import regeneratorRuntime       from 'regenerator-runtime'


let waiting_players = {}

let god = {}
let surfers = []
let sharks = []
let waves = []


function dump() {
    return {
        god: god,
        surfers: surfers,
        waves: waves,
        sharks: sharks
    }
}

function serverLoop() {
    //TODO update velocity & position with orientation
    //TODO compute crash ?
}


export const create = async config => {

    const com = await createCom( config.com )

    com.on('connection', ({ socketId })  => {
        com.emit( socketId, 'ready' )
        com.emit( socketId, 'state', dump())
    })

    com.on('join', ({ socketId, name }) => {
        if ( waiting_player ) {
            waiting_player[socketId] = {name: name, ready: false}
            for ( s in waiting_player ) {
                com.emit(s, 'players_info', {you: s, room: waiting_player})
            } 
        }
    })

    com.on('ready', ({ socketId }) => {
        waiting_player[socketId].ready = true
        for ( s in waiting_player ) {
            com.emit(s, 'players_info', waiting_player)
        } 
        let ready = true 
        for ( s in waiting_player ) {
            ready = ready && waiting_player[s].ready
            if ( ! ready ) {
                break
            }
        }
        if ( ready ) {
            // choose and create god
            let sockets = Object.keys(waiting_player)
            god.id = sockets[Math.floor(Math.random() * sockets.length)] 
            god.power = 0
            god.name = waiting_player[god.id].name
            // send start to god
            com.emit(god, 'start', {type: 'god'})

            // send start to players
            let player_interval = Math.floor(100 / sockets.length)
            let i = 0
            delete waiting_player[god.id]
            for ( sid in waiting_player ) {
                // create player
                players.push({
                    id: sid,
                    name: waiting_player[s].name,
                    position: { x: ++i * player_interval,
                                y: 0 },
                    velocity: { x: 0,
                                y: 1 },
                    orientation: 0
                })
                com.emit(sid, 'start', {type: 'surfer'})
            }
            waiting_player = null

            // start server loop
            setInterval(serverLoop, config.srv.rate)
        }
    })

    com.on('action', ({ socketId, action }) => {
        //TODO Resolve action
    })

}
