import {create as createCom}    from './service/com'
import regeneratorRuntime       from 'regenerator-runtime'


let waiting_players = {}

let god = {}
let surfers = []
let sharks = []
let waves = []

let inputs = {}

const WIDTH_PLAYER = 1
const HIGH_PLAYER = 2

function dump() {
    return {
        god: god,
        surfers: surfers,
        waves: waves,
        sharks: sharks
    }
}

function serverLoop(com) {
    //input processing
    for ( let id in inputs ) {
        applyInputOn(inputs[id])  
    }

    // update position of each entity
    [...surfers, ...sharks, ...waves].forEach(e => {
        e.position.x += e.velocity.x
        e.position.y += e.velocity.y
    })

    resolveCollisions()

    // update client
    com.emit(god.id, 'state', dump())
    for ( let player in surfers ) {
        com.emit(player.id, 'state', dump())
    }

}

function applyInputOn(id, input) {
    //TODO blindy apply input
}

function resolveCollisions() {
    //TODO search for collisions
    for ( let player in surfers ) {
        // player/player
        for ( let player2 in surfers ) {
            dx = Math.abs(player.position.x - player2.position.x)
            dy = Math.abs(player.position.y - player2.position.y)
            if ( dx < WIDTH_PLAYER && dy < HIGH_PLAYER ) {
                //TODO Handle collision    
            }
        }

        // player/wave
        for ( let wave in waves ) {
            dx = Math.abs(player.position.x - wave.position.x)
            if ( wave.position.y  ) {

            }
        } 

        // player/shark
        for ( let shark in sharks ) {
        }
    
    }
}


export const create = async config => {

    const com = await createCom( config.com )

    com.on('connection', ({ socketId }) => {
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
            console.log("[START]")
            // choose and create god
            let sockets = Object.keys(waiting_players)
            /*
            god.id = sockets[Math.floor(Math.random() * sockets.length)] 
            god.power = 0
            god.name = waiting_players[god.id].name
            delete waiting_players[god.id]
            // send start to god
            com.emit(god.id, 'start', {type: 'god'})
            */
            // send start to players
            let player_interval = Math.floor(100 / sockets.length)
            let i = 0
            for ( let sid in waiting_players ) {
                // create player
                surfers.push({
                    id: sid,
                    name: waiting_players[sid].name,
                    state: { type: "ok", date: new Date() },
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
            setInterval(function() {
                serverLoop(com)   
            }, config.srv.rate)
        }
    })

    com.on('action', ({ socketId, action }) => {
        inputs[socketId] = action
    })

}
