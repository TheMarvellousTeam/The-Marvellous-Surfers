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
        console.log("[JOIN] "+name+ " (sid:"+socketId+")")
        if ( waiting_players ) {
            waiting_players[socketId] = {name: name, ready: false}
            for ( let sid in waiting_players ) {
                com.emit(sid, 'players_info', {you: sid, room: waiting_players})
            } 
        }
    })

    com.on('ready', ({ socketId }) => {
        console.log("[READY] "+waiting_players[socketId].name)
        waiting_players[socketId].ready = true
        let ready = true 
        for ( let sid in waiting_players ) {
            com.emit(sid, 'players_info', {you: sid, room:waiting_players})
            ready = ready && waiting_players[sid].ready
        } 
        if ( ready ) {
            // choose and create god
            let sockets = Object.keys(waiting_players)
            god.id = sockets[Math.floor(Math.random() * sockets.length)] 
            god.power = 0
            god.name = waiting_players[god.id].name
            // send start to god
            com.emit(god, 'start', {type: 'god'})

            // send start to players
            let player_interval = Math.floor(100 / sockets.length)
            let i = 0
            delete waiting_players[god.id]
            for ( let sid in waiting_players ) {
                // create player
                players.push({
                    id: sid,
                    name: waiting_players[sid].name,
                    position: { x: ++i * player_interval,
                                y: 0 },
                    velocity: { x: 0,
                                y: 1 },
                    orientation: 0
                })
                com.emit(sid, 'start', {type: 'surfer'})
            }
            waiting_players = null // "forbid" join

            // start server loop
            setInterval(serverLoop, config.srv.rate)
        }
    })

    com.on('action', ({ socketId, action }) => {
        //TODO Resolve action
    })

}
